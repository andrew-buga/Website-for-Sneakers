/**
 * Phase 2: SEO Audit
 * For each page, extract:
 * - Title, meta description, H1, canonical, og:* tags, schema, alt text
 * - Validate lengths and flag issues
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { chromium } = require('playwright');

const PAGES_FILE = path.join(__dirname, '../analysis/crawled-pages.json');
const OUTPUT_FILE = path.join(__dirname, '../analysis/seo-audit.json');
const BATCH_SIZE = 5; // Process 5 pages at a time to avoid memory issues

let browser;

async function checkUrlStatus(url) {
  return new Promise((resolve) => {
    https.head(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => {
      resolve(0); // Network error
    });
  });
}

async function auditPage(page, pageData) {
  try {
    console.log(`   Auditing: ${pageData.url}`);
    
    // Navigate to page with timeout
    await page.goto(pageData.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Extract SEO data via JavaScript
    const seoData = await page.evaluate(() => {
      const result = {
        title: document.title || '',
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        metaRobots: document.querySelector('meta[name="robots"]')?.content || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        h1: {
          text: document.querySelector('h1')?.textContent?.trim() || '',
          count: document.querySelectorAll('h1').length,
        },
        theOpenGraph: {
          title: document.querySelector('meta[property="og:title"]')?.content || '',
          description: document.querySelector('meta[property="og:description"]')?.content || '',
          image: document.querySelector('meta[property="og:image"]')?.content || '',
          url: document.querySelector('meta[property="og:url"]')?.content || '',
        },
        schema: {
          found: !!document.querySelector('script[type="application/ld+json"]'),
          types: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(script => {
            try {
              const json = JSON.parse(script.textContent);
              return json['@type'] || json.type || 'unknown';
            } catch {
              return 'invalid-json';
            }
          }),
        },
        images: {
          total: document.querySelectorAll('img').length,
          withoutAlt: Array.from(document.querySelectorAll('img')).filter(img => !img.alt || img.alt.trim() === '').map(img => ({
            src: img.src,
            alt: img.alt || '[empty]',
          })),
        },
        internalLinks: Array.from(document.querySelectorAll('a[href]')).map(a => ({
          href: a.href,
          text: a.textContent?.trim().substring(0, 50) || '',
        })).filter(link => link.href.includes('sneakerportfolio.me') && !link.href.includes('#')),
      };
      return result;
    });
    
    // Validate and flag issues
    const issues = [];
    const warnings = [];
    
    // Title validation: 30-60 characters is ideal
    if (seoData.title.length < 30) {
      warnings.push(`Title too short: ${seoData.title.length} chars (recommended: 30-60)`);
    } else if (seoData.title.length > 60) {
      warnings.push(`Title too long: ${seoData.title.length} chars (recommended: 30-60)`);
    }
    
    // Meta description: 70-160 characters is ideal
    if (!seoData.metaDescription) {
      issues.push('Missing meta description');
    } else if (seoData.metaDescription.length < 70) {
      warnings.push(`Meta description too short: ${seoData.metaDescription.length} chars (recommended: 70-160)`);
    } else if (seoData.metaDescription.length > 160) {
      warnings.push(`Meta description too long: ${seoData.metaDescription.length} chars (recommended: 70-160)`);
    }
    
    // H1 validation
    if (seoData.h1.count === 0) {
      issues.push('Missing H1 tag');
    } else if (seoData.h1.count > 1) {
      issues.push(`Multiple H1 tags found: ${seoData.h1.count} (recommended: 1)`);
    }
    
    // Canonical validation
    if (!seoData.canonical) {
      warnings.push('Missing canonical URL');
    } else if (!seoData.canonical.includes(pageData.url.split('?')[0])) {
      warnings.push(`Canonical mismatch: ${seoData.canonical} vs current URL`);
    }
    
    // OpenGraph validation
    if (!seoData.theOpenGraph.title) {
      warnings.push('Missing og:title');
    }
    if (!seoData.theOpenGraph.description) {
      warnings.push('Missing og:description');
    }
    if (!seoData.theOpenGraph.image) {
      warnings.push('Missing og:image');
    }
    
    // Images without alt
    if (seoData.images.withoutAlt.length > 0) {
      warnings.push(`Images without alt: ${seoData.images.withoutAlt.length}`);
    }
    
    // Schema validation (especially for product/category pages)
    if (pageData.pageType === 'product' && !seoData.schema.found) {
      warnings.push('Missing schema.org markup on product page');
    }
    
    // Check internal links for broken links (404 status)
    const brokenLinks = [];
    for (const link of seoData.internalLinks.slice(0, 10)) { // Check first 10 only to save time
      const status = await checkUrlStatus(link.href);
      if (status === 404) {
        brokenLinks.push({
          href: link.href,
          text: link.text,
          status,
        });
      }
    }
    if (brokenLinks.length > 0) {
      issues.push(`Broken internal links found: ${brokenLinks.length}`);
    }
    
    return {
      url: pageData.url,
      locale: pageData.locale,
      pageType: pageData.pageType,
      statusCode: 200, // Assume 200 since we loaded it
      seo: seoData,
      issues,
      warnings,
      brokenLinks,
      audited_at: new Date().toISOString(),
    };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      url: pageData.url,
      locale: pageData.locale,
      pageType: pageData.pageType,
      statusCode: 0,
      seo: null,
      issues: [`Error during audit: ${error.message}`],
      warnings: [],
      brokenLinks: [],
      audited_at: new Date().toISOString(),
    };
  }
}

async function runSeoAudit() {
  try {
    const pagesData = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));
    const pages = pagesData.pages || [];
    
    console.log(`\n🔍 Starting SEO Audit for ${pages.length} pages...`);
    console.log(`(Processing in batches of ${BATCH_SIZE} to avoid memory issues)\n`);
    
    browser = await chromium.launch({ headless: true });
    const results = [];
    
    // Process pages in batches
    for (let i = 0; i < pages.length; i += BATCH_SIZE) {
      const batch = pages.slice(i, Math.min(i + BATCH_SIZE, pages.length));
      console.log(`\n📄 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pages.length / BATCH_SIZE)}`);
      
      const batchPromises = batch.map(async (pageData) => {
        const page = await browser.newPage();
        try {
          const result = await auditPage(page, pageData);
          results.push(result);
        } finally {
          await page.close();
        }
      });
      
      await Promise.all(batchPromises);
    }
    
    // Summary statistics
    const summary = {
      total_pages: results.length,
      pages_with_issues: results.filter(r => r.issues.length > 0).length,
      pages_with_warnings: results.filter(r => r.warnings.length > 0).length,
      pages_ok: results.filter(r => r.issues.length === 0 && r.warnings.length === 0).length,
      common_issues: {},
      audited_at: new Date().toISOString(),
    };
    
    // Count common issues
    for (const result of results) {
      for (const issue of result.issues) {
        summary.common_issues[issue] = (summary.common_issues[issue] || 0) + 1;
      }
    }
    
    const output = {
      metadata: summary,
      results,
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n✅ SEO Audit complete! Saved to ${OUTPUT_FILE}`);
    
    console.log('\n📊 SEO AUDIT SUMMARY:');
    console.log(`   Total pages: ${summary.total_pages}`);
    console.log(`   Pages with issues: ${summary.pages_with_issues}`);
    console.log(`   Pages with warnings: ${summary.pages_with_warnings}`);
    console.log(`   Pages OK: ${summary.pages_ok}`);
    console.log(`   Common issues: ${JSON.stringify(summary.common_issues)}`);
    
  } catch (error) {
    console.error('❌ Error during SEO audit:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

runSeoAudit();
