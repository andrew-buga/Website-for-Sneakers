# Deployment Guard System Documentation

## Overview

The Streater Sneakers deployment guard system is a **3-level protection system** that prevents broken code from reaching production. This document covers all aspects of the guard system, configuration, and monitoring.

---

## Architecture: Three Levels of Protection

### Level 1: Local Pre-Commit Hooks (Fastest)
**Location**: `.husky/pre-commit`  
**Trigger**: Before each git commit  
**Time**: ~2-3 seconds  
**Checks**:
- ✅ TypeScript compilation (`npx tsc --noEmit`)
- ✅ ESLint validation via lint-staged
- ✅ No merge conflicts (`git diff --check`)

**Benefit**: Catch errors before they enter the repository

---

### Level 2: Post-Merge Hooks (Recovery)
**Location**: `.husky/post-merge`  
**Trigger**: After git merge/pull/rebase  
**Time**: ~5-10 seconds  
**Checks**:
- ✅ Dependencies sync if `package.json` changed
- ✅ Dependencies sync if `pnpm-lock.yaml` changed
- ✅ TypeScript verification (optional warning)

**Benefit**: Prevent broken builds after pulling changes

---

### Level 3: GitHub Actions CI/CD (Continuous)
**Location**: `.github/workflows/deploy-check.yml`  
**Trigger**: Every push to `main` or `develop`  
**Time**: ~15-20 minutes  
**Checks**:
- ✅ TypeScript compiler verification
- ✅ ESLint (full codebase, not just staged)
- ✅ Environment variable validation
- ✅ Full build verification (120 pages)
- ✅ All dependencies installed & synced

**Benefit**: Independent verification before Vercel deployment

---

## Usage

### Pre-Commit Checks (Automatic)

The pre-commit hook runs automatically before every commit:

```bash
git commit -m "my changes"
# → Hook runs automatically
# → TypeScript check
# → ESLint check
# → Merge conflict check
# → If all pass: commit created
# → If any fail: commit blocked (fix required)
```

**Skip pre-commit (NOT RECOMMENDED):**
```bash
git commit --no-verify -m "my changes"  # Bypasses all hooks
```

### Post-Merge Hooks (Automatic)

The post-merge hook runs automatically after pull/merge/rebase:

```bash
git pull origin main
# → Hook detects changes
# → Checks if package.json changed → npm install
# → Checks if pnpm-lock.yaml changed → pnpm install
# → TypeScript verification (optional)
```

### Manual Pre-Deploy Check

Run the comprehensive pre-deploy check locally before pushing:

```bash
npm run check:deploy
```

This runs:
1. Git status check (no uncommitted changes)
2. TypeScript compilation
3. ESLint validation
4. Environment variable check
5. Full build verification (120 pages)
6. Merge conflict check

✅ Output: "Ready to deploy!" or detailed error messages

### Environment Variable Validation

Check if all required environment variables are configured:

```bash
npm run check:env
```

**Required variables** (defined in `scripts/check-env.js`):
- `NEXT_PUBLIC_API_BASE_URL` - API endpoint URL
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js encryption secret

---

## GitHub Actions Workflow

### Workflow File
**Path**: `.github/workflows/deploy-check.yml`  
**Trigger**: Every push to `main` or `develop`

### Step-by-Step Execution

1. **Checkout code** - Clone repository at current commit
2. **Setup Node.js 22** - Install Node and cache npm packages
3. **Install dependencies** - `npm install`
4. **TypeScript check** - `npx tsc --noEmit`
5. **ESLint validation** - `npm run lint` (full codebase)
6. **Environment check** - `npm run check:env` (with fallback defaults for CI)
7. **Build verification** - `npm run build` (generates all 120 pages)
8. **Page count check** - Verify exactly 120 pages were generated
9. **Status report** - Success or failure summary

### GitHub Actions Secrets Required

Configure these in **Settings → Secrets and variables → Actions**:

