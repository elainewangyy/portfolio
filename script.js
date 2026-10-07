/* =============================================================
   SCRIPT.JS  —  a tiny bit of JavaScript
   =============================================================
   This file does a few small jobs. You probably don't need to
   touch it, but here's what it does so nothing feels like magic.
   (The hamster has its own file: pet.js.)
   ============================================================= */

/* -------------------------------------------------------------
   1. MOBILE MENU
   On small screens, tapping the hamburger button shows/hides the
   navigation links.
   ------------------------------------------------------------- */
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    // Add or remove the "open" class that makes the menu visible.
    const isOpen = links.classList.toggle("nav__links--open");
    // Tell screen readers whether the menu is open, and match the label to it.
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the menu again after tapping a link.
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("nav__links--open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

/* -------------------------------------------------------------
   2. AUTOMATIC YEAR IN THE FOOTER
   Fills in the current year so you never have to update it.
   ------------------------------------------------------------- */
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------
   3. CALM VIDEOS FOR "REDUCE MOTION"
   Videos on project pages play on their own, on a loop. If someone
   has asked their computer to reduce motion, pause them instead and
   show the play button so they can choose.
   ------------------------------------------------------------- */
const calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (calmMotion) {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.pause();
    video.removeAttribute("autoplay");
    video.controls = true;
  });
}

/* -------------------------------------------------------------
   4. "PAUSE ANIMATIONS" BUTTON  (in every page's footer)
   Things that keep moving — twinkling dots, the spinning badge,
   the photo pile, looping videos, the wandering hamster — can all
   be paused here. (An accessibility rule: anything that moves for
   more than 5 seconds needs a way to stop it.) The choice is
   remembered on this browser, if the browser allows it.
   ------------------------------------------------------------- */
const motionButton = document.getElementById("motion-toggle");

// A moving GIF can't be paused, so while animations are paused each
// hamster GIF is swapped for a still picture of the same pose
// (assets/pet/idle.gif → idle-still.png), and swapped back afterwards.
const MOVING_GIF = /assets\/pet\/\w+\.gif$/;

function stillPicture(img, paused) {
  const src = img.getAttribute("src") || "";
  if (paused && MOVING_GIF.test(src)) {
    img.dataset.moving = src;
    img.setAttribute("src", src.replace(/\.gif$/, "-still.png"));
  } else if (!paused && img.dataset.moving) {
    const gif = img.dataset.moving;
    delete img.dataset.moving;
    img.setAttribute("src", gif);
  }
}

// GIFs that turn up later (the hamster changing pose) get the same treatment.
new MutationObserver((changes) => {
  if (!document.body.classList.contains("motion-paused")) return;
  changes.forEach((change) => {
    if (change.type === "attributes") return stillPicture(change.target, true);
    change.addedNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      (node.tagName === "IMG" ? [node] : node.querySelectorAll("img")).forEach((img) => stillPicture(img, true));
    });
  });
}).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"] });

function setMotionPaused(paused) {
  document.body.classList.toggle("motion-paused", paused);
  document.querySelectorAll("video").forEach((video) => {
    if (paused) video.pause();
    else if (video.autoplay) video.play().catch(() => {});
  });
  document.querySelectorAll("img").forEach((img) => stillPicture(img, paused));
  if (motionButton) motionButton.textContent = paused ? "Play animations" : "Pause animations";
  try { localStorage.setItem("motion-paused", paused ? "1" : "0"); } catch (err) { /* not allowed — fine */ }
  // Tell the other scripts (the skill capsules, the hamster) to stop or carry on.
  document.dispatchEvent(new CustomEvent("motionchange", { detail: paused }));
}

let startPaused = false;
try { startPaused = localStorage.getItem("motion-paused") === "1"; } catch (err) { /* ignore */ }
if (startPaused) setMotionPaused(true);
if (motionButton) {
  motionButton.addEventListener("click", () => {
    setMotionPaused(!document.body.classList.contains("motion-paused"));
  });
}

/* -------------------------------------------------------------
   5. PHOTO PILE: TAKING TURNS ON TOP
   In the photo pile (About → Photography), every few seconds each
   photo moves one place along, so a different one becomes the main
   photo in the middle. It pauses while you hover over it or tab to
   it, and stays still for people who've asked for reduced motion.
   ------------------------------------------------------------- */
