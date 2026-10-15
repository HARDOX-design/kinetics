import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'acorn';
import { effectGuides } from '../data/effect-guides.mjs';

const index = parse(readFileSync(resolve(process.cwd(), 'public/js/search-index.js'), 'utf8'), { ecmaVersion: 'latest' }).body
  .find((node) => node.expression?.left?.property?.name === 'KINETICS_KEYWORDS').expression.right;
const keywords = new Map(index.properties.map((property) => [property.key.value, property.value.elements.map((element) => element.value)]));
const topics = [
  ['buttons', 'Button effects', 'Button Interaction', /button|keycap|liquid glass press|hover intent|directional hover/i],
  ['navigation', 'Navigation effects', 'Navigation Animation', /tab pill|snap rail|menu|dock|palette|underline/i],
  ['loading', 'Loading effects', 'Loading Animation', /loader|spinner|skeleton|indeterminate|typing indicator|submit states|rate limit|retry orbit/i],
  ['text', 'Text effects', 'Text Animation', /text|typewriter|scramble|marquee|token stream|variable weight|letterpress|lenticular|checksum/i],
  ['forms', 'Form controls', 'Form Interaction', /label|input|switch|checkbox|stepper|knob|dial|swatch|slider|value scrubber|picker|chips|pills|password|focus relay|prompt composer/i],
  ['gestures', 'Drag and gesture effects', 'Gesture Interaction', /drag|swipe|lasso|gesture|unlock|filmstrip|xy pad|lattice/i],
  ['notifications', 'Notification effects', 'Notification Animation', /toast|notification|snackbar|badge|presence|receipt/i],
  ['cards', 'Card and reveal effects', 'Card Animation', /card|bento|depth stack|page peel|folding doors|clip wipe|before.after/i],
  ['feedback', 'State and feedback effects', 'State Animation', /count|progress|success|error|confetti|heartbeat|signal|status|battery|confidence|rollback|reconcil|activity|handoff|circuit|trace|race|matrix|state diff/i],
  ['surfaces', 'Visual surface effects', 'Visual Effect', /./],
];

export function effectTopic(effect) {
  const [id, label, searchLabel] = topics.find((topic) => topic[3].test(effect.name));
  return { id, label, searchLabel };
}

export function effectTitle(effect, hasScript, duplicate = false) {
  return effectGuides[effect.slug]?.title || `${effect.name}: ${effectTopic(effect).searchLabel} with ${hasScript ? 'JavaScript' : 'CSS'}${duplicate ? ` (${effect.method})` : ''}`;
}

export function relatedEffects(effect, catalog) {
  const preferred = effectGuides[effect.slug]?.related || [];
  const terms = new Set(keywords.get(effect.name) || []);
  const topic = effectTopic(effect).id;
  const score = (item) => {
    const shared = (keywords.get(item.name) || []).filter((keyword) => terms.has(keyword) && !['spring', 'animation', 'motion', 'css'].includes(keyword)).length;
    return (effectTopic(item).id === topic ? 10 : 0) + shared;
  };
  return catalog.filter((item) => item.slug !== effect.slug).sort((a, b) => {
    const ai = preferred.indexOf(a.slug);
    const bi = preferred.indexOf(b.slug);
    if (ai >= 0 || bi >= 0) return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi);
    return score(b) - score(a) || a.name.localeCompare(b.name);
  }).slice(0, 4);
}
