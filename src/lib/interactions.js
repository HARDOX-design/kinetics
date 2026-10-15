// These functions also supply the standalone examples on each effect page.
export function initMagneticButton(root) {
  const zone = root.querySelector('.magnetic-zone');
  const button = root.querySelector('.magnetic-button');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reset = () => { button.style.transform = ''; };
  const move = (event) => {
    if (reduced.matches || event.pointerType === 'touch') return;
    const bounds = zone.getBoundingClientRect();
    const x = Math.max(-20, Math.min(20, (event.clientX - bounds.left - bounds.width / 2) * 0.2));
    const y = Math.max(-14, Math.min(14, (event.clientY - bounds.top - bounds.height / 2) * 0.2));
    button.style.transform = `translate(${x}px, ${y}px)`;
  };
  zone.addEventListener('pointermove', move);
  zone.addEventListener('pointerleave', reset);
  button.addEventListener('blur', reset);
  reduced.addEventListener('change', reset);
  return () => {
    zone.removeEventListener('pointermove', move);
    zone.removeEventListener('pointerleave', reset);
    button.removeEventListener('blur', reset);
    reduced.removeEventListener('change', reset);
    reset();
  };
}

export function initDisclosure(root) {
  const button = root.querySelector('[data-disclosure]');
  const panel = root.querySelector('[data-panel]');
  const toggle = () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
  };
  panel.inert = button.getAttribute('aria-expanded') !== 'true';
  button.addEventListener('click', toggle);
  return () => button.removeEventListener('click', toggle);
}

export function initRippleButton(root) {
  const button = root.querySelector('.ripple-button');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clear = () => button.querySelectorAll('.ripple-wave').forEach((wave) => wave.remove());
  const ripple = (event) => {
    clear();
    if (reduced.matches) return;
    const bounds = button.getBoundingClientRect();
    const size = Math.hypot(bounds.width, bounds.height) * 2;
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.setAttribute('aria-hidden', 'true');
    wave.style.width = wave.style.height = `${size}px`;
    const keyboard = event.detail === 0;
    wave.style.left = `${(keyboard ? bounds.width / 2 : event.clientX - bounds.left) - size / 2}px`;
    wave.style.top = `${(keyboard ? bounds.height / 2 : event.clientY - bounds.top) - size / 2}px`;
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
    button.appendChild(wave);
  };
  button.addEventListener('click', ripple);
  reduced.addEventListener('change', clear);
  return () => {
    button.removeEventListener('click', ripple);
    reduced.removeEventListener('change', clear);
    clear();
  };
}
