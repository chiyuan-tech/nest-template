# Copy Rules

## TDK

- Title: prefer 50-60 characters when possible.
- Description: prefer 140-160 characters when possible.
- Keywords: list the primary keyword, close variants, and provided long-tail keywords for planning. Do not imply that a meta keywords tag is important for Google.

## Style

Write in clear English for the likely searcher behind the primary keyword. Use concrete outcomes, product actions, and visible user benefits.

Before writing the full copy pack, propose 2-3 Homepage Angle options based on the product, primary keyword, and any reference sites. Mark one recommended option and give a short reason.

Include a Module Order Strategy for the recommended Homepage Angle. Adjust it after the user chooses a different angle.

If conversion goal, tone, or geography are not provided, propose 2-3 concise options for each missing category based on the product, primary keyword, and any reference sites. Mark one recommended option and give a short reason. Do not write the full copy pack until the user chooses, unless they explicitly asked to proceed automatically.

Avoid generic AI-sounding phrases:

- Unlock the power of
- Revolutionize your workflow
- Seamless experience
- Supercharge your productivity
- Game-changing
- Next-level
- Effortlessly create stunning
- In today's fast-paced world
- Whether you're a beginner or a professional
- Say goodbye to
- All-in-one platform

## Keyword Use

- Use the exact primary keyword where it reads naturally.
- Use close variants and plural/singular forms to avoid repetition.
- Do not repeat the same phrase in adjacent sentences.
- Do not sacrifice clarity to hit a keyword-density number.
- Prefer long-tail keywords in FAQ questions, How to Use steps, Explore copy, and Use Cases.
- Blend the primary keyword, close variants, or long-tail keywords into module headings where natural.
- Use the exact primary keyword in only 1-2 important headings; use variants elsewhere.

## Word Count and Keyword Density

- Count only homepage-facing copy, not TDK labels, JSON-LD, QA checklists, or instructions.
- Target around 1000 words for a full homepage draft.
- Use 850-1200 words as the acceptable full-page range.
- Count exact primary keyword phrase occurrences.
- Count close variants separately and list which variants were counted.
- Estimate density as `combined keyword occurrences / total homepage copy word count * 100`.
- Use 4%-4.5% as a reference target, not a hard writing constraint.
- If density is above 5%, revise to reduce repetition.
- If density is below target but the copy reads naturally, keep the natural copy and explain the decision.

## Module Guidance

File Output:

- Save two Markdown files by default.
- Use `docs/seo-copy/homepage-copy-[primary-keyword-slug].md` for TDK, user-facing homepage copy, FAQ, and JSON-LD.
- Use `docs/seo-copy/homepage-seo-notes-[primary-keyword-slug].md` for SEO strategy, word count, keyword density, QA, and publishing notes.
- Do not overwrite existing files without asking.
- In chat, summarize both saved paths and key remaining confirmations instead of pasting the full files.
- Keep the landing-page content file clean: no SEO Brief, Keyword Map, QA, assumptions, or internal notes.

Suggested Setup:

- Include Homepage Angle options before the full copy pack.
- Include a Module Order Strategy for the recommended Homepage Angle.
- Keep option labels short and distinct.
- Recommend one option per category.
- Do not overwhelm the user with more than 3 options per category.

Module Order Strategy:

- Match module order to Homepage Angle and search intent.
- Put proof near the top when the product is visual or example-driven.
- Put How to Use near the top when users likely want to complete a task immediately.
- Put Benefits or Comparison near the top when users are evaluating alternatives.
- Include optional modules only when they are supported by real product facts.
- Reflect the chosen order in the generated copy.

Module Headings:

- Write distinctive section headings instead of generic labels.
- Avoid using `Features`, `Benefits`, `Explore`, `How It Works`, or `FAQ` as the only visible heading.
- Make headings describe the product outcome or user action.
- Keep headings concise enough for landing-page UI.
- Do not force the keyword into every heading.

Reference Site Notes:

- Summarize common positioning, module patterns, terminology, CTA patterns, FAQ topics, and claims to avoid.
- Use references as inspiration only.
- Do not copy sentences, claims, FAQ wording, examples, or proof points.

Hero:

- Lead with the user's desired outcome.
- Keep the H1 and subtitle short.
- Make CTA text action-based.

Features:

- Use 3-6 concise feature blocks.
- Name the capability first, then explain the user value.

Explore / Examples:

- Write around concrete examples, image/video galleries, templates, demos, or outputs.
- Avoid vague claims such as "beautiful results" unless the example shows what is beautiful.

How to Use:

- Use 3-5 steps.
- Start each step with a verb.
- Keep each step short enough for UI cards.

FAQ:

- Use realistic search questions.
- Generate at least 8 FAQ items by default.
- Keep answers concise.
- Include the primary keyword or long-tail variants only when natural.

Footer SEO Copy:

- Summarize the page purpose in 1 short paragraph.
- Include the primary keyword or a close variant.
- Avoid sounding like hidden SEO filler.

Facts Needed Before Publishing:

- List facts needed to replace placeholders or support structured data.
- Include only facts relevant to the generated page.
- Flag missing proof for ratings, reviews, prices, customer counts, awards, and social profiles.

## Copy QA

Check:

- H1 is unique and includes the primary keyword or a natural close variant.
- Hero text is visually short.
- Module headings are distinctive and keyword-aware without stuffing.
- CTA wording matches the conversion goal.
- Homepage Angle is explicit and reflected in module order.
- Module Order Strategy is stated and followed.
- Word count and keyword density are calculated and reported.
- Keyword density is reviewed but not forced.
- No keyword stuffing or repeated unnatural phrasing.
- No unsupported ranking, performance, pricing, review, or usage claims.
- Assumptions are clearly marked when the user asked to proceed without choosing suggested options.
