---
name: homepage-seo-copywriter
description: Generate English homepage SEO copy packs in Markdown for website templates. Use when drafting or rewriting homepage TDK, SEO brief, keyword map, Hero copy, Features, Explore or Examples, How to Use, FAQ, Footer SEO copy, JSON-LD structured data drafts, keyword-density QA, and anti-generic-AI-copy checks. Requires a primary keyword before generating copy.
---

# Homepage SEO Copywriter

## Scope

Generate English homepage SEO copy packs for website starter templates. Produce Markdown only unless the user explicitly asks for implementation.

Do not edit project files, perform technical SEO fixes, audit a full website, promise rankings, or rely on live keyword metrics unless explicitly requested.

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
12. Run copy, SEO, keyword-density, and structured-data QA.

Use `references/copy-rules.md` for writing and QA rules. Use `references/jsonld-rules.md` when generating structured data.

## Output Format

Return this Markdown structure:

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

## TDK
- Title:
- Description:
- Keywords:

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

## JSON-LD Draft

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
