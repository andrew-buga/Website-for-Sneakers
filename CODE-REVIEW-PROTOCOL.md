# CODE REVIEW PROTOCOL — Mandatory Checklist

**STATUS**: MANDATORY  
**APPLIES TO**: Every code change, without exception  
**FAILURE**: Skipping any step invalidates the change

---

## BEFORE MAKING ANY CHANGES — SNAPSHOT

Before touching any file, do the following:

### STEP 0.1 — Map the codebase

List every file that is relevant to the task:
- The file you will change (direct)
- Every file that imports the changed file
- Every file that the changed file imports
- Every type/interface used in the changed file
- Every API route called by the changed component
- Every translation key used in the changed file

Write this map to: `/analysis/change-map.md`

**Format**:
```
CHANGING: app/[locale]/product/[id]/page.tsx
IMPORTS FROM: lib/db.ts, components/ui/button.tsx, types/product.ts
IMPORTED BY: app/[locale]/collection/page.tsx
TYPES USED: Product, Locale, PageProps
API ROUTES: /api/products/[id]
TRANSLATION KEYS: product.back, product.home, product.title
```

### STEP 0.2 — Read every file in the map

Open and read EACH file completely before writing a single line.
- Do not guess what a file contains
- Read it thoroughly
- Understand the current implementation

### STEP 0.3 — Understand current behavior

Describe in plain text what the code currently does:
- If you cannot describe it — read again until you can
- Document this in `/analysis/current-behavior.md`
- Include edge cases and error handling

---

## WHILE MAKING CHANGES — LINE BY LINE RULES

For every single line you write or modify:

### LINE CHECK 1 — Types match
- Does the type of this value match what the function/component expects?
- If passing a string where Locale is expected — cast or validate
- If passing null where string is expected — add null check

### LINE CHECK 2 — Imports are correct
- Is every import at the top of the file actually used?
- Is every used function/type/component actually imported?
- Are import paths correct? (relative vs absolute, `@/` alias)

### LINE CHECK 3 — Translation keys exist
- Every `t('key')` or `t.key` used in code must exist in ALL locale files:
  - `messages/en.json`
  - `messages/uk.json`
  - `messages/ru.json`
- If adding a new key — add it to ALL THREE files simultaneously

### LINE CHECK 4 — Props are complete
- Every prop the component requires must be passed
- Every prop that is passed must be accepted by the component
- Optional props must have default values or undefined checks

### LINE CHECK 5 — No new TypeScript errors
After every 10 lines written, mentally check:
- Would `tsc --noEmit` pass on this file right now?
- If not — fix before continuing

### LINE CHECK 6 — No broken references
- If you rename a function — update every file that calls it
- If you change a type — update every file that uses it
- If you move a file — update every import path
- If you delete a prop — remove it from every usage

### LINE CHECK 7 — Edge cases handled
- What if the data is null or undefined?
- What if the array is empty?
- What if the API returns an error?
- What if the user is not logged in?
- Add guards for every case

---

## AFTER MAKING CHANGES — FULL CROSS-CHECK

When you finish making changes, run this full cross-check.
**Do not skip any step** even if you are confident the code is correct.

### CROSS-CHECK 1 — Changed files audit

For every file you modified:

Read the file top to bottom and verify:
- [ ] All imports used and correct?
- [ ] All types match their definitions?
- [ ] All translation keys exist in en.json, uk.json, ru.json?
- [ ] All props passed and received correctly?
- [ ] No console.log or debugger left?
- [ ] No hardcoded values that should be env vars?
- [ ] No TODO comments left unresolved?
- [ ] File saved correctly?

### CROSS-CHECK 2 — Affected files audit

For every file that IMPORTS the changed file:

- [ ] Does it still compile with the new version?
- [ ] Are all the exports it depends on still there?
- [ ] Did any prop or function signature change that breaks this file?
- [ ] Open the file and read the relevant sections

### CROSS-CHECK 3 — Type consistency

Run mentally or actually:
```bash
npx tsc --noEmit
```

For every error reported:
- [ ] Read the exact error message
- [ ] Find the exact line
- [ ] Fix the root cause (not just add `// @ts-ignore`)
- [ ] Re-check after fix

### CROSS-CHECK 4 — Translation completeness

If any translation keys were added or changed:

- Open `messages/en.json` → confirm key exists with correct value
- Open `messages/uk.json` → confirm same key exists
- Open `messages/ru.json` → confirm same key exists

If any key is missing in any file → add it now

### CROSS-CHECK 5 — API and data flow

If you changed anything that touches data:

