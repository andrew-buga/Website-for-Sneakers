# SKILL-003: Hydration Black Screen from localStorage Context

**Applies to**: React Context, localStorage, Next.js SSR, Hydration safety  
**When to use**: Any Context provider that reads/writes localStorage  
**Severity**: Critical (causes blank/black screen)

---

## Problem

A Context provider reads from `localStorage` on component render:

```tsx
// ❌ BROKEN - Causes hydration mismatch
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // This runs on BOTH server and client
  const saved = localStorage.getItem("cart")  // ❌ localStorage doesn't exist on server
  if (saved) {
    setItems(JSON.parse(saved))
  }

  return (
    <CartContext.Provider value={{ items }}>
      {children}  // Renders empty on server, filled on client → MISMATCH
    </CartContext.Provider>
  )
}
```

**Effect**:
- Server renders Context with **empty cart** from `localStorage.getItem(null)`
- Client renders Context with **saved cart** from actual localStorage
- React detects HTML mismatch → Page goes blank

---

## Root Cause

### Why Hydration Matters

Next.js performs **Server-Side Rendering (SSR)**:
1. Server generates static HTML with empty state (no localStorage)
2. HTML sent to browser
3. Browser runs JavaScript, loads saved data from localStorage
4. React "hydrates" the HTML

If server HTML ≠ client HTML, React writes an error and the page breaks.

### The Timeline

1. **Server render**: Code runs in Node.js → `localStorage.getItem()` throws error or returns null → empty state
2. **Client render**: Code runs in browser → `localStorage.getItem()` returns saved data → filled state
3. **ReactDOM.hydrate()**: Compares server HTML to client render → MISMATCH → 💥 Crash

```
Server HTML: <CartContext.Provider value={{ items: [] }}>
Client HTML: <CartContext.Provider value={{ items: [saved...] }}>
Mismatch! → Page goes blank
```

---

## Fix

Use a `mounted` state to **only render children after the component hydrates on the client**:

### Step 1: Add `mounted` state and useEffect
```tsx
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)  // Only runs on client, after hydration
}, [])
```

### Step 2: Gate children rendering on `mounted`
```tsx
// ❌ OLD - Always renders children (causes mismatch)
return (
  <CartContext.Provider value={{ items, ... }}>
    {children}
  </CartContext.Provider>
)

// ✅ NEW - Render children only after mounted
return (
  <CartContext.Provider value={{ items, ... }}>
    {mounted ? children : null}
  </CartContext.Provider>
)
```

### Complete Example - CartProvider
```tsx
"use client"

import { createContext, useState, useEffect } from "react"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)  // ✅ Track mount state

  useEffect(() => {
    setMounted(true)  // ✅ Mark as mounted after first render
    const saved = localStorage.getItem("cart")  // Now safe to read
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  // Only render children after hydration
  return (
    <CartContext.Provider value={{ items }}>
      {mounted ? children : null}  // ✅ Gate children on mounted
    </CartContext.Provider>
  )
}
```

### StorageAdapter Alternative (What This Project Uses)

If you already have a StorageAdapter pattern:

```tsx
// Storage adapter safely checks if window exists
const StorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  },
}
```

Then use the `mounted` gate on the provider:

```tsx
return (
  <CartContext.Provider value={{ items }}>
    {mounted ? children : null}  // ✅ Still gate on mounted!
  </CartContext.Provider>
)
```

---

## Prevention

### Checklist for Any New Context Provider

- [ ] Does the provider read localStorage? ➜ Add `mounted` state
- [ ] Does the provider read from `window`? ➜ Add `mounted` state
- [ ] Does the provider use Browser APIs? ➜ Add `mounted` state
- [ ] Provider gates children on `mounted`? ✅ Yes
- [ ] useEffect for side effects has `[]` dependency? ✅ Yes

### Code Template
```tsx
"use client"

import { createContext, useState, useEffect } from "react"

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<T>(initialState)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Now safe to read localStorage, window, etc.
    const saved = localStorage.getItem("key")
    // ...update state
  }, [])

  return (
    <MyContext.Provider value={{ data }}>
      {mounted ? children : null}  // ✅ Gate on mounted
    </MyContext.Provider>
  )
}
```

---

## Example from Project

**File**: `lib/cart-context.tsx` (lines 43-65)

**Before**:
```tsx
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setMounted(true)  // Missing!
    const savedCart = StorageAdapter.getItem("cart")
    // ...
  }, [])

  return (
    <CartContext.Provider value={{ items, ... }}>
      {children}  // ❌ Always renders, causes mismatch
    </CartContext.Provider>
  )
}
```

**After**:
```tsx
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)  // ✅ Added

  useEffect(() => {
    setMounted(true)  // ✅ Set after hydration
    const savedCart = StorageAdapter.getItem("cart")
    // ...
  }, [])

  return (
    <CartContext.Provider value={{ items, ... }}>
      {mounted ? children : null}  // ✅ Gate on mounted
    </CartContext.Provider>
  )
}
```

**Commit**: [7016d99](https://github.com/andrew-buga/Website-for-Sneakers/commit/7016d99)

---

## Testing

### Local Testing
```bash
# Clear browser cache (important!)
pnpm dev
# Visit http://localhost:3000/cart
# Should render cart UI, not blank screen
```

### Production Testing
```bash
# Incognito browser (no cached state)
# Visit https://sneakerportfolio.me/en/cart
# Should render immediately, not show blank screen
```

---

## Related Skills

- **Hydration Error #310**: Use this skill to prevent that error
- **Black Screen on Cart Page**: This is the fix
- **localStorage Access in SSR**: Use StorageAdapter pattern

---

## References

- [React Hydration Documentation](https://react.dev/reference/react-dom/hydrateRoot)
- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [Why localStorage breaks SSR](https://web.dev/rendering-on-the-web/#server-side-rendering-ssr)
