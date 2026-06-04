# JSON-LD Rules

## Scope

Generate JSON-LD drafts as Markdown content. Do not edit code unless the user explicitly asks for implementation.

Use Google Search Central's structured data Search Gallery as the eligibility reference for rich-result-oriented schema choices:

- https://developers.google.com/search/docs/appearance/structured-data/search-gallery

Google can use structured data to understand page content and make pages eligible for rich search result features, but actual search appearance can vary. Do not imply that adding JSON-LD guarantees a rich result or ranking improvement.

## Recommended Schema Types

Default for most website-template homepages:

- WebSite
- Organization
- WebPage

Add only when the visible homepage content supports it:

- FAQPage
- SoftwareApplication
- BreadcrumbList
- Product
- Service
- HowTo
- VideoObject
- ImageObject

Prefer Google Search Gallery supported rich-result types when they match the website and page content:

- Article: news, sports, or blog article pages, not ordinary SaaS homepages.
- BreadcrumbList: page hierarchy shown in navigation or breadcrumbs.
- Course: educational course listings.
- Dataset: dataset pages.
- Event: scheduled events with time and place.
- FAQPage: visible FAQ sections with matching questions and answers.
- ImageObject: image metadata when the page exposes image ownership, licensing, or creator details.
- LocalBusiness: real local business details such as address, hours, phone, and service area.
- Organization: organization identity, logo, legal name, contact, and identifiers.
- Product: real product details such as price, availability, and review data when provided.
- ProfilePage: person or organization profile pages.
- QAPage: pages where users submit answers to one question; do not use for standard FAQ.
- Recipe: recipe pages.
- ReviewSnippet: real third-party or user review summaries only when review data exists.
- SoftwareApplication: software tools, SaaS products, apps, or web applications.
- VideoObject: visible videos with title, description, thumbnail, upload date, and embed/content URL.

## Counting Rules

Always include a structured data plan table with:

- Schema Type
- Count
- Eligibility
- Purpose
- Source Module
- Needs Confirmation

State the total schema count clearly in Structured Data QA.

Count FAQPage questions separately from schema types.

## Field Rules

- FAQPage questions and answers must match visible FAQ copy.
- Do not add FAQPage if the homepage does not show the same FAQ content to users.
- Do not use Product, ReviewSnippet, or SoftwareApplication ratings unless real rating data is provided.
- Do not create fake ratings, reviews, awards, download counts, customer counts, or usage claims.
- Do not create fake sameAs profiles.
- Do not include offers.price unless a real price is provided.
- Mark unknown URLs, logo paths, organization names, and social profiles as placeholders.
- Use valid JSON only inside JSON code fences. Do not include comments inside JSON.
- Prefer placeholders such as `https://example.com/` only when the real URL is not provided.
- Mark whether each schema is `Google rich-result eligible`, `general schema only`, or `requires confirmation`.

## QA

Check:

- JSON parses as valid JSON.
- Every schema item has a clear purpose.
- Schema count matches the draft.
- FAQ count matches visible FAQ entries.
- Placeholder fields are listed for user confirmation.
- Facts Needed Before Publishing lists every placeholder or unverified fact used by the JSON-LD draft.
- Each rich-result-oriented schema maps to a Google Search Gallery type or is explicitly marked as general schema only.
- No schema is included only because it is possible; it must match visible page content and verified facts.
