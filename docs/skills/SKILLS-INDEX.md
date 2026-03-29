# Streater Sneakers – Technical Skills Library

**Location**: `docs/skills/`  
**Purpose**: Tested, documented solutions for recurring technical problems in the project  
**Audience**: Claude Copilot, development team  
**Last Updated**: March 26, 2026

---

## Overview

This library contains **7 technical skills**—detailed guides for solving common problems in the Streater Sneakers codebase. Each skill is self-contained, includes examples, and references the exact project code.

### How to Use This Library

1. **When debugging** — Search for the error message or problem name (e.g., "hydration mismatch")
2. **When implementing** — Check the skills relevant to your feature (e.g., "adding a new locale route")
3. **For reference** — Use skills to understand patterns, architecture, and best practices
4. **To avoid mistakes** — Review applicable skills BEFORE making changes

---

## Skills Index

### [SKILL-001: Next.js 15 Async Params](SKILL-001-nextjs-15-async-params.md)
**Problem**: Routes with dynamic parameters crash or fail to build  
**Solution**: Properly unwrap `params` Promise using React `use()` hook  
**Applies to**: 
- Dynamic routes: `/products/[id]`, `/account/[page]`
- All localeized routes: `/[locale]/...`
- Buildtime page generation

**Quick Fix**:
```tsx
import { use } from "react"

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  // Now use locale safely
}
```

**When to read**:
- Build fails with "params is not iterable"
- Page shows `undefined` for route parameters
- Creating a new dynamic route
- Migrating from Next.js 14 to 15+

---

### [SKILL-002: pnpm Lockfile Sync](SKILL-002-pnpm-lockfile-sync.md)
**Problem**: `pnpm-lock.yaml` is out of sync → build fails with "peer dependency" errors  
**Solution**: Rebuild lockfile with `pnpm install`, commit with changes  
**Applies to**:
- After `npm install` or `pnpm add` (instead use `pnpm add`)
- When `package.json` is edited manually
- After merging conflicting branches
- Pre-deployment validation

**Quick Fix**:
```bash
pnpm install   # Regenerates pnpm-lock.yaml
git add pnpm-lock.yaml package.json
git commit -m "chore: sync pnpm lockfile"
```

**When to read**:
- See "lockfile out of sync" error
- Dependencies refuse to install
- Pre-deployment check fails
- After resolving merge conflicts in package.json

---

### [SKILL-003: Hydration & localStorage](SKILL-003-hydration-localstorage.md)
**Problem**: SSR server renders different content than client → React error #310  
**Root cause**: Using localStorage during SSR (server-side has no localStorage)  
**Solution**: StorageAdapter pattern with `isMounted` guard  
**Applies to**:
- Cart context (`lib/cart-context.tsx`)
- Wishlist context (`lib/wishlist-context.tsx`)
- Auth context (`lib/auth-context.tsx`)
- Any component using localStorage or client-only hooks

**Quick Fix**:
```tsx
const [isMounted, setIsMounted] = useState(false)
useEffect(() => setIsMounted(true), [])
if (!isMounted) return <Skeleton />
// Safe to use localStorage now
```

**When to read**:
- Black screen on cart page load
- "Hydration mismatch" or "error #310" in console
- localStorage returns undefined
- Creating new state context with client-side persistence
- Pre-deployment validation for hydration safety

---

### [SKILL-004: Vercel Deployment Diagnosis](SKILL-004-vercel-diagnosis.md)
**Problem**: Site works locally but fails on Vercel  
**Causes**: Missing environment variables, API timeouts, database connection issues  
**Solution**: Systematic diagnosis with logs, environment validation, local reproduction  
**Applies to**:
- Broken features in production only
- Mysterious 500 errors on live site
- Features work in dev, fail on Vercel
- Deployment verification before going live

**Quick Checklist**:
```bash
# 1. Check Vercel logs
# 2. Verify env vars (Vercel dashboard)
# 3. Test API endpoints locally
# 4. Check database connectivity
# 5. Simulate Vercel build locally: NODE_ENV=production npm run build
```

**When to read**:
- Production site shows error, dev works fine
- "Internal Server Error" on Vercel
- Deployment succeeds but features broken
- Need to diagnose a live site issue quickly

---

### [SKILL-005: AI-Powered Code Verification](SKILL-005-ai-verification.md)
**Problem**: Need to verify code quality, safety, and correctness before deployment  
**Solution**: Use Claude/AI for syntax, logic, security, and architecture review  
**Applies to**:
- Code reviews before merge
- Pre-deployment verification
- Security audit of sensitive code (auth, payment, CSRF)
- Architecture review of large changes
- Documentation validation

**Verification Checklist**:
```
□ TypeScript compiles cleanly (0 errors)
□ No console.log, debugger, TODO left in code
□ No hardcoded secrets or credentials
□ Error handling for all edge cases
□ Logic works for normal + edge cases
□ Performance optimization where needed
□ Accessibility considerations (for UI)
□ Tests pass for any modified code
```

**When to read**:
- About to merge changes to main
- Pre-deployment validation
- Security-sensitive features (auth, payment)
- Large refactors or architectural changes
- Code review best practices

