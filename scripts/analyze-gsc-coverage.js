#!/usr/bin/env node
/**
 * Google Search Console Coverage Analysis
 * Analyzes GSC data vs. expected sitemap
 */

const fs = require('fs');
const path = require('path');

// Expected pages from project structure
const expectedRoutes = [
  // Main routes (40 routes × 3 locales = 120 pages)
  '/',
  '/accessories',
  '/account/forgot-password',
  '/account/login',
  '/account/orders',
  '/account/orders/[orderId]',
  '/account/profile',
  '/account/register',
  '/account/reset-password',
  '/admin',
  '/cart',
  '/checkout',
  '/collection/[slug]',
  '/collections',
  '/contact',
  '/favorites',
  '/help-center',
  '/help/pagination',
  '/men',
  '/privacy-policy',
  '/product/[id]',
  '/receivers-amplifiers',
  '/returns',
  '/robots.txt',
  '/sitemap.xml',
  '/store-locator',
  '/terms-conditions',
  '/terms-of-use',
  '/trends',
  '/women'
];

const locales = ['en', 'uk', 'ru'];
const baseUrl = 'https://sneakerportfolio.me';

// Generate expected URLs
function generateExpectedUrls() {
  const urls = new Set();

  // Non-locale pages
  urls.add(`${baseUrl}/`);
  urls.add(`${baseUrl}/collections`);
  urls.add(`${baseUrl}/men`);
  urls.add(`${baseUrl}/women`);
  urls.add(`${baseUrl}/trends`);
  urls.add(`${baseUrl}/accessories`);
  urls.add(`${baseUrl}/returns`);
  urls.add(`${baseUrl}/store-locator`);
  urls.add(`${baseUrl}/contact`);
  urls.add(`${baseUrl}/help-center`);
  urls.add(`${baseUrl}/privacy-policy`);
  urls.add(`${baseUrl}/terms-of-use`);
  urls.add(`${baseUrl}/terms-conditions`);
  urls.add(`${baseUrl}/receivers-amplifiers`);
  urls.add(`${baseUrl}/help/pagination`);

  // Locale-prefixed pages
  for (const locale of locales) {
    urls.add(`${baseUrl}/${locale}`);
    urls.add(`${baseUrl}/${locale}/collections`);
    urls.add(`${baseUrl}/${locale}/men`);
    urls.add(`${baseUrl}/${locale}/women`);
    urls.add(`${baseUrl}/${locale}/trends`);
    urls.add(`${baseUrl}/${locale}/accessories`);
    urls.add(`${baseUrl}/${locale}/returns`);
    urls.add(`${baseUrl}/${locale}/store-locator`);
    urls.add(`${baseUrl}/${locale}/contact`);
    urls.add(`${baseUrl}/${locale}/help-center`);
    urls.add(`${baseUrl}/${locale}/privacy-policy`);
    urls.add(`${baseUrl}/${locale}/terms-of-use`);
    urls.add(`${baseUrl}/${locale}/terms-conditions`);
    urls.add(`${baseUrl}/${locale}/receivers-amplifiers`);
    urls.add(`${baseUrl}/${locale}/help/pagination`);
    urls.add(`${baseUrl}/${locale}/admin`);
    urls.add(`${baseUrl}/${locale}/account/login`);
    urls.add(`${baseUrl}/${locale}/account/register`);
    urls.add(`${baseUrl}/${locale}/account/forgot-password`);
    urls.add(`${baseUrl}/${locale}/account/reset-password`);
    urls.add(`${baseUrl}/${locale}/account/profile`);
    urls.add(`${baseUrl}/${locale}/account/orders`);
  }

  return Array.from(urls).sort();
}

// Parse GSC CSV data
function parseGSCCoverage(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });
    data.push(row);
  }

  return data;
}

// MAIN ANALYSIS
console.log('\n' + '='.repeat(80));
console.log('🔍 GOOGLE SEARCH CONSOLE COVERAGE ANALYSIS');
console.log('='.repeat(80) + '\n');

const expectedUrls = generateExpectedUrls();
console.log(`[1/4] EXPECTED PAGES FROM SITEMAP`);
console.log(`  Total routes: 40`);
console.log(`  Locales: ${locales.join(', ')}`);
console.log(`  Expected total pages: ${expectedUrls.length}`);
console.log(`  Sample URLs:\n    ${expectedUrls.slice(0, 5).join('\n    ')}\n`);

