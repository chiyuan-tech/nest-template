---
name: landing-page-styles
description: Applies this repo's Seedance landing-page visual system—typography (h1–h6), section spacing, layout shell, Hero media plane, pricing cards, section headers, CTAs, and brand colors. Use when building or restyling landing pages, marketing sections, homepage modules, pricing UI, or Hero layouts in this project.
---

# Landing Page Styles (Seedance)

Canonical patterns extracted from `app/globals.css`, `components/landing/*`, `lib/layout-shell.ts`, and `components/PricingSection.tsx`. Prefer existing helpers over inventing new scales.

## Quick Start

1. Wrap page body in `layoutShellClassName` from `@/lib/layout-shell`.
2. Every section: `py-12 sm:py-16 lg:py-20` (例外：Hero / BrandClose 用自己的 padding).
3. Section title block → `LandingSectionHeader` (kicker + italic h2 + muted description).
4. Body copy → Inter, `text-muted-foreground`, leading ~1.7–1.75.
5. Primary CTA → `.btn-primary` or Brand gradient; all interactive controls → `cursor-pointer`.
6. Cards: soft `border-border/80`, `rounded-2xl`, light brand-tinted shadow — not purple glow, not heavy multi-shadow stacks.

Source of truth while coding:

| Concern | File |
|---------|------|
| Colors / fonts / CTA | `app/globals.css` |
| Shell width | `lib/layout-shell.ts` |
| Section header | `components/landing/LandingSectionHeader.tsx` |
| Hero | `components/landing/LandingHero.tsx` |
| Pricing cards | `components/PricingSection.tsx` |
| Dark pricing h2 | `app/pricing/pricing-styles.ts` |

Detailed recipes: [reference.md](reference.md)

---

## Design DNA (why it reads well)

- **Serif headline + sans UI**: Instrument Serif italic for emotional H1/H2; Space Grotesk for H3–H6 / card titles; Inter for body.
- **Clamp type, not fixed breakpoints only**: Headlines scale fluidly; body locks to a narrow band (`sm`/`md` only).
- **One shared column**: Navbar and content share `layoutShellClassName` so edges align.
- **Section rhythm**: Consistent vertical padding + header `mb-8 → md:mb-12` creates predictable breathing room.
- **Hero = full-bleed media + content-locked height**: Media fills behind copy; height follows content in **px** (no `vh`/`svh`).
- **Soft cards, brand-tinted depth**: Borders at ~80% opacity; shadows use orange `#ff5f1f` / primary at low alpha.
- **Kicker → title → body**: Caps label in primary, big italic title, muted supporting line — never jump straight to dense grids.

---

## Typography

### Font stack (from `app/layout.tsx` + `globals.css`)

| Role | Family | CSS var / class |
|------|--------|-----------------|
| Display (h1, h2) | Instrument Serif, italic, weight 400 | `--font-instrument-serif` |
| Section / card titles (h3–h6) | Space Grotesk, weight 700 | `--font-space-grotesk` / `.font-space-grotesk` |
| Body, UI, kickers | Inter | `--font-inter` / `.font-inter` |

Global defaults:

- **h1 / h2**: italic, `letter-spacing: 0.02em`, `line-height: 1.3`
- **h3–h6**: bold, `letter-spacing: -0.02em`
- Body: antialiased Inter on `body`

### Size scale (landing)

| Element | Size classes / recipe |
|---------|------------------------|
| **Hero h1** | `text-[clamp(1.5rem,5vw,4.25rem)] font-normal italic` + white + text-shadow |
| **Section h2** (`LandingSectionHeader`) | `text-[clamp(1.375rem,4.5vw,3.25rem)] font-normal italic` |
| **Pricing dark h2** | `pricingH2ClassName` — Space Grotesk bold clamp same size, `leading-[1.12]`, `tracking-[-0.03em]`, white |
| **Feature h3** | `text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold tracking-[-0.02em]` |
| **Card / step h3** | `text-xl md:text-2xl` or `text-lg` (FAQ / small cards) |
| **Plan title (pricing)** | `text-2xl font-bold tracking-tight` |
| **Price numeral** | `text-[2.75rem] sm:text-5xl` main; cents `text-3xl sm:text-4xl` |
| **Body** | `text-sm` → `sm:text-[15px]` → `md:text-base`; leading `relaxed` / `[1.7]` / `[1.75]` |
| **Muted caption** | `text-xs` / `text-[11px]`–`text-sm` at `text-muted-foreground` |
| **Kicker** | `.label-caps` — `0.6875rem`, semibold, `letter-spacing: 0.05em`, uppercase; color `text-primary` (or white on brand surfaces) |

