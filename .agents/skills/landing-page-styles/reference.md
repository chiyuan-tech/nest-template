# Landing page styles — reference recipes

Implementation sketches matching current repo code. Prefer importing shared helpers over copy-pasting forever; use this when building a **new** landing page in the same visual language.

---

## Section header

```tsx
import { LandingSectionHeader } from '@/components/landing/LandingSectionHeader';

<LandingSectionHeader
  kicker="Key Features"
  title="What Seedance 2.5 unlocks for finished cuts"
  description="One short supporting sentence."
  align="left" // or "center"
/>
```

Equivalent classes if you cannot import the component:

- Header wrap: `mb-8 sm:mb-10 md:mb-12` (+ `mx-auto max-w-4xl text-center` when centered)
- Kicker: `label-caps mb-2 text-primary sm:mb-3`
- H2: `text-[clamp(1.375rem,4.5vw,3.25rem)] font-normal italic text-foreground`
- Description: `font-inter mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[15px] md:text-base`

On brand/video surfaces, force light copy:

```tsx
className="[&_.label-caps]:text-white/90 [&_h2]:text-white [&_p]:text-white/90"
```

---

## Hero (content-locked media plane)

Structure:

```tsx
<section id="hero" className="relative isolate w-full" style={{ backgroundColor: '#120806' }}>
  {/* Absolute media plane — height from content measure in px */}
  <div className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden" style={{ height: mediaHeightPx }}>
    <img className="h-full w-full scale-105 object-cover lg:hidden" /* eager LCP poster */ />
    <video className="hidden h-full w-full scale-105 object-cover lg:block" muted loop playsInline preload="none" />
    <div className="absolute inset-0 bg-black/35" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_45%,rgba(5,6,10,0.55)_0%,rgba(5,6,10,0.42)_55%,rgba(5,6,10,0.92)_100%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,95,31,0.12),transparent_65%)]" />
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
  </div>

  <div className={`${layoutShellClassName} relative z-20 flex flex-col px-4 pb-20 pt-28 sm:px-0 sm:pb-24 sm:pt-32 lg:pb-28`}>
    <div data-hero-copy className="mx-auto w-full max-w-6xl space-y-5 text-center sm:space-y-6">
      <h1 className="text-[clamp(1.5rem,5vw,4.25rem)] font-normal italic" style={heroTextStyle}>…</h1>
      <p className="mx-auto max-w-2xl text-sm leading-relaxed sm:text-[15px] md:text-base" style={heroTextStyle}>…</p>
    </div>
    <div className={`${layoutInnerClassName} mx-auto mt-8 w-full sm:mt-10`}>
      {/* Generator / primary CTA cluster */}
    </div>
  </div>
</section>
```

```ts
const heroTextStyle = {
  color: '#ffffff',
  textShadow: '0 2px 18px rgba(0, 0, 0, 0.72)',
} as const;
```

Measure content with `ResizeObserver`, keep max settled height, freeze after ~2.5s — see `LandingHero.tsx`. Never size the media plane with `vh`/`svh`.

Defer desktop video until idle / timeout so the poster wins LCP.

---

## Pricing card grid

```tsx
<div className="mx-auto mb-16 grid max-w-8xl items-stretch gap-5 overflow-visible pt-8 md:grid-cols-2 xl:grid-cols-4">
  {/* default */}
  <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-[#111111] p-6 sm:p-7">
    …
  </div>

  {/* popular */}
  <div className="relative flex h-full flex-col bg-gradient-to-r from-[var(--brand-gradient-start)] to-[var(--brand-gradient-end)]">
    <div className="absolute inset-x-0 -top-9 z-10 rounded-t-[23px] bg-[linear-gradient(to_right,var(--brand-gradient-start),var(--brand-gradient-end))] px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
      Most Popular
    </div>
    <div className="flex h-full flex-col rounded-[23px] bg-gradient-to-br from-[var(--brand-gradient-start)] via-[#ff4081] to-[var(--brand-gradient-end)] p-[1px]">
      <div className="flex h-full flex-col rounded-[23px] bg-[#111111] p-6 sm:p-7">
        …
      </div>
    </div>
  </div>
</div>
```

