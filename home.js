/* =============================================================
   HOME.JS  —  the moving parts of the home page
   =============================================================
     1. The desktop: the hello.txt window you can drag by its title
        bar, close, and reopen — and Da Niu's typewriter notes in it
     2. A little icon that follows the mouse and changes to suit
        whatever it's pointing at (set with data-cursor="…")
     3. The page fades from black to light when you scroll into a
        section marked data-theme="light"
     4. The skill capsules drop in and pile up, and can be dragged
        (uses the free Matter.js physics library)
     5. Camera roll: folders that open, photos that zoom
     6. Work list: each project's cover follows the mouse on hover
   Everything here is "extra": the page still works without it, and
   people who've asked their computer to reduce motion (or pressed
   "Pause animations") get a calm, still version.
   ============================================================= */

(function () {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const still = () => calm || document.body.classList.contains("motion-paused");

  /* -----------------------------------------------------------
     1. THE DESKTOP
     ----------------------------------------------------------- */

  const desktop = document.querySelector(".desktop");
  const win = desktop && desktop.querySelector(".window");
  if (win) {
    const bar = win.querySelector(".window__bar");
    let x = 0, y = 0; // how far the window has been dragged

    /* The three buttons, like a real window:
       red = close → the window shrinks away and the page goes to My work;
       green = maximise → it grows to fill the screen and goes to About;
       yellow = minimise → it drops into a "hello.txt" tab at the bottom.
       After close / maximise it quietly comes back once the desktop is
       out of sight, so it's there again when you scroll back up. */
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    let shown = null; // the animation currently holding the window away

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "window-tab";
    tab.hidden = true;
    tab.setAttribute("aria-label", "Open hello.txt again");
    tab.innerHTML = '<span aria-hidden="true">📄</span> hello.txt';
    desktop.append(tab);

    const dots = [...bar.querySelectorAll("[data-act]")];

    function goTo(id) {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: still() ? "auto" : "smooth" });
    }

    // Play an animation on the window and keep its end state (or jump there).
    function away(frames, ms) {
      if (shown) shown.cancel();
      shown = win.animate(frames, { duration: still() ? 0 : ms, easing: ease, fill: "forwards" });
      return shown.finished.catch(() => {});
    }

    function bringBack() {
      if (shown) { shown.cancel(); shown = null; }
      win.classList.remove("window--min");
      dots.forEach((d) => d.removeAttribute("tabindex"));
    }

    // Put the window back as soon as the page has finished scrolling away,
    // so hello.txt is always there when you come back to the top.
    function backWhenAway() {
      let done = false;
      const back = () => {
        if (done) return;
        done = true;
        bringBack();
      };
      window.addEventListener("scrollend", back, { once: true });
      setTimeout(back, 1200); // browsers without "scrollend", or no scroll needed
    }

    function close() {
      away([{ transform: "none", opacity: 1 }, { transform: "scale(0.85)", opacity: 0 }], 220)
        .then(() => { goTo("work"); backWhenAway(); });
    }

    function maximise() {
      // Grow from where it is to cover the whole screen.
      const r = win.getBoundingClientRect();
      const dx = innerWidth / 2 - (r.left + r.width / 2);
      const dy = innerHeight / 2 - (r.top + r.height / 2);
      const s = Math.max(innerWidth / r.width, innerHeight / r.height);
      away([{ transform: "none" }, { transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")" }], 380)
        .then(() => { goTo("about"); backWhenAway(); });
    }

    function minimise() {
      tab.hidden = false;
      // Shrink down into the tab.
      const r = win.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      const dx = t.left + t.width / 2 - (r.left + r.width / 2);
      const dy = t.top + t.height / 2 - (r.top + r.height / 2);
      win.classList.add("window--min");
      dots.forEach((d) => d.setAttribute("tabindex", "-1"));
      away([{ transform: "none", opacity: 1 },
            { transform: "translate(" + dx + "px," + dy + "px) scale(0.08)", opacity: 0 }], 320);
      tab.focus();
    }

    function restore() {
      tab.hidden = true;
      if (still() || !shown) { bringBack(); }
      else { shown.reverse(); shown.finished.then(bringBack).catch(() => {}); }
      dots[0].focus();
    }

    const acts = { close, min: minimise, max: maximise };
    dots.forEach((dot) => dot.addEventListener("click", () => acts[dot.dataset.act]()));
    tab.addEventListener("click", restore);

    // Drag by the title bar (mouse only — on phones the window just sits in the page).
    if (hasMouse) {
      let startX, startY, fromX, fromY, limits;
      bar.addEventListener("pointerdown", (e) => {
        if (window.matchMedia("(max-width: 700px)").matches) return;
        if (e.target.closest("button")) return; // the three buttons aren't for dragging
        startX = e.clientX; startY = e.clientY; fromX = x; fromY = y;
        // Keep the whole window inside the desktop.
        const d = desktop.getBoundingClientRect();
        const w = win.getBoundingClientRect();
        limits = {
          minX: x - (w.left - d.left), maxX: x + (d.right - w.right),
          minY: y - (w.top - d.top), maxY: y + (d.bottom - w.bottom),
        };
        win.classList.add("window--dragging");
        try { bar.setPointerCapture(e.pointerId); } catch (err) { /* fine without it */ }
      });
      bar.addEventListener("pointermove", (e) => {
        if (!win.classList.contains("window--dragging")) return;
        x = Math.min(limits.maxX, Math.max(limits.minX, fromX + e.clientX - startX));
        y = Math.min(limits.maxY, Math.max(limits.minY, fromY + e.clientY - startY));
        win.style.translate = x + "px " + y + "px";
      });
      const drop = () => win.classList.remove("window--dragging");
      bar.addEventListener("pointerup", drop);
      bar.addEventListener("pointercancel", drop);
    }
  }
  // Da Niu's notes in the hello.txt window, typed like a typewriter:
  // type the Chinese line, then the English, wait, delete, next note.
  const quote = document.querySelector(".quote");
  if (quote) {
    const zh = quote.querySelector(".quote__zh");
    const en = quote.querySelector(".quote__en");
    const items = [...quote.querySelectorAll(".quote__lines li")];
    // A note is read fresh from the list each time, so it follows the
    // language picker (i18n.js turns the Chinese into 繁體 if chosen).
    const note = (k) => [...items[k].querySelectorAll("span")].map((s) => s.textContent);
    const caret = document.createElement("span");
    caret.className = "caret";

    const wait = (ms) => new Promise((done) => setTimeout(done, ms));
    let n = 0;      // which note is showing
    let round = 0;  // goes up to call off the typing in progress

    // Show the current note whole (no typing).
    function showWhole() {
      zh.lang = /^zh-Hant/i.test(document.documentElement.lang) ? "zh-Hant" : "zh-Hans";
      zh.textContent = note(n)[0];
      en.textContent = note(n)[1];
      if (!calm) en.append(caret);
    }

    // Wait a moment (longer while the tab is hidden) — unless this round
    // of typing has been called off by "Pause animations".
    async function step(ms, mine) {
      do { await wait(ms); } while (document.hidden);
      if (mine !== round) throw new Error("stopped");
    }

    async function type(line, text, speed, mine) {
      line.append(caret);
      for (const ch of text) {
        caret.before(ch);
        await step(speed, mine);
      }
    }

    // Backspace: remove the letter just before the cursor, one at a time.
    async function erase(line, speed, mine) {
      line.append(caret);
      let letters;
      while ((letters = caret.previousSibling)) {
        letters.textContent = letters.textContent.slice(0, -1);
        if (!letters.textContent) letters.remove();
        await step(speed, mine);
      }
    }

    async function run(mine) {
      try {
        // The note on show is already whole; let people read it first.
        await step(3200, mine);
        for (;;) {
          await erase(en, 22, mine);
          await erase(zh, 45, mine);
          n = (n + 1) % items.length;
          await step(300, mine);
          await type(zh, note(n)[0], 120, mine);
          await step(250, mine);
          await type(en, note(n)[1], 45, mine);
          await step(3200, mine);
        }
      } catch (err) { /* called off — see below */ }
    }

    // "Pause animations": stop typing and show the whole note, never half
    // a word. Playing again carries on from that note. A new language
    // does the same, so the note on show is in the right script.
    const restart = () => {
      round++;
      showWhole();
      if (!still()) run(round);
    };
    document.addEventListener("motionchange", restart);
    document.addEventListener("langchange", restart);

    showWhole();
    if (!still()) run(round);
  }

  /* -----------------------------------------------------------
     2. CURSOR ICON
     ----------------------------------------------------------- */
  if (hasMouse) {
    const badge = document.createElement("div");
    badge.className = "cursor-badge";
    badge.setAttribute("aria-hidden", "true");
    document.body.appendChild(badge);

    let current = null;
    document.addEventListener("pointermove", (e) => {
      const spot = e.target.closest ? e.target.closest("[data-cursor]") : null;
      if (spot !== current) {
        current = spot;
        if (spot) badge.textContent = spot.dataset.cursor;
        badge.classList.toggle("cursor-badge--show", !!spot);
      }
      // Sit just below-right of the pointer.
      badge.style.transform = "translate(" + (e.clientX + 18) + "px," + (e.clientY + 20) + "px)";
    });
    const hideBadge = () => {
      current = null;
      badge.classList.remove("cursor-badge--show");
    };
    document.addEventListener("pointerleave", hideBadge);
    // When the page scrolls, what's under the mouse changes — hide the
    // label until the mouse moves again, so it never shows a stale one.
    window.addEventListener("scroll", hideBadge, { passive: true });
  }

  /* -----------------------------------------------------------
     3. BLACK → LIGHT WHEN SCROLLING
     Watches an invisible line across the middle of the window.
     When a light section crosses it, the page turns light.
     ----------------------------------------------------------- */
  const lightParts = document.querySelectorAll('[data-theme="light"]');
  if (lightParts.length) {
    const showing = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) showing.add(entry.target);
        else showing.delete(entry.target);
      });
      document.body.classList.toggle("theme-light", showing.size > 0);
    }, { rootMargin: "-50% 0px -50% 0px" });
    lightParts.forEach((part) => observer.observe(part));
  }

  /* -----------------------------------------------------------
     4. FALLING SKILL CAPSULES
     Each capsule is a real list item; the physics engine just
     tells it where to sit and how much to tilt.
     ----------------------------------------------------------- */
  const skills = document.querySelector(".skills");
  const box = skills && skills.querySelector(".skills__box");
  if (box && window.Matter && !calm) {
    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;
    const pills = [...box.querySelectorAll(".skills__list li")];
    let started = false;
    let inView = false;
    let engine, runner;

    function start() {
      started = true;
      skills.classList.add("skills--physics");

      engine = Engine.create({ gravity: { y: 1 } });
      const width = () => box.clientWidth;
      const height = () => box.clientHeight;

      // Invisible floor and walls to keep the capsules in the box.
      const thick = 200;
      const floor = Bodies.rectangle(width() / 2, height() + thick / 2, width() * 3, thick, { isStatic: true });
      const left = Bodies.rectangle(-thick / 2, height() / 2, thick, height() * 4, { isStatic: true });
      const right = Bodies.rectangle(width() + thick / 2, height() / 2, thick, height() * 4, { isStatic: true });
      Composite.add(engine.world, [floor, left, right]);

      // One rounded body per capsule, dropped from above at random spots.
      const bodies = pills.map((pill, i) => {
        const w = pill.offsetWidth;
        const h = pill.offsetHeight;
        const body = Bodies.rectangle(
          w / 2 + Math.random() * Math.max(1, width() - w),
          -h - i * 45,
          w, h,
          { chamfer: { radius: h / 2 }, restitution: 0.35, friction: 0.3, angle: (Math.random() - 0.5) * 0.8 }
        );
        body.pill = { el: pill, w, h };
        return body;
      });
      Composite.add(engine.world, bodies);

      // A new language (i18n.js) changes how wide each capsule is:
      // swap each one's body for a new one of the right size, in place.
      document.addEventListener("langchange", () => {
        bodies.forEach((old, i) => {
          const { el, h } = old.pill;
          const w = el.offsetWidth;
          if (!w || w === old.pill.w) return;
          const body = Bodies.rectangle(old.position.x, old.position.y, w, h, {
            chamfer: { radius: h / 2 }, restitution: 0.35, friction: 0.3, angle: old.angle,
          });
          body.pill = { el, w, h };
          Composite.remove(engine.world, old);
          Composite.add(engine.world, body);
          bodies[i] = body;
        });
      });

      // Grab-and-drag with the mouse (not on touch screens, so the page
      // can still be scrolled with a finger).
      if (hasMouse) {
        const mouse = Mouse.create(box);
        // Let the mouse wheel keep scrolling the page.
        mouse.element.removeEventListener("wheel", mouse.mousewheel);
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
        const grab = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, render: { visible: false } },
        });
        Composite.add(engine.world, grab);
      }

      // After every physics step, move each capsule to match its body.
      Events.on(engine, "afterUpdate", () => {
        bodies.forEach((b) => {
          const { el, w, h } = b.pill;
          el.style.transform =
            "translate(" + (b.position.x - w / 2) + "px," + (b.position.y - h / 2) + "px) rotate(" + b.angle + "rad)";
        });
      });

      runner = Runner.create();
      Runner.run(runner, engine);

      // Keep the walls in place if the window changes size.
      window.addEventListener("resize", () => {
        Matter.Body.setPosition(floor, { x: width() / 2, y: height() + thick / 2 });
        Matter.Body.setPosition(right, { x: width() + thick / 2, y: height() / 2 });
      });
    }

    // Drop them in when the box first scrolls into view. While animations
    // are paused they wait as a still list; if they've already fallen,
    // they freeze where they are.
    const maybeStart = () => { if (inView && !started && !still()) start(); };
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      maybeStart();
    }, { threshold: 0.35 }).observe(box);

    document.addEventListener("motionchange", (e) => {
      if (!runner) return maybeStart();
      if (e.detail) Runner.stop(runner);
      else Runner.run(runner, engine);
    });
  }

  /* -----------------------------------------------------------
     6. WORK LIST: THE COVER THAT FOLLOWS THE MOUSE
     Hover a project's row and its cover floats up beside the
     pointer, gliding after it. Keyboard focus shows it at the
     right-hand end of the row. (Touch screens show the cover in
     the row instead — that's all CSS.)
     ----------------------------------------------------------- */
  const preview = document.querySelector(".work-preview");
  if (preview) {
    const rows = [...document.querySelectorAll(".work__link")];
    let px = 0, py = 0, tx = 0, ty = 0, showing = false, gliding = 0;

    function fill(row) {
      preview.innerHTML = "";
      const cover = row.querySelector(".work__cover").cloneNode(true);
      cover.querySelectorAll("img").forEach((img) => { img.alt = ""; }); // the row already says what it is
      preview.appendChild(cover);
    }

    // Ease towards the target a little each frame, so it glides.
    function glide() {
      const k = still() ? 1 : 0.18;
      px += (tx - px) * k;
      py += (ty - py) * k;
      preview.style.transform = "translate(" + px + "px," + py + "px)";
      gliding = (showing && (Math.abs(tx - px) > 0.5 || Math.abs(ty - py) > 0.5)) ? requestAnimationFrame(glide) : 0;
    }
    const go = () => { if (!gliding) gliding = requestAnimationFrame(glide); };

    function aim(x, y) {
      const w = preview.offsetWidth, h = preview.offsetHeight;
      tx = x + 28;
      if (tx + w > window.innerWidth - 16) tx = x - w - 28; // flip to the left near the right edge
      ty = Math.min(Math.max(y - h / 2, 70), window.innerHeight - h - 16);
    }

    function show(row, x, y) {
      fill(row);
      aim(x, y);
      if (!showing) { px = tx; py = ty; } // first appearance: start right there
      showing = true;
      preview.classList.add("work-preview--show");
      go();
    }

    function hide() {
      showing = false;
      preview.classList.remove("work-preview--show");
    }

    // Pointer events tell us if it's a mouse (or pen) — a finger on a
    // touch screen sees the cover in the row instead, so skip those.
    // (Laptops with a touch screen AND a mouse still get the preview.)
    const byMouse = (e) => e.pointerType === "mouse" || e.pointerType === "pen";

    rows.forEach((row) => {
      row.addEventListener("pointerenter", (e) => { if (byMouse(e)) show(row, e.clientX, e.clientY); });
      row.addEventListener("pointermove", (e) => { if (byMouse(e)) { aim(e.clientX, e.clientY); go(); } });
      row.addEventListener("pointerleave", hide);
      row.addEventListener("focus", () => {
        if (!row.matches(":focus-visible")) return;
        const r = row.getBoundingClientRect();
        show(row, r.right - preview.offsetWidth - 80, r.top + r.height / 2);
      });
      row.addEventListener("blur", hide);
    });
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* -----------------------------------------------------------
     5. CAMERA ROLL: FOLDERS THAT OPEN + PHOTOS THAT ZOOM
     Opening a folder: each photo starts small at the folder and
     flies to its place in the grid (one after another).
     Clicking a photo: it grows from where it is into the big
     viewer. Closing does the same in reverse.
     With "reduce motion" or "Pause animations", it all happens
     instantly instead.
     ----------------------------------------------------------- */
  const ease = "cubic-bezier(0.2, 0.9, 0.25, 1.1)";
  const centre = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

  const folderArea = document.querySelector("[data-folders]");
  if (folderArea) {
    const folders = [...folderArea.querySelectorAll(".folder")];
    const panels = folders.map((f) => document.getElementById(f.getAttribute("aria-controls")));
    let openOne = -1;

    // With JavaScript working, start with every folder closed.
    panels.forEach((p) => { p.hidden = true; });

    // Every photo flies from (or back to) the folder's picture.
    function fly(i, backwards) {
      const from = centre(folders[i].querySelector(".folder__art").getBoundingClientRect());
      const thumbs = [...panels[i].querySelectorAll(".thumb")];
      return thumbs.map((thumb, k) => {
        const to = centre(thumb.getBoundingClientRect());
        const atFolder = {
          transform: "translate(" + (from.x - to.x) + "px," + (from.y - to.y) + "px) scale(0.2) rotate(" + ((k % 3) - 1) * 14 + "deg)",
          opacity: 0,
        };
        const inPlace = { transform: "none", opacity: 1 };
        return thumb.animate(backwards ? [inPlace, atFolder] : [atFolder, inPlace], {
          duration: backwards ? 320 : 560,
          delay: (backwards ? thumbs.length - 1 - k : k) * (backwards ? 18 : 45),
          easing: backwards ? "ease-in" : ease,
          fill: "both",
        });
      });
    }

    function openFolder(i) {
      openOne = i;
      folders[i].setAttribute("aria-expanded", "true");
      folders[i].dataset.cursor = "📁 Close";
      panels[i].hidden = false;
      if (!still()) {
        fly(i, false).forEach((a) => a.finished.then(() => a.cancel()));
        panels[i].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
      }
      // Scroll so the folders sit near the top, with the photos below them.
      const header = document.querySelector(".site-header");
      const top = folderArea.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 16;
      if (Math.abs(window.scrollY - top) > 40) {
        window.scrollTo({ top, behavior: still() ? "auto" : "smooth" });
      }
    }

    function closeFolder(i, thenDo) {
      openOne = -1;
      folders[i].setAttribute("aria-expanded", "false");
      folders[i].dataset.cursor = "📂 Open";
      const finish = () => {
        panels[i].hidden = true;
        panels[i].querySelectorAll(".thumb").forEach((t) => t.getAnimations().forEach((a) => a.cancel()));
        if (thenDo) thenDo();
      };
      if (still()) { finish(); return; }
      Promise.all(fly(i, true).map((a) => a.finished)).then(finish);
    }

    folders.forEach((folder, i) => {
      folder.addEventListener("click", () => {
        if (openOne === i) closeFolder(i);
        else if (openOne !== -1) closeFolder(openOne, () => openFolder(i));
        else openFolder(i);
      });
      panels[i].querySelector(".folder-panel__close").addEventListener("click", () => {
        closeFolder(i, () => folders[i].focus());
      });
    });

    /* ---- the big photo viewer ---- */
    const viewer = document.querySelector(".lightbox");
    const big = viewer.querySelector(".lightbox__img");
    const count = viewer.querySelector(".lightbox__count");
    const extras = [count, ...viewer.querySelectorAll(".lightbox__btn")];
    let photos = [];
    let at = 0;

    function show(k) {
      at = (k + photos.length) % photos.length;
      const img = photos[at].querySelector("img");
      big.src = img.currentSrc || img.src;
      big.alt = img.alt; // no caption on screen; screen readers still hear the description
      count.textContent = (at + 1) + " / " + photos.length;
    }

    // Grow (or shrink) the big photo from (or to) its little thumbnail.
    function zoom(thumb, backwards) {
      const a = thumb.getBoundingClientRect();
      const b = big.getBoundingClientRect();
      const small = {
        transform: "translate(" + (a.left - b.left) + "px," + (a.top - b.top) + "px) scale(" + a.width / b.width + ")",
        borderRadius: "12px",
      };
      const full = { transform: "none", borderRadius: "14px" };
      extras.forEach((el) => el.animate(
        backwards ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
        { duration: 250, fill: backwards ? "forwards" : "none" }
      ));
      return big.animate(backwards ? [full, small] : [small, full], {
        duration: backwards ? 320 : 460,
        easing: backwards ? "ease-in" : ease,
      });
    }
    big.style.transformOrigin = "top left";

    async function openViewer(list, k) {
      photos = list;
      show(k);
      viewer.showModal();
      if (still()) return;
      try { await big.decode(); } catch (err) { /* show it anyway */ }
      zoom(photos[at], false);
    }

    async function closeViewer() {
      if (!viewer.open) return;
      if (!still()) {
        await zoom(photos[at], true).finished;
      }
      viewer.close();
      extras.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    }

    function flip(step) {
      show(at + step);
      if (!still()) {
        big.animate([{ opacity: 0, transform: "translateX(" + step * 24 + "px)" }, { opacity: 1, transform: "none" }],
          { duration: 260, easing: "ease-out" });
      }
    }

    panels.forEach((panel) => {
      const thumbs = [...panel.querySelectorAll(".thumb")];
      thumbs.forEach((thumb, k) => {
        // (built from the English description; i18n.js translates the whole label)
        const img = thumb.querySelector("img");
        const alt = window.i18n ? window.i18n.english(img, "alt") : img.alt;
        thumb.setAttribute("aria-label", "Open photo: " + alt);
        thumb.addEventListener("click", () => openViewer(thumbs, k));
      });
    });

    viewer.querySelector(".lightbox__close").addEventListener("click", closeViewer);
    viewer.querySelector(".lightbox__prev").addEventListener("click", () => flip(-1));
    viewer.querySelector(".lightbox__next").addEventListener("click", () => flip(1));
    viewer.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") flip(-1);
      if (e.key === "ArrowRight") flip(1);
    });
    // Esc: run our zoom-out instead of closing instantly.
    viewer.addEventListener("cancel", (e) => { e.preventDefault(); closeViewer(); });
    // Clicking the dark area around the photo closes it too.
    viewer.addEventListener("click", (e) => {
      if (e.target === viewer || e.target.classList.contains("lightbox__stage")) closeViewer();
    });
  }

  /* -----------------------------------------------------------
     7. ME, IN MOTION  (the moving wall in About)
     Style based on Skiper UI "skiper30". Each column scrolls by
     itself, round and round (the CSS animation "drift-loop"). Here we
     add a hidden second copy of each column's tiles so the loop has
     no seam, and set each column's speed from data-speed (pixels per
     second). The videos play only while the wall is on screen. With
     "Pause animations" or "reduce motion" the wall holds still, the
     videos stop and show play controls.
     ----------------------------------------------------------- */
  const wall = document.querySelector(".drift");
  if (wall) {
    const cols = [...wall.querySelectorAll(".drift__col")];

    // The copy is only there for the loop: hidden from screen readers.
    cols.forEach((col) => {
      [...col.children].forEach((tile) => {
        const copy = tile.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        copy.querySelectorAll("img").forEach((img) => { img.alt = ""; });
        copy.querySelectorAll("video").forEach((v) => { v.muted = true; v.removeAttribute("aria-label"); });
        col.append(copy);
      });
    });
    const videos = [...wall.querySelectorAll("video")];
    let onScreen = false;

    // Same speed however tall the column is: time = one copy's height ÷ speed.
    function setSpeeds() {
      cols.forEach((col) => {
        const oneCopy = col.scrollHeight / 2;
        col.style.animationDuration = (oneCopy / Number(col.dataset.speed)).toFixed(1) + "s";
      });
    }

    // On screen and moving: play (no sound). Otherwise stop. While
    // everything's still, show play controls so people can choose.
    function playOrStop() {
      videos.forEach((v) => {
        v.controls = still() && !v.closest('[aria-hidden="true"]');
        if (onScreen && !still()) v.play().catch(() => {});
        else v.pause();
      });
    }

    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      wall.classList.toggle("is-offscreen", !onScreen);
      playOrStop();
    }).observe(wall);

    window.addEventListener("resize", setSpeeds);
    document.addEventListener("motionchange", playOrStop);
    setSpeeds();
  }
})();