Do not invent a parallel type scale. Mirror these clamps.

---

## Color & brand

| Token | Value / usage |
|-------|----------------|
| Brand gradient | `#ff7e4b` → `#ff3c8e` (`--brand-gradient`) |
| Hover gradient | `#f06d38` → `#e8337f` |
| Primary CTA | `.btn-primary` / `.bg-brand-gradient` |
| Brand surface (footer band) | `.brand-surface-bg` — `#d94e18` → `#9a3310` |
| Accent chip orange | `#ff7a42` / `#ff5f1f` in soft shadows |
| Hero underpaint | `#120806` |
| Pricing card surface | `#111111`, border `border-white/10` |
| Body text | `text-foreground` / `text-muted-foreground` |
| Cards | `bg-card/50`–`bg-card/70`, `border-border/80` |

Avoid default AI looks: purple-indigo gradients, cream+serif terracotta themes, newspaper brutalism. This brand is **warm orange → pink** on light (or dark card) surfaces.

---

## Layout shell & spacing

### Shell

```ts
// lib/layout-shell.ts
layoutShellClassName =
  'mx-auto w-full max-w-[min(calc(100%-1.5rem),76rem)] sm:max-w-[min(calc(100%-2rem),78rem)] lg:max-w-[80rem] xl:max-w-[84rem] 2xl:max-w-[88rem]'
layoutInnerClassName = 'w-full'
```

- Homepage: Hero / Testimonials / BrandClose often **full-bleed**; mid-page modules sit inside one `layoutShellClassName` wrapper (`app/page.tsx`).
- Inside a section that already sits in the shell, still nest `layoutShellClassName` + `layoutInnerClassName` when the section is full-bleed itself.
- `section[id]`: `scroll-margin-top: 5.5rem` (globals).

### Vertical rhythm

| Layer | Spacing |
|-------|---------|
| Section padding | `py-12 sm:py-16 lg:py-20` |
| First section after hero (WhatsNew) | heavier top: `pt-16 sm:pt-20 lg:pt-24` + `pb-12…` |
| Section header → content | `mb-8 sm:mb-10 md:mb-12` on `LandingSectionHeader` |
| Feature / alternating blocks | `space-y-12 lg:space-y-16` |
| Two-column editorial (WhatsNew) | `gap-12 lg:gap-16` |
| Card grids | `gap-4` (3-col steps), `gap-6` (2-col use cases) |
| FAQ items | `space-y-3` |
| Pricing grid | `gap-5`, `mb-16`, cards `p-6 sm:p-7` |

### Section anatomy (default)

```
<section className="… py-12 sm:py-16 lg:py-20">
  <div className={layoutShellClassName}>
    <div className={layoutInnerClassName}>
      <LandingSectionHeader kicker="…" title="…" description="…" />
      {/* one content job: grid / stack / media */}
    </div>
  </div>
</section>
```

One job per section: one kicker, one headline, one short support line, then content.

---

## Hero layout

Pattern from `LandingHero`:

1. **Full-bleed section** — `relative isolate w-full`, dark underpaint `#120806`.
2. **Media plane** — absolute, top/inset-x, height = measured content height in **px** (freeze after load). Mobile: eager AVIF poster; desktop: deferred muted loop video. `object-cover`, slight `scale-105`.
3. **Overlays** (stacked): `bg-black/35` → dark radial vignette → soft orange radial wash → bottom fade `from-background` so the next section blends.
4. **Content column** — `layoutShellClassName`, `pt-28 sm:pt-32`, `pb-20 sm:pb-24 lg:pb-28`, centered copy `max-w-6xl`, `space-y-5 sm:space-y-6`.
5. **SEO-critical copy** — wrap in `[data-hero-copy]`; force visible (globals already do this). White text + `textShadow: 0 2px 18px rgba(0,0,0,0.72)`.
6. **Primary product UI under copy** — generator/form in `layoutInnerClassName`, `mt-8 sm:mt-10` — not floating badges on the media.

