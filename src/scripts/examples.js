import { track } from '../lib/analytics.js';
import { initSpringSimulator } from '../lib/spring-simulator.js';
import { initMagneticButton, initDisclosure, initRippleButton } from '../lib/interactions.js';
const initializers = {
  'magnetic-button': initMagneticButton,
  'accordion-spring': initDisclosure,
  'card-resize': initDisclosure,
  'ripple-button': initRippleButton,
};
document.querySelectorAll('[data-effect]').forEach((root) => initializers[root.dataset.effect]?.(root));

document.querySelectorAll('[data-spring-simulator]').forEach(initSpringSimulator);

document.querySelectorAll('[data-copy-code]').forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const code = button.closest('.source-block').querySelector('code').textContent;
    const status = button.closest('.source-block').querySelector('[role="status"]');
    try {
      await navigator.clipboard.writeText(code);
      status.textContent = 'Copied to clipboard.';
      const source = button.closest('.source-block');
      track('Copy Code', { effect: source.dataset.sourceEffect, language: source.dataset.sourceLanguage, source: location.pathname });
    } catch {
      const range = document.createRange();
      range.selectNodeContents(button.closest('.source-block').querySelector('code'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      status.textContent = 'Code selected. Use your browser’s copy command.';
    }
    window.setTimeout(() => { status.textContent = ''; }, 2500);
  });
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || location.pathname !== '/guides/css-spring-animation/') return;
  const url = new URL(link.href);
  if (url.origin === location.origin && /^\/effects\/[^/]+\/$/.test(url.pathname)) track('Guide Example Click', { effect: url.pathname.split('/')[2] });
});
