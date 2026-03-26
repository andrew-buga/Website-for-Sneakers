# GitHub Secrets Setup Script
# Встав значення нижче з твого .env.local
# Replace these with your actual values from .env.local

$DATABASE_URL = "postgresql://user:password@localhost:5432/database"  # FROM .env.local
$NEXTAUTH_SECRET = "your-nextauth-secret-here"  # FROM .env.local
$JWT_SECRET = "your-jwt-secret-here"  # FROM .env.local

$repo = "andrew-buga/Website-for-Sneakers"

Write-Host "🔐 Adding GitHub Secrets..." -ForegroundColor Green
Write-Host ""

# Path to gh CLI
$gh = "C:\Program Files\GitHub CLI\gh.exe"

# Check if gh is authenticated
Write-Host "Checking GitHub CLI authentication..." -ForegroundColor Yellow
& $gh auth status

Write-Host ""
Write-Host "If not authenticated, run: gh auth login --web" -ForegroundColor Yellow
Write-Host ""

# Add public secrets
Write-Host "📝 Adding public URL secrets..." -ForegroundColor Cyan
& $gh secret set NEXT_PUBLIC_API_BASE_URL --body "https://sneakerportfolio.me" --repo $repo
& $gh secret set NEXT_PUBLIC_APP_URL --body "https://sneakerportfolio.me" --repo $repo
& $gh secret set NEXT_PUBLIC_SITE_URL --body "https://sneakerportfolio.me" --repo $repo

# Add private secrets
Write-Host ""
Write-Host "🔒 Adding private secrets..." -ForegroundColor Cyan
Write-Host "⚠️  Make sure you've updated DATABASE_URL, NEXTAUTH_SECRET, JWT_SECRET in this script!" -ForegroundColor Yellow
Write-Host ""

if ($DATABASE_URL -eq "postgresql://user:password@localhost:5432/database") {
    Write-Host "❌ ERROR: DATABASE_URL is still a placeholder!" -ForegroundColor Red
    Write-Host "Please update the script with your real DATABASE_URL from .env.local" -ForegroundColor Red
    exit 1
}

if ($NEXTAUTH_SECRET -eq "your-nextauth-secret-here") {
    Write-Host "❌ ERROR: NEXTAUTH_SECRET is still a placeholder!" -ForegroundColor Red
    Write-Host "Please update the script with your real NEXTAUTH_SECRET from .env.local" -ForegroundColor Red
    exit 1
}

if ($JWT_SECRET -eq "your-jwt-secret-here") {
    Write-Host "❌ ERROR: JWT_SECRET is still a placeholder!" -ForegroundColor Red
    Write-Host "Please update the script with your real JWT_SECRET from .env.local" -ForegroundColor Red
    exit 1
}

& $gh secret set DATABASE_URL --body $DATABASE_URL --repo $repo
& $gh secret set NEXTAUTH_SECRET --body $NEXTAUTH_SECRET --repo $repo
& $gh secret set JWT_SECRET --body $JWT_SECRET --repo $repo

Write-Host ""
Write-Host "✅ All secrets have been added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Green
Write-Host "1. Run: git push origin main" -ForegroundColor Gray
Write-Host "2. Go to: https://github.com/andrew-buga/Website-for-Sneakers/actions" -ForegroundColor Gray
Write-Host "3. Check that the workflow runs successfully" -ForegroundColor Gray
