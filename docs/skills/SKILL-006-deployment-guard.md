# SKILL-006: Three-Level Deployment Guard System

**Applies to**: Next.js, Vercel, CI/CD, pre-commit hooks  
**When to use**: Setting up a production-grade Next.js project  
**Severity**: High (prevents broken code from reaching production)

---

## Problem

Without protection layers, broken code reaches production:

1. Developer commits untested code
2. GitHub Actions skips/doesn't catch issues
3. Vercel build succeeds by accident
4. Production deploys with bugs
5. Users see black screens, errors, broken features

---

## Solution: Three-Level Guard System

Create **three independent layers** of protection that run at different times:

### Level 1: Pre-Commit Hooks (Local, ~2-3 seconds)

**When**: Before `git commit` executes  
**Tools**: Husky + lint-staged  
**Checks**:
- ✅ TypeScript compilation
- ✅ ESLint validation  
- ✅ No merge conflict markers

**Setup**:
```bash
npm install husky lint-staged --save-dev
npx husky install
npx husky add .husky/pre-commit "npx tsc --noEmit && npx lint-staged"
```

**.husky/pre-commit**:
```sh
#!/usr/bin/env sh

echo "🔍 Running pre-commit checks..."

echo "⏳ Checking TypeScript..."
npx tsc --noEmit || { echo "❌ TypeScript errors"; exit 1; }

echo "⏳ Running ESLint..."
npx lint-staged || { echo "❌ ESLint errors"; exit 1; }

echo "⏳ Checking for merge conflicts..."
git diff --check || { echo "❌ Merge markers found"; exit 1; }

echo "✅ Pre-commit checks passed"
```

**Effect**: Developer can't commit broken code

---

### Level 2: Post-Merge Hooks (Local, ~5-10 seconds)

**When**: After `git pull`, `git merge`, `git rebase`  
**Tools**: Husky  
**Checks**:
- ✅ Dependencies are synced (`pnpm install` if `package.json` changed)
- ✅ TypeScript still compiles

**.husky/post-merge**:
```sh
#!/usr/bin/env sh

echo "🔄 Running post-merge checks..."

if git diff --name-only HEAD~1 | grep -E "package\.json|pnpm-lock\.yaml"; then
  echo "⏳ Dependencies may have changed, syncing..."
  pnpm install
fi

echo "⏳ Verifying TypeScript..."
npx tsc --noEmit || echo "⚠️  TypeScript issues (non-blocking)"

echo "✅ Post-merge checks complete"
```

**Effect**: After pulling changes, dependencies are automatically synced

---

### Level 3: GitHub Actions CI/CD (Remote, ~15-20 minutes)

**When**: Every push to `main` or `develop`  
**Tools**: GitHub Actions  
**Checks**:
- ✅ Full TypeScript compilation
- ✅ ESLint on entire codebase
- ✅ Environment variable validation
- ✅ Complete build (all pages)
- ✅ Deployment-ready verification

**.github/workflows/deploy-check.yml**:
```yaml
name: Deploy Check

on:
  push:
    branches: [main, develop]

jobs:
  pre-deploy-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: TypeScript Check
        run: npx tsc --noEmit
      
      - name: ESLint Check
        run: npm run lint
      
      - name: Environment Variables Check
        run: npm run check:env
      
      - name: Build Verification
        run: npm run build
      
      - name: Verify 120 Pages Generated
        run: |
          COUNT=$(find .next -name "*.html" | wc -l)
          if [ "$COUNT" -lt 120 ]; then
            echo "Error: Only $COUNT pages generated, expected 120"
            exit 1
          fi
```

**Effect**: GitHub validates before Vercel even touches the code

---

## Installation Steps

### Step 1: Install Dependencies
```bash
npm install husky lint-staged --save-dev
```

### Step 2: Initialize Husky
```bash
npx husky install
```

### Step 3: Create Pre-Commit Hook
```bash
npx husky add .husky/pre-commit

# Edit .husky/pre-commit:
#!/usr/bin/env sh
npx tsc --noEmit && npx lint-staged && git diff --check
```

### Step 4: Create Post-Merge Hook
```bash
npx husky add .husky/post-merge

# Edit .husky/post-merge:
#!/usr/bin/env sh
if git diff --name-only HEAD~1 | grep -E "package\.json|pnpm-lock\.yaml"; then
  pnpm install
fi
```

### Step 5: Create GitHub Actions Workflow

Create `.github/workflows/deploy-check.yml` (see above)

### Step 6: Update package.json Scripts
```json
{
  "scripts": {
    "check:env": "node scripts/check-env.js",
    "check:deploy": "pnpm run tsc --noEmit && npm run lint && npm run build",
    "build": "pnpm run check:merge-markers && next build"
  }
}
```

### Step 7: Test Locally
```bash
# Try to commit broken code
echo "broken code" >> app/page.tsx
git add app/page.tsx
git commit -m "test"
# Should FAIL with TypeScript errors
```

---

## How It Protects Production

### Timeline of Protection

```
Developer makes changes
    ↓
[Level 1] Pre-Commit Hook
  ├─ Code compiles? NO → ❌ Can't commit
  ├─ Code lints? NO → ❌ Can't commit
  └─ Code compiles? YES → Continue
    ↓
[Commit created locally]
    ↓
Developer runs: git push origin main
    ↓
[Level 3] GitHub Actions CI/CD
  ├─ Code compiles? NO → ❌ Block Vercel
  ├─ Build succeeds? NO → ❌ Block Vercel
  ├─ 120 pages? NO → ❌ Block Vercel
  └─ All checks pass? YES → Continue
    ↓
[Vercel auto-deploys]
    ↓
🟢 Production has tested, verified code
```

---

## Example from Project

**File**: `.github/workflows/deploy-check.yml`  
**File**: `.husky/pre-commit`  
**File**: `.husky/post-merge`

**What happened**:
1. Team added dependencies without syncing lockfile
2. Vercel deployment failed
3. **Prevention**: Post-merge hook would have auto-synced
4. **Prevention**: Level 3 CI/CD would have caught the mismatch

---

## Maintenance

### Quarterly Review

Every 3 months, verify:

```bash
# Check Level 1 works
git add .
git commit -m "test"  # Pre-commit should run

# Check Level 2 works
git pull origin main  # Post-merge should run

# Check Level 3
# Go to: https://github.com/andrew-buga/Website-for-Sneakers/actions
# Verify recent deployments passed all checks
```

### Update Dependencies

```bash
# Husky
npm update husky

# lint-staged
npm update lint-staged

# GitHub Actions
# Check https://github.com/actions/checkout for latest version
# Update workflows if newer majors exist
```

---

## Common Issues

| Problem | Solution |
|---|---|
| Pre-commit not running | Run `npx husky install` |
| GitHub Actions not triggering | Check branch protection rules allow PRs |
| Build fails but locally passes | Clear `.next/` cache: `rm -rf .next && pnpm build` |
| Hooks too slow | Reduce ESLint scope or run only on staged files |

---

## Benefits

✅ Catch bugs before they commit  
✅ Never deploy broken code  
✅ Automatic dependency sync  
✅ Independent verification on GitHub  
✅ Peace of mind before Vercel build  

---

## References

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [GitHub Actions Workflows](https://docs.github.com/en/actions)
- [Vercel Deployment Protection](https://vercel.com/docs/deployments/environments)
