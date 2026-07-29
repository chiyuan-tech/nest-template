# Nest Template

This template builds clone-first SaaS homepages. The generated workflow clones a competitor, captures accessible media with Playwright, researches the keyword, implements real responsive components, then uses Claude Sonnet for locked homepage SEO copy.

## Homepage contract

- Keep and render `Navbar`, `Footer`, and `PricingSection`.
- `Home` and `How to Use` use homepage anchors; `Pricing` uses `/pricing`.
- Use captured competitor font files when available, with the bundled Instrument Serif fallback.
- Use only user-uploaded `/logo.webp`, `/favicon.ico`, and `/share-img.png` as final brand assets.
- Do not add CY components or deprecated visual-conversion workflows.

The current workflow develops the homepage only. Its SEO documents must include module-level copy, TDK, headings, CTA, FAQ, media text, metadata, and JSON-LD, and pass an SEO score of at least 95.

## SEO automation deliverables

This repository deliberately does not contain final SEO copy: it is specific to the cloned competitor, immutable keyword, and uploaded brand assets. During a generated project's run, Claude Sonnet creates these files under that project's `.ai-task/` directory:

- `seo-development-plan.md` — homepage-only SEO strategy, module plan, TDK, headings, FAQ, media text, Open Graph/Twitter, and JSON-LD mapping.
- `seo-copy-map.md` — the locked, exact copy for every homepage content and metadata slot.
- `claude-sonnet-run.log` — the Sonnet invocation result.
- `claude-sonnet-blocker.md` — explicit failure reason if Sonnet is unavailable, an input is missing, or either required output is incomplete.

Read [the SEO delivery contract](docs/seo-automation.md) before changing the template or bootstrap flow. A project may not advance to copy synchronization or SEO audit without both Claude-authored files.
