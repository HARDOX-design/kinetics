import { parseFragment, serialize } from 'parse5';
import { effectSlugs } from '../data/effects.mjs';

const hasClass = (node, name) => node.attrs?.some((a) => a.name === 'class' && a.value.split(/\s+/).includes(name));
const find = (node, predicate) => {
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const result = find(child, predicate);
    if (result) return result;
  }
};
const text = (node) => !node ? '' : node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
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
  const catalog = [];
  const usedIDs = new Map();
  for (const card of cards) {
    const nameNode = find(card, (n) => hasClass(n, 'name'));
    const name = text(nameNode).trim();
    const baseID = effectSlugs[name] || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const occurrence = (usedIDs.get(baseID) || 0) + 1;
    usedIDs.set(baseID, occurrence);
    setAttribute(card, 'id', occurrence === 1 ? baseID : `${baseID}-${occurrence}`);
    nameNode.tagName = nameNode.nodeName = 'h3';
    setHTML(nameNode, `<a href="/effects/${attribute(card, 'id')}/">${escapeHTML(name)}</a>`);
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
    let section = card.parentNode;
    while (section && !hasClass(section, 'section')) section = section.parentNode;
    const snippets = [];
    const readSnippets = (node) => {
      if (node.tagName === 'pre') snippets.push({ language: attribute(node, 'data-lang'), code: text(node) });
      for (const child of node.childNodes || []) readSnippets(child);
    };
    readSnippets(card);
    catalog.push({
      slug: attribute(card, 'id'), name,
      summary: text(find(card, (node) => hasClass(node, 'desc'))).trim().replace(/\s+/g, ' '),
      category: text(find(section, (node) => node.tagName === 'h2')).trim(),
      method: text(find(card, (node) => hasClass(node, 'card-param'))).trim(),
      stage: serialize(find(card, (node) => hasClass(node, 'card-stage'))),
      snippets,
    });
  }
  return { html: serialize(document), total: cards.length, counts, catalog };
}
