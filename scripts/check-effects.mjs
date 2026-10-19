import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import { parse, serialize } from 'parse5';
import { catalog } from '../src/data/catalog.mjs';
import { effectGuides } from '../src/data/effect-guides.mjs';
import { buttondownUsername } from '../src/data/site.mjs';
import { effectAssets, runnableExample } from '../src/lib/effect-assets.mjs';
import { relatedEffects, effectTopic } from '../src/lib/effect-discovery.mjs';

const nodes = (node) => [node, ...(node.childNodes || []).flatMap(nodes)];
const attr = (node, key) => node.attrs?.find((item) => item.name === key)?.value;
const cssFiles = ['a', 'b', 'c'].map((part) => readFileSync(new URL(`../public/css/effects-${part}.css`, import.meta.url), 'utf8'));
const originalBytes = cssFiles.join('').length + readFileSync(new URL('../public/js/main.js', import.meta.url), 'utf8').length;
let totalBytes = 0;
for (const effect of catalog) {
  const assets = effectAssets(effect);
  totalBytes += assets.css.length + assets.js.length;
  if (assets.js) new Script(assets.js);
  const html = readFileSync(new URL(`../dist/effects/${effect.slug}/index.html`, import.meta.url), 'utf8');
  const all = nodes(parse(html));
  assert.ok(!all.some((node) => node.tagName === 'script' && attr(node, 'src')?.includes('/js/main.js')), `${effect.slug}: no full demo runtime`);
  assert.ok(!all.some((node) => node.tagName === 'link' && /\/css\/effects-[abc]\.css/.test(attr(node, 'href') || '')), `${effect.slug}: no full effect stylesheets`);
  const waitlist = all.find((node) => node.tagName === 'form' && attr(node, 'data-waitlist') !== undefined);
  if (buttondownUsername) {
    assert.equal(attr(waitlist, 'action'), `https://buttondown.com/api/emails/embed-subscribe/${buttondownUsername}`, `${effect.slug}: waitlist posts to Buttondown`);
    const hidden = Object.fromEntries(nodes(waitlist).filter((node) => attr(node, 'type') === 'hidden').map((node) => [attr(node, 'name'), attr(node, 'value')]));
    assert.deepEqual(hidden, { tag: 'kinetics-pro', metadata__effect: effect.slug }, `${effect.slug}: waitlist tags the effect`);
  } else assert.equal(waitlist, undefined, `${effect.slug}: no waitlist without a Buttondown username`);
  const related = relatedEffects(effect, catalog);
  assert.equal(related.length, 4);
  assert.equal(new Set(related.map((item) => item.slug)).size, 4);
  assert.ok(!related.includes(effect));
  const expected = effectGuides[effect.slug]?.related.filter((slug) => catalog.some((item) => item.slug === slug));
  if (expected) assert.deepEqual(related.map((item) => item.slug), expected);
  else assert.ok(related.some((item) => effectTopic(item).id === effectTopic(effect).id), `${effect.slug}: relevant topic links`);
  if (!effectGuides[effect.slug]) continue;
  const example = nodes(parse(runnableExample(effect)));
  assert.equal(example.filter((node) => node.tagName === 'title').length, 1);
  const stage = example.find((node) => attr(node, 'class') === 'card-stage');
  assert.equal(serialize(stage), effect.stage, `${effect.slug}: standalone markup matches original`);
  for (const script of example.filter((node) => node.tagName === 'script')) new Script((script.childNodes || []).map((node) => node.value || '').join(''));
  for (const id of ['how-it-works', 'troubleshooting']) assert.ok(all.some((node) => attr(node, 'id') === id), `${effect.slug}: ${id} content`);
}
assert.ok(totalBytes / catalog.length < originalBytes / 5, 'Effect-specific assets substantially reduce the original payload');
console.log(`Effect checks passed: ${catalog.length} scoped runtimes and related-link sets, 5 standalone examples. Average CSS/JS: ${Math.round(totalBytes / catalog.length)} bytes versus ${originalBytes} bytes before (uncompressed, excludes shared layout).`);
