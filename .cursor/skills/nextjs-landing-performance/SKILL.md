---
name: nextjs-landing-performance
description: End-to-end Next.js landing-page performance playbook for PageSpeed and Lighthouse — LCP/FCP/TBT/CLS, render-blocking CSS, unused and legacy JavaScript, Tailwind v4, images, lazy videos, Clerk/auth deferral, fonts, forced reflow, and cache headers. Use when optimizing a homepage or marketing site, reading a PageSpeed report, fixing LCP element render delay, or applying this stack to another Next.js project.
---

# Next.js Landing Performance

Cross-project playbook. Preserve visuals, SEO, a11y, and auth. Move non-critical work off the first-paint path. Adapt paths and SDK names to each repo.

Recipes: [reference.md](reference.md)

## Discover first

Locate before editing:

- Root layout, global CSS, font setup
- Landing/Hero and measured LCP element
- Client providers and auth SDK usage
- Above-fold images/videos
- Tailwind/PostCSS and `next.config`
- Existing perf guards/scripts

Do not assume App Router, Tailwind v4, or Clerk until verified.

## Workflow

1. Measure **deployed mobile** PageSpeed/Lighthouse first.
2. Split LCP into TTFB → resource delay → load duration → **element render delay**.
3. Inventory: videos, CSS, unused/legacy JS, fonts, auth, forced reflow, cache TTL, **oversized images**.
4. Fix **one bottleneck category** at a time.
5. Run project tests, typecheck, lint, production build.
6. Deploy; remeasure the same way.
7. Report only deployed deltas.

## Priority order

1. Kill initial video / huge media payloads.
2. Fix LCP paint blockers (render delay, sync layout, heavy client shell).
3. Defer auth, editors, checkout, analytics JS.
4. Shrink CSS; remove render-blocking stylesheet waterfalls.
5. Correct image sizing / LCP image strategy.
6. Legacy polyfills, chunking, short-TTL third parties.
7. TTFB last (after browser critical path is lean).

## PageSpeed → action map

| Audit | Typical fix |
|---|---|
| LCP element render delay | Server-render LCP; `decoding="sync"`; no pre-paint JS measure; avoid empty `<video>` swap |
| LCP resource delay | Preload LCP asset on that page; `fetchPriority="high"`; skip optimizer hop for static AVIF LCP |
| Render-blocking CSS | Shrink Tailwind sources → App Router `experimental.inlineCss` (not Critters) |
| Unused JavaScript | `next/dynamic` + intent/viewport gate; do not statically import heavy SDKs |
| Legacy JavaScript | Alias Next `polyfill-module` to a modern baseline (keep `URL.canParse` if needed) |
| Forced reflow | No `getBoundingClientRect` on first paint; prefer `contentRect` / CSS sizing |
| Critical request chain (fonts) | Preload above-fold fonts or only the LCP font; avoid CSS→font chains |
| Efficient cache | Self-host short-TTL third-party scripts under long `Cache-Control` |
| Network payload (video) | `preload="none"`; set `src` on click; AVIF/WebP posters |
| Properly sized images / oversized image | Audit every homepage image; add `srcset` + accurate `sizes`; generate display-width AVIF/WebP; preload only the mobile LCP variant |

## LCP

Confirm the real LCP element every time.

**Image LCP**

- Put the poster in **Server Component** HTML (not behind a fat `'use client'` hero).
- Prefer a **static AVIF/WebP** with native `<img>` when the asset is already optimized — skip `/_next/image` if it adds delay.
- `fetchPriority="high"`, `decoding="sync"`, correct `width`/`height`.
- Preload on the **page** (`<link rel="preload" as="image">`), not globally on every route.
- Preload the **mobile display-width** variant when mobile is the measured LCP path (e.g. `720w` AVIF, not the desktop `1280w` master).
- Do not lazy-load it. Demote competing above-fold images (`fetchPriority="low"`).
- Keep media plane size stable with CSS (`absolute inset-0` or fixed aspect-ratio). Avoid ResizeObserver/`getBoundingClientRect` before LCP paints.

