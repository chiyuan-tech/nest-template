---
name: seo-metadata-tdk-check
description: Validates SEO metadata and TDK (Title, Description, Keywords) requirements for Next.js pages. Use when creating or updating pages in app/ and checking metadata compliance.
---

# SEO Metadata TDK Check Standards

## Metadata Requirements

All pages in `app/` **MUST** export a `metadata` object, except:
- `app/profile` - User profile page (excluded)
- `app/sso-callback` - SSO callback page (excluded)
- `app/share` - share Page (excluded)

### Required Metadata Structure

**CRITICAL**: All TDK (Title, Description, Keywords) fields must comply with character limits:
- **Title (T)**: ≤ 60 characters
- **Description (D)**: ≤ 160 characters
- **Keywords (K)**: < 100 characters (total length of all keywords combined)

**TDK source (required):**
- Each page **MUST** use TDK from `@/website-config`: import `getPageTdk(path)` or `pageTdk` and use the returned `title`, `description`, and `keywords` for `metadata` (and for `openGraph` / `twitter` title and description). Do not hardcode TDK in the page; define and maintain it in `website-config.js` → `pageTdk`.

```typescript
import { getPageTdk, SITE_NAME, siteUrl, websiteConfig } from '@/website-config';

const tdk = getPageTdk('/your-path');  // e.g. getPageTdk('/'), getPageTdk('/pricing')

export const metadata: Metadata = {
  title: tdk.title,                  // ≤ 60 characters (from pageTdk)
  description: tdk.description,       // ≤ 160 characters (from pageTdk)
  keywords: tdk.keywords,             // total < 100 characters (from pageTdk)
  robots: {
    index: boolean,
    follow: boolean,
    googleBot: {
      index: boolean,
      follow: boolean,
      'max-video-preview': number,
      'max-image-preview': string,
      'max-snippet': number,
    },
  },
  alternates: {
    canonical: string,              // Canonical URL
  },
  openGraph: {
    title: string,
    description: string,
    url: string,
    siteName: string,
    images: Array<{
      url: string,                    // Use `${siteUrl}/share-img.png` for default
      width: number,
      height: number,
      alt: string,
    }>,
    locale: string,
    type: string,
  },
  twitter: {
    card: string,
    site: string,
    title: string,
    description: string,
    images: string[],                // Use `${siteUrl}/share-img.png` for default
  },
};
```

### JSON-LD Structured Data

**REQUIRED**: Pages **SHOULD** include JSON-LD script for SEO. Add a `<script type="application/ld+json">` in the page or layout (or a single script with `@graph`).

