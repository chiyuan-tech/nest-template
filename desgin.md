# Design System Inspired by Framer

## Overview

Framer's marketing canvas is a near-pure black artboard. The dominant surface is a near-black canvas, and the page reads like a poster: one assertive statement per band, oversized white display type, generous breathing room, monochrome chrome, and scarce blue signal accents.

## Core Characteristics

- Dark-canvas marketing system: hero, body, pricing, FAQ, and footer sit on near-black.
- Massive display headlines with tight negative letter spacing.
- White pill primary CTAs; charcoal pill secondary CTAs.
- Charcoal cards on black canvas, with one or two vibrant gradient spotlight cards as showcase accents.
- Inter Variable for body, with display type approximated by Inter/Mona/Geist weight 500-700 when GT Walsheim is unavailable.
- Accent blue is reserved for links, focus rings, and selected indicators.
- No full-section gradients. Gradients are cards, not page backgrounds.

## Colors

- Canvas: `#050505`
- Surface 1: `#151515`
- Surface 2: `#222222`
- Hairline: `rgba(255,255,255,0.10)`
- Hairline Soft: `rgba(255,255,255,0.07)`
- Ink: `#FFFFFF`
- Ink Muted: `#999999`
- Primary CTA Surface: `#FFFFFF`
- Primary CTA Text: `#050505`
- Accent Blue: `#0099FF`
- Success Green: `#22C55E`
- Error Red: `#EF4444`
- Gradient Magenta: `#FF4FD8`
- Gradient Violet: `#7C3AED`
- Gradient Orange: `#FF7A1A`
- Gradient Coral: `#FF5F6D`

## Typography

- Display: GT Walsheim Medium if available; otherwise Inter/Geist/Mona Sans at 500-700.
- Body: Inter Variable.
- Display XXL: 110px / 500 / 0.85 / -5.5px.
- Display XL: 85px / 500 / 0.95 / -4.25px.
- Display LG: 62px / 500 / 1.0 / -3.1px.
- Display MD: 32px / 500 / 1.13 / -1px.
- Body: 15px / 400 / 1.3 / -0.15px.
- Caption: 13px / 500 / 1.2 / -0.13px.
- Button: 14px / 500 / 1.0 / -0.14px.

## Shapes

- Small utility radius: 4px.
- Inputs/list items: 10px.
- Template cards: 15px.
- Pricing cards/mockup tiles: 20px.
- Gradient spotlight cards: 30px.
- CTAs: 100px pill.
- Icon buttons/avatar circles: full circle.

## Components

- Primary button: white pill, black text, 10px vertical and 15px horizontal padding.
- Secondary button: charcoal pill, white text.
- Inputs: surface-1 background, white text, 10px radius, blue focus ring.
- Pricing card: surface-1, 20px radius, 24px padding.
- Featured pricing card: surface-2, same structure.
- Gradient spotlight card: violet/magenta/orange/coral gradient, 30px radius, 32px padding.
- Top nav: dark canvas, 56px high, centered nav links, right-side secondary + primary actions or compact controls.
- Footer: dark canvas, dense caption-sized link grid.

## Rules

- Do use the dark canvas as the main whitespace.
- Do use white/charcoal surfaces as the main system.
- Do keep CTAs as pills.
- Do use accent blue only for links, focus, and selected indicators.
- Do add at most one or two gradient spotlight cards per long page.
- Do not ship a light-mode marketing page as the primary identity. Light mode may exist only as a template utility.
- Do not use orange as a brand/action color in this theme.
- Do not use full-page gradients.
- Do not square off CTAs.
