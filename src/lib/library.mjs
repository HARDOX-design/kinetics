import { parseFragment, serialize } from 'parse5';
import { effects, codeExamples } from '../data/effects.mjs';

const hasClass = (node, name) => node.attrs?.some((a) => a.name === 'class' && a.value.split(/\s+/).includes(name));
const find = (node, predicate) => {
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const result = find(child, predicate);
    if (result) return result;
  }
};
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
const attribute = (node, key) => node.attrs?.find((a) => a.name === key)?.value;
function setAttribute(node, key, value) {
  const existing = node.attrs.find((a) => a.name === key);
  if (existing) existing.value = value;
  else node.attrs.push({ name: key, value });
}
function setHTML(node, html) {
  node.childNodes = parseFragment(html).childNodes;
  for (const child of node.childNodes) child.parentNode = node;
}
export const escapeHTML = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Transform the existing HTML at build time. No parser or metadata ships to the browser.
export function prepareLibrary(source) {
  const document = parseFragment(source);
  const cards = [];
  const visit = (node) => {
    if (hasClass(node, 'card')) cards.push(node);
    for (const child of node.childNodes || []) visit(child);
  };
  visit(document);
  const counts = { css: 0, react: 0, prompt: 0 };
  const usedIDs = new Map();
  for (const card of cards) {
    const nameNode = find(card, (n) => hasClass(n, 'name'));
    const name = text(nameNode).trim();
    const featured = effects.find((effect) => effect.name === name);
    const baseID = featured?.slug || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const occurrence = (usedIDs.get(baseID) || 0) + 1;
    usedIDs.set(baseID, occurrence);
    setAttribute(card, 'id', occurrence === 1 ? baseID : `${baseID}-${occurrence}`);
    nameNode.tagName = nameNode.nodeName = 'h3';
    if (featured) {
      setHTML(nameNode, `<a href="/effects/${featured.slug}/">${escapeHTML(name)}</a>`);
      const stage = find(card, (n) => hasClass(n, 'card-stage'));
      setHTML(stage, `<div class="card-param mono">${escapeHTML(featured.method)}</div><div class="standalone-demo" data-effect="${featured.slug}">${featured.html}</div>`);
      const panel = find(card, (n) => hasClass(n, 'code-panel'));
      const examples = codeExamples(featured);
      // Keep CSS first in the gallery's existing modal.
      examples.sort((a, b) => (a.language === 'css' ? -1 : b.language === 'css' ? 1 : 0));
      setHTML(panel, `<div class="code-tabs">${examples.map((example, i) => `<button class="code-tab${i === 0 ? ' active' : ''}" data-lang="${example.language}">${example.label}</button>`).join('')}</div><div class="code-body"><button class="copy-btn">Copy</button>${examples.map((example, i) => `<pre data-lang="${example.language}"${i ? ' class="hidden"' : ''}><code>${escapeHTML(example.code)}</code></pre>`).join('')}</div>`);
    }
    const languages = new Set();
    const collect = (node) => {
      if (node.tagName === 'pre') languages.add(attribute(node, 'data-lang'));
      for (const child of node.childNodes || []) collect(child);
    };
    collect(card);
    for (const language of Object.keys(counts)) if (languages.has(language)) counts[language]++;
    const badges = parseFragment(`<div class="implementation-badges" aria-label="Available snippets">${['html', 'css', 'js', 'react', 'prompt'].filter((language) => languages.has(language)).map((language) => `<span>${({ html: 'HTML', css: 'CSS', js: 'JS', react: 'React', prompt: 'Prompt' })[language]}</span>`).join('')}</div>`).childNodes[0];
    const holder = nameNode.parentNode;
    badges.parentNode = holder;
    holder.childNodes.splice(holder.childNodes.indexOf(nameNode) + 1, 0, badges);
  }
  return { html: serialize(document), total: cards.length, counts };
}