**Text LCP**

- H1 in server HTML; preload only its font; `font-display: swap`.
- No reveal CSS/JS hiding the heading.
- Keep auth/editor chunks out of its window.

**Never** claim wins from local-only numbers.

## CSS and Tailwind

Unified pipeline:

1. **Shrink** — Tailwind v4 `source(none)` + explicit `@source`; exclude demos/stories; drop dead globals; no duplicate `@tailwind utilities`.
2. **Unblock** — App Router: `experimental.inlineCss: true` when gzipped CSS is Tailwind-small (~tens of KiB).
3. **Do not use** `experimental.optimizeCss` / Critters for App Router streaming — it will not remove render-blocking CSS.
4. Skip inlining if CSS is huge or return-visitor caching dominates.
5. Verify production HTML: `<style>` present, **zero** `<link rel="stylesheet">` in `<head>` when inlining.

## JavaScript

- Do **not** override `optimization.splitChunks`.
- `next/dynamic` alone is not deferral if the component mounts immediately — gate with intent, viewport, or post-LCP idle.
- Prefer **intent-only** auth/editor mount on marketing home (Login / form focus / pricing in view). Timers auto-loading SDKs put unused JS back on the critical path.
- Auth providers: `dynamic(() => import(...))` so Clerk/SWR are not in the homepage graph until ready. Non-home auth routes must still SSR providers when hooks run during prerender.
- No sync `require()` as lazy fallback.
- Keep headings/copy outside client islands.
- Avoid `useLayoutEffect` and forced layout before LCP.

## Images

Audit **every image on the landing page**, not just the LCP candidate. PageSpeed flags “image file exceeds display size” when intrinsic pixels ≫ rendered CSS pixels.

**Decision tree**

1. **LCP poster (hero)** — native `<picture>` + AVIF/WebP `srcset` + `sizes="100vw"`; preload the mobile variant; `fetchPriority="high"`, `decoding="sync"`.
2. **Decorative / card / collage images** — responsive `srcset` + accurate `sizes`; lazy-load below fold; never ship full-resolution PNG/JPG when display is ~360–720px.
3. **Tiny fixed UI (logo, avatar)** — optimized static WebP/AVIF at display size + explicit `sizes="42px"` / `sizes="40px"`.
4. **`next/image`** — use when you want the optimizer; still require correct `sizes`. Skip the optimizer hop only for measured static LCP when a prebuilt AVIF is faster.

**Workflow**

1. List every `<img>`, `<Image>`, `<picture>`, and CSS `background-image` on the homepage.
2. For each, note **intrinsic size** (ffprobe) vs **display size** (PageSpeed or layout: card width, hero viewport, logo px).
3. If intrinsic width > ~1.5× display width, generate variants:
   - Mobile card/collage: `720w` AVIF/WebP
   - Desktop section: `1080w` AVIF/WebP when needed
   - Logos/avatars: exact display px
4. Wire `srcset` + `sizes` in markup. Remove direct references to oversized originals (`share-img.png`, `action_*.jpg`, `logo.png`).
5. Re-run PageSpeed “Properly size images” and repo perf guards.

**Examples**

```tsx
// Hero LCP — mobile preload + responsive poster
<link rel="preload" as="image" href="/media/hero-720.avif" type="image/avif" />
<picture>
  <source type="image/avif" srcSet="/media/hero-720.avif 720w, /media/hero-1280.avif 1280w" sizes="100vw" />
  <source type="image/webp" srcSet="/media/hero-720.webp 720w, /media/hero-1280.webp 1280w" sizes="100vw" />
  <img src="/media/hero-720.webp" width={720} height={405} sizes="100vw" fetchPriority="high" decoding="sync" alt="" />
</picture>

// Card grid — display ~360px on mobile
<picture>
  <source type="image/avif" srcSet="/media/card-720.avif" sizes="(max-width: 768px) 92vw, 360px" />
  <img src="/media/card-720.webp" width={720} height={480} loading="lazy" decoding="async" sizes="(max-width: 768px) 92vw, 360px" alt="" />
</picture>
```

