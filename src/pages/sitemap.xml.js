import { site, pages } from '../data/site.mjs';
export function GET() {
  const urls = pages.map((page) => `  <url><loc>${new URL(page.path, site).href}</loc><lastmod>${page.updated}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
