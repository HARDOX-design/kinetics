import { presets, normalizeSpring, springCurve, springCode } from '../lib/spring-curve.js';
import { track } from '../lib/analytics.js';
const root = document.querySelector('[data-spring-generator]');
if (root) {
  const inputs = [...root.querySelectorAll('[data-param]')];
  const status = root.querySelector('[data-generator-status]');
  const ball = root.querySelector('[data-ball]');
  const stage = root.querySelector('[data-track]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation, curve;
  function preview() {
    animation?.cancel();
    const distance = Math.max(0, (stage.clientWidth - 130) * 0.65);
    ball.style.transform = `translateX(${distance}px)`;
    if (reduced.matches) return;
    animation = ball.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${distance}px)` }], {
      duration: curve.duration, easing: CSS.supports('transition-timing-function', curve.easing) ? curve.easing : 'ease-out', fill: 'forwards',
    });
  }
  function update(params, writeURL = true) {
    curve = springCurve(params);
    for (const input of inputs) {
      input.value = curve.params[input.dataset.param];
      root.querySelector(`[data-output="${input.dataset.param}"]`).value = input.value;
    }
    for (const button of root.querySelectorAll('[data-preset]')) button.setAttribute('aria-pressed', String(Object.entries(presets[button.dataset.preset]).every(([key,value]) => curve.params[key] === value)));
    for (const [language, code] of Object.entries(springCode(curve))) root.querySelector(`[data-generated="${language}"] code`).textContent = code;
    status.textContent = `Duration: ${curve.duration} ms`;
    if (writeURL) {
      const url = new URL(location.href);
      url.search = new URLSearchParams(curve.params).toString();
      history.replaceState(null, '', url);
    }
    preview();
  }
  update(normalizeSpring(Object.fromEntries(new URLSearchParams(location.search))), false);
  inputs.forEach(input => input.addEventListener('input', () => update(Object.fromEntries(inputs.map(el => [el.dataset.param, el.value])))));
  root.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => update(presets[button.dataset.preset])));
  root.querySelector('[data-preview]').addEventListener('click', preview);
  reduced.addEventListener('change', preview);
  let lastWidth = stage.clientWidth;
  new ResizeObserver(() => {
    if (stage.clientWidth === lastWidth) return;
    lastWidth = stage.clientWidth;
    animation?.cancel(); ball.style.transform = `translateX(${Math.max(0, (stage.clientWidth - 130) * 0.65)}px)`; }).observe(stage);
  root.querySelector('[data-share]').addEventListener('click', async () => {
    const url = new URL(location.pathname, location.origin);
    url.search = new URLSearchParams(curve.params).toString();
    try { await navigator.clipboard.writeText(url.href); status.textContent = 'Settings link copied.'; track('Share Spring', { source: 'spring-generator' }); }
    catch { status.textContent = `Copy this link: ${url.href}`; }
  });
}
