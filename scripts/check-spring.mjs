import assert from 'node:assert/strict';
import { springCurve, normalizeSpring, presets, springCode } from '../src/lib/spring-curve.js';
assert.deepEqual(normalizeSpring({ stiffness: 'no', mass: Infinity, damping: '' }), presets.snappy);
assert.deepEqual(normalizeSpring({stiffness: -2, damping: 100, mass: 20}), {stiffness:80,damping:50,mass:2});
assert.equal(normalizeSpring({mass:1.03}).mass,1.05);
for (const stiffness of [80, 320, 500]) for (const damping of [8, 2*Math.sqrt(stiffness), 50]) for (const mass of [.5,1,2]) {
  const curve = springCurve({stiffness,damping,mass});
  assert.equal(curve.values[0],0);
  assert.equal(curve.values.at(-1),1);
  assert.ok(curve.values.every(Number.isFinite));
  assert.ok(Math.abs(curve.values.at(-2)-1) < .002);
  assert.ok(curve.duration > 0 && curve.duration <= 10000);
}
assert.ok(Math.max(...springCurve(presets.bouncy).values) > 1.1);
assert.ok(Math.max(...springCurve(presets.soft).values) <= 1.001);
assert.match(springCode(springCurve()).css,/prefers-reduced-motion/);
console.log('Spring checks passed: invalid settings, parameter extremes, damping regimes, overshoot, and settled endpoints.');