document.querySelectorAll(".spread").forEach((pile) => {
  const photos = [...pile.querySelectorAll("img")];
  if (calmMotion || photos.length < 2) return;

  const edge = (photos.length - 1) / 2; // 5 photos → places -2 … 2
  let paused = false;
  const link = pile.closest("a");
  if (link) {
    link.addEventListener("mouseenter", () => { paused = true; });
    link.addEventListener("mouseleave", () => { paused = false; });
    link.addEventListener("focusin", () => { paused = true; });
    link.addEventListener("focusout", () => { paused = false; });
  }

  setInterval(() => {
    if (paused || document.hidden || document.body.classList.contains("motion-paused")) return;
    photos.forEach((photo) => {
      let place = Number(photo.style.getPropertyValue("--d")) + 1;
      if (place > edge) place = -edge; // the far-right photo goes round to the far left
      photo.style.setProperty("--d", place);
    });
  }, 2600);
});

/* -------------------------------------------------------------
   6. NARRATION  ("🔊 Narration" button in the menu bar)
   A small built-in narrator. Switch it on, then point at anything
   (or move with the Tab key) and the browser reads it aloud using
   its own speech voices — headings, text, links, buttons, and image
   descriptions. Chinese and Japanese words are read with Chinese /
   Japanese voices. What's being read gets a dashed orange outline.
   Esc stops the current reading. It's off unless switched on, so it
   never talks over someone's own screen reader.
   ------------------------------------------------------------- */
const narrateButton = document.querySelector(".narrate-btn");

