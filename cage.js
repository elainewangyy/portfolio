/* =============================================================
   CAGE.JS  —  the Desk Pet page
   =============================================================
     1. The cloth cover: the page starts with a cloth over Da Niu's
        cage, like at night. "Lift the cover" to start. (Once per visit.)
     2. Da Niu digs a winding tunnel down the side as you scroll
        through the bedding layers.
   (The playable game at the top is its own page, play/index.html.
   The older "look through the cage bars" version of this file is in
   archive/cage-version.js.)
   Everything here is extra: the page reads fine without it. With
   "reduce motion" or "Pause animations", things hold still.
   ============================================================= */

(function () {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const still = () => calm || document.body.classList.contains("motion-paused");

  /* -----------------------------------------------------------
     1. THE CLOTH COVER
     ----------------------------------------------------------- */
  let seenCover = false;
  try { seenCover = sessionStorage.getItem("cage-uncovered") === "1"; } catch (err) { /* ignore */ }

  if (!seenCover) {
    const cover = document.createElement("div");
    cover.className = "cover";
    cover.setAttribute("role", "dialog");
    cover.setAttribute("aria-modal", "true");
    cover.setAttribute("aria-labelledby", "cover-text");
    cover.innerHTML =
      '<div class="cover__inner">' +
      '<img src="assets/pet/sleep.gif" alt="" />' +
      '<p class="cover__text" id="cover-text">Shh… Da Niu is asleep under the cover.</p>' +
      '<p class="cover__progress" aria-hidden="true"><span>WAKING UP</span> <span class="cover__num">0</span>%</p>' +
      '<button type="button" class="cover__btn">Lift the cover</button>' +
      "</div>";
    document.body.appendChild(cover);

    // Everything behind the cover is out of reach until it's lifted.
    const behind = [document.querySelector(".site-header"), document.querySelector("main"), document.querySelector(".site-footer")];
    behind.forEach((el) => el && el.setAttribute("inert", ""));
    document.documentElement.style.overflow = "hidden";

    const btn = cover.querySelector(".cover__btn");
    btn.focus();

    // "Waking up" counts up as Da Niu's pictures finish loading.
    const number = cover.querySelector(".cover__num");
    const files = ["play/pa.gif", "play/shake.gif", "play/sleepy.gif", "assets/pet/walk.gif"];
    let done = 0;
    files.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => { done++; number.textContent = Math.round((done / files.length) * 100); };
      img.src = src;
    });

    function lift() {
      behind.forEach((el) => el && el.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
      const gone = () => cover.remove();
      if (still()) gone();
      else {
        cover.classList.add("cover--lifted");
        cover.addEventListener("transitionend", gone, { once: true });
        setTimeout(gone, 1200); // just in case
      }
      // Keyboard focus goes to the page title, so it's not lost.
      const title = document.getElementById("page-title");
      if (title) title.focus({ preventScroll: true });
      try { sessionStorage.setItem("cage-uncovered", "1"); } catch (err) { /* fine */ }
    }
    btn.addEventListener("click", lift);
    cover.addEventListener("keydown", (e) => { if (e.key === "Escape") lift(); });
  }

  /* -----------------------------------------------------------
     2. DA NIU DIGS A WINDING TUNNEL DOWN THE SIDE AS YOU SCROLL
     The tunnel wiggles left and right on its way down. The further
     down the bedding layers you scroll, the more of it he has dug;
     he sits at the end, turned to face the way the tunnel bends.
     While you're scrolling he wiggles and kicks up dirt behind him.
     ----------------------------------------------------------- */
  const digger = document.querySelector(".digger");
  const burrow = document.querySelector(".burrow");
  if (digger && burrow) {
    const niuDigging = digger.querySelector(".digger__niu");
    const tunnel = digger.querySelector(".digger__tunnel");
    const clip = digger.querySelector(".digger__clip");
    const paths = digger.querySelectorAll(".digger__dug, .digger__crumbs");
    const CRUMBS = ["#7a5638", "#5a3d27", "#fffaf2", "#e9dcc4", "#f2c14e"]; // dirt, bedding, a corn bit
    let stopTimer, lastY = window.scrollY, lastCrumb = 0;
    let boxW = 0, boxH = 0;
    let heading = { x: 0, y: 1 }; // which way he's digging (for the dirt)
    let freshRoute = true;        // the current route hasn't been dug yet

    // Where the tunnel is (left–right) at each height: three waves of
    // different sizes mixed together. Their sizes, timings and starting
    // points are picked at random, so every time the route is different.
    // BEND is roughly how many pixels one big wiggle takes — smaller = curlier.
    const BEND = 300;
    let waves = [];
    function newRoute() {
      const rand = (lo, hi) => lo + Math.random() * (hi - lo);
      const weights = [rand(0.5, 0.8), rand(0.15, 0.35), rand(0.05, 0.2)];
      const total = weights.reduce((a, b) => a + b, 0);
      waves = [
        { len: BEND * rand(0.8, 1.4), shift: rand(0, 2 * Math.PI) },
        { len: BEND * rand(0.35, 0.6), shift: rand(0, 2 * Math.PI) },
        { len: BEND * rand(0.15, 0.3), shift: rand(0, 2 * Math.PI) },
      ].map((w, i) => ({ ...w, weight: weights[i] / total }));
      if (Math.random() < 0.5) waves.forEach((w) => { w.weight = -w.weight; }); // sometimes starts the other way
    }
    newRoute();

    function tunnelX(y) {
      const amp = Math.max(6, boxW / 2 - 18); // how far it can swing either way
      let sway = 0;
      for (const w of waves) sway += w.weight * Math.sin((y / w.len) * 2 * Math.PI + w.shift);
      return boxW / 2 + amp * sway;
    }

    function drawTunnel() {
      boxW = digger.clientWidth;
      boxH = digger.clientHeight;
      if (!boxW || !boxH) return;
      tunnel.setAttribute("viewBox", "0 0 " + boxW + " " + boxH);
      let d = "";
      for (let y = 0; y <= boxH; y += 6) d += (y ? " L" : "M") + tunnelX(y).toFixed(1) + " " + y;
      paths.forEach((p) => p.setAttribute("d", d));
    }

    function kickUpDirt() {
      const now = Date.now();
      if (now - lastCrumb < 60) return; // not too many at once
      lastCrumb = now;
      const r = niuDigging.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (let i = 0; i < 3; i++) {
        const bit = document.createElement("span");
        bit.className = "dig-crumb";
        // From behind him, flying back the way he came.
        bit.style.left = cx - heading.x * 22 + (Math.random() - 0.5) * 16 + "px";
        bit.style.top = cy - heading.y * 22 + "px";
        bit.style.setProperty("--s", 3 + Math.random() * 5 + "px");
        bit.style.setProperty("--c", CRUMBS[Math.floor(Math.random() * CRUMBS.length)]);
        bit.style.setProperty("--dx", -heading.x * 40 + (Math.random() - 0.5) * 60 + "px");
        bit.style.setProperty("--dy", -heading.y * (25 + Math.random() * 35) + "px");
        document.body.appendChild(bit);
        setTimeout(() => bit.remove(), 750);
      }
    }

    const update = () => {
      if (!boxH) drawTunnel();
      const r = burrow.getBoundingClientRect();
      const through = (window.innerHeight * 0.5 - r.top) / r.height; // 0 at the top layer, 1 at the bottom
      const dug = Math.min(Math.max(through, 0), 1);
      digger.classList.toggle("digger--show", through > 0 && through < 1.05);

      // Scrolled back up above the bedding? Next time he digs a new route.
      if (through <= 0 && !freshRoute) { newRoute(); drawTunnel(); freshRoute = true; }
      if (through > 0.02) freshRoute = false;

      // How far down he is, where the tunnel is there, and which way it bends.
      const y = dug * boxH;
      const x = tunnelX(y);
      const dx = tunnelX(y + 4) - x, dy = 4;
      const len = Math.hypot(dx, dy);
      heading = { x: dx / len, y: dy / len };
      clip.setAttribute("height", y + 20);
      niuDigging.style.left = x + "px";
      niuDigging.style.top = y + "px";
      // The GIF's head points up; turn him so his head points along the tunnel.
      niuDigging.style.setProperty("--turn", (Math.atan2(dy, dx) * 180) / Math.PI + 90 + "deg");

      // Scrolling down = digging: wiggle and throw dirt (unless motion is paused).
      const goingDown = window.scrollY > lastY;
      lastY = window.scrollY;
      if (goingDown && through > 0 && through < 1 && !still()) {
        digger.classList.add("is-digging");
        kickUpDirt();
        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => digger.classList.remove("is-digging"), 180);
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => { drawTunnel(); update(); });
    drawTunnel();
    update();
  }

  /* -----------------------------------------------------------
     3. PHOTO CAROUSEL IN THE NEST
     Style based on Skiper UI "skiper54". The photos sit in a row
     that snaps as you scroll it sideways; whichever is nearest the
     middle becomes "current" (shown in full, title showing). The
     arrows and dots move along one photo at a time; clicking a
     clipped photo brings it to the middle. A video that slides away
     is paused.
     ----------------------------------------------------------- */
  const carousel = document.querySelector(".nest-carousel");
  if (carousel) {
    const track = carousel.querySelector(".nest-carousel__track");
    const slides = [...track.children];
    const nav = carousel.querySelector(".nest-carousel__nav");
    const dotsBox = carousel.querySelector(".nest-carousel__dots");
    const count = carousel.querySelector(".nest-carousel__count");
    let current = -1;

    const dots = slides.map((slide, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "nest-carousel__dot";
      dot.setAttribute("aria-label", "Photo " + (i + 1) + " of " + slides.length);
      dot.addEventListener("click", () => goTo(i));
      dotsBox.append(dot);
      return dot;
    });

    function setCurrent(best) {
      if (best === current) return;
      current = best;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-current", i === best);
        if (i !== best) slide.querySelectorAll("video").forEach((v) => v.pause());
      });
      dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === best)));
      count.textContent = (best + 1) + " / " + slides.length;
    }

    // Arrows / dots / clicks: that photo becomes current straight away
    // (so pressing → twice quickly goes two photos), then the row
    // slides there. Scrolling doesn't change "current" until it stops.
    let gliding = false;
    let glideTimer;
    function goTo(i) {
      i = (i + slides.length) % slides.length; // past the end goes back round
      const slide = slides[i];
      setCurrent(i);
      gliding = true;
      clearTimeout(glideTimer);
      glideTimer = setTimeout(() => { gliding = false; }, 900); // in case "scrollend" never comes
      track.scrollTo({
        left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
        behavior: still() ? "auto" : "smooth",
      });
    }

    // Swiping / scrolling by hand: whichever photo is nearest the middle.
    function findCurrent() {
      const middle = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      slides.forEach((slide, i) => {
        const gap = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);
        const bestGap = Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - middle);
        if (gap < bestGap) best = i;
      });
      setCurrent(best);
    }

    track.addEventListener("scroll", () => { if (!gliding) findCurrent(); }, { passive: true });
    track.addEventListener("scrollend", () => { gliding = false; findCurrent(); });

    carousel.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => goTo(current + Number(btn.dataset.step)));
    });

    // Click a clipped photo at the side: bring it to the middle.
    slides.forEach((slide, i) => {
      slide.addEventListener("click", (e) => {
        if (i === current) return;
        e.preventDefault(); // (don't start a video that isn't in the middle yet)
        goTo(i);
      });
    });

    // Arrow keys while the row has focus.
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    });

    window.addEventListener("resize", () => { current = -1; findCurrent(); });

    nav.hidden = false;
    carousel.classList.add("is-ready");
    findCurrent();
  }
})();
