import { initSpringSimulator } from '../lib/spring-simulator.js';
export const easingHTML = '<button class="spring-easing" type="button">Hover or focus me</button>';
export const easingCSS = `.spring-easing {
  padding: 16px 24px; border: 0; border-radius: 12px;
  background: #ff8a00; color: #0e0e10; font: 600 16px/1.5 system-ui;
  cursor: pointer;
  transition: transform 400ms cubic-bezier(.34, 1.56, .64, 1);
}
.spring-easing:hover, .spring-easing:focus-visible { transform: translateY(-6px) scale(1.03); }
.spring-easing:focus-visible { outline: 3px solid #5b8def; outline-offset: 4px; }
.spring-easing:active { transform: translateY(0) scale(.98); }
@media (prefers-reduced-motion: reduce) {
  .spring-easing { transition: none; }
  .spring-easing:hover, .spring-easing:focus-visible, .spring-easing:active { transform: none; }
}`;
export const simulatorHTML = `<div class="spring-simulator" data-spring-simulator>
  <div class="sim-control">
    <label for="sim-stiffness">Stiffness</label>
    <input id="sim-stiffness" data-stiffness type="range" min="80" max="500" value="320" />
    <output for="sim-stiffness" data-stiffness-value>320</output>
  </div>
  <div class="sim-control">
    <label for="sim-damping">Damping</label>
    <input id="sim-damping" data-damping type="range" min="8" max="50" value="24" />
    <output for="sim-damping" data-damping-value>24</output>
  </div>
  <div class="sim-stage" data-spring-stage aria-hidden="true">
    <span class="sim-marker sim-left"></span><span class="sim-marker sim-right"></span>
    <span class="sim-ball" data-spring-ball></span>
  </div>
  <div class="sim-actions">
    <button type="button" data-target="0.25">Move left</button>
    <button type="button" data-target="0.75">Move right</button>
  </div>
  <p class="sim-status" data-spring-status role="status">Choose a target. Mass is fixed at 1.</p>
</div>`;
export const simulatorCSS = `.spring-simulator { max-width: 720px; padding: 24px; border: 1px solid #54545b; border-radius: 16px; background: #1a1a1d; color: #ede9e0; font: 15px/1.6 system-ui; }
.sim-control { display: grid; grid-template-columns: 80px minmax(0, 1fr) 40px; gap: 12px; align-items: center; margin-bottom: 16px; }
.sim-control input { min-width: 0; width: 100%; accent-color: #ff8a00; }
.sim-control output { color: #ff8a00; text-align: right; }
.sim-stage { position: relative; height: 120px; overflow: hidden; border: 1px solid #54545b; border-radius: 10px; background: #0e0e10; }
.sim-ball { position: absolute; top: 46px; left: 16px; width: 28px; height: 28px; border-radius: 50%; background: #ff8a00; }
.sim-marker { position: absolute; top: 16px; bottom: 16px; width: 1px; background: #54545b; }
.sim-left { left: calc(25% + 15px); } .sim-right { left: calc(75% - 15px); }
.sim-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 18px; }
.sim-actions button { min-height: 44px; padding: 10px 16px; border: 1px solid #777780; border-radius: 8px; background: #232326; color: #ede9e0; font: inherit; cursor: pointer; }
.sim-actions button:focus-visible, .sim-control input:focus-visible { outline: 3px solid #5b8def; outline-offset: 4px; }
.sim-status { min-height: 3.2em; margin: 16px 0 0; color: #bdbbb5; }
@media (max-width: 400px) { .spring-simulator { padding: 16px; } .sim-control { grid-template-columns: 68px minmax(0, 1fr) 32px; gap: 8px; } }`;
export const simulatorJS = `const setup = ${initSpringSimulator.toString()};\nconst cleanup = setup(document.querySelector('[data-spring-simulator]'));\n// Call cleanup() before removing the simulator.`;