```
NEXT_PUBLIC_API_BASE_URL  = your-api-url
DATABASE_URL              = postgresql://...
NEXTAUTH_SECRET           = your-secret-key
JWT_SECRET                = your-jwt-secret
NEXT_PUBLIC_APP_URL       = https://sneakerportfolio.me
NEXT_PUBLIC_SITE_URL      = https://sneakerportfolio.me
```

**Note**: If secrets are not configured, the workflow uses fallback test values to verify build structure.

### Workflow Badge

Add this to your README.md:

```markdown
[![Deployment Guard](https://github.com/andrew-buga/Website-for-Sneakers/workflows/Deployment%20Guard%20-%20Pre-Deploy%20Checks/badge.svg)](https://github.com/andrew-buga/Website-for-Sneakers/actions)
```

---

## Configuration Files

### `.husky/pre-commit`
Runs before each commit. Prevents commits with errors.

**To disable temporarily**:
```bash
chmod -x .husky/pre-commit
```

**To re-enable**:
```bash
chmod +x .husky/pre-commit
```

### `.husky/post-merge`
Runs after merge/pull. Keeps dependencies in sync.

### `scripts/check-env.js`
Validates that required environment variables are configured.

**To add new required variables**:
1. Edit `scripts/check-env.js`
2. Add variable name to `requiredEnv` array
3. Commit and push
4. GitHub Actions will enforce it

### `scripts/check-deploy.js`
Comprehensive pre-deploy readiness check.

**Usage**:
```bash
npm run check:deploy
```

---

## Common Issues & Solutions

### Issue: Pre-commit hook blocks my commit

**Cause**: TypeScript error, ESLint error, or merge conflict detected

**Solution**:
1. Read the error message from the hook
2. Fix the issue in your code
3. Stage the fix: `git add <file>`
4. Try commit again

### Issue: "Cannot find module" error in pre-commit

**Cause**: Dependencies not installed or npx cache stale

**Solution**:
```bash
npm install
git commit -m "my changes"  # Try again
```

### Issue: Hook says "Merge conflicts detected"

**Cause**: You have unresolved merge conflicts

**Solution**:
1. Resolve all merge conflicts in files
2. Do NOT edit `.git/MERGE_HEAD` files
3. Stage resolved files: `git add <file>`
4. Try commit again

### Issue: GitHub Actions workflow failing with "120/120" not in output

**Cause**: Build generated fewer than 120 pages (some routes failed)

**Solution**:
1. Check workflow logs for build errors
2. Run `npm run build` locally to reproduce
3. Fix the issue and push a new commit

### Issue: GitHub Actions secrets not working

**Cause**: Secrets not set in GitHub settings or typo in secret name

**Solution**:
1. Go to **Settings → Secrets and variables → Actions**
2. Verify all secrets are present
3. Check secret names match exactly in `.github/workflows/deploy-check.yml`
4. Re-run the workflow: **Actions → Deployment Guard → Re-run jobs**

---

## Deployment Flow

```
USER MAKES CODE CHANGES
        ↓
git commit -m "my changes"
        ↓
PRE-COMMIT HOOK (Level 1)
├─ TypeScript check
├─ ESLint check
├─ Merge conflict check
└─ All pass? → Commit created
   Any fail? → Commit blocked
        ↓
CODE PUSHED TO GITHUB
← Pre-merge branch
        ↓
GITHUB ACTIONS WORKFLOW (Level 3)
├─ Checkout code
├─ Install dependencies
├─ TypeScript check
├─ ESLint check
├─ Environment check
├─ Build verification (120 pages)
└─ All pass? → Green checkmark
   Any fail? → Red X, blocks Vercel
        ↓
MANUAL VERIFICATION (Developer)
└─ Review workflow results
        ↓
VERCEL DEPLOYMENT
└─ Automatic deploy if GitHub Actions pass
        ↓
PRODUCTION LIVE
```

---

## Maintenance

### Monthly Checks

1. **Verify hooks are working**:
   ```bash
   git commit --amend  # Should trigger pre-commit hook
   ```

