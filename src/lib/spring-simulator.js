export function initSpringSimulator(root) {
  const stage = root.querySelector('[data-spring-stage]');
  const ball = root.querySelector('[data-spring-ball]');
  const stiffness = root.querySelector('[data-stiffness]');
  const damping = root.querySelector('[data-damping]');
  const stiffnessValue = root.querySelector('[data-stiffness-value]');
  const dampingValue = root.querySelector('[data-damping-value]');
  const buttons = [...root.querySelectorAll('[data-target]')];
  const status = root.querySelector('[data-spring-status]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let position = 0.25;
  let velocity = 0;
  let target = position;
  let frame = null;
  let previousTime = null;
  let travel = 0;

  const render = () => { ball.style.transform = `translateX(${position * travel}px)`; };
  const measure = () => {
    travel = Math.max(0, stage.clientWidth - ball.offsetWidth - 32);
    render();
  };
  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
  };
  const settle = () => {
    stop();
    position = target;
    velocity = 0;
    render();
    status.textContent = reduced.matches ? 'Reduced motion: moved directly to the target.' : 'At rest. Choose either target to move again.';
  };
  const tick = (time) => {
    // Bound catch-up after a background tab, then use small integration steps.
    const elapsed = Math.min((time - (previousTime ?? time)) / 1000, 1 / 30);
    previousTime = time;
    const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
    const dt = elapsed / steps;
    const k = Number(stiffness.value);
    const c = Number(damping.value);
    for (let i = 0; i < steps; i++) {
      // Mass is fixed at 1. Position and velocity survive a target change.
      const acceleration = k * (target - position) - c * velocity;
      velocity += acceleration * dt;
      position += velocity * dt;
    }
    render();
    if (Math.abs(target - position) < 0.001 && Math.abs(velocity) < 0.001) settle();
    else frame = requestAnimationFrame(tick);
  };
  const move = (event) => {
    target = Number(event.currentTarget.dataset.target);
    if (reduced.matches) { settle(); return; }
    status.textContent = 'Moving. Change the target to interrupt without resetting velocity.';
    if (frame === null) frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    stiffnessValue.textContent = stiffness.value;
    dampingValue.textContent = damping.value;
  };
  const onPreferenceChange = () => { if (reduced.matches) settle(); };
  buttons.forEach((button) => button.addEventListener('click', move));
  stiffness.addEventListener('input', sync);
  damping.addEventListener('input', sync);
  reduced.addEventListener('change', onPreferenceChange);
  const observer = new ResizeObserver(measure);
  observer.observe(stage);
  sync();
  measure();
  return () => {
    stop();
    observer.disconnect();
    buttons.forEach((button) => button.removeEventListener('click', move));
    stiffness.removeEventListener('input', sync);
    damping.removeEventListener('input', sync);
    reduced.removeEventListener('change', onPreferenceChange);
  };
}
