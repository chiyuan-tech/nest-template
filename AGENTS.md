# Project Instructions

## Design System

- Before making any UI, page, layout, component, navigation, footer, pricing, card, form, modal, or visual style change, read `desgin.md` first.
- Treat `desgin.md` as the source of truth for visual direction.
- Follow its Framer-inspired dark marketing style: near-black canvas, oversized white display type, tight negative tracking, white/charcoal pill CTAs, charcoal cards, scarce blue signal accents, and gradient spotlight cards only as individual cards.
- Do not introduce unrelated visual themes such as orange Retool controls, editorial cream layouts, small-radius dashboard surfaces, full-page gradients, or blue CTA fills unless explicitly requested.
- For new reusable UI, prefer updating shared components and design tokens so pages inherit the template style consistently.

## Frontend Development

- When building or editing any frontend page, layout, section, or UI component, **must** read and follow `.codex/skills/design-taste-frontend-v1/SKILL.md` before writing code.
- Apply that skill together with `desgin.md`: `desgin.md` defines this repo’s visual tokens and brand direction; `design-taste-frontend-v1` defines frontend engineering and taste constraints (typography, spacing, motion, Tailwind usage, component structure).
- Do not skip the skill for “small” UI changes—if the task touches visible frontend markup or styles, load the skill first.

## Verification

- For small copy, image, or navigation configuration changes, only run static checks or state that no build was run.
- For type, interface, route, or core component logic changes, run the lightest useful check first, or ask whether a full build is needed.
- Only run `next build` when explicitly requested.