if (narrateButton && !("speechSynthesis" in window)) {
  narrateButton.hidden = true; // this browser can't speak
} else if (narrateButton) {
  // Which voice to use for a page language (from lang="…").
  function voiceFor(tag) {
    tag = tag.toLowerCase();
    if (/^zh-(hant|tw|hk)/.test(tag)) return "zh-TW"; // 繁體
    if (tag.startsWith("zh")) return "zh-CN";         // 简体
    if (tag.startsWith("ja")) return "ja-JP";
    if (tag.startsWith("en")) return "en-NZ";
    return tag;
  }
  // Words the narrator says itself, in the language the site is in (i18n.js).
  const T = (en) => (window.i18n ? window.i18n.t(en) : en);
  const own = (en) => [{ lang: window.i18n ? window.i18n.voice() : "en", text: T(en) }];
  const speedBox = document.querySelector(".narrate-speed");
  const speedPicker = speedBox && speedBox.querySelector("select");
  let speed = 1; // 1 = normal speaking speed, up to 8 = eight times faster
  const readable = "a, button, h1, h2, h3, h4, p, li, img, figcaption, .quote";
  let narrating = false;
  let current = null;
  let hoverTimer;

  // Which language is this bit of text in? (from the nearest lang="…")
  function langOf(el) {
    return (el.closest("[lang]") || document.documentElement).getAttribute("lang") || "en";
  }

  // Split an element's visible text into pieces by language.
  function pieces(el) {
    const out = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(t) {
        const hidden = t.parentElement.closest('[aria-hidden="true"], [hidden]');
        return hidden && el.contains(hidden) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });
    while (walker.nextNode()) {
      // (emoji are left out — "compass, User flows" isn't helpful)
      const text = walker.currentNode.textContent.replace(/[\p{Extended_Pictographic}️]/gu, "").replace(/\s+/g, " ");
      const last = out[out.length - 1];
      if (!text.trim()) { if (last) last.text += " "; continue; } // keep the gap between words
      const lang = langOf(walker.currentNode.parentElement);
      if (last && last.lang === lang) last.text += text;
      else out.push({ lang, text });
    }
    return out;
  }

  // What to say for an element — like a screen reader would.
  function describe(el) {
    if (el === speedPicker) {
      return own("Narration speed, " + el.value + " times.");
    }
    if (el.tagName === "IMG") {
      return el.alt ? [{ lang: langOf(el), text: T("Image. ") + el.alt }] : [];
    }
    const kind = el.tagName === "A" ? "Link. " : el.tagName === "BUTTON" ? "Button. " : "";
    const label = el.getAttribute("aria-label");
    const said = label ? [{ lang: langOf(el), text: label }] : pieces(el);
    if (kind && said.length) said.unshift(own(kind)[0]);
    return said;
  }

  // The nearest readable thing to what the mouse/keyboard is on.
  function targetOf(node) {
    let el = node.closest && node.closest(readable);
    if (!el) return null;
    if (el.closest(".quote")) return el.closest(".quote"); // Da Niu's typed notes
    if (el.closest('[aria-hidden="true"]')) return null;   // decoration
    return el;
  }

  function stop() {
    window.speechSynthesis.cancel();
    if (current) current.classList.remove("is-speaking");
    current = null;
  }

  let latest = 0;
  // Speak some parts. "then" (optional) runs when they've all been said —
  // but not if something newer interrupted them.
  function say(parts, el, then) {
    stop();
    if (!parts.length) return;
    current = el || null;
    if (current) current.classList.add("is-speaking");
    const mine = ++latest;
    // A tiny wait after cancel() makes Chrome more reliable.
    setTimeout(() => {
      if (mine !== latest) return; // something newer was asked for — skip this one
      parts.forEach((part, i) => {
        const line = new SpeechSynthesisUtterance(part.text.trim());
        line.lang = voiceFor(part.lang);
        line.rate = speed;
        if (i === parts.length - 1) {
          line.onend = () => {
            if (el) el.classList.remove("is-speaking");
            if (then && mine === latest) then();
          };
        }
        window.speechSynthesis.speak(line);
      });
    }, 60);
  }

  /* Read the whole page aloud, top to bottom (the Accessibility icon,
     section 8). Each part is scrolled into view and outlined while it's
     read. Esc, Tab, or pointing at something else stops it. */
  let reading = 0;

  // What to say for one part of the page: its words, then its pictures.
  // Long text is cut into sentences (some voices stop after ~15 seconds).
  function partsToRead(el) {
    if (el.tagName === "IMG") return describe(el);
    const out = [];
    pieces(el).forEach((p) => {
      p.text.split(/(?<=[.!?。！？])\s+/).forEach((s) => { if (s.trim()) out.push({ lang: p.lang, text: s }); });
    });
    el.querySelectorAll("img[alt]").forEach((img) => {
      if (img.alt && !img.closest('[aria-hidden="true"]') && img.getClientRects().length) out.push(...describe(img));
    });
    return out;
  }

  function readPage(intro) {
    const mine = ++reading;
    const all = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main p, main li, main button, main img[alt]")];
    const parts = all.filter((el) =>
      el.getClientRects().length &&                         // on show (not in a closed folder)
      !el.closest('[aria-hidden="true"], [hidden]') &&       // not decoration
      !all.some((other) => other !== el && other.contains(el)) // not already inside another part
    );
    let i = 0;
    const next = () => {
      if (mine !== reading || !narrating) return;
      const el = parts[i++];
      if (!el) return say(own("End of page."));
      const words = partsToRead(el);
      if (!words.length) return next();
      el.scrollIntoView({ block: "center" });
      say(words, el, next);
    };
    if (intro) say(own(intro), null, next);
    else next();
  }

  function setNarrating(isOn, announce) {
    narrating = isOn;
    narrateButton.setAttribute("aria-pressed", String(isOn));
    if (speedBox) speedBox.hidden = !isOn; // the speed picker only shows while narration is on
    try { localStorage.setItem("narration", isOn ? "1" : "0"); } catch (err) { /* fine */ }
    if (!announce) return;
    if (isOn) say(own("Narration on. Point at anything, or press Tab, to hear it read aloud. Press Escape to stop."));
    else { stop(); say(own("Narration off.")); }
  }

  narrateButton.addEventListener("click", () => setNarrating(!narrating, true));

  // Speed picker: 0.75× to 8×. Says the new speed at that speed, so you
  // can hear the difference straight away. Remembered for next time.
  if (speedPicker) {
    try {
      const saved = localStorage.getItem("narration-speed");
      if (saved && speedPicker.querySelector('option[value="' + saved + '"]')) speedPicker.value = saved;
    } catch (err) { /* ignore */ }
    speed = Number(speedPicker.value);
    speedPicker.addEventListener("change", () => {
      speed = Number(speedPicker.value);
      try { localStorage.setItem("narration-speed", speedPicker.value); } catch (err) { /* fine */ }
      if (narrating) say(own("Speed " + speedPicker.value + " times."));
    });
  }

  // Keyboard: read whatever gets focus straight away.
  document.addEventListener("focusin", (e) => {
    if (!narrating || e.target === narrateButton) return;
    const el = targetOf(e.target) || e.target;
    say(describe(el), el);
  });

  // Mouse: read what you rest the pointer on (after a short pause).
  // Only when the mouse really moved — not when the page scrolled
  // underneath a still pointer (that would cut "read the page" short).
  let lastMoved = 0;
  document.addEventListener("mousemove", (e) => {
    if (e.movementX || e.movementY) lastMoved = Date.now();
  });
  document.addEventListener("mouseover", (e) => {
    if (!narrating) return;
    clearTimeout(hoverTimer);
    const el = targetOf(e.target);
    if (!el || el === current) return;
    hoverTimer = setTimeout(() => {
      if (Date.now() - lastMoved < 700) say(describe(el), el);
    }, 350);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && narrating) { reading++; stop(); }
  });

  // For the Accessibility icon (section 8).
  window.narrator = {
    isOn: () => narrating,
    turn: (isOn) => { reading++; stop(); setNarrating(isOn, false); },
    readPage,
    say: (text) => say(own(text)),
  };

  // Remember the choice from last time (browsers only let it speak
  // after the visitor has clicked or pressed something on the page).
  let wasOn = false;
  try { wasOn = localStorage.getItem("narration") === "1"; } catch (err) { /* ignore */ }
  if (wasOn) setNarrating(true, false);
}

