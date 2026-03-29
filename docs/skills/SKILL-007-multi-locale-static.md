# SKILL-007: Multi-Locale Static Generation (40 routes × 3 locales = 120 pages)

**Applies to**: Next.js dynamic routes, internationalization, static generation  
**When to use**: Building static e-commerce sites with multiple languages  
**Severity**: High (affects SEO, performance, and scalability)

---

## Problem

You have 40 unique routes that need to be available in 3 languages (en, uk, ru):

```
/products
/products/men
/products/women
/cart
/account
...
```

Each should exist in:
```
/en/products
/uk/products
/ru/products
```

That's **40 × 3 = 120 pages** that must be pre-generated and served statically (not on-demand).

**Without proper setup**:
- ❌ Only English routes exist
- ❌ Requests to `/uk/products` return 404
- ❌ Users in Ukraine can't access the site
- ❌ SEO is broken for non-English locales

---

## Solution: generateStaticParams + Middleware Redirect

### Architecture

```
User visits: /products
         ↓
[Middleware catches]
    ├─ Is locale in path? (e.g., /en/products)
    │  YES → Pass through
    │  NO → Redirect to /[DEFAULT_LOCALE]/products (e.g., /en/products) with 307
         ↓
[Next.js router matches /[locale]/products]
    ├─ Has generateStaticParams?
    │  YES → Generate all locale variants during build
    │  NO → Generate on-demand (slow)
         ↓
[Static page served instantly]
```

---

## Implementation

### Step 1: Create Middleware for Locale Redirect

**File**: `middleware.ts`

```tsx
import { NextRequest, NextResponse } from "next/server"

const DEFAULT_LOCALE = "en"
const SUPPORTED_LOCALES = ["en", "uk", "ru"]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if pathname starts with a locale
  const locale = SUPPORTED_LOCALES.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  )

  if (locale) {
    // Already has locale, pass through
    return NextResponse.next()
  }

  // No locale, redirect to default with 307 (temporary redirect)
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.redirect(newUrl, { status: 307 })
}

export const config = {
  matcher: [
    // Match all paths except static assets and API
    "/((?!_next|api|.*\\.).*)",
  ],
}
```