Hard rules:

- Do **not** use `vh`/`svh` for hero media height (crawler/LCP issues in this project).
- Do **not** put inset hero cards, side-panel hero, or sticker badges on the media.
- Keep hero budget tight: brand moment + h1 + one line + CTA/product block.

---

## Pricing

Homepage wraps cards with light-theme `LandingSectionHeader`, then `PricingSection` with `hideSection` + `hideHeader`.

### Cards

| State | Treatment |
|-------|-----------|
| Default | `rounded-[24px] border border-white/10 bg-[#111111] p-6 sm:p-7` |
| Popular | Outer gradient edge `p-[1px]` + inner `#111111`; **Most Popular** tab: absolute `-top-9`, gradient bar, `text-[11px] uppercase tracking-[0.14em]` |

### Card interior

1. Title `h3` white `text-2xl`
2. Price row: large numeral + optional `/ N credits` in `text-white/75`
3. CTA: `Button` solid, `h-12`, `rounded-full`, full width, `mt-8`
4. Features: `mt-8 space-y-3.5`; first row Sparkles `#ff7a42`, rest Check `text-white/55`; copy `text-sm text-white/80`

### Trust strip

`rounded-2xl border-white/10 bg-[#111111]`, icon in `bg-[#ff7a42]/15` circle — all links/buttons `cursor-pointer`.

Standalone `/pricing` may use `pricingSectionClassName` (`py-20 sm:py-24 lg:py-28`) and `pricingH2ClassName` for dark surfaces.

---

## Recurring section patterns

| Pattern | When | Key classes |
|---------|------|-------------|
| **Alternating feature** | Media + copy pairs | `rounded-2xl border…`, `lg:grid-cols-2`, odd/even `order`, tinted shadow |
| **Step cards** | How-it-works | 3-col, big watermark number, image `aspect-[16/10]`, dot-grid section bg |
| **Use-case tiles** | Audience | 2-col, image `aspect-video`, hover: primary border glow + image scale |
| **FAQ accordion** | FAQ | `details` + `rounded-2xl`, open state `border-primary/20` |
| **Brand close** | Final CTA + footer | Shared video plane + brand orange wash; white header override via `[&_h2]:text-white` |

CTA buttons: primary gradient (`rounded-xl` / `rounded-full` ok) + ghost `border-white/35` on video surfaces. Always `cursor-pointer`.

---

## Motion & media

- Prefer CSS transitions on hover (`duration-300`–`700`); respect `motion-reduce:`.
- Videos: poster first; load on idle / intersection / click — don’t compete with LCP.
- Soft brand radial behind media frames (WhatsNew) beats hard drop shadows.

---

## Checklist (before shipping a landing section)

- [ ] Uses `layoutShellClassName` / shared max-width
- [ ] Section padding = `py-12 sm:py-16 lg:py-20` (unless Hero/BrandClose)
- [ ] Titles use Instrument Serif italic (h1/h2) or Space Grotesk (h3+)
- [ ] Body is Inter + muted + ~1.7 leading
- [ ] Kicker uses `.label-caps` + primary
- [ ] Primary actions use brand gradient; `cursor-pointer` on all buttons/links-as-buttons
- [ ] Cards: soft border, `rounded-2xl`, orange-tinted shadow if any
- [ ] No purple AI gradient, no sticker overlays on hero media
- [ ] Hero media height not `vh`-based

## Anti-patterns

- Mixing a third display font for marketing headlines
- Shrinking section padding below `py-12` on homepage modules
- Pricing cards on white with generic blue badges
- Hero content in a centered card floating over a cropped video
- Decorative stat strips / pill clusters in the first viewport