/* -------------------------------------------------------------
   7. FEED DA NIU  ("🌽 Feed Da Niu" button in the menu bar)
   Press it and the mouse pointer becomes a corn cob — Da Niu runs
   after it and eats it when he catches it (pet.js / cage.js do the
   running). On a phone: tap anywhere to drop a corn cob there.
   Press the button again, or Esc, to put the corn away.
   window.corn tells the hamsters where the corn is.
   ------------------------------------------------------------- */
window.corn = { on: false, x: null, y: null };
const feedButton = document.querySelector(".feed-btn");

if (feedButton) {
  function setFeeding(on, x, y) {
    window.corn.on = on;
    window.corn.x = on ? x : null;
    window.corn.y = on ? y : null;
    document.body.classList.toggle("feeding", on);
    feedButton.setAttribute("aria-pressed", String(on));
    document.dispatchEvent(new CustomEvent("feedingchange", { detail: on }));
  }

  // Start with the corn right where the button was pressed.
  feedButton.addEventListener("click", (e) => {
    const r = feedButton.getBoundingClientRect();
    setFeeding(!window.corn.on, e.clientX || r.left + r.width / 2, e.clientY || r.bottom);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && window.corn.on) setFeeding(false);
  });

  // Mouse: the corn is wherever the pointer is.
  document.addEventListener("pointermove", (e) => {
    if (!window.corn.on || e.pointerType !== "mouse") return;
    window.corn.x = e.clientX;
    window.corn.y = e.clientY;
  });

  // Touch: tap somewhere to drop a corn cob there.
  document.addEventListener("pointerdown", (e) => {
    if (!window.corn.on || e.pointerType === "mouse") return;
    if (e.target.closest("a, button, select, input, label")) return;
    window.corn.x = e.clientX;
    window.corn.y = e.clientY;
    const drop = document.createElement("img");
    drop.src = "assets/corn.png";
    drop.alt = "";
    drop.className = "corn-drop";
    drop.style.left = e.clientX + "px";
    drop.style.top = e.clientY + "px";
    document.body.appendChild(drop);
    setTimeout(() => drop.remove(), 1700);
  });
}

/* -------------------------------------------------------------
   8. ACCESSIBILITY  ("♿ Accessibility" in every menu bar, and the
   icon on the home page's desktop — they're the same switch)
   One click: every animation stops (the same as "Pause
   animations") and Narration switches on and starts reading the
   page aloud from the top. Click again to turn both back off.
   Both choices are remembered on the other pages too.
   ------------------------------------------------------------- */
const easyButtons = [...document.querySelectorAll(".easy-mode, .access-btn")];

if (easyButtons.length) {
  const narrator = window.narrator; // missing if this browser can't speak
  const isOn = () =>
    document.body.classList.contains("motion-paused") && (!narrator || narrator.isOn());
  const show = () => easyButtons.forEach((b) => b.setAttribute("aria-pressed", String(isOn())));
  show();

  easyButtons.forEach((b) => b.addEventListener("click", () => {
    const on = !isOn();
    if (window.corn && window.corn.on && feedButton) feedButton.click(); // put the corn away too
    setMotionPaused(on);
    if (narrator) {
      narrator.turn(on);
      if (on) {
        narrator.readPage(
          "Accessibility on. All animations are stopped, and I'll read this page aloud from the top. " +
          "Press Escape to stop reading, or point at anything, or press Tab, to hear just that."
        );
      } else {
        narrator.say("Accessibility off. Animations are back on.");
      }
    }
    show();
  }));

  // Keep the icon right if Narration or Pause animations are changed on their own.
  document.addEventListener("motionchange", show);
  const narrateBtn = document.querySelector(".narrate-btn");
  if (narrateBtn) narrateBtn.addEventListener("click", show);
}
