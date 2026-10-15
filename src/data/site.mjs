import { effects } from './effects.mjs';
export const site = 'https://kinetics.colorion.co';
// Update these dates only when the corresponding content changes substantially.
export const updated = '2026-10-15';
export const updatedLabel = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${updated}T12:00:00Z`));
export const pages = [
  { path: '/', updated },
  { path: '/effects/', updated },
  { path: '/tools/spring-animation-generator/', updated },
  { path: '/guides/css-spring-animation/', updated },
  ...effects.map((effect) => ({ path: `/effects/${effect.slug}/`, updated })),
];
