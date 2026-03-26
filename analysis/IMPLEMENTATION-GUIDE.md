# Implementation Guide: Fix Indexation Crisis

## Overview
This guide provides exact code changes needed to fix the indexation crisis identified in INDEXATION-CRISIS-REPORT.md

**Timeline**: 2-4 hours implementation + 24-48 hours monitoring

---

## STEP 1: Create Canonical URL Helper Function

### File: `lib/get-canonical-url.ts` (NEW)

```typescript
/**
 * Generate canonical URL for a page
 * Ensures every page has a locale-specific canonical URL
 * Prevents Google from treating localized pages as duplicates
 */

export function getCanonicalUrl(
  locale: string | undefined,
  pathname: string = "/"
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"

  // Ensure locale is provided
  if (!locale) {
    return `${baseUrl}${pathname}`
  }

  // Homepage
  if (pathname === "/" || pathname === "") {
    return `${baseUrl}/${locale}`
  }

  // All other pages: include locale + pathname
  return `${baseUrl}/${locale}${pathname}`
}

/**
 * Validate canonical URL (for testing)
 */
export function validateCanonicalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // Must be HTTPS
    if (urlObj.protocol !== "https:") return false
    // Must have locale in path
    const parts = urlObj.pathname.split("/").filter(Boolean)
    if (!parts.length) return false
    // First part should be locale (en, uk, ru)
    const validLocales = ["en", "uk", "ru"]
    return validLocales.includes(parts[0])
  } catch {
    return false
  }
}
```

---

## STEP 2: Update Root Layout Canonical Configuration

### File: `app/layout.tsx`

**Current problematic code** (around line 40-60):
```typescript
// WRONG: All pages point to root
const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Streater Sneakers",
  description: "Online sneaker store",
  // ...
  alternates: {
    canonical: siteUrl, // ❌ WRONG: Points to root, not locale-specific
  },
}
```

**Replace with**:
```typescript
import { getCanonicalUrl } from "@/lib/get-canonical-url"

// In the root layout, we can't know the pathname at metadata generation
// So we'll use middleware-level metadata in [locale]/layout.tsx instead
// Root layout should NOT set canonical - children layouts will

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Streater Sneakers",
  description: "Online sneaker store",
  // ... other metadata
  // NO canonical in root - will be set in [locale] layouts
}
```

---

## STEP 3: Update Locale Layout Canonical Configuration

### File: `app/[locale]/layout.tsx`

**Current code** (find and replace):
```typescript
// WRONG: Points to root
const metadata: Metadata = {
  title: dictionary.common.storeName,
  description: dictionary.common.storeDescription,
  alternates: {
    canonical: siteUrl, // ❌ WRONG
  },
}
```

**Replace with**:
```typescript
import { getCanonicalUrl } from "@/lib/get-canonical-url"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params
  const locale = resolvedParams.locale

  return (
    <html lang={locale} dir={getDirFromLocale(locale)}>
      <head>
        {/* Canonical URL: homepage for this locale */}
        <link rel="canonical" href={getCanonicalUrl(locale, "/")} />
        
        {/* Hreflang links to other locale versions */}
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl("en", "/")} />
        <link rel="alternate" hrefLang="uk" href={getCanonicalUrl("uk", "/")} />
        <link rel="alternate" hrefLang="ru" href={getCanonicalUrl("ru", "/")} />
        <link rel="alternate" hrefLang="x-default" href="https://sneakerportfolio.me/en" />
      </head>
      <body>
        {/* ... rest of layout */}
      </body>
    </html>
  )
}
```

---

## STEP 4: Update Product Page Metadata

### File: `app/[locale]/product/[id]/page.tsx`

**Find the metadata export** (if exists) or add:
```typescript
import { getCanonicalUrl } from "@/lib/get-canonical-url"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; id: string }> }
): Promise<Metadata> {
  const { locale, id } = await params
  
  const product = await fetchProduct(id) // Your existing fetch function

  return {
    title: `${product.name} | Streater Sneakers`,
    description: product.description,
    alternates: {
      canonical: getCanonicalUrl(locale, `/product/${id}`), // ✅ CORRECT
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: getCanonicalUrl(locale, `/product/${id}`), // ✅ CORRECT
      images: [{ url: product.imageUrl }],
      type: "product",
    },
  }
}
```

---

## STEP 5: Update All Category/Collection Pages