2. **Check workflow status**:
   - Go to your GitHub repo
   - Click **Actions** tab
   - Verify latest workflows show ✅

3. **Update Node.js version** (if new LTS released):
   - Edit `.github/workflows/deploy-check.yml`
   - Update `node-version: '22'` to latest LTS
   - Commit and push

### Quarterly Audits

1. **Review failed workflows**:
   ```bash
   # GitHub Actions → Deployment Guard → Filter by failed
   ```

2. **Check pre-commit hook performance**:
   - Time commit: does hook take <5 seconds?
   - If slow: review what checks are running

3. **Verify 120 pages still generate**:
   ```bash
   npm run build
   # Look for: "Generating static pages using 7 workers (120/120)"
   ```

---

## Advanced: Customization

### Add New Pre-Commit Check

1. Edit `.husky/pre-commit`
2. Add new check block at the end:
   ```bash
   echo "⏳ New check..."
   node scripts/my-new-check.js
   if [ $? -ne 0 ]; then
     echo "❌ Check failed"
     exit 1
   fi
   ```
3. Test: `git commit -m "test"`

### Add New GitHub Actions Check

1. Edit `.github/workflows/deploy-check.yml`
2. Add new `- name: My New Check` step in `pre-deploy-checks` job
3. Push to a branch and verify workflow runs

### Auto-Fix Issues in Pre-Commit

Modify lint-staged in `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": "eslint --fix"
}
```

This auto-fixes ESLint issues before commit.

---

## Monitoring & Alerts

### GitHub Actions Status

View deployment check status:
- **Repository Settings** → **Webhooks** → View recent deliveries
- **Actions** tab → **Deployment Guard** workflow

### Slack Integration (Optional)

Configure workflow to notify Slack on failures:

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Deployment checks failed on main branch"
      }
```

### Email Notifications

Enable GitHub email notifications:
- Go to **Settings → Email preferences**
- Enable "Notify me when checks fail"

---

## Performance Metrics

### Build Time Targets

| Stage | Target | Typical |
|-------|--------|---------|
| Pre-commit hook | <5s | 2-3s |
| Post-merge hook | <10s | 5-8s |
| GitHub Actions | <30m | 15-20m |
| Total (push to live) | <30m | ~20m |

### Page Generation

| Metric | Target | Status |
|--------|--------|--------|
| Total routes | 40 | ✅ |
| Locales | 3 (en, uk, ru) | ✅ |
| Total pages | 120 | ✅ |
| API routes | 25+ | ✅ |
| Build time | <25s | ✅ |

---

## Troubleshooting Deployment Guard

### Debug Pre-Commit Hook

```bash
# Run hook manually
./.husky/pre-commit

# See detailed output
bash -x ./.husky/pre-commit
```

### Debug GitHub Actions Locally

```bash
# Use https://github.com/act-rs/act
act push --job pre-deploy-checks
```

### View Detailed Workflow Logs

1. Go to **Actions** → **Deployment Guard**
2. Click latest workflow run
3. Expand failing step to see full output

### Force Workflow Re-run

1. **Actions** → **Deployment Guard**
2. Click latest run
3. **Re-run failed jobs** or **Re-run all jobs**

---

## Related Documentation

- [Husky Configuration](https://typicode.github.io/husky/)
- [GitHub Actions Workflows](https://docs.github.com/actions/using-workflows)
- [Lint-Staged Guide](https://github.com/okonet/lint-staged)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [ESLint Rules](https://eslint.org/docs/rules/)

---

## Support & Questions

For issues with the deployment guard system:

1. **Check your git status**: `git status --porcelain`
2. **Review recent commits**: `git log --oneline -10`
3. **Run manual checks**: `npm run check:env`, `npm run check:deploy`
4. **Check GitHub Actions logs**: Actions tab in GitHub repo
5. **File an issue** on GitHub with detailed error messages

---

**Last Updated**: March 26, 2026  
**Version**: 1.0 (Phase 3 Complete)  
**Maintainer**: @andrew-buga