Price split helper pattern: main `$99` at `text-[2.75rem] sm:text-5xl`, cents `.00` at `text-3xl sm:text-4xl`.

CTA:

```tsx
<Button
  variant="solid"
  size="lg"
  className="mt-8 h-12 w-full shrink-0 cursor-pointer rounded-full text-sm font-semibold shadow-none"
/>
```

Homepage embedding:

```tsx
<section id="pricing" className="border-t border-border bg-background py-12 sm:py-16 lg:py-20">
  <LandingSectionHeader kicker="Pricing" title="…" description="…" />
  <PricingSection hideSection hideHeader />
</section>
```

Dark standalone page titles: import `pricingH2ClassName` / `pricingSectionClassName` from `app/pricing/pricing-styles.ts`.

---

## Alternating feature row

```tsx
<article className="overflow-hidden rounded-2xl border border-border/80 bg-card/50 shadow-[0_20px_50px_-40px_rgba(255,95,31,0.35)]">
  <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
    <div className={`flex flex-col justify-center p-7 sm:p-10 ${textFirst ? 'lg:order-1' : 'lg:order-2'}`}>
      <p className="label-caps mb-4 text-primary">Feature {n}</p>
      <h3 className="mb-4 font-space-grotesk text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold leading-tight tracking-[-0.02em]">…</h3>
      <p className="font-inter text-[15px] leading-[1.75] text-muted-foreground">…</p>
    </div>
    <div className={`relative bg-black ${textFirst ? 'lg:order-2' : 'lg:order-1'}`}>
      <div className="aspect-video lg:aspect-auto lg:h-full lg:min-h-full">
        {/* video / image */}
      </div>
    </div>
  </div>
</article>
```

Stack rows with `space-y-12 lg:space-y-16`.

---

## Step / process cards

```tsx
<section className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20">
  {/* optional dot grid bg */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-8 md:p-9">
      <div className="pointer-events-none absolute -bottom-8 -right-6 text-[clamp(6rem,18vw,11rem)] font-black leading-none text-foreground/[0.06]" aria-hidden>
        {n}
      </div>
      {/* image + h3 text-xl md:text-2xl + body */}
    </div>
  </div>
</section>
```

---

## Brand close (CTA + footer shared media)

```tsx
<div className="relative isolate overflow-hidden bg-[#9a3310]" data-nav-surface="brand">
  {/* absolute poster + optional deferred video, scale-105 object-cover */}
  {/* brand orange wash / .brand-surface-bg feel */}
  <LandingCTA /> {/* white header overrides */}
  <Footer />
</div>
```

Primary CTA link classes:

```
btn-primary … cursor-pointer rounded-xl px-5 py-2.5 … sm:px-8 sm:py-3.5 sm:text-base
```

Secondary:

```
border border-white/35 … text-white hover:border-white/55 hover:bg-white/10 cursor-pointer
```

---

## Globals worth reusing as-is

```css
.btn-primary { background: var(--brand-gradient); color: #fff; }
.btn-primary:hover { background: var(--brand-gradient-hover); }
.bg-brand-gradient { background: var(--brand-gradient); }
.brand-surface-bg { background: linear-gradient(to bottom, #d94e18, #9a3310); }
.label-caps { /* 0.6875rem / 600 / 0.05em / uppercase Inter */ }
.shadow-custom { box-shadow: rgba(0,0,0,0.08) 0px 4px 12px; }
```

---

## Homepage module order (reference)

1. `LandingHero` (full bleed)
2. Shell: WhatsNew → KeyFeatures → WhatYouCanCreate → Masonry → WhoItsBuiltFor → VersionComparison → HowItWorks
3. `LandingTestimonials` (may break shell)
4. Shell: LandingPricing → LandingFAQ
5. `LandingBrandClose` (CTA + footer, full bleed)

Match this cadence when composing a new marketing landing: Hero → editorial proof → features → social proof → pricing → FAQ → brand close.