---

### [SKILL-006: Deployment Guard System (3-Level Protection)](SKILL-006-deployment-guard.md)
**Problem**: Broken code reaches production, downtime occurs  
**Solution**: 3-level automated guard system (pre-commit hooks, GitHub Actions, Vercel rules)  
**Applies to**:
- Every code commit and push
- Every deployment to production
- Team-wide quality enforcement
- Preventing common mistakes

**The 3 Levels**:
1. **Pre-commit** (local, 2-3 sec)
   - TypeScript compilation
   - ESLint validation
   - Merge conflict detection
   
2. **Post-merge** (local, 5-10 sec)
   - Dependency sync after pull/merge
   - TypeScript verification
   
3. **GitHub Actions** (CI/CD, 15-20 min)
   - Full build verification
   - Complete ESLint + TypeScript
   - Environment validation

**When to read**:
- Setting up new developer machine
- Understanding deployment workflow
- Troubleshooting why commit/push is blocked
- Learning pre-commit hook patterns
- Post-deployment issue diagnosis

---

### [SKILL-007: Multi-Locale Static Generation (40 routes × 3 locales = 120 pages)](SKILL-007-multi-locale-static.md)
**Problem**: Non-English routes (uk, ru) don't exist or aren't indexed by SEO  
**Root cause**: Missing `generateStaticParams()` or incomplete locale list  
**Solution**: Middleware redirect + generateStaticParams for all locale combinations  
**Applies to**:
- `/uk/products`, `/ru/products` routes missing (404 errors)
- Internationalization setup for new sites
- Multi-language e-commerce sites
- SEO for non-English markets
- Site structure with 40+ routes and 3+ languages

**Quick Fix**:
```tsx
// middleware.ts: Redirect missing locale to default
const newUrl = request.nextUrl.clone()
newUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`
return NextResponse.redirect(newUrl, { status: 307 })

// Every page: Generate all locale variants
export async function generateStaticParams() {
  return ["en", "uk", "ru"].map((locale) => ({ locale }))
}
```

**Expected Result**: Build generates exactly 120 pages (40 routes × 3 locales)

**When to read**:
- Building a multi-language site from scratch
- Users report 404 on non-English routes
- Adding a new language locale (need to update generateStaticParams)
- SEO audit shows missing language variants
- Pre-deployment verification for all 120 pages
- Understanding site structure and route generation

---

## Problem-to-Skill Quick Reference

| Problem | Skill |
|---------|-------|
| Black screen on load | SKILL-003 |
| Build fails with "params is not iterable" | SKILL-001 |
| "Hydration mismatch" or error #310 | SKILL-003 |
| Lockfile out of sync / dependency errors | SKILL-002 |
| Works locally, broken on Vercel | SKILL-004 |
| Need to verify code before deployment | SKILL-005 |
| Commit/push blocked or want to understand guard | SKILL-006 |
| Non-English routes return 404 | SKILL-007 |
| Need to generate 120 pages (40 routes × 3 locales) | SKILL-007 |
| Pre-deployment checklist | SKILL-005, SKILL-006 |

---

## Learning Path by Role

### **New Developer – Get Up to Speed**
Read in order:
1. SKILL-007 (understand project structure: 40 routes × 3 locales)
2. SKILL-001 (understand how routes work in Next.js 15)
3. SKILL-003 (understand hydration safety)
4. SKILL-006 (understand deployment workflow)

### **Backend/API Developer – Build Features Safely**
Read:
1. SKILL-005 (verification before merge)
2. SKILL-004 (diagnose production issues)
3. SKILL-006 (understand deployment guards)

### **Frontend Developer – Build Components**
Read:
1. SKILL-003 (hydration safety for state components)
2. SKILL-001 (dynamic routes and params)
3. SKILL-005 (pre-deployment verification)

### **DevOps/Deployment Engineer – Manage Pipeline**
Read:
1. SKILL-006 (deployment guard system)
2. SKILL-004 (Vercel diagnosis and troubleshooting)
3. SKILL-002 (dependency management)

### **Before Every Deployment**
Read:
1. SKILL-005 (code verification)
2. SKILL-006 (deployment guard checks)

---

## How Skills Are Updated

**Rule**: When a new pattern, issue, or solution is discovered:
1. Document it in existing skill if related
2. Create new skill if novel enough
3. Update this index
4. Add reference to Claude.md "Recent Work" section
5. Commit with type: `docs: add/update SKILL-XXX`

**Last 3 Additions**:
- SKILL-006 (Deployment Guard) — March 20, 2026
- SKILL-005 (AI Verification) — March 15, 2026
- SKILL-007 (Multi-Locale Static) — March 26, 2026

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | March 26, 2026 | Initial library with 7 skills |
| - | - | - |

---

## Questions?

- **Missing a skill?** Check Claude.md "Common Issues & Solutions" section
- **Found a bug in a skill?** Update the skill, commit, and notify team
- **Want to add a skill?** Document the pattern, create `.md` file, update this index

---

**Remember**: Skills are living documents. Update them as you learn new things.
