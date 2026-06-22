---
name: homepage-seo-copywriter
description: Generate English homepage SEO copy packs as Markdown files for website templates. Use when drafting or rewriting homepage TDK, SEO brief, keyword map, Hero copy, Features, Explore or Examples, How to Use, FAQ, Footer SEO copy, JSON-LD structured data drafts, keyword-density QA, and anti-generic-AI-copy checks. Requires a primary keyword before generating copy.
---

# Homepage SEO Copywriter

## Scope

Generate English homepage SEO copy for website starter templates. Save the final output as two Markdown files by default: one landing-page content file with TDK, homepage copy, FAQ, and JSON-LD, and one supporting SEO notes file for strategy, counts, and QA.

Do not edit implementation files, perform technical SEO fixes, audit a full website, promise rankings, or rely on live keyword metrics unless explicitly requested.

## Required Inputs

Before writing the copy, confirm these inputs are available:

- Product or website description
- Primary keyword

If the primary keyword is missing, ask for it before generating the copy.
If the product or website description is missing, ask for it before generating the copy.

Optional inputs:

- Long-tail keywords
- Reference content sites
- Conversion goal
- Desired tone
- Competitors
- Forbidden words or claims
- Brand constraints
- Target geography

If long-tail keywords are missing, proceed without them and mark them as not provided.

Before writing the full copy pack, use the product, primary keyword, and any reference sites to propose 2-3 Homepage Angle options. Recommend one default angle and explain why in one short phrase.

If conversion goal, tone, or geography are missing, propose concise options for the user to choose from before writing the full copy pack. Recommend one default option in each missing category and explain why in one short phrase. If the user explicitly asks to proceed without choosing, use the recommended options and list them as assumptions in the `Inputs` section.

If reference sites are provided, inspect or summarize them only when the user explicitly asks to use them for source information. Use reference sites for structure, positioning, module ideas, terminology, and option suggestions. Do not copy their sentences, claims, FAQ wording, or unique examples.

## Workflow

1. Restate the provided inputs briefly.
2. If reference sites are provided and the user asks to use them, produce Reference Site Notes before suggesting setup options.
3. Propose 2-3 Homepage Angle options, mark one recommended option, and wait for the user's selection unless they asked to proceed automatically.
4. Propose a Module Order Strategy for the recommended Homepage Angle, and adjust it after the user chooses an angle.
5. If conversion goal, tone, or geography are missing, propose 2-3 options for each missing category, mark a recommended option, and wait for the user's selection unless they asked to proceed automatically.
6. Classify search intent and homepage positioning.
7. Create the TDK.
8. Create a keyword map across homepage modules.
9. Write the homepage modules in Markdown using the selected Module Order Strategy.
10. Draft JSON-LD structured data using Google Search Gallery eligibility as the main reference for rich-result-oriented schema choices, and count every schema item clearly.
11. Add Facts Needed Before Publishing.
12. Calculate Word Count and Keyword Density.
13. Run copy, SEO, keyword-density, and structured-data QA.
14. Save the final output as two Markdown files: a copy-only file and a supporting notes file.

Use `references/copy-rules.md` for writing and QA rules. Use `references/jsonld-rules.md` when generating structured data.

## Output Format

Save two Markdown files by default.

The landing-page content file should contain TDK, homepage-facing copy, FAQ, and JSON-LD:

```md
# Homepage Landing Page Content

## TDK
- Title:
- Description:
- Keywords:

## Hero
### H1

### Subtitle

### CTAs
- Primary:
- Secondary:

## [Distinctive Features Heading]

## [Distinctive Explore / Examples Heading]

## [Distinctive How to Use Heading]

## [Distinctive Use Cases / Benefits Heading]

## [Distinctive FAQ Heading]

## Footer SEO Copy

## JSON-LD
```

The supporting notes file should contain SEO strategy, counts, and QA:

```md
# Homepage SEO Copy Pack

## Inputs
- Product:
- Primary Keyword:
- Long-tail Keywords:
- Conversion Goal:
- Tone:
- Reference Sites:
- Assumptions:

## SEO Brief
- Search Intent:
- Page Positioning:
- Primary Message:
- Homepage Angle:
- Module Order Strategy:

## Reference Site Notes
- Common Positioning:
- Useful Module Patterns:
- Useful Terminology:
- Claims To Avoid Copying:

## Keyword Map
| Module | Keyword Usage |
|---|---|

## Hero
### H1

### Subtitle

### CTAs
- Primary:
- Secondary:

## Features

## Explore

## How to Use

## Use Cases / Benefits

## FAQ

## Footer SEO Copy

## JSON-LD Structured Data Plan
| Schema Type | Count | Eligibility | Purpose | Source Module | Needs Confirmation |
|---|---:|---|---|---|---|

## Facts Needed Before Publishing
- Final homepage URL:
- Brand name:
- Organization legal name:
- Logo URL:
- sameAs social profile URLs:
- Pricing or offer details:
- Ratings/reviews:
- App category:
- Video/image URLs:
- Visible FAQ confirmation:

## Copy QA
- H1 includes the primary keyword or a natural close variant:
- Hero length is within limit:
- Module headings are distinctive and use keywords naturally:
- Primary keyword density target checked:
- No keyword stuffing:
- No generic AI phrases:
- CTA is consistent:

## Structured Data QA
- Schema count:
- FAQ count:
- JSON is valid:
- No fake ratings, reviews, awards, or usage claims:
- URLs, logo, price, and sameAs values are confirmed or marked as placeholders:
```

