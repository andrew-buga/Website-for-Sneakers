# SKILL-002: pnpm Lockfile Sync for Vercel CI/CD

**Applies to**: pnpm, Vercel deployment, CI/CD pipelines  
**When to use**: After adding/removing any package with `npm install`, `pnpm add`, or manual `package.json` edits  
**Severity**: Critical (breaks Vercel builds)

---

## Problem

Vercel deployments fail with:
```
ERR_PNPM_OUTDATED_LOCKFILE
pnpm-lock.yaml is not up to date with package.json
3 dependencies were added: dotenv@^17.3.1, husky@^9.1.7, lint-staged@^16.4.0
```

**Effect**: 
- ✅ Local dev works fine
- ❌ Vercel build fails
- ❌ Production deployment blocked
- ❌ Team can't deploy despite passing local tests

---

## Root Cause

1. You add a package locally:
   ```bash
   pnpm add dotenv husky lint-staged
   ```

2. This updates `package.json` AND `pnpm-lock.yaml` locally

3. But you **forget to commit `pnpm-lock.yaml`** to git (or it's in `.gitignore`)

4. GitHub receives only the updated `package.json` without the updated lockfile

5. Vercel runs:
   ```bash
   pnpm install --frozen-lockfile
   ```
   (The `--frozen-lockfile` flag means: "if package.json and lockfile don't match, FAIL")

6. Vercel sees mismatch between `package.json` (with new deps) and `pnpm-lock.yaml` (without them) → Build fails

---

## Fix

### Immediate Fix (When Build Fails)

1. **Ensure lockfile is updated locally**:
   ```bash
   pnpm install
   ```
   This creates correct lock entry for all packages in `package.json`

2. **Verify lockfile changed**:
   ```bash
   git status
   # Should show: pnpm-lock.yaml (modified)
   ```
   If it doesn't change, something is wrong — check `.gitignore`

3. **Commit lockfile**:
   ```bash
   git add pnpm-lock.yaml
   git commit -m "fix: sync pnpm-lock.yaml with package.json"
   ```

4. **Push to main**:
   ```bash
   git push origin main
   ```
   Vercel will re-run the build automatically

### Complete Example
```bash
# After adding new packages
pnpm add dotenv husky lint-staged

# Update lockfile
pnpm install

# Verify changes
git diff pnpm-lock.yaml | head -20

# Commit
git add pnpm-lock.yaml package.json
git commit -m "feat: add dotenv, husky, lint-staged"

# Push (Vercel auto-builds)
git push origin main
```

---

## Prevention

### Strategy 1: Pre-Commit Hook (Automatic)

Add to `.husky/pre-commit`:
```sh
# Check if package.json changed but pnpm-lock.yaml didn't
if git diff --cached --name-only | grep -q "package.json"; then
  if ! git diff --cached --name-only | grep -q "pnpm-lock.yaml"; then
    echo "ERROR: package.json changed but pnpm-lock.yaml not updated"
    echo "Run: pnpm install && git add pnpm-lock.yaml"
    exit 1
  fi
fi
```

### Strategy 2: GitHub Actions Check

Add to `.github/workflows/deploy-check.yml`:
```yaml
- name: Check lockfile sync
  run: |
    pnpm install --frozen-lockfile
    # If this passes, lockfile is in sync
```

### Strategy 3: Developer Discipline

**Whenever you modify `package.json`:**
1. ✅ Always run `pnpm install`
2. ✅ Always commit both `package.json` AND `pnpm-lock.yaml`
3. ✅ Never skip the lockfile

**Checklist before pushing**:
```bash
git status
# Should show BOTH files or NEITHER:
# - package.json (modified) + pnpm-lock.yaml (modified) ✅ GOOD
# - Only package.json (modified) ❌ BAD
```

---

## Example from Project

**Commit**: [f83df6a](https://github.com/andrew-buga/Website-for-Sneakers/commit/f83df6a)

**What happened**:
1. Added three packages: `dotenv`, `husky`, `lint-staged`
2. Forgot to commit `pnpm-lock.yaml`
3. Vercel build failed with `ERR_PNPM_OUTDATED_LOCKFILE`
4. **Fix**: `pnpm install` + `git add pnpm-lock.yaml` + `git commit` + `git push`

**Error Log**:
```
ERR_PNPM_OUTDATED_LOCKFILE
pnpm-lock.yaml is not up to date with package.json
3 dependencies were added: dotenv@^17.3.1, husky@^9.1.7, lint-staged@^16.4.0
```

---

## Testing

### Local Verification
```bash
# This is what Vercel runs
pnpm install --frozen-lockfile

# If it passes: ✅ Lockfile is in sync
# If it fails: ❌ Need to update lockfile
```

### After Push
1. Visit Vercel dashboard: https://vercel.com/dashboard
2. Deployment should show status: **Ready** (green checkmark)
3. If it says **Error**: Check the build logs

---

## Notes

- **Why `--frozen-lockfile`?** Ensures exact reproducible builds in CI
- **Why pnpm?** pnpm is stricter than npm about lockfile sync (which is good for CI)
- **Never commit pnpm-lock.yaml to `.gitignore`** — it MUST be in git

---

## References

- [pnpm install documentation](https://pnpm.io/cli/install)
- [pnpm frozen lockfile](https://pnpm.io/cli/install#--frozen-lockfile)
- [Vercel Node.js Package Manager Support](https://vercel.com/docs/concepts/metabase/supported-languages-and-frameworks#node.js)
