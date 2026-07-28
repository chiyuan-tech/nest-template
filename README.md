# Nest Template

This template builds clone-first SaaS homepages. The generated workflow clones a competitor, captures accessible media with Playwright, researches the keyword, implements real responsive components, then uses Claude Sonnet for locked homepage SEO copy.

## Homepage contract

- Keep and render `Navbar`, `Footer`, and `PricingSection`.
- `Home` and `How to Use` use homepage anchors; `Pricing` uses `/pricing`.
- Use captured competitor font files when available, with the bundled Instrument Serif fallback.
- Use only user-uploaded `/logo.webp`, `/favicon.ico`, and `/share-img.png` as final brand assets.
- Do not add CY components or deprecated visual-conversion workflows.

The current workflow develops the homepage only. Its SEO documents must include module-level copy, TDK, headings, CTA, FAQ, media text, metadata, and JSON-LD, and pass an SEO score of at least 95.
