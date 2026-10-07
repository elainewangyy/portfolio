/* =============================================================
   PET.JS  —  the hamster who lives on the website
   =============================================================
   A small web version of my Desk Pet app. The hamster sits at the
   bottom of the window and:
     - looks around when it's resting
     - crawls to a new spot every few seconds
     - says something when you click (or tap, or press Enter on) it
     - can be picked up and dragged, and drops back down when let go
     - falls asleep if nobody plays with it for a while
   It uses the same GIFs as the Desk Pet app.

   Want to change what it says? Edit the LINES list just below.
   ============================================================= */

(function () {
  // Pages with <body data-no-pet> (the Desk Pet cage page) have their
  // own Da Niu, so the little one doesn't come along there.
  if (document.body.hasAttribute("data-no-pet")) return;

  /* ---------- Things you might want to change ---------- */

  // The four looks, one for each mood.
  const LOOKS = {
    idle:  "assets/pet/idle.gif",   // looking left and right
    walk:  "assets/pet/walk.gif",   // crawling
    held:  "assets/pet/held.gif",   // being held in a hand
    sleep: "assets/pet/sleep.gif",  // sleepy
  };

  // What it says when clicked. Chinese first (its own voice, the same
  // lines as in the Desk Pet app), with an English version underneath.
  const LINES = [
    { zh: "摸摸我嘛", en: "Pat me?" },
    { zh: "嘿嘿，最喜欢你了", en: "Hehe, you're my favourite" },
    { zh: "今天也要加油哦！", en: "You've got this today!" },
    { zh: "肚子有点饿了…", en: "I'm a bit peckish…" },
    { zh: "记得喝口水哦", en: "Remember to drink some water" },
    { zh: "让眼睛休息一下吧", en: "Give your eyes a rest" },
    { zh: "我一直在这儿陪着你", en: "I'm right here with you" },
  ];
  const HELLO   = { zh: "你好呀！", en: "Kia ora!" };
  const PUTDOWN = { zh: "放我下来啦！", en: "Put me down!" };
  const SLEEPY  = { zh: "困困~", en: "Zzz…" };
  const HUNGRY  = LINES[3];                      // "肚子有点饿了…" when the corn comes out
  const YUM     = { zh: "好吃！", en: "Yum!" };  // when he catches the corn

  const SPEED = 70;            // crawling speed, pixels per second
  const RUN = 190;             // running speed when chasing corn
  const SLEEP_AFTER = 30000;   // fall asleep after this long untouched (ms)

  /* ---------- Build the hamster ---------- */

  const pet = document.createElement("div");
  pet.className = "pet";
  pet.innerHTML =
    '<span class="pet__bubble" aria-live="polite"></span>' +
    '<button type="button" class="pet__btn" data-cursor="✋ Pick me up" aria-label="Da Niu the hamster, from my Desk Pet project. Press to say hello.">' +
    '<img class="pet__img" src="' + LOOKS.idle + '" alt="" draggable="false" />' +
    "</button>";
  document.body.appendChild(pet);

  const btn = pet.querySelector(".pet__btn");
  const img = pet.querySelector(".pet__img");
  const bubble = pet.querySelector(".pet__bubble");

  // Load every look now, so swapping between them doesn't flicker.
  Object.values(LOOKS).forEach((src) => { new Image().src = src; });

  // Respect "reduce motion": the hamster stays put, but still talks.
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Where it is and what it's doing ---------- */

  let x = 0;          // pixels from the left edge of the window
  let y = 0;          // pixels above the bottom (0 = on the floor)
  let mood = "idle";  // idle | walk | held | sleep | fall
  let target = 0;     // where it's crawling to
  let lastPlayed = Date.now();
  let lastFrame = 0;

  const size = () => pet.offsetWidth;
  const maxX = () => Math.max(0, window.innerWidth - size() - 8);

  function place() {
    pet.style.transform = "translate(" + x + "px," + -y + "px)";
    if (bubble.classList.contains("pet__bubble--show")) keepBubbleOnScreen();
  }

  // Near the edge of the window, slide the bubble sideways so it isn't cut off.
  function keepBubbleOnScreen() {
    const half = bubble.offsetWidth / 2;
    const centre = x + size() / 2;
    const shift = Math.min(0, window.innerWidth - 8 - (centre + half)) + Math.max(0, 8 - (centre - half));
    bubble.style.marginLeft = shift + "px";
    bubble.style.setProperty("--tail", shift + "px");
  }

  function setMood(next) {
    mood = next;
    const look = next === "fall" ? "held" : next;
    // (while animations are paused, script.js shows a still picture and
    // keeps the GIF's name in data-moving)
    const showing = img.dataset.moving || img.src;
    if (!showing.endsWith(LOOKS[look])) img.src = LOOKS[look];
  }

  let bubbleTimer;
  function say(line, ms) {
    bubble.innerHTML =
      '<span lang="zh-Hans">' + line.zh + "</span><small>" + line.en + "</small>";
    bubble.classList.add("pet__bubble--show");
    keepBubbleOnScreen();
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove("pet__bubble--show"), ms || 2600);
  }

  function wakeUp() {
    lastPlayed = Date.now();
    if (mood === "sleep") setMood("idle");
  }

  /* ---------- Feeding: chase the corn (script.js, section 7) ---------- */

  let munchUntil = 0;
  const feeding = () =>
    window.corn && window.corn.on && window.corn.x !== null &&
    !document.body.classList.contains("pet-hidden");

  function chase(dt) {
    lastPlayed = Date.now();
    if (mood === "sleep") setMood("idle");
    if (Date.now() < munchUntil) return; // still munching
    const goal = Math.max(0, Math.min(maxX(), window.corn.x - size() / 2));
    const gap = goal - x;
    if (Math.abs(gap) > 4) {
      if (mood !== "walk") setMood("walk");
      const step = calm ? Infinity : RUN * dt;
      x = Math.abs(gap) <= step ? goal : x + Math.sign(gap) * step;
      target = x;
      place();
    } else {
      if (mood === "walk") setMood("idle");
      // Caught up — eat it, if the corn is down at hamster height.
      if (window.corn.y > window.innerHeight - size() * 1.4) eat();
    }
  }

  function eat() {
    munchUntil = Date.now() + 2200;
    say(Math.random() < 0.6 ? YUM : LINES[1]); // "Yum!" or "嘿嘿，最喜欢你了"
    if (!calm) {
      pet.classList.remove("pet--bounce");
      void pet.offsetWidth;
      pet.classList.add("pet--bounce");
    }
    // On a touch screen that corn cob is gone now — wait for the next tap.
    if (!window.matchMedia("(hover: hover)").matches) window.corn.x = null;
  }

  document.addEventListener("feedingchange", (e) => {
    if (e.detail) {
      if (document.body.classList.contains("pet-hidden")) setHidden(false);
      wakeUp();
      say(HUNGRY);
    } else if (mood === "walk") {
      setMood("idle");
    }
  });

  /* ---------- The main loop: runs every frame ---------- */

  function tick(now) {
    const dt = Math.min((now - (lastFrame || now)) / 1000, 0.05); // seconds since last frame
    lastFrame = now;

    if (feeding() && mood !== "held" && mood !== "fall") {
      chase(dt);
    } else if (mood === "walk") {
      const step = SPEED * dt;
      if (Math.abs(target - x) <= step) {
        x = target;
        setMood("idle");
      } else {
        x += Math.sign(target - x) * step;
      }
      place();
    } else if (mood === "fall") {
      fallSpeed += 2200 * dt; // gravity
      y -= fallSpeed * dt;
      if (y <= 0) {
        y = 0;
        setMood("idle");
      }
      place();
    }

    requestAnimationFrame(tick);
  }

  /* ---------- Every couple of seconds: decide what to do next ---------- */

  setInterval(() => {
    if (document.body.classList.contains("pet-hidden") || document.hidden || feeding()) return;
    const quietFor = Date.now() - lastPlayed;

    if (mood === "idle" && quietFor > SLEEP_AFTER) {
      setMood("sleep");
      say(SLEEPY, 3000);
    } else if (mood === "idle" && !calm && !hovering && quietFor > 4000 && Math.random() < 0.45 &&
               !document.body.classList.contains("motion-paused")) {
      // Pick a new spot at least 120px away and crawl there.
      let next = Math.random() * maxX();
      if (Math.abs(next - x) < 120) next = x > maxX() / 2 ? next - 160 : next + 160;
      target = Math.max(0, Math.min(maxX(), next));
      setMood("walk");
    }
  }, 2000);

  // "Pause animations" / the Accessibility icon: stop crawling on the spot.
  document.addEventListener("motionchange", (e) => {
    if (e.detail && mood === "walk") setMood("idle");
  });

  /* ---------- Hover: stop crawling when the cursor is on it ---------- */

  let hovering = false;
  btn.addEventListener("pointerenter", () => {
    hovering = true;
    if (mood === "walk") setMood("idle");
  });
  btn.addEventListener("pointerleave", () => { hovering = false; });

  /* ---------- Dragging ---------- */

  let pressed = false;
  let dragged = false;
  let startX = 0, startY = 0, grabX = 0, grabY = 0;
  let fallSpeed = 0;

  btn.addEventListener("pointerdown", (e) => {
    pressed = true;
    dragged = false;
    startX = e.clientX;
    startY = e.clientY;
    // Where on the hamster you grabbed it, so it doesn't jump.
    grabX = e.clientX - x;
    grabY = (window.innerHeight - e.clientY) - y;
    // Keep getting move events even if the pointer slips off the hamster.
    try { btn.setPointerCapture(e.pointerId); } catch (err) { /* not supported — fine */ }
  });

  btn.addEventListener("pointermove", (e) => {
    if (!pressed) return;
    if (!dragged && Math.hypot(e.clientX - startX, e.clientY - startY) < 6) return;
    if (!dragged) {
      dragged = true;
      wakeUp();
      setMood("held");
      say(PUTDOWN, 1800);
    }
    x = Math.max(0, Math.min(maxX(), e.clientX - grabX));
    y = Math.max(0, Math.min(window.innerHeight - size(), (window.innerHeight - e.clientY) - grabY));
    place();
  });

  function letGo() {
    if (!pressed) return;
    pressed = false;
    if (dragged) {
      fallSpeed = 0;
      setMood(y > 0 ? "fall" : "idle");
    }
  }
  btn.addEventListener("pointerup", letGo);
  btn.addEventListener("pointercancel", letGo);

  /* ---------- Clicking (mouse, tap, Enter or Space) ---------- */

  btn.addEventListener("click", () => {
    if (dragged) { dragged = false; return; } // that was a drag, not a click
    wakeUp();
    if (mood === "walk") setMood("idle");
    say(LINES[Math.floor(Math.random() * LINES.length)]);
    if (!calm) {
      pet.classList.remove("pet--bounce");
      void pet.offsetWidth; // restart the animation
      pet.classList.add("pet--bounce");
    }
  });

  /* ---------- Keep it on screen if the window is resized ---------- */

  window.addEventListener("resize", () => {
    x = Math.min(x, maxX());
    y = Math.min(y, Math.max(0, window.innerHeight - size()));
    target = Math.min(target, maxX());
    place();
  });

  /* ---------- "Hide the hamster" button in the footer ---------- */
  // Remembers your choice on this browser (if the browser allows it).

  const toggle = document.getElementById("pet-toggle");
  function setHidden(hidden) {
    document.body.classList.toggle("pet-hidden", hidden);
    if (toggle) toggle.textContent = hidden ? "Bring the hamster back" : "Hide the hamster";
    try { localStorage.setItem("pet-hidden", hidden ? "1" : "0"); } catch (err) { /* not allowed — that's fine */ }
  }
  let startHidden = false;
  try { startHidden = localStorage.getItem("pet-hidden") === "1"; } catch (err) { /* ignore */ }
  setHidden(startHidden);
  if (toggle) {
    toggle.addEventListener("click", () => setHidden(!document.body.classList.contains("pet-hidden")));
  }

  /* ---------- Start: bottom-right corner, then say hello ---------- */

  x = maxX() - 16;
  place();
  requestAnimationFrame(tick);
  if (!startHidden) setTimeout(() => say(HELLO), 1200);
})();