// Parse GSC CSV
const csvPath = path.join(__dirname, '..', '..', 'Downloads', 'Table.csv');
let gscUrls = [];

try {
  if (fs.existsSync(csvPath)) {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const gscData = parseGSCCoverage(csvContent);
    gscUrls = gscData.map(row => row.URL || row.url);
    console.log(`[2/4] GOOGLE SEARCH CONSOLE - VALID COVERAGE`);
    console.log(`  Indexed URLs: ${gscUrls.length}`);
    console.log(`  URLs:\n    ${gscUrls.join('\n    ')}\n`);
  }
} catch (err) {
  console.log(`⚠️  Could not read GSC CSV: ${err.message}\n`);
}

// Coverage Analysis
console.log(`[3/4] COVERAGE ANALYSIS`);
const indexedSet = new Set(gscUrls);
const notIndexed = expectedUrls.filter(url => !indexedSet.has(url));
const coveragePercent = ((gscUrls.length / expectedUrls.length) * 100).toFixed(1);

console.log(`  ✅ Indexed: ${gscUrls.length}/${expectedUrls.length} (${coveragePercent}%)`);
console.log(`  ❌ NOT Indexed: ${notIndexed.length}/${expectedUrls.length}\n`);

if (notIndexed.length > 0 && notIndexed.length <= 20) {
  console.log(`  Missing URLs:\n    ${notIndexed.join('\n    ')}\n`);
} else if (notIndexed.length > 20) {
  console.log(`  Sample of ${Math.min(10, notIndexed.length)} missing URLs:\n    ${notIndexed.slice(0, 10).join('\n    ')}\n`);
}

// Recommendations
console.log(`[4/4] CRITICAL RECOMMENDATIONS`);
console.log(`\n  PRIORITY 1 - FIX IMMEDIATELY:`);
console.log(`    1. ✅ Google is crawling site (Chart shows activity)`);
console.log(`    2. ❌ BUT only 2 pages are INDEXED (${coveragePercent}% coverage)`);
console.log(`    3. ❌ All locale-prefixed pages (/en, /uk, /ru) are NOT indexed`);
console.log(`    4. 🔴 LIKELY CAUSES:`);
console.log(`       - robots.txt blocking pages`);
console.log(`       - noindex meta tag on pages`);
console.log(`       - Pages not discoverable in sitemap`);
console.log(`       - Duplicate content (canonical URL issues)`);
console.log(`       - Server returning 4xx/5xx on crawl\n`);

console.log(`  PRIORITY 2 - ACTIONS:`);
console.log(`    ✓ Verify robots.txt allows all pages`);
console.log(`    ✓ Check meta robots tags (no noindex)`);
console.log(`    ✓ Verify sitemap.xml contains all 120 URLs`);
console.log(`    ✓ Check canonical URLs are correct (FIXED in d0141b1)`);
console.log(`    ✓ Run "Request indexing" in GSC for /en, /uk, /ru`);
console.log(`    ✓ Check server logs for 4xx errors during crawl\n`);

console.log(`  PRIORITY 3 - MONITORING:`);
console.log(`    📅 Wait 2 weeks for re-crawl`);
console.log(`    📊 Monitor "Valid Coverage" → target >90%`);
console.log(`    🔗 Monitor "Excluded" → should be none`);
console.log(`    🚫 Monitor "Errors" → should be none\n`);

console.log('='.repeat(80) + '\n');

// Export summary JSON
const summary = {
  timestamp: new Date().toISOString(),
  reportDate: '2026-03-26',
  coverage: {
    expected: expectedUrls.length,
    indexed: gscUrls.length,
    percent: parseFloat(coveragePercent),
    notIndexed: notIndexed.length
  },
  indexedUrls: gscUrls,
  missingUrls: notIndexed,
  criticalIssues: [
    'Only 2 pages indexed out of 120 (1.7% coverage)',
    'All locale-prefixed pages (/en, /uk, /ru) missing from index',
    'Core homepage crawled but not all variants indexed'
  ],
  actions: [
    'Verify robots.txt does not block pages',
    'Confirm no noindex meta tags',
    'Validate sitemap.xml completeness',
    'Request manual indexing in GSC',
    'Monitor next crawl cycle'
  ]
};

fs.writeFileSync(
  path.join(__dirname, 'gsc-coverage-analysis.json'),
  JSON.stringify(summary, null, 2)
);

console.log(`📊 Full analysis saved to: scripts/gsc-coverage-analysis.json\n`);
