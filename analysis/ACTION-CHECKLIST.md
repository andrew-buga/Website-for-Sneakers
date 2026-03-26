# 🔴 CRITICAL: Action Checklist

## Situation

**Google Search Console Report (March 26, 2026)**:
- ✅ Valid indexation: 2 pages (root + store-locator)
- ❌ Not indexed: 118 pages (99% of site)
- 📊 Indexation rate: **1.7%** ← CRITICAL

**Root Cause**: Canonical URLs point to root for ALL pages, causing Google to treat localized pages as duplicates.

---

## URGENT: Next 4 Hours

### Phase 1: Create Canonical URL Helper (30 min)

- [ ] Create file: `lib/get-canonical-url.ts`
- [ ] Copy code from IMPLEMENTATION-GUIDE.md Step 1
- [ ] Test function locally (optional): `getCanonicalUrl("en", "/accessories")` should return `https://sneakerportfolio.me/en/accessories`

### Phase 2: Fix Layout Metadata (45 min)

- [ ] Open: `app/layout.tsx`
  - Remove: `alternates: { canonical: siteUrl }` ← This points to root for all pages
  - Result: No canonical in root layout

- [ ] Open: `app/[locale]/layout.tsx`
  - Add canonical in `<head>`: `<link rel="canonical" href={getCanonicalUrl(locale, "/")} />`
  - Add hreflang variants for en, uk, ru
  - Code in IMPLEMENTATION-GUIDE.md Step 3

### Phase 3: Fix Sitemap (45 min)

- [ ] Open: `app/sitemap.ts`
- [ ] Replace entire file with updated version from IMPLEMENTATION-GUIDE.md Step 6
- [ ] This adds:
  - ✅ All 3 locale routes (instead of just en + uk/ru separately)
  - ✅ Hreflang links for language alternates
  - ✅ All product pages with locale+hreflang
  - **Result**: 72+ entries instead of 30

### Phase 4: Verify & Build (15 min)

- [ ] `npm run build` - should complete in <30s, 120/120 pages, 0 errors
- [ ] If errors: fix TypeScript issues
- [ ] Rebuild until clean

---

## DEPLOYMENT: Next 30 Min

### Before Pushing

- [ ] Build successful: `npm run build`
- [ ] Test with local server: `npm run dev` (check page renders)
- [ ] All changes committed locally

### Push to Production

```bash
git add -A
git commit -m "fix: correct canonical URLs and add complete hreflang support

- Create lib/get-canonical-url.ts for canonical URL generation
- Update app/layout.tsx: remove root canonical declaration
- Update app/[locale]/layout.tsx: add proper canonical + hreflang
- Rewrite app/sitemap.ts: include all 3 locales + hreflang for 72 pages

Fixes critical indexation crisis:
- Before: 2 pages indexed (1.7%)
- After: 120 pages indexable (100%)
- Root cause: Canonical URL confusion (all pages → root)
- Solution: Locale-specific canonical for each of 120 pages"

git push origin main
```

---

## MONITORING: Next 24-48 Hours

### Day 1 (Same Day)

- [ ] Verify production deployed successfully
- [ ] Open https://sneakerportfolio.me/en/accessories
  - View page source, search for `<link rel="canonical"`
  - Should show: `https://sneakerportfolio.me/en/accessories`
  - NOT: `https://sneakerportfolio.me/`

- [ ] Check sitemap: https://sneakerportfolio.me/sitemap.xml
  - Should have ~72 entries
  - Each should have `<xhtml:link>` tags for hreflang

### Day 2 (24 Hours After Deploy)

- [ ] Open Google Search Console: https://search.google.com/search-console
- [ ] Select property: `https://sneakerportfolio.me`
- [ ] Go to "Sitemaps" section
  - Refresh sitemap entry
  - Wait 5-10 min for reprocessing

- [ ] Check "Coverage" tab
  - Look for increase from 2 to 10+ pages
  - May not be immediate - takes 24-48 hours

- [ ] Check Crawl Stats
  - Settings → Crawl Errors
  - Should see Google crawling pages again

### Day 3-4 (48-72 Hours After Deploy)

- [ ] Check Coverage Report again
  - Target: 60+ pages indexed (50% improvement)
  - Each page should show "Valid" status

- [ ] Check specific page via URL Inspection
  - Test: `https://sneakerportfolio.me/en/product/cmm3vt32e0000evpam5xhna5f`
  - Should show: "URL is on Google" and indexed

---

## Success Metrics

### 24 Hours
- ✅ Canonical URLs fixed in production
- ✅ Sitemap updated with all locales
- ✅ Google crawling increased (visible in crawl stats)

### 48 Hours  
- ✅ 10-30 pages newly indexed (up from 2)
- ✅ No "Narrow duplicate" errors in GSC
- ✅ Indexation rate: 8-25% (up from 1.7%)

### 72 Hours
- ✅ 60+ pages indexed (target: 50% improvement)
- ✅ Clear positive trend in Coverage dashboard
- ✅ Organic impressions in GSC starting to appear

### 7 Days
- ✅ 96+ pages indexed (target: 80% improvement)  
- ✅ All high-priority pages (home, products, collections) indexed
- ✅ Organic traffic starting to recover

### 30 Days
- ✅ All 120 pages indexed (100% coverage)
- ✅ Stable indexation maintained
- ✅ Measurable organic traffic increase

---

## Files to Modify

1. **Create New**: `lib/get-canonical-url.ts`
   - Status: ⏳ TO DO
   - Time: 5 min

2. **Modify**: `app/layout.tsx`
   - Status: ⏳ TO DO
   - Time: 5 min
   - Change: Remove root canonical

3. **Modify**: `app/[locale]/layout.tsx`
   - Status: ⏳ TO DO
   - Time: 10 min
   - Change: Add locale canonical + hreflang

4. **Modify**: `app/sitemap.ts`
   - Status: ⏳ TO DO
   - Time: 20 min
   - Change: Complete rewrite with all locales + hreflang

---

## Rollback Plan (If Issues)

If anything breaks after deploy:

```bash
# Find last good commit before this change
git log --oneline | head -5

# Revert to previous version
git reset --hard <commit-hash>
git push --force-with-lease origin main
```

---

## Questions to Answer Before Proceeding

Before making changes, confirm:

1. ✅ **Is `/en` the primary/default locale?**
   - YES: Proceed with implementation
   - NO: Adjust `getCanonicalUrl()` function

2. ✅ **Should Ukrainian & Russian pages be indexed?**
   - YES: Implement full 3-locale sitemap (current plan)
   - NO: Remove uk/ru from sitemap.ts

3. ✅ **Can we deploy now?**
   - YES: Proceed to Phase 1
   - NO: Schedule deployment window

---

## Key Insight

**The Problem**: Google sees this:
```
/en/accessories → canonical: https://sneakerportfolio.me/ 
/ru/accessories → canonical: https://sneakerportfolio.me/
/uk/accessories → canonical: https://sneakerportfolio.me/
```

Google deduplicates to single page → indexes only root, ignores all variants.

**The Solution**: Google should see this:
```
/en/accessories → canonical: https://sneakerportfolio.me/en/accessories
/ru/accessories → canonical: https://sneakerportfolio.me/ru/accessories
/uk/accessories → canonical: https://sneakerportfolio.me/uk/accessories
```

Each page is unique → all 120 pages become indexable.

---

**Status**: 🔴 CRITICAL - Awaiting implementation approval

**Prepared**: March 26, 2026 at 18:50 UTC  
**Impacts**: 118 pages currently invisible to Google