### Pattern for: `app/[locale]/[page]/page.tsx`

Apply to these routes:
- `/accessories`
- `/collections`
- `/men`
- `/women`
- `/trends`
- `/help-center`
- `/contact`
- `/returns`
- `/store-locator`
- `/privacy-policy`
- `/terms-conditions`
- `/terms-of-use`

**Template change**:
```typescript
import { getCanonicalUrl } from "@/lib/get-canonical-url"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const pathname = "/" + pathname_for_this_page // e.g., "/accessories"

  return {
    title: "Page Title",
    description: "Page description",
    alternates: {
      canonical: getCanonicalUrl(locale, pathname), // ✅ Locale-specific
    },
  }
}
```

---

## STEP 6: Update Sitemap to Include All Locales + Hreflang

### File: `app/sitemap.ts`

**Current issue**: Only generates English routes. Product pages missing hreflang.

**Replace entire file with**:
```typescript
import type { MetadataRoute } from "next"
import { collectionsMeta } from "@/lib/storefront-types"
import { getStoreProducts } from "@/lib/server/storefront"
import { locales } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sneakerportfolio.me"
type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Define all static routes
  const staticRoutePaths = [
    "",
    "/trends",
    "/collections",
    "/men",
    "/women",
    "/accessories",
    "/contact",
    "/returns",
    "/store-locator",
    "/help-center",
    "/help/pagination",
    "/privacy-policy",
    "/terms-conditions",
    "/terms-of-use",
    "/receivers-amplifiers",
  ]

  // Get products
  let products: Awaited<ReturnType<typeof getStoreProducts>>
  try {
    products = await getStoreProducts()
  } catch {
    products = []
  }

  // Generate entries for ALL LOCALES (not just English + uk/ru)
  const sitemapEntries: MetadataRoute.Sitemap = []

  // For each locale, generate static routes
  for (const locale of locales) {
    for (const path of staticRoutePaths) {
      const changeFrequency: ChangeFrequency =
        path === "" || path === "/trends" ? "daily" : "weekly"
      const url = path === "" ? `${siteUrl}/${locale}` : `${siteUrl}/${locale}${path}`

      // Create variant links for hreflang
      const links = locales.map((l) => ({
        rel: "alternate" as const,
        hrefLang: l,
        href: path === "" ? `${siteUrl}/${l}` : `${siteUrl}/${l}${path}`,
      }))

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency,
        priority: path === "" ? 1.0 : 0.7,
        links, // Add hreflang links
      })
    }

    // Collections for each locale
    for (const slug of Object.keys(collectionsMeta)) {
      const url = `${siteUrl}/${locale}/collection/${slug}`

      const links = locales.map((l) => ({
        rel: "alternate" as const,
        hrefLang: l,
        href: `${siteUrl}/${l}/collection/${slug}`,
      }))

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        links,
      })
    }

    // Products for each locale
    for (const product of products) {
      const url = `${siteUrl}/${locale}/product/${product.id}`

      const links = locales.map((l) => ({
        rel: "alternate" as const,
        hrefLang: l,
        href: `${siteUrl}/${l}/product/${product.id}`,
      }))

      sitemapEntries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
        links,
      })
    }
  }

  return sitemapEntries
}
```

**Result**: Sitemap will now contain:
- ✅ All 3 locale variants of all static routes (15 routes × 3 locales = 45 entries)
- ✅ All 3 locale variants of collections (3 collections × 3 locales = 9 entries)
- ✅ All 3 locale variants of products (6 products × 3 locales = 18 entries)
- ✅ Hreflang links for each URL pointing to all locale variants
- **Total**: ~72+ entries (vs current ~30)

---

## STEP 7: Verify robots.txt is Correct

### File: `app/robots.ts` (CHECK - may be OK)

Verify it allows all public pages, blocks only private/admin pages:
```typescript
rules: [
  {
    userAgent: "*",
    allow: "/",
    disallow: [
      "/api/",
      "/admin/",
      "/account/",
      "/checkout/",
      "/cart/",
      "/favorites/",
      "/_next/",
    ],
  },
]
```

✅ This looks correct - allows all public pages

---

## DEPLOYMENT CHECKLIST

Before deploying:

