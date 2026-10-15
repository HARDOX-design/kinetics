import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { Script } from 'node:vm';
import { parse } from 'parse5';
import { effects, codeExamples } from '../src/data/effects.mjs';
import { pages, site } from '../src/data/site.mjs';

const root = new URL('../dist/', import.meta.url);
const nodes = (node) => [node, ...(node.childNodes || []).flatMap(nodes)];
const attr = (node, key) => node.attrs?.find((a) => a.name === key)?.value;
const text = (node) => node.value || (node.childNodes || []).map(text).join('');
const documents = new Map();
for (const page of pages) {
  const html = await readFile(new URL(`.${page.path}index.html`, root), 'utf8');
  const all = nodes(parse(html));
  const canonical = all.filter((n) => n.tagName === 'link' && attr(n, 'rel') === 'canonical');
  assert.equal(canonical.length, 1, `${page.path}: exactly one canonical`);
  assert.equal(attr(canonical[0], 'href'), new URL(page.path, site).href);
  assert.equal(all.filter((n) => n.tagName === 'h1').length, 1, `${page.path}: one H1`);
  assert.ok(text(all.find((n) => n.tagName === 'title')).trim());
  assert.ok(attr(all.find((n) => n.tagName === 'meta' && attr(n, 'name') === 'description'), 'content'));
  assert.equal(attr(all.find((n) => n.tagName === 'meta' && attr(n, 'property') === 'og:url'), 'content'), new URL(page.path, site).href);
  assert.ok(!html.includes('{{effectCount}}') && !html.includes('{{reactCount}}') && !html.includes('{{promptCount}}'));
  const ids = all.map((n) => attr(n, 'id')).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, `${page.path}: unique IDs`);
  for (const node of all.filter((n) => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json')) {
    const data = JSON.parse(text(node));
    assert.ok(data['@graph']?.length);
    assert.ok(!text(node).includes('SearchAction'));
  }
  documents.set(page.path, { all, ids, html });
}
const titles = [...documents.values()].map(({ all }) => text(all.find((n) => n.tagName === 'title')));
assert.equal(new Set(titles).size, titles.length, 'Every page has its own title');
for (const [path, { all }] of documents) {
  for (const a of all.filter((n) => n.tagName === 'a' && attr(n, 'href'))) {
    const url = new URL(attr(a, 'href'), new URL(path, site));
    if (url.origin !== site) continue;
    const target = documents.get(url.pathname);
    if (target) {
      if (url.hash) assert.ok(target.ids.includes(decodeURIComponent(url.hash.slice(1))), `${path}: missing anchor ${url.href}`);
    } else await access(new URL(`.${url.pathname}`, root));
  }
}
const home = documents.get('/');
const cardNames = home.all.filter((n) => n.tagName === 'h3' && attr(n, 'class') === 'name');
assert.equal(cardNames.length, 162, 'The full existing gallery is preserved');
for (const effect of effects) {
  assert.ok(home.all.some((n) => n.tagName === 'a' && attr(n, 'href') === `/effects/${effect.slug}/`));
  const detail = documents.get(`/effects/${effect.slug}/`);
  for (const example of codeExamples(effect)) {
    assert.ok(detail.all.some((n) => n.tagName === 'code' && text(n) === example.code), `${effect.slug}: ${example.label} must be readable in HTML`);
    if (example.language === 'js') new Script(example.code);
  }
}
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(locations.sort(), pages.map((page) => new URL(page.path, site).href).sort());
assert.ok(!sitemap.includes('2025-01-01'));
async function htmlFiles(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(async (entry) => entry.isDirectory() ? htmlFiles(new URL(`${entry.name}/`, dir)) : entry.name.endsWith('.html') ? [entry.name] : []))).flat();
}
assert.equal((await htmlFiles(root)).length, pages.length, 'Every built HTML page is in the sitemap');
const redirects = await readFile(new URL('_redirects', root), 'utf8');
assert.equal(redirects, await readFile(new URL('../_redirects', import.meta.url), 'utf8'));
assert.match(redirects, /^\/index\.html\s+\/\s+301!$/m);
console.log(`SEO checks passed: ${documents.size} pages, ${cardNames.length} gallery cards, ${effects.length} complete examples, all internal links and sitemap entries.`);
