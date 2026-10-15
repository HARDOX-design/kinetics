/* Pause decorative CSS animations outside the viewport without changing the demos. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const stages = Array.from(document.querySelectorAll('.card-stage'));
  const visible = new Set();
  const update = (stage) => {
    stage.toggleAttribute('data-motion-paused', document.hidden || !visible.has(stage));
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
      update(entry.target);
    });
  }, { rootMargin: '100px' });
  stages.forEach((stage) => {
    stage.setAttribute('data-motion-paused', '');
    observer.observe(stage);
  });
  document.addEventListener('visibilitychange', () => stages.forEach(update));
})();