- [ ] Does the API route still return the same shape?
- [ ] Does the component still expect the same shape?
- [ ] Are loading states handled?
- [ ] Are error states handled?
- [ ] Is the data validated before use?

### CROSS-CHECK 6 — Component tree

If you changed a component:

- [ ] Does the parent still pass correct props?
- [ ] Do the children still receive correct props?
- [ ] Are conditional renders still logical?
- [ ] Are keys present on all mapped elements?

### CROSS-CHECK 7 — Route and navigation

If you changed a page or route:

- [ ] Does the URL still work? (`/en/product/[id]`)
- [ ] Do all locales still work? (`/en/`, `/uk/`, `/ru/`)
- [ ] Are dynamic segments handled? (`[id]`, `[locale]`)
- [ ] Does navigation to/from this page still work?
- [ ] Does the back button work?

### CROSS-CHECK 8 — Environment and config

If you added any new feature:

- [ ] Does it need a new env var?
- [ ] Is that var in `.env.local`?
- [ ] Is it documented in `/analysis/missing-env-vars.txt`?
- [ ] Will it be available in Vercel? (add to dashboard if needed)

---

## CROSS-FILE CONSISTENCY MATRIX

After every change, verify this matrix:

| FILE CHANGED | FILES THAT MUST ALSO BE CHECKED |
|---|---|
| `types/*.ts` | Every file that uses that type |
| `messages/*.json` | Every component using those keys |
| `lib/*.ts` | Every file importing from lib/ |
| `components/*.tsx` | Every page using that component |
| `app/api/**/*.ts` | Every fetch() calling that route |
| `middleware.ts` | Every protected route |
| `next.config.*` | Build process, env vars |
| `tailwind.config.*` | Every component using custom classes |
| `package.json` | Lock file, all imports |

**Rule**: If a file in the left column was changed → open and verify every file in the right column.

---

## CONSISTENCY REPORT

After completing all cross-checks, document the changes:

### CHANGE SUMMARY
```
Files modified: [list]
Files checked as affected: [list]
Translation keys added: [list or "none"]
Types changed: [list or "none"]
New env vars needed: [list or "none"]
```

### CROSS-CHECK RESULTS
```
Changed files audit: [PASS/FAIL with details]
Affected files audit: [PASS/FAIL with details]
Type consistency: [PASS/FAIL with details]
Translation completeness: [PASS/FAIL with details]
API and data flow: [PASS/FAIL with details]
Component tree: [PASS/FAIL with details]
Route and navigation: [PASS/FAIL with details]
Environment and config: [PASS/FAIL with details]
```

### FINAL VERDICT
```
✅ ALL CHECKS PASSED — Ready to commit
❌ CHECKS FAILED — List failures and fix before committing
```

---

## EXECUTION SUMMARY

Write this summary in `/analysis/code-review-[date-time].md`:

```markdown
# Code Review Report — [YYYY-MM-DD HH:MM:SS]

## Changes Made
[List all files modified with 1-line summary]

## Mapping (STEP 0.1)
[Include change-map.md content]

## Current Behavior (STEP 0.3)
[Include current-behavior.md content]

## Cross-Checks Performed
[Include all 8 cross-check results]

## Consistency Matrix
[Include matrix verification results]

## Final Status
[APPROVED / REJECTED with reason]

## Time Spent
[Duration of code review]
```

---

## QUICK REFERENCE

Run this before every commit:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. View changes
git diff --staged

# 4. Verify build
npm run build
```

---

## VIOLATIONS & CONSEQUENCES

**⚠️ DO NOT SKIP STEPS**

| Violation | Consequence |
|---|---|
| Commit without Step 0.1 (mapping) | Change rejected, revert required |
| Commit without Step 0.2 (reading files) | Build likely to fail, cascading errors |
| Commit without CROSS-CHECK 1-8 | Production bugs, user-facing issues |
| Push without CONSISTENCY REPORT | No audit trail, difficult to debug |
| Merge without all steps complete | Risk of broken code reaching main |

**Important**: The deployment guard system will catch violations, but prevention is faster than recovery.

---

## INTEGRATION WITH DEPLOYMENT GUARD

This Code Review Protocol works alongside the Deployment Guard system:

1. **Code Review Protocol** (YOUR responsibility) — Catch logical errors, type mismatches, missing pieces
2. **Pre-commit Hooks** (Automatic) — Catch TypeScript/ESLint/merge conflicts
3. **GitHub Actions** (Automatic) — Verify full build succeeds
4. **Vercel Deploy** (Automatic) — Production verification

All layers must pass for code to reach production.

---

**Last Updated**: March 26, 2026  
**Status**: ACTIVE — Mandatory for all contributions  
**Questions**: Review this file + Claude.md before starting work