- [ ] Created `lib/get-canonical-url.ts`
- [ ] Updated `app/layout.tsx` - removed root canonical declaration
- [ ] Updated `app/[locale]/layout.tsx` - added locale canonical + hreflang
- [ ] Updated all category page metadata - using `getCanonicalUrl()`
- [ ] Updated product page metadata - using `getCanonicalUrl()`
- [ ] Updated `app/sitemap.ts` - includes all 3 locales + hreflang
- [ ] Verified `robots.txt` allows crawling
- [ ] Build successful: `npm run build`
- [ ] No TypeScript errors
- [ ] 120/120 pages generated

### Build & Deploy Commands

```bash
# Build locally
npm run build

# If successful, commit changes
git add -A
git commit -m "fix: correct canonical URLs and add hreflang for all 120 pages

- Create lib/get-canonical-url.ts utility function
- Update app/layout.tsx to not set root canonical
- Update app/[locale]/layout.tsx with locale canonical + hreflang
- Update all category pages to use locale-specific canonical
- Update product pages to use locale-specific canonical
- Completely rewrite sitemap.ts to include all 3 locale variants
- Add hreflang links to all sitemap entries for language variants

This fixes critical indexation issue where only 2 pages were indexed.
Canonical URL confusion was preventing Google from indexing 118 pages.

Expected result: All 120 pages become indexable, GSC coverage increases
from 1.7% (2 pages) to 100% (120 pages) over 48-72 hours."

# Deploy to production
git push origin main
```

---

## POST-DEPLOYMENT MONITORING

### Immediately After Deploy (0-1 hour)

1. **Verify build succeeded**:
   - npm run build completes
   - 120/120 pages generated
   - 0 TypeScript errors

2. **Test canonical URLs locally**:
   ```bash
   curl -I https://sneakerportfolio.me/en/accessories | grep canonical
   # Should show: link rel="canonical" href="https://sneakerportfolio.me/en/accessories"
   ```

3. **Verify sitemap**:
   - Visit `https://sneakerportfolio.me/sitemap.xml`
   - Should now contain 72+ entries (was ~30)
   - Each entry should have `<xhtml:link>` tags for hreflang

### 24 Hours After Deploy

1. **Check Google Search Console**:
   - Go to https://search.google.com/search-console
   - Select property: `https://sneakerportfolio.me`
   - Check "Sitemaps" section
   - Click sitemap to refresh

2. **Monitor Coverage**:
   - Should see increase in pages crawled/indexed
   - May take 24-48 hours for full update

3. **URL Inspection**:
   - Inspect a product page: `/en/product/cmm3vt32e0000evpam5xhna5f`
   - Check status: should show "URL is on Google"
   - Check "Why isn't indexed?" - should be resolved

### 48-72 Hours After Deploy

1. **Check Coverage Report**:
   - Should show significant increase from 2 pages to 60+ pages
   - Look for indexation trend

2. **Monitor Crawl Stats**:
   - Settings → Crawl stats
   - Should show Google crawling ~10-20 pages per day (up from ~0)

3. **Check for Errors**:
   - Coverage → Errors
   - Should see none (previously may have 100+)
   - Check "Crawl errors" → should be empty or minimal

---

## Success Criteria

After 72 hours:
- [ ] 50%+ pages indexed (target: 60+/120)
- [ ] No deduplication errors in GSC
- [ ] Crawl activity visible in stats
- [ ] No canonical URL issues reported

After 7 days:
- [ ] 80%+ pages indexed (target: 96+/120)
- [ ] All product pages indexed
- [ ] Organic impressions appearing in GSC

After 30 days:
- [ ] 100% pages indexed (all 120 pages)
- [ ] Measurable organic traffic
- [ ] Stable indexation maintained

---

## Troubleshooting

**If pages still not indexing after 72 hours**:

1. Check GSC Coverage report
   - What's the blocking reason? (excludedNoindex, nofollow, redirect, etc.)

2. Inspect a specific URL
   - Go to URL Inspection in GSC
   - Paste: `https://sneakerportfolio.me/en/accessories`
   - Check "Why isn't this URL indexed?"

3. Common issues & fixes:
   - **"noindex tag detected"**: Check meta tags, remove `<meta name="robots" content="noindex" />`
   - **"Redirect detected"**: Check middleware.ts for unintended redirects
   - **"Soft 404"**: Ensure page renders proper content (not 404 page)
   - **"Blocked by robots.txt"**: Verify robots.ts allows the path

---

**Report Generated**: March 26, 2026  
**Status**: Ready for implementation