## Homepage Modules

Prefer these modules by default:

- TDK
- SEO Brief
- Keyword Map
- Hero
- Features
- Explore / Examples
- How to Use
- FAQ
- Footer SEO Copy
- JSON-LD Structured Data Plan
- JSON-LD Draft
- Copy QA

Add optional modules only when useful for the website type:

- Use Cases
- Benefits
- Comparison
- Trust / Social Proof
- Pricing CTA

## FAQ Rules

Generate at least 8 FAQ items by default.

Rules:

- Use realistic search questions.
- Include the primary keyword or close variants only where natural.
- Use long-tail keywords in FAQ questions when provided.
- Keep each answer concise, but substantive enough to be useful.
- FAQPage JSON-LD must match the visible FAQ exactly.
- Do not create fake product claims in FAQ answers.

## How to Use Rules

Write the How to Use module as exactly 3 steps by default.

Default step pattern:

1. Upload resources
2. Write the prompt or set parameters
3. Wait, share, or download the result

Adapt the labels to the product, but keep the structure:

- Step 1 should cover uploading, importing, pasting, selecting, or adding the user's input resource.
- Step 2 should cover writing a prompt or setting key parameters such as duration, quality, resolution, style, format, language, or output options.
- Step 3 should cover waiting for generation or processing, then sharing, exporting, saving, or downloading the result.

Keep each step short enough for a UI card. Do not add extra steps unless the user explicitly asks for a more detailed workflow.

## Module Heading Rules

Write distinctive section headings for every homepage module. Blend the primary keyword, close variants, or long-tail keywords into headings where it reads naturally.

Rules:

- Do not use generic headings such as `Features`, `Benefits`, `Explore`, or `How It Works` as the only visible heading unless the surrounding copy adds a stronger SEO phrase.
- Prefer specific headings that communicate the product outcome.
- Use the exact primary keyword in 1-2 important headings only, such as Hero, Explore, FAQ, or Footer SEO Copy.
- Use close variants, action phrases, and long-tail keywords in other module headings.
- Do not force the keyword into every heading.
- Keep headings concise enough for UI sections and cards.

Examples:

- Instead of `Features`, use `AI Background Remover Features Built for Product Photos`.
- Instead of `Explore`, use `Explore Clean Product Cutouts and Background Edits`.
- Instead of `How to Use`, use `How to Remove Image Backgrounds in Three Steps`.
- Instead of `FAQ`, use `AI Background Remover Questions, Answered`.

## File Output

Save two Markdown files by default:

```text
docs/seo-copy/homepage-copy-[primary-keyword-slug].md
docs/seo-copy/homepage-seo-notes-[primary-keyword-slug].md
```

Create `docs/seo-copy/` if it does not exist.

Filename rules:

- Convert the primary keyword to lowercase kebab case.
- Remove punctuation that is unsafe for filenames.
- Keep the filename concise.
- Do not overwrite existing files without asking.

If the user provides a specific output path, use that path instead if it is inside the current workspace.

The landing-page content file should contain TDK, user-facing homepage copy, visible FAQ, and JSON-LD. Do not include SEO Brief, Keyword Map, word-count calculations, QA, assumptions, or publishing notes in the landing-page content file.

The notes file should contain:

- Inputs and assumptions
- SEO Brief
- Reference Site Notes
- Keyword Map
- Word Count & Keyword Density
- JSON-LD Structured Data Plan
- Facts Needed Before Publishing
- Copy QA
- Structured Data QA

After saving, summarize both output paths and any facts that still need confirmation. Do not paste the full file contents into chat unless the user asks.

## Homepage Angle

Always suggest a Homepage Angle before writing the full copy pack, unless the user already provided one.

Common angles:

- Tool-first: prioritize immediate action, upload, generation, search, or conversion.
- Example-first: prioritize visual outputs, demos, gallery, templates, or before/after examples.
- Use-case-first: prioritize practical scenarios and workflows.
- Comparison-first: prioritize why this product is better than an old workflow or alternative.
- Template-gallery: prioritize reusable templates, examples, or downloadable assets.
- Trust-first: prioritize credibility, compliance, reliability, or business proof.

Use the primary keyword to infer intent. For example, task keywords usually fit Tool-first, visual generation keywords often fit Example-first, and "best" or "alternative" keywords often fit Comparison-first.

Output setup suggestions in this format before the full copy pack:

```md
## Suggested Setup

### Homepage Angle
1. Tool-first (Recommended) - the keyword suggests users want to complete a task immediately.
2. Example-first - useful if generated outputs are the strongest proof.
3. Use-case-first - useful if the product serves several workflows.

### Module Order Strategy
- Recommended:
- Why:

### Conversion Goal
...

### Tone
...

### Target Geography
...
```

## Reference Site Notes

If reference sites are provided and the user asks to use them, summarize them before suggesting setup options:

- Common positioning
- Useful module patterns
- Useful terminology
- CTA patterns
- FAQ topics
- Claims to avoid copying

Use reference sites for structure, positioning, and terminology only. Do not copy wording, claims, examples, reviews, or FAQ text.

## Module Order Strategy

Choose module order from the selected Homepage Angle and search intent. The final homepage copy should follow the chosen order unless there is a clear reason to change it.

Recommended defaults:

- Tool-first: Hero -> Explore / Examples -> How to Use -> Features -> Use Cases / Benefits -> FAQ -> Footer SEO Copy
- Example-first: Hero -> Explore / Examples -> Features -> Use Cases / Benefits -> How to Use -> FAQ -> Footer SEO Copy
- Use-case-first: Hero -> Use Cases / Benefits -> Explore / Examples -> Features -> How to Use -> FAQ -> Footer SEO Copy
- Comparison-first: Hero -> Benefits -> Comparison -> Features -> Explore / Examples -> FAQ -> Footer SEO Copy
- Template-gallery: Hero -> Explore / Examples -> Use Cases / Benefits -> Features -> How to Use -> FAQ -> Footer SEO Copy
- Trust-first: Hero -> Trust / Social Proof -> Features -> Use Cases / Benefits -> How to Use -> FAQ -> Footer SEO Copy

If the chosen order includes an optional module such as Comparison or Trust / Social Proof, include it only when the product facts support it. Otherwise replace it with Features or Use Cases / Benefits.

In the SEO Brief, state the selected Module Order Strategy and one short reason.

## Facts Needed Before Publishing

Always include a final checklist of facts that need confirmation before publishing. Include only facts relevant to the generated copy and JSON-LD draft.

Common items:

- Final homepage URL
- Brand name
- Organization legal name
- Logo URL
- sameAs social profile URLs
- Pricing or offer details
- Real ratings or reviews
- App category for SoftwareApplication schema
- Product/service availability
- Video thumbnail, upload date, and embed/content URLs
- Image creator, license, or source URLs
- FAQ list confirmed as visible on the page

## Hero Rules

Keep Hero copy short enough to fit a polished landing page:

- H1: 6-12 words preferred, 16 words maximum.
- Subtitle: 18-32 words preferred, 45 words maximum.
- H1 should fit one or two lines in a normal homepage hero.
- Do not explain the whole product in the Hero.
- Use one primary CTA and optionally one secondary CTA.
- Do not repeat the primary keyword more than once in the Hero.
- Avoid dense keyword placement in the first viewport.

## Keyword Density

Target roughly 1000 words of total homepage copy when the user wants a full page draft.

Use 4%-4.5% as a QA reference for the primary keyword plus natural close variants. Do not force this target if it makes the copy repetitive or unnatural. Natural language, search intent, and conversion clarity take priority over density.

## Word Count and Keyword Density Check

Before saving the final Markdown file, calculate and include a `Word Count & Keyword Density` section.

Count only homepage-facing copy sections, not metadata labels, JSON-LD code, QA checklists, or instructions. Include Hero, Features, Explore / Examples, How to Use, Use Cases / Benefits, FAQ, Footer SEO Copy, and any optional visible modules.

Calculate:

- Total homepage copy word count
- Exact primary keyword phrase occurrences
- Close variant keywords counted
- Close variant occurrences
- Combined keyword occurrences
- Estimated keyword density
- Density decision

Formula:

```text
estimated keyword density = combined keyword occurrences / total homepage copy word count * 100
```

Targets:

- Full page word count: around 1000 words.
- Acceptable full page range: 850-1200 words.
- Keyword density reference target: 4%-4.5%.
- If natural copy lands below target, prefer natural copy over stuffing.
- If density is above 5%, revise to reduce repetition.

Counting rules:

- Count exact primary keyword as phrase occurrences, not individual words.
- Count close variants only when they are semantically equivalent or clearly search-relevant.
- List the close variants that were counted.
- Treat the density value as an estimate, not a ranking promise.
- If the selected module order or compact page style makes 850-1200 words inappropriate, state the reason in `Density Decision`.

Include the primary keyword or a natural close variant in:

- SEO Title
- Meta Description
- H1
- Hero subtitle or first-screen copy
- At least one FAQ question or answer
- Footer SEO copy or closing module

Place long-tail keywords mainly in FAQ, How to Use, Use Cases, and Explore sections.

## Reference Sites

If the user provides content sites for inspiration, use them only for structure, tone, section ideas, and search-intent clues. Do not copy sentences, claims, FAQ wording, examples, or unique positioning.
