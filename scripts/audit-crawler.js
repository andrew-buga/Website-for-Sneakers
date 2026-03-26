/**
 * Phase 1: Website Crawler
 * Fetches sitemap.xml and discovers all URLs on sneakerportfolio.me
 * Output: /analysis/crawled-pages.json with metadata for each page
 */

const https = require('https');
const { parseStringPromise } = require('xml2js');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://sneakerportfolio.me';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const OUTPUT_DIR = path.join(__dirname, '../analysis');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'crawled-pages.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

async function extractLocaleAndType(urlPath) {
  // Examples:
  // /en/product/123 -> locale: en, type: product
  // /uk/cart -> locale: uk, type: cart
  // / -> locale: en, type: home
  
  const parts = urlPath.split('/').filter(Boolean);
  const locales = ['en', 'uk', 'ru'];
  
  let locale = 'en';
  let pathType = 'other';
  
  if (locales.includes(parts[0])) {
    locale = parts[0];
    pathType = parts[1] || 'home';
  } else {
    pathType = parts[0] || 'home';
  }
  
  // Map path to page type
  const typeMap = {
    'product': 'product',
    'category': 'category',
    'men': 'category',
    'women': 'category',
    'accessories': 'category',
    'collections': 'category',
    'collection': 'category',
    'trends': 'category',
    'cart': 'cart',
    'favorites': 'favorites',
    'account': 'account',
    'checkout': 'checkout',
    'contact': 'contact',
    'help-center': 'support',
    'help': 'support',
    'privacy-policy': 'legal',
    'terms-conditions': 'legal',
    'terms-of-use': 'legal',
    'store-locator': 'info',
    'returns': 'legal',
    'home': 'home',
    '': 'home',
  };
  
  pathType = typeMap[pathType] || 'other';
  
  return { locale, pageType: pathType };
}

async function crawlSitemap() {
  try {
    console.log(`⏳ Fetching sitemap from ${SITEMAP_URL}...`);
    const sitemapXml = await fetchUrl(SITEMAP_URL);
    
    console.log('📄 Parsing XML...');
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(sitemapXml);
    
    const urls = result.urlset.url || [];
    console.log(`✓ Found ${urls.length} URLs in sitemap`);
    
    const pages = [];
    const seenUrls = new Set();
    
    for (const urlEntry of urls) {
      const fullUrl = urlEntry.loc[0];
      
      // Skip duplicates and anchors
      if (seenUrls.has(fullUrl) || fullUrl.includes('#')) continue;
      seenUrls.add(fullUrl);
      
      // Extract path
      const urlObj = new URL(fullUrl);
      const pathname = urlObj.pathname;
      
      // Only include sneakerportfolio.me domain
      if (!fullUrl.includes('sneakerportfolio.me')) continue;
      
      const { locale, pageType } = await extractLocaleAndType(pathname);
      
      pages.push({
        url: fullUrl,
        pathname,
        locale,
        pageType,
        discovered_at: new Date().toISOString(),
        // Additional fields to be filled by other audit phases
        seo: null,
        performance: null,
        ux: null,
        security: null,
      });
    }
    
    // Sort by locale and path
    pages.sort((a, b) => a.url.localeCompare(b.url));
    
    const summary = {
      total_pages: pages.length,
      by_locale: {
        en: pages.filter(p => p.locale === 'en').length,
        uk: pages.filter(p => p.locale === 'uk').length,
        ru: pages.filter(p => p.locale === 'ru').length,
      },
      by_type: {},
      crawled_at: new Date().toISOString(),
    };
    
    // Count by type
    for (const page of pages) {
      summary.by_type[page.pageType] = (summary.by_type[page.pageType] || 0) + 1;
    }
    
    const output = {
      metadata: summary,
      pages,
    };
    
    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✅ Crawling complete! Saved to ${OUTPUT_FILE}`);
    
    // Print summary
    console.log('\n📊 CRAWL SUMMARY:');
    console.log(`   Total pages: ${summary.total_pages}`);
    console.log(`   By locale: EN=${summary.by_locale.en}, UK=${summary.by_locale.uk}, RU=${summary.by_locale.ru}`);
    console.log(`   By type: ${JSON.stringify(summary.by_type)}`);
    
  } catch (error) {
    console.error('❌ Error during crawling:', error.message);
    process.exit(1);
  }
}

crawlSitemap();
