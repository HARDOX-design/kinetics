import { track } from '../lib/analytics.js';
import { initSpringSimulator } from '../lib/spring-simulator.js';
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

document.querySelectorAll('[data-snippet-tabs]').forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      select(target);
      target.focus();
    });
  });
});

// Delegated so forms added later, such as the one in the homepage code modal, are tracked too.
// The browser validates the email before submit fires, so this counts real sign-up attempts.
document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-waitlist]');
  if (!form) return;
  track('Waitlist Signup', { effect: form.dataset.waitlistEffect || 'none', placement: form.dataset.waitlistPlacement, source: location.pathname });
  form.querySelector('[role="status"]').textContent = 'Finish in the Buttondown tab, then confirm from your inbox.';
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || location.pathname !== '/guides/css-spring-animation/') return;
  const url = new URL(link.href);
  if (url.origin === location.origin && /^\/effects\/[^/]+\/$/.test(url.pathname)) track('Guide Example Click', { effect: url.pathname.split('/')[2] });
});
