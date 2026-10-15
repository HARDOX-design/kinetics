import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const versions = new Map();
// Public files keep their names; the content version prevents stale CSS/JS after a deploy.
export function asset(path) {
  if (!versions.has(path)) {
    const content = readFileSync(new URL(`../../public${path}`, import.meta.url));
    versions.set(path, createHash('sha256').update(content).digest('hex').slice(0, 12));
  }
  return `${path}?v=${versions.get(path)}`;
}