```typescript
// Example: one entity
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: string,
  description: string,
  url: string,
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

#### Global constraints (all types)

- **`@context`**: Use `"https://schema.org"` unless you intentionally combine multiple vocabularies.
- **`@type`**: String or array (e.g. `['Article', 'BlogPosting']`). Pick the most specific type that matches the visible content.
- **URLs**: Use absolute URLs from `@/website-config` (`websiteConfig.canonical.url` / `siteUrl`) for `url`, `image`, `@id`, `item` in breadcrumbs, etc.
- **Content parity**: FAQ, HowTo, Review, `aggregateRating`, and offers must **match what users see** on the page; do not invent ratings or steps.
- **Multiple entities**: Either multiple `<script type="application/ld+json">` blocks or one object with `@graph: [...]`. Avoid duplicate `@id` for different things.
- **Testing**: Google’s Rich Results Test lists only some types as “rich result” candidates; other types may still be valid for Google and should validate in Schema.org / URL Inspection.

#### Types, fields, and constraints

| `@type` | When to use | Required / strongly recommended | Optional but common | Notes |
|--------|-------------|----------------------------------|----------------------|--------|
| **WebSite** | Site-wide; usually homepage | `name`, `url` | `description`, `publisher` (Organization), `inLanguage`, `potentialAction` (SearchAction) | SearchAction needs `target` (URL template with `{search_term_string}`) and `query-input` |
| **Organization** | Brand / legal entity | `name`, `url` | `description`, `logo` (`ImageObject` with `url`), `sameAs`, `contactPoint` | `logo` should be stable URL; prefer HTTPS |
| **WebPage** | Any HTML page | `name`, `url` | `description`, `isPartOf` (WebSite), `inLanguage`, `breadcrumb` (BreadcrumbList), `primaryImageOfPage`, `@id` | Inherits from CreativeWork; align `name` with `<title>` / H1 where sensible |
| **FAQPage** | Page whose main content is Q&A | `mainEntity`: array of **Question** | `name`, `description`, `url` on FAQPage itself | Each **Question** needs `name` + `acceptedAnswer` → **Answer** with `text`. Must mirror on-page FAQ copy. |
| **Question** | Inside `FAQPage.mainEntity` | `name`, `acceptedAnswer` | — | `name` = question string; **Answer** must use `@type: 'Answer'` and `text` |
| **HowTo** | Step-by-step instructions shown on page | `name`, `step` (array of **HowToStep**) | `description`, `totalTime` (ISO 8601 duration, e.g. `PT15M`), `image` (ImageObject or URL), `url` | For Google HowTo rich results, include `image` and clear steps; each **HowToStep** should have `position` (number) and `name` and/or `text` |
| **HowToStep** | Child of HowTo | `name` or `text` (or both) | `position`, `url`, `image` | Order `position` 1..n |
| **Article** / **BlogPosting** | Blog posts / news | `headline`, `author`, `datePublished`, `image` | `dateModified`, `description`, `publisher` (Organization), `mainEntityOfPage`, `inLanguage` | Dates in ISO 8601; `author` = Person or Organization with `name`; `image` URL(s) absolute |
| **CollectionPage** | Index listing (e.g. blog index) | `name`, `url` | `description`, `isPartOf` (WebSite) | Optionally add `hasPart` / `ItemList` if listing URLs are stable |
| **BreadcrumbList** | Visible breadcrumb trail | `itemListElement` (ListItem[]) | — | Each **ListItem**: `position` (1-based), `name`, `item` (URL). Must match UI order. |
| **SoftwareApplication** | Desktop/mobile app or SaaS product | `name` | `applicationCategory`, `operatingSystem`, `url`, `description`, `offers` (Offer), `aggregateRating` | **aggregateRating** only if real user ratings exist: **AggregateRating** with `ratingValue`, `bestRating`, `worstRating`, and `ratingCount` and/or `reviewCount` |
| **WebApplication** | Browser-only app | Same spirit as SoftwareApplication; `operatingSystem` often “Web” or “Web Browser” | `offers`, `aggregateRating` | Same honesty rules for ratings |
| **Review** | Editorial or user review of a product | `itemReviewed`, `reviewRating` (**Rating**), `author` | `reviewBody`, `datePublished`, `url` | **Rating**: `ratingValue`, `bestRating`, `worstRating` (numeric strings allowed) |
| **Product** | Physical/digital product with offer | `name` | `image`, `description`, `brand`, `offers` (with `price`, `priceCurrency`, `availability`) | Prefer schema.org `Offer`/`AggregateOffer` patterns; prices must match page |

#### Nested types (reuse patterns)

- **ImageObject**: `@type: 'ImageObject'`, `url`, and when known `width`, `height`.
- **Offer** (under Product / SoftwareApplication): `@type: 'Offer'`, `price` (string or number per docs), `priceCurrency` (ISO 4217), `availability` (e.g. `https://schema.org/InStock`), `url` to purchase.
- **AggregateRating**: `@type: 'AggregateRating'`, `ratingValue`, `bestRating`, `worstRating`, `ratingCount` and/or `reviewCount`.
- **Rating** (single review): `@type: 'Rating'`, `ratingValue`, `bestRating`, `worstRating`.

#### Homepage JSON-LD priority (**CRITICAL**)

On **`/` (homepage)**, the following types are **highest priority** — implement them whenever the page has matching visible content (product/tool, how-to steps, FAQ). Do **not** treat them as optional extras:

1. **`SoftwareApplication`** (or **`WebApplication`** if browser-only) — describes the product/service; include `applicationCategory`, `operatingSystem`, `url`, `offers` (if applicable), and `aggregateRating` only when authentic.
2. **`HowTo`** — mirrors the on-page “how to use” / steps section; include `step` (HowToStep array) with `position`, `name` and/or `text`, `image` on HowTo when possible, `totalTime` if appropriate.
3. **`FAQPage`** — mirrors the on-page FAQ; `mainEntity` must match visible Q&A; set `name`, `description`, `url` on the FAQPage node (e.g. `/#faq`).

**Lower priority on home (still recommended):** `WebSite`, `Organization`, `WebPage` — add for site graph and page identity after the three above are satisfied.

Order in HTML: priority is **logical**, not render order; multiple `<script type="application/ld+json">` blocks or one `@graph` are both fine.

#### Homepage / layout composition (typical)

