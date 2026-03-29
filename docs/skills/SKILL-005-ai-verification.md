# SKILL-005: AI Agent Verification Protocol (Anti-Pattern)

**Applies to**: Working with Copilot, Claude, ChatGPT, or any AI assistant  
**When to use**: Every time an agent claims to have "fixed" something  
**Severity**: Critical (prevents iteration on incomplete work)

---

## Problem

AI agents (Copilot, Claude, etc.) frequently claim:
> "I fixed the issue" 
> "Your code is now working"
> "The build passes"

**WITHOUT VERIFICATION.**

Then the developer later finds:
- ❌ Build still fails
- ❌ Error persists
- ❌ Code produces different behavior
- ❌ Deployment blocked

**Effect**: Developers waste time discovering the "fix" was incomplete, and the real solution requires starting over.

---

## Root Cause

### Why AI Agents Make This Mistake

1. **No execution environment** — AI can't actually run `pnpm build` or visit a webpage
2. **Overconfidence** — AI is trained to be helpful and sounds confident even without proof
3. **Single-shot thinking** — AI provides one answer, then moves to next topic
4. **No feedback loop** — AI doesn't re-run checks to verify the fix worked

### How This Manifests

**Bad agent interaction**:
```
User: "My build fails with ERR_PNPM_OUTDATED_LOCKFILE"
Agent: "I've fixed it. I've added pnpm install to the build script.
        Your code is now ready to deploy."
User: [pushes to Vercel]
User: "Build still fails! The same error!"
Agent: [has no idea because it never actually ran `pnpm build`]
```

**Good agent interaction**:
```
User: "My build fails with ERR_PNPM_OUTDATED_LOCKFILE"
Agent: "I'll fix this by syncing the lockfile. First, let me run:
        1. pnpm install
        2. git add pnpm-lock.yaml && git commit
        3. npm run build to verify it works
        [runs commands...]
        ✅ Build succeeded with 0 errors. Lockfile is synced."
User: [pushes with confidence because verified]
```

---

## Fix: Verification Protocol

### Tier 1: Code Changes (Minimum Required)

For every code fix, require the agent to show:

1. **The actual diff** — Show exactly what changed:
   ```
   - const x = undefined
   + const x = resolveParams()
   ```

2. **Before/After code blocks** — Visually compare the change:
   ```tsx
   // BEFORE
   const locale = params.locale
   
   // AFTER
   const { locale } = use(params)
   ```

3. **Which files changed** — List every modified file:
   ```
   - app/[locale]/cart/page.tsx
   - app/[locale]/favorites/page.tsx (2 changes)
   ```

**Require from agent**: "Show me the exact changes in code blocks"

---

### Tier 2: Build Verification (Always Required)

For any fix affecting build/deployment:

1. **Run `pnpm build` locally** — Show the output:
   ```
   ✓ Compiled successfully in 12.7s
   ✓ Generating static pages using 7 workers (120/120) in 4.5s
   ```
   
   ✅ Accept only if:
   - "Compiled successfully" message
   - "120/120 pages" generated
   - "0 errors" mentioned

   ❌ Reject if:
   - "Error:" appears anywhere
   - Build time > 5 minutes
   - Page count < 120

2. **Run `npx tsc --noEmit`** — Verify TypeScript:
   ```
   ✓ No TypeScript errors found
   ```

3. **Run `npm run lint`** — Verify ESLint:
   ```
   ✓ All files pass linting
   ```

**Require from agent**: "Run `pnpm build` and show me the output"

---

### Tier 3: Production Verification (Critical)

For any fix affecting production:

1. **Commit message** — Show the git commit:
   ```
   git commit -m "fix: description of what was fixed"
   ```

2. **Push status** — Show the push to GitHub:
   ```
   git push origin main
   → Status: "main -> main" (successful)
   ```

3. **Test production URL** — Visit the actual website:
   ```
   Before: https://sneakerportfolio.me/en/cart → BLACK SCREEN
   After:  https://sneakerportfolio.me/en/cart → CART LOADS
   ```
   
   Take a screenshot or describe what you see.

**Require from agent**: "Commit, push, and then test the URL in an incognito browser"

---

## Checklist for Every "Fix"

```
☐ Code Change Verification
  ☐ Agent shows actual diff?
  ☐ Agent shows before/after code blocks?
  ☐ Agent lists all modified files?

☐ Build Verification
  ☐ Agent ran `pnpm build`?
  ☐ Build output shows "Compiled successfully"?
  ☐ All 120 pages generated?
  ☐ Zero TypeScript errors?
  ☐ Zero ESLint errors?

☐ Production Verification
  ☐ Agent committed the fix?
  ☐ Agent pushed to main?
  ☐ Vercel deployment succeeded?
  ☐ Production URL tested in incognito?
  ☐ Issue is actually resolved?

☐ Final Sign-Off
  ☐ Agent provided evidence for all checks above?
  ☐ You personally verified the production URL?
  ☐ You ran `pnpm build` yourself if skeptical?
```

---

## How to Enforce This

### Template for Asking for a Fix

```
I have a problem: [describe issue]

Please fix it by:
1. Reading the file at [path] to understand context
2. Making the code change
3. Running `pnpm build` and showing the output
4. Running `pnpm tsc --noEmit` and showing the result
5. Git committing with message "fix: [description]"
6. Git pushing to main
7. Testing the production URL in incognito browser
8. Showing me a screenshot or description of the result

Show me:
- The exact code diff (before/after)
- The `pnpm build` output
- The git commit hash
- A description of testing

ONLY then will I consider this fixed.
```

### Red Flags

When an agent says ANY of these without showing proof:
- "I fixed it"
- "It should work now"
- "This will solve the problem"
- "Your code is ready"

**STOP** and ask: "Show me the build output and production test"

---

## Example from Project

**Bad Case** (without verification):
```
User: "Cart shows black screen"
Agent: "I've added a mounted state to the provider. Fixed!"
User: [pushes]
User: "Still black screen!"
Agent: "Hmm, let me check..."
[Wasted 30 minutes debugging]
```

**Good Case** (with verification):
```
User: "Cart shows black screen"
Agent: "I'll fix the hydration mismatch. Let me:
        1. Add mounted state to CartProvider
        2. Gate children rendering
        3. Run pnpm build..."
        [shows build output: ✓ 120/120 pages]
        
        "4. Commit and test on production..."
        [shows git commit]
        
        "5. Test production at https://...
         [description: Cart page loads, items visible]
         
        ✅ Black screen is fixed. Verified on production."

User: [confident to push because all steps verified]
```

---

## Protocol in Practice

### For This Project

**Going forward**, never accept a "fix" without:

1. **Code diff** — Show the change
2. **Build log** — Show `pnpm build` passed
3. **Git log** — Show `git log --oneline -1`
4. **Production test** — Show the URL works
5. **Screenshot** — Show what you see on the live site

---

## References

- [How to Verify Code Changes](https://github.com/conventional-commits/conventionalcommits.org)
- [Testing in Production](https://www.vercel.com/docs/concepts/deployments/environments)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)
