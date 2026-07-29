# SEO Automation Delivery Contract

## Purpose

`nest-template` supplies the homepage components and metadata slots. `project-bootstrap` creates the project-specific `.ai-task/` workspace and invokes Claude CLI with `--model sonnet` after competitor cloning, keyword research, and the homepage content-slot map are complete.

Final SEO copy is intentionally generated in the cloned project rather than stored in this template. It depends on the competitor URL, immutable keyword, researched product meaning, and the three user-uploaded brand assets.

## Required generated files

Every clone-first homepage project must contain these files in `.ai-task/` before its copy-polish phase:

| File | Author / stage | Required content |
| --- | --- | --- |
| `writer-input.md` | research-seo-input | sourced keyword/product research, audience, search intent, competitor synthesis and safe claims |
| `content-slot-map.json` | landing-page-implementation | concrete source slots for every visible module, metadata, JSON-LD and media text |
| `seo-development-plan.md` | Claude Sonnet | homepage strategy, module keyword intent, TDK, headings, CTAs, FAQ, alt/caption, OG/Twitter and JSON-LD |
| `seo-copy-map.md` | Claude Sonnet | exact locked copy for all implementation slots |
| `claude-sonnet-run.log` | Claude runner | invocation evidence and CLI output |

If any prerequisite, authentication, Sonnet output, or allowed file scope fails, the runner must write `.ai-task/claude-sonnet-blocker.md`. This is a hard stop: no other writer may substitute for Sonnet and the SEO audit cannot be marked complete.

## Homepage application rules

- The exact primary keyword remains unchanged in the H1 and major H2 positions defined by the copy map.
- `app/layout.tsx`, `site-identity.generated.js`, and `components/seo/HomeStructuredData.tsx` must use the copy map's TDK and schema values.
- Open Graph, Twitter, favicon, logo and share image use only `/logo.webp`, `/favicon.ico`, and `/share-img.png`.
- The final audit must inspect rendered local HTML and score at least 95 before completion.

## Debugging

Run the generated runner from any directory with:

```powershell
node D:\path\to\project\.ai-task\scripts\run-claude-sonnet-writer.mjs
```

The runner resolves the project root from its own file location. Inspect `claude-sonnet-run.log` first; if the run stops, read `claude-sonnet-blocker.md` for the exact reason. Do not create final SEO documents manually as a fallback.
