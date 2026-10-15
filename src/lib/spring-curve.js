export const presets = {
  snappy: { stiffness: 400, damping: 32, mass: 1 },
  soft: { stiffness: 170, damping: 26, mass: 1 },
  bouncy: { stiffness: 220, damping: 14, mass: 1 },
};
export const limits = { stiffness: [80, 500], damping: [8, 50], mass: [0.5, 2] };
export function normalizeSpring(input = {}) {
  return Object.fromEntries(Object.entries(limits).map(([key, [min, max]]) => {
    const value = Number(input[key]);
    return [key, Number.isFinite(value) && input[key] !== null && input[key] !== '' ? Math.round(Math.max(min, Math.min(max, value)) * 100) / 100 : presets.snappy[key]];
  }));
}
export function springCurve(input) {
  const params = normalizeSpring(input);
  const { stiffness: k, damping: c, mass: m } = params;
  // Evaluate the damped oscillator analytically, starting at rest at position 0.
  const omega = Math.sqrt(k / m), alpha = c / (2 * m);
  function sample(t) {
    if (Math.abs(alpha - omega) < 1e-7) return 1 - (1 + omega * t) * Math.exp(-omega * t);
    if (alpha < omega) {
      const w = Math.sqrt(omega * omega - alpha * alpha);
      return 1 - Math.exp(-alpha * t) * (Math.cos(w * t) + alpha / w * Math.sin(w * t));
    }
    const r1 = -alpha + Math.sqrt(alpha * alpha - omega * omega);
    const r2 = -alpha - Math.sqrt(alpha * alpha - omega * omega);
    return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
  }
  // Require a quiet half second so an early crossing cannot count as settled.
  let quiet = 0, duration = 10;
  for (let i = 1; i <= 2400; i++) {
    const t = i / 240;
    const velocity = (sample(t) - sample(t - 1 / 240)) * 240;
    quiet = Math.abs(1 - sample(t)) < 0.001 && Math.abs(velocity) < 0.001 ? quiet + 1 : 0;
    if (quiet >= 120) { duration = t; break; }
  }
  const count = Math.ceil(duration * 120);
  const values = Array.from({ length: count + 1 }, (_, i) => i === count ? 1 : Number(sample(i / count * duration).toFixed(5)));
  return { params, duration: Math.round(duration * 1000), easing: `linear(${values.join(', ')})`, values };
}
export function springCode(curve) {
  const css = `.spring-button {\n  transform: scale(1);\n  transition: transform ${curve.duration}ms ease-out;\n  transition-timing-function: ${curve.easing};\n}\n.spring-button:hover, .spring-button:focus-visible { transform: scale(1.12); }\n@media (prefers-reduced-motion: reduce) {\n  .spring-button { transition: none; }\n}`;
  return { html: '<button class="spring-button" type="button">Try this spring</button>', css,
    react: `export default function SpringButton() {\n  return (<>\n    <style>{${JSON.stringify(css)}}</style>\n    <button className="spring-button" type="button">Try this spring</button>\n  </>);\n}` };
}
