# Project Instructions

## Design System

- Before making any UI, page, layout, component, navigation, footer, pricing, card, form, modal, or visual style change, read `desgin.md` first.
- Treat `desgin.md` as the source of truth for visual direction.
- Follow its Framer-inspired dark marketing style: near-black canvas, oversized white display type, tight negative tracking, white/charcoal pill CTAs, charcoal cards, scarce blue signal accents, and gradient spotlight cards only as individual cards.
- Do not introduce unrelated visual themes such as orange Retool controls, editorial cream layouts, small-radius dashboard surfaces, full-page gradients, or blue CTA fills unless explicitly requested.
- For new reusable UI, prefer updating shared components and design tokens so pages inherit the template style consistently.

## Frontend Development

Skill stack when building or editing pages / layouts / sections / UI (load before writing code):

| Layer | Skill / file | When |
|-------|----------------|------|
| Brand tokens | `desgin.md` | Always for visual work |
| Frontend engineering & taste | `.codex/skills/design-taste-frontend-v1/SKILL.md` | Always for visible frontend markup or styles |
| Page style / layout craft | `.codex/skills/gpt-taste/SKILL.md` | **Must** for page-level style development (hero, sections, spacing, grids, AIDA structure) |
| GSAP in React | `.codex/skills/gsap-react/SKILL.md` | **As needed**—only when adding or editing GSAP / `useGSAP` / ScrollTrigger motion |

- Do not skip `design-taste-frontend-v1` or `gpt-taste` for “small” UI/page style changes if markup or styles are touched.
- `desgin.md` wins on brand direction (colors, CTAs, Framer dark marketing look). `design-taste-frontend-v1` and `gpt-taste` constrain engineering and page craft; when they conflict with `desgin.md`, follow `desgin.md`.
- Prefer CSS / existing motion patterns first; load `gsap-react` when the task needs GSAP (or when `gpt-taste` selects GSAP paradigms that you actually implement).

## Verification

- For small copy, image, or navigation configuration changes, only run static checks or state that no build was run.
- For type, interface, route, or core component logic changes, run the lightest useful check first, or ask whether a full build is needed.
- Only run `next build` when explicitly requested.
