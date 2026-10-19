/* ============================================================
   Kinetics — physics-demo.js
   Interactive spring sim
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Interactive spring simulator
  --------------------------------------------------------- */
  (function springSim() {
    const ball = document.getElementById('physics-ball');
    const stiffSlider = document.getElementById('stiff-slider');
    const dampSlider = document.getElementById('damp-slider');
    const stiffVal = document.getElementById('stiff-val');
    const dampVal = document.getElementById('damp-val');
    const trigger = document.getElementById('physics-trigger');
    if (!ball || !stiffSlider || !dampSlider || !trigger) return;

    const stage = ball.parentElement;
    let raf = null;

    const sync = () => {
      stiffVal.textContent = stiffSlider.value;
      dampVal.textContent = dampSlider.value;
    };
    stiffSlider.addEventListener('input', sync);
    dampSlider.addEventListener('input', sync);
    sync();

    const travel = () => Math.max(stage.clientWidth - ball.offsetWidth - 48, 40);

    // simulate a critically/under-damped spring from left -> right
    const release = () => {
      if (raf) cancelAnimationFrame(raf);
      const tension = parseFloat(stiffSlider.value);
      const friction = parseFloat(dampSlider.value);
      const dist = travel();

      let x = 0;        // normalized 0 -> 1
      let v = 0;        // velocity
      const target = 1;
      const dt = 1 / 60;
      let settleFrames = 0;

      const step = () => {
        // integrate a few sub-steps for stability at high stiffness
        for (let i = 0; i < 4; i++) {
          const a = tension * (target - x) - friction * v;
          v += a * (dt / 4);
          x += v * (dt / 4);
        }
        ball.style.transform = `translate(${(x * dist).toFixed(2)}px, -50%)`;

        const atRest = Math.abs(target - x) < 0.001 && Math.abs(v) < 0.001;
        if (atRest) settleFrames++; else settleFrames = 0;

        if (settleFrames < 6 && !reduce) {
          raf = requestAnimationFrame(step);
        } else {
          ball.style.transform = `translate(${dist}px, -50%)`;
        }
      };

      if (reduce) {
        ball.style.transform = `translate(${dist}px, -50%)`;
      } else {
        raf = requestAnimationFrame(step);
      }
    };

    trigger.addEventListener('click', () => {
      const t = ball.style.transform;
      // toggle: if already at/near the right, snap home then release
      if (t && t.indexOf('translate(0') !== 0 && t !== '') {
        if (raf) cancelAnimationFrame(raf);
        ball.style.transform = 'translate(0px, -50%)';
        setTimeout(release, 120);
      } else {
        release();
      }
    });
  })();

})();
