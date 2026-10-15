# Kinetics

A gallery of 162 interface animations with CSS snippets, 99 React examples, and 153 AI prompts. The library mixes spring-like easing, keyframes, and JavaScript interactions. Five complete examples include runnable HTML, CSS, any required JavaScript, and self-contained React components.

## Develop and check

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # static build, metadata, sitemap, source examples, and internal links
npm run preview
```

## Pages and content

- `src/pages/index.astro` renders the full gallery from `src/content/body.html`.
- `src/lib/library.mjs` adds headings, unique card anchors, snippet-availability labels, complete featured demos, and links at build time. The parser does not ship to the browser.
- `src/data/effects.mjs` supplies the five complete effect pages, their copyable code, and related links.
- `src/lib/interactions.js` supplies both live demos and the standalone JavaScript/React examples. Edit these functions to keep the preview and copied code consistent.
- `src/pages/guides/css-spring-animation.astro` explains CSS easing and live spring simulation. Its simulator has shared source in `src/lib/spring-simulator.js`.
- `src/pages/tools/spring-animation-generator.astro` exports sampled spring curves as CSS and React. `src/lib/spring-curve.js` supplies the shared math and code. URL parameters store settings, while the canonical URL stays clean.
- `src/data/site.mjs` lists the canonical pages and substantive update dates used by the generated sitemap. Add a registry entry when publishing a page. Update a date only when its content changes meaningfully.
- `src/components/SiteHead.astro` generates page titles, descriptions, clean canonicals, social metadata, and structured data.

Gallery snippet counts come from the actual code blocks. `{{effectCount}}`, `{{reactCount}}`, and `{{promptCount}}` in the body are replaced during the build. A snippet label describes availability, not a guarantee that an entire effect needs only CSS.

For complete examples, native inputs and buttons keep their keyboard behavior. Disclosures update their expanded state, and motion respects reduced-motion preferences. The CSS spring-like effects are duration-based approximations. The guide's simulator retains position and velocity when its target changes.

## Hosting and canonical URLs

The production origin is `https://kinetics.colorion.co`. Deploy the `dist` directory after `npm run check`.

Sevalla reads `_redirects` from the repository root. The forced `301!` rules redirect explicit `index.html` URLs to their clean paths, including `/index.html` to `/`. The build also copies the rules to `dist` for hosts that read their published artifact. Local development applies the same explicit rules through Vite middleware. Astro 4’s static preview serves the output files but does not apply host redirect rules. Do not add a catch-all homepage rewrite, which would turn missing pages into false successes.

The redirect rules take effect on the live site after deployment. Check the production status and Location headers then. See [Sevalla's redirect documentation](https://docs.sevalla.com/static-sites/redirects).

Public CSS and script URLs include content versions, so changed files get new URLs after a build. Astro fingerprints its bundled content-page styles and example script. The hero search geometry loads with critical CSS to avoid a layout shift.

Archivo, Inter, and JetBrains Mono load from Google Fonts.

## Conversion measurement

The existing Plausible tracker receives `Copy Code` (effect, language, source), `Guide Example Click` (effect), and `Share Spring` (source). Copy events fire only after a successful clipboard action. Create matching custom event goals in the Plausible site settings to display conversions. No code contents or clipboard contents are sent.

Compare Google Search Console clicks and impressions over equal 28-day periods after launch. Review non-brand queries, the guide, the generator, and each effect page separately. Indexing and ranking changes can take longer than a reporting period.
