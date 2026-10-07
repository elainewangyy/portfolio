/* =============================================================
   CHAT.JS  —  💌 "Message Elaine", straight to my phone
   =============================================================
   A little window (bottom-right, and a button in the footer) where
   visitors can write to me. Messages go to my old OnePlus phone
   (phone-relay/ in this repo), which passes them to my Telegram.
   When I reply in Telegram, the reply shows up here. If the AI
   helper is on, Da Niu answers first while I'm busy.

   The phone's address is in chat-endpoint.json — just { "url": … }.
   When it's empty, none of this shows up on the page. When the phone
   gets a new address, it tells me in Telegram; paste it there.

   Each visitor gets a random id (kept in their browser), so they
   still see my reply if they come back later.
   ============================================================= */

(function () {
  /* ---------- Things you might want to change ---------- */
  const ENDPOINT_FILE = "chat-endpoint.json";
  const POLL_OPEN = 4000;     // check for replies every 4 s while the window is open
  const POLL_CLOSED = 30000;  // …and every 30 s while it's closed (if they've written)
  const STORE = "chat-v1";    // where the browser keeps this visitor's conversation

  const t = (en) => (window.i18n ? window.i18n.t(en) : en);

  fetch(ENDPOINT_FILE, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : {}))
    .then((cfg) => {
      const url = String((cfg && cfg.url) || "").trim().replace(/\/+$/, "");
      if (/^https?:\/\//.test(url)) start(url);
    })
    .catch(() => { /* no file — no chat */ });

  function start(API) {
    /* ---- What this visitor has said and heard (kept in their browser) ---- */
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (err) { /* fine */ }
    const data = {
      session: saved.session || newId(),
      name: saved.name || "",
      after: saved.after || 0,  // the last reply we've already shown
      log: Array.isArray(saved.log) ? saved.log : [],
      unread: Boolean(saved.unread),
    };
    function keep() {
      data.log = data.log.slice(-100);
      try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (err) { /* fine */ }
    }

    /* ---- The window ---- */
    const launch = document.createElement("button");
    launch.type = "button";
    launch.className = "chat-launch";
    launch.setAttribute("aria-label", "Message Elaine");
    launch.setAttribute("aria-expanded", "false");
    launch.setAttribute("aria-controls", "chat");
    launch.innerHTML = '<span aria-hidden="true">💌</span><span class="chat-launch__dot" hidden></span>';

    const panel = document.createElement("section");
    panel.id = "chat";
    panel.className = "chat";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "chat-title");
    panel.innerHTML =
      '<div class="chat__head">' +
        '<h2 class="chat__title" id="chat-title">Message Elaine</h2>' +
        '<button type="button" class="chat__close" aria-label="Close">✕</button>' +
      "</div>" +
      '<p class="chat__intro">Write me anything — it goes straight to my phone. My reply will show up here, even if you come back later.</p>' +
      '<ol class="chat__log" data-no-i18n aria-live="polite"></ol>' +
      '<p class="chat__status" role="status"></p>' +
      '<form class="chat__form">' +
        '<input class="chat__name" maxlength="40" autocomplete="name" placeholder="Your name (optional)" aria-label="Your name (optional)" />' +
        '<input class="chat__hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
        '<div class="chat__row">' +
          '<textarea class="chat__text" rows="2" maxlength="1000" required placeholder="Say hi…" aria-label="Message"></textarea>' +
          '<button type="submit" class="chat__send">Send</button>' +
        "</div>" +
      "</form>";

    document.body.append(launch, panel);

    const dot = launch.querySelector(".chat-launch__dot");
    const logEl = panel.querySelector(".chat__log");
    const statusEl = panel.querySelector(".chat__status");
    const form = panel.querySelector(".chat__form");
    const nameEl = panel.querySelector(".chat__name");
    const hpEl = panel.querySelector(".chat__hp");
    const textEl = panel.querySelector(".chat__text");
    const sendBtn = panel.querySelector(".chat__send");
    nameEl.value = data.name;

    // The footer button opens the same window.
    document.querySelectorAll("[data-chat-open]").forEach((btn) => {
      btn.hidden = false;
      btn.addEventListener("click", () => open());
    });

    /* ---- Showing the conversation ---- */
    const WHO = { visitor: "You", elaine: "Elaine", ai: "Da Niu 🐹 (auto-reply)" };
    function render() {
      logEl.innerHTML = "";
      for (const m of data.log) {
        const li = document.createElement("li");
        li.className = "chat__msg chat__msg--" + m.from;
        const who = document.createElement("span");
        who.className = "chat__who";
        who.textContent = t(WHO[m.from] || "");
        const text = document.createElement("p");
        text.className = "chat__bubble";
        text.textContent = m.text;
        li.append(who, text);
        logEl.append(li);
      }
      logEl.hidden = !data.log.length;
      logEl.scrollTop = logEl.scrollHeight;
      dot.hidden = !data.unread;
    }
    let statusKey = "";
    document.addEventListener("langchange", () => { render(); status(statusKey); });

    function status(en) {
      statusKey = en;
      statusEl.textContent = en ? t(en) : "";
    }

    /* ---- Open / close ---- */
    function open() {
      panel.hidden = false;
      launch.setAttribute("aria-expanded", "true");
      data.unread = false;
      keep();
      render();
      textEl.focus();
      checkAwake();
      poll();
    }
    function close() {
      panel.hidden = true;
      launch.setAttribute("aria-expanded", "false");
      launch.focus();
      schedule();
    }
    launch.addEventListener("click", () => (panel.hidden ? open() : close()));
    panel.querySelector(".chat__close").addEventListener("click", close);
    panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    /* ---- Sending ---- */
    textEl.addEventListener("keydown", (e) => {
      // Enter sends, Shift+Enter is a new line. Not while picking
      // characters in a Chinese/Japanese keyboard (isComposing).
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = textEl.value.trim();
      if (!text || sendBtn.disabled) return;
      data.name = nameEl.value.trim();
      sendBtn.disabled = true;
      status("Sending…");
      try {
        const res = await fetch(API + "/send", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ session: data.session, name: data.name, text, website: hpEl.value }),
          signal: AbortSignal.timeout(15000),
        });
        if (res.status === 429) return status("That's a lot of messages — try again in a minute.");
        if (!res.ok) throw new Error(res.status);
        data.log.push({ from: "visitor", text, at: Date.now() });
        keep();
        render();
        textEl.value = "";
        status("Sent ✓ — it's on Elaine's phone now.");
        poll();
      } catch (err) {
        status("Couldn't send — Elaine's phone might be asleep. Please try again later.");
      } finally {
        sendBtn.disabled = false;
      }
    });

    async function checkAwake() {
      try {
        const res = await fetch(API + "/health", { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error(res.status);
        if (statusKey === "Elaine's phone is asleep right now, so messages may not get through.") status("");
      } catch (err) {
        status("Elaine's phone is asleep right now, so messages may not get through.");
      }
    }

    /* ---- Checking for replies ---- */
    let timer;
    function schedule() {
      clearTimeout(timer);
      if (document.hidden) return; // tab in the background — wait till they're back
      if (!panel.hidden) timer = setTimeout(poll, POLL_OPEN);
      else if (data.log.length) timer = setTimeout(poll, POLL_CLOSED);
    }

    async function poll() {
      clearTimeout(timer);
      if (!data.log.length) return schedule();
      try {
        const url = API + "/poll?session=" + encodeURIComponent(data.session) + "&after=" + data.after;
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        const body = await res.json();
        if (body.ok) {
          for (const m of body.msgs) {
            data.log.push({ from: m.from, text: m.text, at: m.at });
            data.after = Math.max(data.after, m.id);
          }
          if (body.msgs.length) {
            if (panel.hidden) data.unread = true;
            keep();
            render();
            if (statusKey !== "") status("");
          }
          if (!panel.hidden && body.typing) status("Da Niu is typing…");
          else if (statusKey === "Da Niu is typing…") status("");
        }
      } catch (err) { /* phone asleep — try again later */ }
      schedule();
    }

    document.addEventListener("visibilitychange", () => { if (!document.hidden) poll(); });

    render();
    poll();
  }

  function newId() {
    const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    return Array.from(bytes, (b) => abc[b % abc.length]).join("");
  }
})();
