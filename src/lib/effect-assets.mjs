import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'acorn';
import postcss from 'postcss';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');
const script = read('public/js/main.js');
const statements = parse(script, { ecmaVersion: 'latest' }).body[0].expression.callee.body.body;
const rules = ['a', 'b', 'c'].map((part) => postcss.parse(read(`public/css/effects-${part}.css`)));
const base = read('public/css/base.css');
const gallery = read('public/css/gallery.css');
const classesIn = (text) => new Set([...text.matchAll(/\bclass=["']([^"']+)["']/g)].flatMap((match) => match[1].split(/\s+/)));
const cache = new Map();

function selectCSS(classes) {
  const select = (node) => {
    if (node.type === 'atrule' && node.name === 'property') return node.clone();
    if (node.type === 'rule') {
      const selectors = node.selector.split(',').filter((selector) => [...selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].some((match) => classes.has(match[1])));
      return selectors.length ? node.clone({ selector: selectors.join(',') }) : null;
    }
    if (node.type === 'atrule' && !/keyframes$/.test(node.name) && node.nodes) {
      const children = node.nodes.map(select).filter(Boolean);
      return children.length ? node.clone({ nodes: children }) : null;
    }
    return null;
  };
  const selected = postcss.root({ nodes: rules.flatMap((root) => root.nodes.map(select).filter(Boolean)) });
  const declarations = selected.toString();
  for (const root of rules) root.walkAtRules(/keyframes$/, (node) => {
    if (declarations.includes(node.params)) selected.append(node.clone());
  });
  return selected.toString();
}

export function effectAssets(effect) {
  if (cache.has(effect.slug)) return cache.get(effect.slug);
  const classes = classesIn(effect.stage);
  const selected = statements.filter((node) => {
    const expression = node.expression;
    const query = expression?.callee?.object;
    if (expression?.callee?.property?.name !== 'forEach' || query?.callee?.name !== '$$') return false;
    const selector = query.arguments[0]?.value;
    return typeof selector === 'string' && [...selector.matchAll(/\.([\w-]+)/g)].some((match) => classes.has(match[1]));
  }).map((node) => script.slice(node.start, node.end));
  const body = selected.join('\n');
  // These are the only shared constants referenced by the original demo initializers.
  const helpers = statements.filter((node) => node.type === 'VariableDeclaration' && node.declarations.some((declaration) =>
    ['$', '$$'].includes(declaration.id.name) || ['SCRAMBLE_CHARS', 'CONFETTI_COLORS', 'CHECK_SVG'].includes(declaration.id.name) && body.includes(declaration.id.name)
  )).map((node) => script.slice(node.start, node.end));
  for (const match of body.matchAll(/\.([a-zA-Z_][\w-]*)/g)) classes.add(match[1]);
  for (const match of body.matchAll(/className\s*=\s*['"]([^'"]+)['"]/g)) match[1].split(/\s+/).forEach((name) => classes.add(name));
  for (const name of classesIn(body)) classes.add(name);
  const result = { css: selectCSS(classes), js: body ? `(function () { 'use strict';\n${helpers.join('\n')}\n${body}\n})();` : '' };
  cache.set(effect.slug, result);
  return result;
}

export function runnableExample(effect) {
  const assets = effectAssets(effect);
  const safeStyle = (base + '\n' + gallery + '\n' + assets.css).replace(/<\/style/gi, '<\\/style');
  const safeScript = assets.js.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${effect.name} — Kinetics example</title>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">\n<style>\n${safeStyle}\nbody { display: grid; place-items: center; min-height: 100vh; padding: 24px; }\n.example { width: min(100%, 420px); }\n</style>\n</head>\n<body>\n<div class="example"><div class="card-stage">${effect.stage}</div></div>\n${safeScript ? `<script>\n${safeScript}\n</script>` : ''}\n</body>\n</html>`;
}
