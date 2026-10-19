# Kinetics

A gallery of 162 interface animations, each with a dedicated page and live preview. The library mixes spring-like easing, keyframes, and JavaScript interactions. Every effect page preserves its original gallery demo and available snippets, with links to the shared preview styles and script.

## Develop and check

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # static build, metadata, sitemap, source examples, and internal links
npm run preview
```

## Pages and content

- `src/pages/index.astro` renders the full gallery from `src/content/body.html`.
- `src/lib/library.mjs` adds headings, unique card anchors, snippet-availability labels, and links at build time. The parser does not ship to the browser.
- `src/data/catalog.mjs` derives all 162 effect routes from the gallery cards at build time. New cards automatically get a page, gallery link, and sitemap entry. Duplicate names receive unique slugs.
- `src/data/effects.mjs` keeps existing effect URLs stable. All pages use `src/components/GalleryEffect.astro` with the original preview markup, styles, interactions, and available snippets.
- `src/content/body.html`, `public/css/effects-*.css`, and `public/js/main.js` supply the original effects. The build adds links and snippet labels without replacing demos or code panels.
- `src/lib/effect-assets.mjs` selects each detail page's original CSS rules, keyframes, and interaction initializer at build time. Shared helper constants stay with the relevant initializer. Detail pages do not load the full effect stylesheets or demo runtime.
- `src/data/effect-guides.mjs` adds explanations, setup, tuning, troubleshooting, and runnable HTML documents for five priority effects. The standalone documents preserve the original demo and include their own styles and script.
- `src/lib/effect-discovery.mjs` selects descriptive titles and related effects by purpose and the existing keyword index. The five guides have curated related links.
- `src/pages/guides/css-spring-animation.astro` explains CSS easing and live spring simulation. Its simulator has shared source in `src/lib/spring-simulator.js`.
- `src/pages/tools/spring-animation-generator.astro` exports sampled spring curves as CSS and React. `src/lib/spring-curve.js` supplies the shared math and code. URL parameters store settings, while the canonical URL stays clean.
- `src/data/site.mjs` lists the canonical pages and substantive update dates used by the generated sitemap. Effect routes come from the catalog. Add a registry entry for other new pages. Update a date only when its content changes meaningfully.
- `src/components/SiteHead.astro` generates page titles, descriptions, clean canonicals, social metadata, and structured data.

Gallery snippet counts come from the actual code blocks. `{{effectCount}}`, `{{reactCount}}`, and `{{promptCount}}` in the body are replaced during the build. A snippet label describes availability, not a guarantee that an entire effect needs only CSS.

Gallery snippets illustrate the original effects. They are not all complete standalone implementations. Check keyboard behavior, focus states, and reduced-motion support when adapting them to an application. The guide's simulator retains position and velocity when its target changes.

The homepage pauses decorative CSS animations outside the viewport and while the document is hidden. The cursor trail runs only during pointer interaction, and the header waveform stops when it is not visible. These controls preserve the original visible motion.

## Pro waitlist

Each effect page ends its code section with a “Get the production version” waitlist. The homepage shows a short banner above the library, and the gallery’s code modal clones a compact form from a `<template>` for the open effect. The `placement` property tells them apart: `effect-page`, `home-banner`, or `code-modal`. Every form posts directly to Buttondown with the `kinetics-pro` tag and the effect slug in `metadata__effect`, so no server is needed. Set `buttondownUsername` in `src/data/site.mjs` to show it. The waitlist stays hidden while the username is empty. Buttondown opens in a new tab to confirm the subscription.

## Hosting and canonical URLs

The production origin is `https://kinetics.colorion.co`. Deploy the `dist` directory after `npm run check`.

Sevalla reads `_redirects` from the repository root. The forced `301!` rules redirect explicit `index.html` URLs to their clean paths, including `/index.html` to `/`. The build also copies the rules to `dist` for hosts that read their published artifact. Local development applies the same explicit rules through Vite middleware. Astro 4’s static preview serves the output files but does not apply host redirect rules. Do not add a catch-all homepage rewrite, which would turn missing pages into false successes.

The homepage library is the main effect directory. `/effects`, `/effects/`, and `/effects/index.html` redirect permanently to `/#library`. Individual effect pages keep their URLs and sitemap entries.

The redirect rules take effect on the live site after deployment. Check the production status and Location headers then. See [Sevalla's redirect documentation](https://docs.sevalla.com/static-sites/redirects).

Public CSS and script URLs include content versions, so changed files get new URLs after a build. Astro fingerprints its bundled content-page styles and example script. The hero search geometry loads with critical CSS to avoid a layout shift.

Archivo, Inter, and JetBrains Mono load from Google Fonts.

## Conversion measurement

The existing Plausible tracker receives `Copy Code` (effect, language, source), `Guide Example Click` (effect), and `Share Spring` (source). Copy events fire only after a successful clipboard action. Pro waitlist forms send `Waitlist Signup` (effect, placement, source) when a visitor submits a valid email. Create matching custom event goals in the Plausible site settings to display conversions. No code, clipboard contents, or email addresses are sent to Plausible.

Compare Google Search Console clicks and impressions over equal 28-day periods after launch. Review non-brand queries, the guide, the generator, and each effect page separately. Indexing and ranking changes can take longer than a reporting period.

Only explicit `index.html` paths use forced redirects. Sevalla normalizes trailing slashes when matching redirect rules, so a forced slashless-to-slash rule would loop. Clean slash and slashless paths share the same canonical URL.