- **Home**: **Required priority:** `SoftwareApplication` or `WebApplication`, `HowTo` (if steps section exists), `FAQPage` (if FAQ section exists). **Also include:** `WebSite`, `Organization`, `WebPage` — each as separate script or `@graph`.
- **Article**: `Article` or `BlogPosting` + optional `BreadcrumbList`.
- **Pricing**: `WebPage` + `SoftwareApplication` (or `Product`) + `FAQPage` if pricing FAQ exists + `BreadcrumbList`.

### Canonical URL

**REQUIRED**: Canonical URL must use the value from `@/website-config`:

```typescript
import { websiteConfig } from '@/website-config';

// In metadata.alternates.canonical
alternates: {
  canonical: `${websiteConfig.canonical.url}${pathname}`,
},

// For OpenGraph url
openGraph: {
  url: `${websiteConfig.canonical.url}/your-page-path`,
  // ...
},
```

- Use `websiteConfig.canonical.url` or `siteUrl` (they are the same; `siteUrl` is an alias)
- Do NOT hardcode URLs — all public URLs come from `@/website-config`
- Sitemap, metadata alternates, OpenGraph, and share images use the same base URL

### Share Image Path

**IMPORTANT**: Default share image path:
- Path: `/share-img.png`
- Full URL: `${siteUrl}/share-img.png` or `${websiteConfig.canonical.url}/share-img.png` (import from `@/website-config`)

### Validation Checklist

When creating or updating pages:
- ✅ `metadata` is exported (except profile, sso-callback, and share pages)
- ✅ **TDK is taken from `@/website-config`** (`getPageTdk(path)` or `pageTdk[path]`), not hardcoded in the page
- ✅ Title length ≤ 60 characters
- ✅ Description length ≤ 160 characters
- ✅ Keywords total length < 100 characters
- ✅ New or changed TDK is added/updated in `website-config.js` → `pageTdk`
- ✅ Canonical URL uses `websiteConfig.canonical.url` from `@/website-config`
- ✅ JSON-LD included where applicable; types and fields follow **JSON-LD Structured Data** (global constraints + per-`@type` table); ratings/FAQ/HowTo match visible content
- ✅ **Homepage (`/`)**: `SoftwareApplication` (or `WebApplication`), `HowTo`, and `FAQPage` per **Homepage JSON-LD priority** when content exists — not optional
- ✅ Share images use `/share-img.png` path
- ✅ URLs use correct site URL from `@/website-config`

## Component Library Priority

**CRITICAL**: Always prioritize shadcn/ui components over custom implementations.

### shadcn/ui Components

**REQUIRED**: Use shadcn/ui components when available:

```typescript
// ✅ Correct - Use shadcn components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// ❌ Incorrect - Custom implementation when shadcn component exists
<button className="px-4 py-2 bg-blue-500">Click me</button>
```

**Available Components:**
- `Button`, `Dialog`/`Sheet`, `Input`/`Textarea`, `Card`, `DropdownMenu`
- `Toast`/`Alert`, `Avatar`, `Badge`, `Checkbox`, and others in `components/ui/`

**Rules:**
- ✅ Check `components/ui/` directory first
- ✅ Use shadcn components with theme-aware styling
- ✅ Extend shadcn components when needed, don't replace them
- ✅ Use `cn()` utility to merge Tailwind classes

### Adding New shadcn Components

```bash
npx shadcn@latest add [component-name]
```

## Image and Link Components

**CRITICAL**: All images and links must use Next.js optimized components.

### Image Component

**REQUIRED**: Always use Next.js `Image` component:

```typescript
import Image from 'next/image';

// ✅ Correct
<Image 
  src="/logo.png" 
  alt="Logo" 
  width={100} 
  height={100}
  loading="lazy"
/>

// ❌ Incorrect
<img src="/logo.png" alt="Logo" />
```

**Rules:**
- ✅ Always import `Image` from `next/image`
- ✅ Always provide `width` and `height` (or use `fill` for responsive)
- ✅ Always provide `alt` text
- ✅ Use `loading="lazy"` for below-the-fold images
- ✅ Use `priority` prop for above-the-fold images

### Link Component

**REQUIRED**: Always use Next.js `Link` component for internal navigation:

```typescript
import Link from 'next/link';

// ✅ Correct
<Link href="/about" prefetch={false}>
  About Us
</Link>

// ❌ Incorrect
<a href="/about">About Us</a>
```

**Rules:**
- ✅ Always import `Link` from `next/link`
- ✅ **`prefetch` defaults to `false`** - Only set `prefetch={true}` for critical paths
- ✅ Use HTML `<a>` tag only for external links (with `target="_blank"` and `rel="noopener noreferrer"`)
