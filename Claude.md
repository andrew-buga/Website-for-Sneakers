# Claude.md — Workspace Instructions for Streater Sneakers

## Project Overview

**Project**: Streater Sneakers — E-commerce sneaker store  
**Tech Stack**: Next.js 16.1.6 (Turbopack), React 18, TypeScript (strict), TailwindCSS, Prisma ORM  
**Status**: Production (live at https://sneakerportfolio.me)  
**Locales**: 3 (English/en, Ukrainian/uk, Russian/ru)  
**Routes**: 120 static pages (40 routes × 3 locales)

---

## Architecture & Key Patterns

### State Management
- **CartProvider** (`lib/cart-context.tsx`) — ShoppingCart state with StorageAdapter for hydration safety
- **WishlistProvider** (`lib/wishlist-context.tsx`) — Favorites/wishlist state with StorageAdapter
- **AuthProvider** (`lib/auth-context.tsx`) — User authentication state
- **StorageAdapter Pattern**: Safely checks `typeof window === 'undefined'` before localStorage access

### Hydration & SSR Safety
**Critical**: Any component using useState + localStorage hooks MUST:
1. Add `isMounted` state with useEffect setter
2. Return null/skeleton during SSR phase (`if (!isMounted) return ...`)
3. Only render actual content after client-side mount

**Why**: Next.js generates static HTML on server. Client hydration must match exactly or React crashes with error #310 (hydration mismatch).

### Security Patterns
- **CSRF Protection** (`lib/csrf.ts`, `lib/use-csrf-token.ts`):
  - HMAC-SHA256 signature validation
  - Timestamp-based expiration (24 hours max)
  - Applied to: login, register, profile (address form)
  - Header: `x-csrf-token`

- **Form Validation** (`lib/validation.ts`):
  - `validateAddress()` with field-level error messages
  - Character validation for names (letters/spaces only)
  - Email & password strength validation

### Error Handling
- **ErrorBoundary** (`lib/error-boundary.tsx`) — Class component catches render errors
- Wrapped at layout: `app/[locale]/layout-client.tsx`
- Logs errors using `logError()` utility

### Image Handling
- Next.js Image component with `fill` prop requires parent `position: relative`
- Responsive sizing: use `w-[size]` + `md:w-[larger-size]` pattern
- Mobile first: start with mobile size, increase on md+ breakpoints

---

## Common Issues & Solutions

### Issue: Black screen on page load
**Cause**: Component uses hooks (cart, auth, wishlist) without hydration guard  
**Fix**: Add isMounted state + useEffect + conditional rendering
```tsx
const [isMounted, setIsMounted] = useState(false)
useEffect(() => setIsMounted(true), [])
if (!isMounted) return <LoadingSkeleton />
```

### Issue: React error #310 (hydration mismatch)
**Cause**: Server HTML differs from client render (responsive classes, conditional renders, layout shifts)  
**Fix**: Use `hidden/md:hidden` for visibility instead of `md:flex-col` for layout changes. Keep DOM structure consistent across breakpoints.

### Issue: Cart/Wishlist empty on page refresh
**Cause**: localStorage not initialized during SSR, hydration mismatch  
**Fix**: StorageAdapter pattern already implemented — ensure components use it

### Issue: Infinite loops in useEffect
**Cause**: Function references in dependency array (e.g., `[id, updateQuality]`)  
**Fix**: Remove function references, use only primitive values as dependencies

### Issue: Static route generation fails
**Cause**: generateStaticParams not returning all required locales  
**Fix**: Most pages auto-generate via middleware redirect. Check `app/[locale]/layout.tsx` for proper static params

---

## File Structure & Conventions

### Key Directories
```
app/[locale]/          → Locale-prefixed routes (en, uk, ru)
├── layout.tsx         → Root layout with providers
├── layout-client.tsx  → Client-side ErrorBoundary wrapper
├── page.tsx           → Home page
├── cart/page.tsx      → Shopping cart (hydration-protected)
├── account/           → Auth pages (login, register, profile)
└── product/[id]/      → Product detail page

lib/                   → Utilities & contexts
├── cart-context.tsx   → Cart state with StorageAdapter
├── wishlist-context.tsx → Wishlist state with StorageAdapter
├── auth-context.tsx   → Authentication state
├── csrf.ts            → CSRF token generation/validation
├── use-csrf-token.ts  → React hook for CSRF tokens
├── validation.ts      → Form validation functions
├── i18n.ts            → Localization utilities
└── error-boundary.tsx → ErrorBoundary class component

app/api/              → API routes (server-only)
├── auth/             → Authentication endpoints
├── csrf-token        → CSRF token endpoint (must return string token)
├── cart/             → Cart operations (not used in current impl)
└── payment/          → Payment processing (501 Not Implemented)

components/           → Reusable React components
├── navbar.tsx        → Navigation with locale links
├── footer.tsx        → Footer
└── ui/               → shadcn/ui components

styles/               → Global & component styles
└── globals.css       → Tailwind + custom CSS
```

### Naming Conventions
- Components: PascalCase (`Navbar`, `CartItem`, `ErrorBoundary`)
- Functions: camelCase (`getDictionary`, `withLocaleHref`, `validateAddress`)
- Context hooks: `use{Name}` (`useCart`, `useWishlist`, `useAuth`)
- Utilities: camelCase (`formatPrice`, `parseJSON`)

---

## Build & Deployment

### Build Process
```bash
npm run build
# Runs: pnpm run check:merge-markers && next build
# Output: .next/ directory with 120 prerendered pages
```

### Build Validation
- ✅ TypeScript compilation (10-16s)
- ✅ 120 static pages generated (3 locales × 40 routes)
- ✅ 25+ API routes compiled
- ✅ ESLint checking
- ✅ Merge marker validation

### Route Generation
- Static: `app/[locale]/[page]/page.tsx` with `generateStaticParams()`
- Dynamic: API routes `app/api/[...route]/route.ts`
- Fallback: Middleware redirects `/[route]` → `/[default-locale]/[route]`

### Environment
- `.env` — Local secrets (never commit)
- `.env.example` — Template with placeholders (safe for git)
- `NEXT_PUBLIC_*` — Exposed to browser
- Database: Prisma ORM with migrations

---

## Development Workflow

### Before Making Changes
1. **Build check**: Ensure `npm run build` succeeds (0 errors)
2. **Memory check**: Review this file and session memory for context
3. **Git status**: Verify on main branch, no uncommitted changes

### Making Changes
1. **Identify file**: Use semantic_search or file_search for location
2. **Read context**: Get 10+ lines before/after for proper context
3. **Use multi_replace_string_in_file**: For multiple edits in same/different files
4. **Test build**: Run `npm run build` to verify changes compile
5. **Git workflow**: Add → Commit (detailed message) → Push

### Commit Message Format
```
<type>: <subject>

<detailed description of changes>
<why the change was needed>
<any breaking changes or notes>
```

**Types**: fix, feat, refactor, doc, style, test, perf, security

### Code Review Checklist
- ✅ No hydration mismatches (use StorageAdapter, isMounted guard)
- ✅ Imports are correct (check for unused)
- ✅ TypeScript: strict mode compliance
- ✅ Dependencies: useEffect dependency arrays reviewed
- ✅ Console warnings: None visible in production build
- ✅ Build: Completes in <30s with 0 errors
- ✅ Routes: All 120 pages generated

---

## Recent Work & Fixes

### Completed Issues (This Session)
1. **Product page race condition** — Removed `isInWishlist` from useEffect dependencies
2. **Hydration mismatches** — Added StorageAdapter pattern to cart/wishlist contexts
3. **Error handling** — Created ErrorBoundary component, integrated into layout
4. **Form validation** — Added validateAddress() with field-level errors
5. **CSRF protection** — Integrated HMAC tokens into login, register, address forms
6. **Mobile responsiveness** — Fixed cart layout with adaptive flex/grid classes
7. **Black screen on cart** — Added isMounted hydration guard to prevent blank page

### Commit History (Recent)
- `b0a2589`: Hydration protection for cart page (fixes black screen)
- `bc2ee3d`: Hydration mismatch fix for cart controls
- `4fdc9fa`: Mobile responsiveness improvements for cart
- `b1fa09a`: Form validation & CSRF tokens (Phase 4)
- `d8d96ad`: Critical fixes for hydration & race conditions (Phase 1-3)
- `ddf52f8`: Environment configuration (.env.example)

---

## What I Need for Continuous Work

### Critical Context
1. **Current git status** — Branch, uncommitted changes, last commits
2. **Build state** — Does it compile? Any TypeScript/ESLint errors?
3. **Production state** — What's working/broken on live site?
4. **User feedback** — Specific URLs, error messages, reproduction steps

### For Each Task
1. **Problem statement** — What's broken? Where? How to reproduce?
2. **Affected files** — Which components/routes are involved?
3. **Expected behavior** — What should work? What's the desired outcome?
4. **Constraints** — Performance, compatibility, business requirements?

### Useful Patterns to Remember
- Always check `typeof window === 'undefined'` for SSR safety
- StorageAdapter pattern for all localStorage access
- isMounted guard for hooks that depend on client-side state
- CSRF tokens required for POST/PUT/DELETE requests
- Hydration issues: prefer `hidden/block` over responsive layout classes
- Build must complete successfully before pushing

---

## Performance & Optimization

### Build Metrics (Target)
- Compile time: <20s (currently 10-16s ✅)
- Static routes: 120/120 generated ✅
- TypeScript errors: 0 ✅
- Bundle size: Monitor via next/image optimization

### Optimization Opportunities (Backlog)
- [ ] Code splitting for routes
- [ ] Image optimization (next/image fill prop sizing)
- [ ] CSS purging (TailwindCSS already optimized)
- [ ] API response caching
- [ ] Database query optimization

---

## Security Checklist

- ✅ Environment variables: Never commit `.env`
- ✅ CSRF tokens: Required on state-changing requests
- ✅ Input validation: Email, password, address fields
- ✅ Error messages: No sensitive details exposed
- ✅ API routes: Server-side validation (don't trust client)
- ✅ Middleware: Locale redirect with 307 status
- ✅ Dependencies: Keep up-to-date (npm audit)

---

## Questions for Future Work

**When adding new pages:**
- Does it need a dynamic route `[param]`?
- Are there any context hooks (cart, auth, wishlist)?
- Does it use localStorage or client-only state?
- Is it covered by static generation or dynamic rendering?

**When fixing bugs:**
- Can I reproduce it? (URL, steps, browser)
- Is it client-side (JS error) or server-side (API error)?
- Hydration mismatch or logic error?
- Production only or also in dev build?

---

**Last Updated**: March 25, 2026  
**Next Review**: After each major feature or critical fix
