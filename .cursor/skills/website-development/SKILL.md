---
name: website-development
description: Enforces Next.js website development standards including metadata requirements, component library usage, image/link components, and CSS styling guidelines. Use when creating or updating pages in app/, working with Next.js components, styling pages, or implementing SEO metadata.
---

# Website Development Standards

## Metadata Requirements

All pages in `app/` **MUST** export a `metadata` object, except:
- `app/profile` - User profile page (excluded)
- `app/sso-callback` - SSO callback page (excluded)

### Required Metadata Structure

**CRITICAL**: All TDK (Title, Description, Keywords) fields must comply with character limits:
- **Title (T)**: ≤ 60 characters
- **Description (D)**: ≤ 160 characters
- **Keywords (K)**: < 100 characters (total length of all keywords combined)

```typescript
export const metadata: Metadata = {
  title: string,                    // ≤ 60 characters
  description: string,              // ≤ 160 characters
  keywords: string[],               // total < 100 characters
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

### Share Image Path

**IMPORTANT**: Default share image path:
- Path: `/share-img.png`
- Full URL: `${siteUrl}/share-img.png` (import `siteUrl` from `@/website-config`)

### Validation Checklist

When creating or updating pages:
- ✅ `metadata` is exported (except profile and sso-callback pages)
- ✅ Title length ≤ 60 characters
- ✅ Description length ≤ 160 characters
- ✅ Keywords total length < 100 characters
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

## CSS and Styling Guidelines

**CRITICAL**: Follow consistent CSS class naming and spacing conventions.

### Container and Layout Classes

**REQUIRED**: Use standard container classes:

```typescript
// ✅ Correct
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="max-w-4xl mx-auto px-6">
<div className="container mx-auto max-w-4xl">

// ❌ Incorrect
<div className="max-w-1200 mx-auto">
<div className="w-full max-w-custom">
```

**Standard Max-Width Classes:**
- `max-w-7xl` - Main content containers (1280px)
- `max-w-4xl` - Article/content pages (896px)
- `max-w-2xl` - Narrow content (672px)
- `max-w-xl` - Very narrow content (576px)

**Standard Padding Classes:**
- `px-4 sm:px-6 lg:px-8` - Standard horizontal padding (responsive)
- `px-6` - Standard horizontal padding
- `py-12` - Standard vertical padding (48px)
- `py-16` - Large vertical padding (64px)
- `p-8 md:p-12` - Card/content padding (responsive)

### Spacing and Layout Patterns

**REQUIRED**: Use consistent spacing patterns:

```typescript
// ✅ Correct - Standard page layout
<div className="min-h-screen flex flex-col bg-background">
  <main className="flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Content */}
    </div>
  </main>
</div>

// ✅ Correct - Page layout with card styling
<article className="prose prose-xl lg:prose-2xl max-w-none dark:prose-invert bg-card p-8 md:p-12 rounded-2xl shadow-custom">
```

**Standard Spacing Values:**
- Vertical padding: `py-12`, `py-16`, `py-24`
- Horizontal padding: `px-4 sm:px-6 lg:px-8`, `px-6`
- Content padding: `p-8 md:p-12`
- Margins: `mb-4`, `mb-6`, `mb-8`, `mb-10`, `mt-10`

### Typography Classes

**REQUIRED**: Use consistent typography classes:

```typescript
// ✅ Correct
<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
<h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
<p className="text-base md:text-lg text-muted-foreground">
```

**Standard Typography:**
- H1: `text-3xl md:text-4xl font-bold`
- H2: `text-2xl md:text-3xl font-semibold`
- Body: `text-base md:text-lg`
- Small: `text-sm`, `text-xs`

### Color Classes

**REQUIRED**: Always use theme-aware color classes:

```typescript
// ✅ Correct - Theme colors
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="text-muted-foreground"
className="text-primary"

// ❌ Incorrect - Hardcoded colors
className="bg-white text-black"
className="text-gray-600"
```

**Standard Color Classes:**
- Background: `bg-background`, `bg-card`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Borders: `border-border`

### Validation Checklist

When styling pages:
- ✅ Use `max-w-7xl` or `max-w-4xl` for containers
- ✅ Use `py-12` or `py-16` for vertical padding
- ✅ Use `px-4 sm:px-6 lg:px-8` for responsive horizontal padding
- ✅ Use theme color classes (`bg-background`, `text-foreground`, etc.)
- ✅ Use consistent typography classes
- ✅ Use `min-h-screen flex flex-col` for full-page layouts
- ✅ Use `flex-grow` for main content areas
