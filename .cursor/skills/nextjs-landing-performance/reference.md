# Performance recipes

Adapt paths, framework version, and auth SDK to the target repository.

## 1. Mobile Lighthouse

```powershell
npx --yes lighthouse "https://example.com/" `
  --only-categories=performance `
  --form-factor=mobile `
  --screen-emulation.mobile=true `
  --throttling-method=simulate `
  --output=json `
  --output-path=".lighthouse-live.json" `
  --quiet
```

Extract score, LCP/FCP/TBT/CLS, LCP element + breakdown, render-blocking CSS, unused/legacy JS, videos, auth. Delete the temp report after analysis.

## 2. Server-rendered image LCP

```tsx
// app/(marketing)/page.tsx
export default function Page() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/media/hero.avif"
        type="image/avif"
        fetchPriority="high"
      />
      <Hero />
    </>
  );
}

// components/Hero.tsx — Server Component (no "use client")
export default function Hero() {
  return (
    <section className="relative isolate">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <img
          src="/media/hero.avif"
          alt="…"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          className="h-full w-full object-cover lg:hidden"
        />
        <DeferredDesktopVideo />
      </div>
      <div className="relative z-10">{/* H1 + deferred editor */}</div>
    </section>
  );
}
```

## 3. Intent-gated auth chunk

```tsx
'use client';

import dynamic from 'next/dynamic';

const AuthBoundProviders = dynamic(() => import('./auth-bound-providers'));

function DeferredAuthBoundary({ children }: { children: React.ReactNode }) {
  const { ready } = useAuthGate();
  if (!ready) return <>{children}</>;
  return <AuthBoundProviders>{children}</AuthBoundProviders>;
}
```

- Marketing `/`: `ready` only after Login / editor / pricing intent.
- Auth-required routes: `ready` immediately so SSR hooks do not crash.
- Do not auto-`setTimeout` enable auth on the homepage if unused-JS audits still flag the SDK.

## 4. Click-to-load video (no flicker)

```tsx
<div className="relative aspect-[4/3] overflow-hidden">
  <Image
    src={poster}
    alt={posterAlt}
    fill
    sizes="(max-width: 1023px) 100vw, 50vw"
    className={cn('object-cover', isPlaying && 'opacity-0')}
  />
  <video
    ref={videoRef}
    className={cn('absolute inset-0 h-full w-full object-cover', !isPlaying && 'opacity-0')}
    playsInline
    preload="none"
    onPlaying={() => setIsPlaying(true)}
  />
  <button type="button" className="absolute inset-0 cursor-pointer" onClick={play}>
    Play
  </button>
</div>
```

Set `video.src` only inside `play()`. Never unmount the poster for an empty `<video>`.

## 5. Extract AVIF poster

```powershell
ffmpeg -y -ss 0.1 `
  -i "public/media/input.mp4" `
  -frames:v 1 `
  -vf "scale='min(920,iw)':-2" `
  -c:v libaom-av1 `
  -crf 32 `
  -still-picture 1 `
  "public/media/input-poster.avif"
```

Reject black first frames.

## 6. Tailwind v4 + App Router CSS inline

```css
@import "tailwindcss" source(none);

@source "../app/**/*.{ts,tsx,js,jsx}";
@source "../components/**/*.{ts,tsx,js,jsx}";
@source "../lib/**/*.{ts,tsx,js,jsx}";
@source not "../components/**/*Demo*";
```

```ts
// next.config.ts
experimental: {
  inlineCss: true, // App Router — not optimizeCss/critters
},
```

After build: homepage `<head>` should have inline `<style>` and no render-blocking stylesheet links.

## 7. Modern Next polyfill alias

```js
// lib/modern-polyfills.js
if (typeof URL !== 'undefined' && typeof URL.canParse !== 'function') {
  URL.canParse = function (url, base) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}
```

```ts
webpack: (config) => {
  const modern = resolve(process.cwd(), 'lib/modern-polyfills.js');
  config.resolve.alias = {
    ...config.resolve.alias,
    '../build/polyfills/polyfill-module': modern,
    'next/dist/build/polyfills/polyfill-module': modern,
  };
  return config;
},
```

Pair with modern `browserslist` (e.g. Safari ≥ 15.4). Confirm production runtime chunk lacks `Array.prototype.at||` definitions.

## 8. Avoid forced reflow

```ts
// Prefer derived width over measuring the shell on mount
const containerWidth =
  viewportWidth > 0
    ? Math.max(0, viewportWidth - (viewportWidth >= 640 ? 32 : 16))
    : 0;
```

If you must observe size, use `entry.contentRect` from `ResizeObserver` only.

## 9. Self-host short-TTL scripts