**Do not**

- Ship a 1672×941 PNG when the element renders at ~360×203.
- Use `width={1600}` on a half-width collage without `sizes`.
- Preload desktop hero assets on mobile-first audits.
- Replace every image with `next/image` if static AVIF + preload is already faster for LCP.

- Layered poster + video: keep poster mounted; fade to video on `onPlaying` — do not unmount Image for an empty `<video>` (causes shrink/flicker). Use a stable aspect-ratio box (e.g. `aspect-[4/3]`).

## Videos

- First load target: **zero** MP4 requests.
- `preload="none"`; set `src` only on click/viewport activation.
- Pre-extract AVIF/WebP posters; do not use `preload="metadata"` just for frame one.
- Pause when leaving the viewport; do not duplicate requests in marquees.
- **The `poster` attribute cannot be responsive.** It takes a single URL — no `srcset`/`sizes` — so PageSpeed will flag it as “oversized image” on mobile whenever the still is bigger than the mobile render box (e.g. 960×540 poster in a 378px slot). Fix by replacing `poster="..."` with a layered `<picture>` overlay (AVIF/WebP `srcset` + `sizes`) that sits above the muted `<video preload="none">` and is unmounted on `onPlaying`. Make the overlay a real `<button aria-label="Play …">`, prime `video.src` on `pointerenter`, and call `video.play()` on click.

## Auth SDKs (Clerk or similar)

- Marketing home: defer provider tree until explicit auth-related intent.
- Auth-required routes: mount immediately.
- Keep user/token providers inside the auth provider.
- Disable polling/session-touch on marketing pages when the SDK allows.
- No auth preconnects when deferred.
- Fixed-size anonymous navbar fallbacks (no CLS).
- Regression-test signed-out, signed-in, checkout, OAuth callback.

## Fonts and third parties

- Preload only fonts that are above-fold / LCP-critical; subset weights actually used.
- Self-host analytics (e.g. CNZZ) when origin `max-age` is tiny; serve with long immutable cache.
- Load analytics `lazyOnload` / after idle.
- Do not preconnect every third party.

## Forced reflow

- Navbar/shell widths: derive from viewport + known padding, not `getBoundingClientRect` on mount.
- If measuring, use `ResizeObserver` `contentRect` only — never re-read the DOM in the same turn.
- Prefer CSS for hero media height (`inset-0`) over JS locks on the LCP path.

## Legacy polyfills (Next 15)

Next ships outdated `polyfill-module` regardless of `browserslist`. For Baseline ~2022 targets, alias it to a tiny modern shim (retain `URL.canParse` if the runtime needs it). Raise `browserslist` to match. Verify production chunk has no `Array.prototype.at||` / `Object.hasOwn||` polyfill definitions.

## Regression guards

Add repo-local checks for invariants that matter:

- No eager video `<source>`
- Videos `preload="none"`
- Auth/editor behind intent/`dynamic` import
- Hero LCP: server HTML + sync decode / correct preload policy
- Homepage images: no oversized originals; responsive `srcset` + `sizes` on hero, cards, collage, logo
- Tailwind `source(none)` + `@source`
- No custom `splitChunks`
- `inlineCss` when that strategy is chosen; no App Router `optimizeCss`
- Modern polyfill alias present when used

## Anti-patterns

- Middleware as a browser LCP fix
- Critters/`optimizeCss` on App Router expecting critical CSS
- Auto-mounting Clerk on a timer “after LCP”
- Preloading decorative hero media when LCP is text
- Swapping poster Image for empty video
- Serving full-resolution PNG/JPG when display size is a fraction of intrinsic pixels
- Preloading desktop-only image variants on mobile LCP paths
- Custom webpack vendor/`lib` chunk groups
- Claiming improvement before deploy remeasure

## Completion report

- Files changed
- Production JS/CSS size before/after (build)
- Commands run and results
- Deployed metrics only
- Next highest-value remaining bottleneck
