# SKILL-001: Next.js 15 Async Params in Client Components

**Applies to**: Next.js 15+, React Server Components, Dynamic Routes  
**When to use**: Any client component with `params` prop in dynamic routes  
**Severity**: Critical (causes permanent black screen)

---

## Problem

In Next.js 15+, route parameters passed to **client components** (`"use client"`) are wrapped in a **Promise**. Reading them synchronously returns `undefined`, causing conditional logic to fail:

```tsx
// ❌ BROKEN - params.locale is undefined
export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {  // undefined is not a valid locale!
    return null  // Returns null forever → Black screen
  }
  const locale = params.locale  // Never reached
}
```

**Effect**: Page appears as a black/empty screen permanently because the component returns `null` on every render and never recovers.

---

## Root Cause

Next.js 15 changed params handling:
- **Server Components**: `params` is a synchronous object
- **Client Components**: `params` is a `Promise<{ ... }>`

The Promise must be awaited/unwrapped before reading properties. Reading a Promise's properties directly returns `undefined`.

```tsx
// What actually happens:
const params = Promise.resolve({ locale: "en" })
console.log(params.locale)  // undefined, NOT "en"
```

---

## Fix

Use React's `use()` hook to unwrap the Promise before reading its properties:

### Step 1: Import `use` from React
```tsx
import { useState, useEffect, use } from "react"
```

### Step 2: Change the params type to Promise
```tsx
// ❌ OLD (Next.js 14 style)
export default function Page({ params }: { params: { locale: string } }) {

// ✅ NEW (Next.js 15 style)
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
```

### Step 3: Unwrap params at the top of the component
```tsx
const { locale } = use(params)  // Now locale is a string, not undefined
```

### Complete Example
```tsx
"use client"

import { useState, useEffect, use } from "react"

export default function LocalizedCartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)  // ✅ Unwrap Promise
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Now locale is reliably a string
  if (!isLocale(locale)) {
    return null
  }

  // Rest of component...
}
```

---

## Prevention

1. **Check your Next.js version** — This applies to Next.js 15.0+
2. **All `"use client"` components with params** need this fix
3. **Type-check strictly** — Use `params: Promise<...>` in TypeScript to catch the issue at compile time
4. **Add to your ESLint config** (optional) — Create a rule to warn about `params: { ... }` in client components

### Updated ESLint Rule (Optional)
```json
{
  "rules": {
    "custom/nextjs-params-type": "error"
  }
}
```

---

## Example from Project

**File**: `app/[locale]/cart/page.tsx` (lines 14-23)

**Before**:
```tsx
export default function LocalizedCartPage({ params }: { params: { locale: string } }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isLocale(params.locale)) {  // ❌ params.locale undefined
    return null
  }

  const locale = params.locale  // Dead code
```

**After**:
```tsx
export default function LocalizedCartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)  // ✅ Unwrap Promise first
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isLocale(locale)) {  // ✅ locale is now a string
    return null
  }
  // locale is reliably available
```

**Commit**: [29273d4](https://github.com/andrew-buga/Website-for-Sneakers/commit/29273d4)

---

## Testing

1. **Local**: `pnpm build` should complete with 0 errors
2. **Navigation**: Visit `/en/cart` and `/en/favorites` — should render content, not black screen
3. **All locales**: Test with `/uk/cart` and `/ru/cart` — all should work

---

## References

- [Next.js 15 Breaking Changes](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React `use()` Hook Documentation](https://react.dev/reference/react/use)
- [Dynamic Routes in App Router](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
