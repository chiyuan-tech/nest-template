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

If conversion goal, tone, or geography are missing, use the product, primary keyword, and any reference sites to propose concise options for the user to choose from before writing the full copy pack. Recommend one default option in each missing category and explain why in one short phrase. If the user explicitly asks to proceed without choosing, use the recommended options and list them as assumptions in the `Inputs` section.

If reference sites are provided, inspect or summarize them only when the user explicitly asks to use them for source information. Use reference sites for structure, positioning, module ideas, terminology, and option suggestions. Do not copy their sentences, claims, FAQ wording, or unique examples.

## Workflow

1. Restate the provided inputs briefly.
2. If conversion goal, tone, or geography are missing, propose 2-3 options for each missing category, mark a recommended option, and wait for the user's selection unless they asked to proceed automatically.
3. Classify search intent and homepage positioning.
4. Create the TDK.
5. Create a keyword map across homepage modules.
6. Write the homepage modules in Markdown.
7. Draft JSON-LD structured data using Google Search Gallery eligibility as the main reference for rich-result-oriented schema choices, and count every schema item clearly.
8. Run copy, SEO, keyword-density, and structured-data QA.

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
