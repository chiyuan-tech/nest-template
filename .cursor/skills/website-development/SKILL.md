---
name: website-development
description: Enforces Next.js website development standards including metadata requirements, component library usage, and image/link components. Use when creating or updating pages in app/, working with Next.js components, or implementing SEO metadata.
---

# Website Development Standards

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

**REQUIRED**: Pages **SHOULD** include JSON-LD script for SEO. Add a `<script type="application/ld+json">` in the page or layout.

```typescript
// Common types: WebSite, WebPage, Article, Organization
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: string,
  description: string,
  url: string,
  // Add type-specific properties (e.g., Article: datePublished, author)
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

**Type guidelines:**
- **WebSite**: Homepage, include `potentialAction` for SearchAction if applicable
- **WebPage**: General pages
- **Article**: Blog posts, include `datePublished`, `dateModified`, `author`, `image`
- **Organization**: About/contact pages

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
- ✅ JSON-LD structured data included where applicable (WebPage, Article, etc.)
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
