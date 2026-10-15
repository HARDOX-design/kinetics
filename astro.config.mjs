import { defineConfig } from 'astro/config';
import { readFileSync, copyFileSync } from 'node:fs';

// Apply the static host’s explicit redirects in local development as well.
const redirectRules = readFileSync(new URL('./_redirects', import.meta.url), 'utf8')
  .split('\n').filter((line) => line.trim() && !line.startsWith('#'))
  .map((line) => line.trim().split(/\s+/));
const redirects = (request, response, next) => {
  const url = new URL(request.url, 'http://localhost');
  const rule = redirectRules.find(([from]) => from === url.pathname);
  if (!rule) return next();
  response.writeHead(parseInt(rule[2], 10), { Location: rule[1] + url.search });
  response.end();
};
export default defineConfig({
  site: 'https://kinetics.colorion.co',
  trailingSlash: 'always',
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321 },
  vite: {
    plugins: [{
      name: 'kinetics-canonical-redirects',
      configureServer(server) { server.middlewares.use(redirects); },
    }],
  },
  integrations: [{
    name: 'kinetics-static-redirects',
    hooks: {
      'astro:build:done': ({ dir }) => {
        // Include the rules in the artifact for hosts that read the output directory.
        copyFileSync(new URL('./_redirects', import.meta.url), new URL('_redirects', dir));
      },
    },
  }],
});