```tsx
<Script id="analytics" strategy="lazyOnload" src="/vendor/analytics.js" />
```

```ts
headers: [
  {
    source: '/vendor/(.*)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
],
```

## 10. Font preload policy

- Image LCP: do not let decorative font preloads starve the image; preload fonts that are still above-fold if the critical-chain audit requires it, and subset weights.
- Text LCP: preload only that text’s font file.
- Always `display: 'swap'`.

## 11. Viewport gate

```tsx
function ViewportGate({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '240px 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}
```

## 12. Verification matrix

| Area | Check |
|---|---|
| Build / types / lint | Exit 0 |
| Homepage HTML | LCP asset discoverable; no eager videos |
| Auth | Home deferred; protected routes SSR-safe |
| Media | Click plays; no shrink/flicker; aspect box stable |
| Images | No oversized originals; hero/card/collage use `srcset` + `sizes`; mobile LCP preload |
| CSS | Inline or intentionally external; size regress checked |
| JS | Heavy SDK absent from initial homepage graph |
| Deploy | Fresh mobile PageSpeed after ship |

## 14. Homepage image audit + responsive variants

When PageSpeed reports “image file exceeds display size”:

1. Identify the flagged URL and rendered size (e.g. `1672×941` displayed at `360×203`).
2. Generate display-width variants under `public/**/opt/`:

```powershell
ffmpeg -y -i "public/media/share-img.png" `
  -vf "scale=720:-2" `
  -c:v libaom-av1 -crf 35 -still-picture 1 `
  "public/assets/home/opt/share-img-720.avif"

ffmpeg -y -i "public/media/share-img.png" `
  -vf "scale=1080:-2" `
  -c:v libaom-av1 -crf 34 -still-picture 1 `
  "public/assets/home/opt/share-img-1080.avif"
```

3. Wire responsive markup:

```tsx
<picture>
  <source
    type="image/avif"
    srcSet="/assets/home/opt/share-img-720.avif 720w, /assets/home/opt/share-img-1080.avif 1080w"
    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 540px"
  />
  <img
    src="/assets/home/opt/share-img-720.webp"
    width={720}
    height={405}
    loading="lazy"
    decoding="async"
    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 540px"
    alt=""
  />
</picture>
```

4. Add repo guard (`scripts/check-home-performance.mjs`) that fails if homepage components still reference oversized originals.

**Checklist — scan all homepage sections**

| Section | Typical display | Target asset |
|---|---|---|
| Hero poster | `100vw` mobile | `720w` AVIF preload + `1280w` desktop srcset |
| Collage / feature image | ~360–540px | `720w`/`1080w` srcset + `sizes` |
| Card thumbnails | ~360px | `720w` AVIF/WebP, not 2K JPG |
| Pipeline / step art | ~360px | WebP ≤400px wide |
| Video still | ~378px mobile / ~600px desktop | layered `<picture>` (`480w`+`960w`), **not** the `poster` attribute |
| Logo | 42px | `/logo.webp` + `sizes="42px"` |
| Avatars | 40px | `sizes="40px"` |

**Video poster still is oversized (`<video poster>`):** the attribute takes one fixed URL, so mobile always downloads the desktop still. Replace it with an overlay:

```tsx
{!started && (
  <button type="button" aria-label={`Play video: ${title}`}
    onPointerEnter={prime} onClick={start}
    className="group/poster absolute inset-0 z-[3] cursor-pointer">
    <picture>
      <source type="image/avif" srcSet={`${base}-480.avif 480w, ${base}.avif 960w`} sizes="(max-width:1024px) 92vw, 600px" />
      <source type="image/webp" srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w`} sizes="(max-width:1024px) 92vw, 600px" />
      <img src={`${base}-480.webp`} width={960} height={540} loading="lazy" decoding="async" alt="" className="h-full w-full object-cover" />
    </picture>
  </button>
)}
<video ref={ref} controls playsInline preload="none" onPlaying={() => setStarted(true)} />
```

Generate the extra widths with ffmpeg (Sharp can crash re-encoding AVIF→AVIF in a loop on Windows):

```bash
ffmpeg -y -i poster.avif -vf scale=480:-1 poster-480.avif
ffmpeg -y -i poster.avif -vf scale=480:-1 poster-480.webp
ffmpeg -y -i poster.avif -vf scale=960:-1 poster-960.webp
```

## 13. Interpretation traps

- Simulated LCP ≫ raw trace is common — compare like with like.
- “Unused JS” on shared React/Next runtime is usually not removable.
- Payload down ≠ LCP down if render delay or CSS regresses.
- `optimizeCss: true` on App Router ≠ critical CSS.
- Local First Load JS is not deployed proof.