**What this does**:
- User visits `/products` → Redirects to `/en/products` (307 temporary)
- User visits `/en/products` → Passes through (no redirect)
- User visits `/uk/products` → Passes through (no redirect)
- `/api/foo` → Skips middleware (doesn't redirect API)
- `/_next/...` → Skips middleware (static assets)

---

### Step 2: Create Dynamic Routes with generateStaticParams

**File**: `app/[locale]/products/page.tsx`

```tsx
import { isLocale } from "@/lib/i18n"

type Locale = "en" | "uk" | "ru"

export async function generateStaticParams() {
  // Return an array of all locale variants to generate
  return [
    { locale: "en" },
    { locale: "uk" },
    { locale: "ru" },
  ]
}

export default function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)

  if (!isLocale(locale)) {
    return null
  }

  return (
    <main>
      <h1>Products in {locale}</h1>
      {/* ... */}
    </main>
  )
}
```

**What this does**:
- During build, Next.js generates:
  - `/en/products/index.html`
  - `/uk/products/index.html`
  - `/ru/products/index.html`
- All 3 exist and serve instantly (no on-demand generation)

---

### Step 3: Extract Locales from Configuration

For DRY code, define locales once:

**File**: `lib/i18n.ts`

```tsx
export const SUPPORTED_LOCALES = ["en", "uk", "ru"] as const
export const DEFAULT_LOCALE = "en"

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value as Locale)
}

export function getAllLocales(): Locale[] {
  return [...SUPPORTED_LOCALES]
}
```

**Then use in generateStaticParams**:

```tsx
import { getAllLocales } from "@/lib/i18n"

export async function generateStaticParams() {
  return getAllLocales().map((locale) => ({ locale }))
}
```

---

### Step 4: Update Middleware to Use Config

**File**: `middleware.ts` (updated)

```tsx
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n"
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const locale = SUPPORTED_LOCALES.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  )

  if (locale) {
    return NextResponse.next()
  }

  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.redirect(newUrl, { status: 307 })
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.).*)"  ],
}
```

---

### Step 5: Verify All Routes Are Generated

During build, you should see:

```
✓ Compiled successfully
✓ Generating static pages using 7 workers (0/120)
✓ Generating static pages using 7 workers (30/120)
✓ Generating static pages using 7 workers (60/120)
✓ Generating static pages using 7 workers (90/120)
✓ Generating static pages using 7 workers (120/120) in 4.5s
```

**Check**:
- Is count *exactly* `120/120`?
- Is it `40 routes × 3 locales`?
- If not: add more routes to `generateStaticParams()`

---

## Complete Example for 40 Routes

If you have 40 main route files:

```
app/[locale]/page.tsx (home)
app/[locale]/cart/page.tsx
app/[locale]/products/page.tsx
app/[locale]/products/[id]/page.tsx (SPECIAL—see below)
... 40 routes total
```

Each needs:

```tsx
export async function generateStaticParams() {
  return getAllLocales().map((locale) => ({ locale }))
}
```

For **dynamic sub-routes** like `/products/[id]`:

```tsx
// This generates ALL product IDs in ALL locales
export async function generateStaticParams() {
  const locales = getAllLocales()
  const productIds = await fetchProductIds() // e.g., [1, 2, 3, 4, ...]

  const combinations = []
  for (const locale of locales) {
    for (const id of productIds) {
      combinations.push({ locale, id })
    }
  }
  return combinations
}
```

This generates: `3 locales × N product IDs = 3N pages`

---

## Performance & SEO Benefits

### Performance
- ✅ Static HTML served instantly (no Node.js needed)
- ✅ No database queries on page load
- ✅ CDN can cache globally
- ✅ Lighthouse scores: 95+ possible

### SEO
- ✅ `en.sneakerportfolio.me/products` indexes separate from `uk.shorturl.me/uk/products`
- ✅ Language meta tags properly set
- ✅ Canonical URLs avoid duplicate content penalties
- ✅ Hreflang links tell Google about language variants

---

## Example from Project

**Project Structure**:
```
app/[locale]/
├── page.tsx (home, 1 file)
├── cart/page.tsx (1 file)
├── products/
│   ├── page.tsx (1 file)
│   └── [id]/page.tsx (dynamic, generates based on product count)
├── account/
│   ├── login/page.tsx (1 file)
│   ├── register/page.tsx (1 file)
│   ├── profile/page.tsx (1 file)
│   └── ...
└── ... (40 total routes)

40 routes × 3 locales (en, uk, ru) = 120 static pages
```

**Build Output**:
```
✓ Generating static pages using 7 workers (120/120) in 3.8s

Route (app)
├ ● /[locale]
│ ├ /en
│ ├ /uk
│ └ /ru
├ ● /[locale]/products
│ ├ /en/products
│ ├ /uk/products
│ └ /ru/products
└ ... (all 40 × 3 combinations)

● (SSG) prerendered as static HTML
```

---

## Monitoring

### Build Time
- Target: < 2 minutes
- If > 5 minutes: Too many routes or slow database queries

### Page Count
- Run: `find .next/app -name "*.html" | wc -l`
- Should equal: `40 routes × 3 locales = 120` (exactly)
- If less: Check `generateStaticParams()` returns all locales

### Deployment Size
```bash
ls -lh .next/
# Should be ~50-200 MB for 120 static HTML files
```

---

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| Only 40 pages generated (not 120) | Missing locales in `generateStaticParams()` | Return all locales |
| /uk/products returns 404 | Middleware not redirecting or route doesn't exist | Check `generateStaticParams()` |
| Build takes > 5 minutes | Too many dynamic routes | Cache database queries |
| Non-English pages show English content | Locale not passed to translation function | Check `params: Promise<...>` unwrapping |

---

## References

- [Next.js generateStaticParams](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Internationalization (i18n) in Next.js](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [SEO for Multi-Locale Sites](https://developers.google.com/search/docs/specialty/international/localized-versions)
