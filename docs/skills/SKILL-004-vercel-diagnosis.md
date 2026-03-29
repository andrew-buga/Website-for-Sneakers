# SKILL-004: Vercel Deployment Diagnosis Checklist

**Applies to**: Vercel, deployment debugging, production issues  
**When to use**: When a page is blank, black screen, or showing errors in production  
**Severity**: Critical (blocks production debugging)

---

## Problem

Your code works locally but on Vercel (production), the page shows:
- ⬛ Completely black screen
- ⚪ Completely blank screen
- ❌ Error message
- 🔄 Infinite loading spinner

**What went wrong?**
- ✅ Build succeeded (green checkmark on Vercel)
- ✅ Site deployed
- ❌ Page doesn't work

---

## Diagnosis Process

### STEP 1: Open Incognito Browser + DevTools

```
1. Open https://sneakerportfolio.me/en/cart in INCOGNITO mode
   (Prevents cached state from old version)

2. Press F12 to open DevTools

3. Go to THREE tabs:
   - Console (red errors?)
   - Network (how many requests?)
   - Application > Storage (cached data?)
```

### STEP 2: Check Network Tab

**What you're looking for**: How many JavaScript chunks loaded?

| Chunks Loaded | Meaning | Action |
|---|---|---|
| 15+ requests | ✅ Build succeeded, JS loaded | Go to STEP 3 |
| 1-3 requests | ❌ Build failed, chunks missing | Go to STEP 4 |
| 0 requests | ❌ Page never loaded | Check internet |

**Look for**:
```
GET /en/cart        → 200 (HTML page loads)
GET /_next/static/... → 200 (JS chunk loads OK)
GET /_next/static/... → 200
GET /_next/static/... → 200
...
```

If you see `404` on any `.js` file → Build didn't generate that file → Go to STEP 4

### STEP 3: Check Console Tab for Runtime Errors

If Network shows 15+ requests loaded:

**Red errors in Console?**
- YES → ❌ There's a runtime JavaScript error
  - Take a screenshot of the error
  - Google the error message
  - The error is in your component code
  - Go to STEP 5

- NO → Continue to STEP 4

### STEP 4: Check Vercel Build Logs

If JavaScript didn't load or build failed:

```
1. Go to: https://vercel.com/dashboard
2. Click the failing deployment
3. Scroll to the build logs
4. Look for lines starting with ERROR or ERR_
```

**Common Build Errors**:

| Error | Cause | Fix |
|---|---|---|
| `ERR_PNPM_OUTDATED_LOCKFILE` | pnpm-lock.yaml out of sync | Sync lockfile and commit |
| `TypeScript error` | Code doesn't type-check | Run `pnpm tsc --noEmit` locally |
| `Module not found` | Missing file or import | Check import paths |
| `Build failed` | Generic build error | Read full error message |

### STEP 5: Diagnose Runtime Error

If JavaScript loaded but console shows red errors:

**Common Runtime Errors**:

| Error | Cause | Fix |
|---|---|---|
| `Cannot read property 'X' of undefined` | Accessing property on null | Add null check |
| `is not a function` | Trying to call non-function | Verify the import |
| `ReferenceError: X is not defined` | Variable not imported | Add missing import |
| `Hydration mismatch` | SSR/client render conflict | Use `mounted` state pattern |

**How to Reproduce Locally**:
```bash
pnpm build   # Simulate Vercel build
pnpm start   # Run production build locally
# Visit http://localhost:3000/en/cart
# Should show same error as Vercel
```

---

## Complete Diagnosis Flowchart

```
Page shows black screen on Vercel
    ↓
[Incognito + DevTools open]
    ↓
[Check Network tab]
    ├─→ 15+ requests? → [Check Console tab]
    │                    ├─→ Red errors? → [Runtime error, execute STEP 5]
    │                    └─→ No errors? → [Something else, check API]
    │
    └─→ 1-3 requests? → [Build failed, check Vercel logs]
                        ├─→ ERR_PNPM? → [Sync pnpm-lock.yaml]
                        ├─→ TypeScript? → [Run tsc --noEmit locally]
                        └─→ Other? → [Reproduce locally with pnpm build]
```

---

## Practical Example

**Scenario**: Your `/en/cart` page shows black screen on Vercel

### Execute Diagnosis:

1. Open incognito: `https://sneakerportfolio.me/en/cart`
2. Open DevTools (F12)
3. Check Network tab:
   - ✅ See 20 requests, including `main-xxx.js` 200s
   - This means JavaScript loaded
4. Check Console tab:
   - ❌ See red error: `Cannot read property 'items' of undefined`
   - This is a runtime error in your React code
5. Reproduce locally:
   ```bash
   pnpm build
   pnpm start
   # Visit http://localhost:3000/en/cart
   # Should show same red error
   ```
6. Fix the error:
   - Add null check: `if (cart?.items) { ... }`
   - Commit and push
   - Vercel auto-deploys
   - Test again in incognito

---

## Fast Diagnosis Checklist

```
☐ 1. Open incognito browser
☐ 2. Press F12 for DevTools
☐ 3. Go to Network tab
☐ 4. Reload page (Ctrl+R)
☐ 5. Count JavaScript requests
     • 15+? → Check Console for red errors
     • 1-3? → Check Vercel build log
☐ 6. Take screenshot of errors
☐ 7. Open Vercel dashboard
☐ 8. Scroll to build log
☐ 9. Search for "ERROR" or "ERR_"
☐ 10. Reproduce locally with `pnpm build && pnpm start`
```

---

## Prevention

### Before Every Deploy:

```bash
# 1. Build locally (same as Vercel)
pnpm build
✓ Expect: "Compiled successfully" + "120/120 pages"
✗ Stop if errors

# 2. Start production build locally
pnpm start
✓ Expect: "localhost:3000 ready"

# 3. Test key pages in browser
http://localhost:3000/en/cart
http://localhost:3000/en/favorites
http://localhost:3000/uk/products
✓ Expect: Pages load without errors
✗ Stop if black screen or console errors

# 4. Check build time
✓ Expect: < 2 minutes on Vercel
✗ If > 5 minutes: something is broken, investigate

# 5. Test production URL after deploy
https://sneakerportfolio.me/en/cart
✓ Expect: Same as localhost:3000
✗ If different: deployment issue
```

---

## Example from Project

**Real Case**: Cart page showed black screen on production

**Diagnosis**:
1. Incognito + DevTools → 20+ JS requests loaded ✅
2. Console tab → No red errors ✅
3. But page is black...
4. Reproduce locally:
   ```bash
   pnpm build
   pnpm start
   # Page loads fine locally!
   ```
5. Root cause: Hydration mismatch (SKILL-003)
   - Server rendered empty cart from no localStorage
   - Client rendered filled cart from localStorage
   - React detected mismatch and crashed
6. Fix: Add `mounted` state to gate children

---

## References

- [Vercel Deployment Monitoring](https://vercel.com/docs/monitoring)
- [Vercel Build Error Logs](https://vercel.com/docs/concepts/deployments/build-output-api)
- [Chrome DevTools Network Tab](https://developer.chrome.com/docs/devtools/network/)
- [Chrome DevTools Console](https://developer.chrome.com/docs/devtools/console/)
