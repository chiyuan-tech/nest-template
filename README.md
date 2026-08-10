# Nest Template

This template builds CY-composed SaaS homepages. The generated workflow uses competitor and Playwright findings for product research, media and interaction evidence; composes the final homepage from registered CY modules; then uses Claude Sonnet for locked homepage SEO copy.

## Homepage contract

- Keep and render `Navbar`, `Footer`, and `PricingSection`.
- `Home` and `How to Use` use homepage anchors; `Pricing` uses `/pricing`.
- Use the generated modern sans-serif typography stack. Instrument Serif and generic serif fallbacks are not part of the default page typography.
- Use only user-uploaded `/logo.webp`, `/favicon.ico`, and `/share-img.png` as final brand assets.
- CY component modules, their `/cy` demo routes, registry skill, generator script, configuration and documentation are supported in this template. Use `npm run cy:generate` to scaffold registered CY modules.

The current workflow develops the homepage only. Its SEO documents must include module-level copy, TDK, headings, CTA, FAQ, media text, metadata, and JSON-LD, and pass an SEO score of at least 95.

Every SEO copy map must use this ordered SaaS homepage architecture: Hero, product Overview, Key Features, an evidence-backed model comparison table, Why Choose, How to Use, Use Cases, verified feedback, FAQ, and a final “Start Creating” CTA. Comparison claims require sources or an explicit “not publicly verified” qualification; testimonials cannot be invented.

## SEO automation deliverables

This repository deliberately does not contain final SEO copy: it is specific to the cloned competitor, immutable keyword, and uploaded brand assets. During a generated project's run, Claude Sonnet creates these files under that project's `.ai-task/` directory:

- `seo-development-plan.md` — homepage-only SEO strategy, module plan, TDK, headings, FAQ, media text, Open Graph/Twitter, and JSON-LD mapping.
- `seo-copy-map.md` — the locked, exact copy for every homepage content and metadata slot.
- `claude-sonnet-run.log` — the Sonnet invocation result.
- `claude-sonnet-blocker.md` — explicit failure reason if Sonnet is unavailable, an input is missing, or either required output is incomplete.

Read [the SEO delivery contract](docs/seo-automation.md) before changing the template or bootstrap flow. A project may not advance to copy synchronization or SEO audit without both Claude-authored files.

For the end-to-end CY generation, competitor-media and SEO workflow, read the [CY SaaS homepage automation manual](../../工具测试/project-bootstrap/docs/cy-saas-homepage-manual.md).
