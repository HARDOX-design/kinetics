export function track(name, props) {
  // Analytics must never interrupt a successful user action.
  try { window.plausible?.(name, { props }); } catch { /* Tracking can be blocked. */ }
}
