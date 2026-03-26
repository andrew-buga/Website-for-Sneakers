/**
 * Phase 6: CRO & A/B Test Planning
 * Generate 3 recommended A/B tests based on audit findings
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../analysis');

function generateABTestPlan(seoData) {
  const results = seoData.results || [];
  
  // Analyze data to identify test opportunities
  const findings = {
    missingTitles: results.filter(r => !r.seo?.title || r.seo.title.length === 0).length,
    shortTitles: results.filter(r => r.seo?.title && r.seo.title.length < 30).length,
    missingMeta: results.filter(r => !r.seo?.metaDescription).length,
    missingH1: results.filter(r => r.seo?.h1?.count === 0).length,
    multipleH1: results.filter(r => r.seo?.h1?.count > 1).length,
    imagesWithoutAlt: results.filter(r => r.seo?.images?.withoutAlt?.length > 0).length,
  };
  
  // Base conversion assumptions
  const monthlyVisitors = 800; // From user response
  const baseConversionRate = 0.05; // 5% (conservative for ecommerce)
  const desiredLift = 0.10; // 10% improvement target
  
  // Function to calculate sample size (Cochran's formula)
  function calculateSampleSize(p1 = baseConversionRate, effect = desiredLift, confidence = 0.95) {
    const p2 = p1 * (1 + effect);
    const z = 1.96; // 95% confidence
    
    const pooled = (p1 + p2) / 2;
    const variance = 2 * pooled * (1 - pooled);
    
    const n = (z * z * variance) / Math.pow(p2 - p1, 2);
    return Math.ceil(n);
  }
  
  const sampleSize = calculateSampleSize();
  const testDurationWeeks = Math.ceil((sampleSize * 2 * 7) / monthlyVisitors);
  
  const tests = [
    {
      id: 1,
      name: 'Improve Meta Descriptions for Search Visibility',
      priority: 'HIGH',
      hypothesis: `If we write optimized meta descriptions (70-160 chars, action-oriented), click-through rate from search results will increase by 10%, because better descriptions entice more clicks.`,
      affected_pages: findings.missingMeta,
      
      scenario: {
        control: 'Current: Generic or missing meta descriptions',
        variant: 'Optimized: 120-char descriptions with action words (e.g., "Shop premium sneakers...")'
      },
      
      metrics: {
        primary: 'CTR from search results (impressions -> clicki)',
        secondary: ['Bounce rate', 'Average time on page', 'Pages per session'],
        sample_size_per_variant: sampleSize,
        total_sample_size: sampleSize * 2,
        duration_estimate_weeks: testDurationWeeks,
        confidence_level: '95%',
      },
      
      success_criteria: '>10% relative lift in CTR, p-value <0.05',
      
      implementation: `
// Test 1: Meta Description A/B Test
(function() {
  const testId = 'ab-test-meta-descriptions';
  const variant = localStorage.getItem(testId) || (Math.random() > 0.5 ? 'control' : 'variant');
  localStorage.setItem(testId, variant);
  
  // Track if user came from search
  const referrer = document.referrer;
  if (referrer.includes('google.') || referrer.includes('bing.') || referrer.includes('yandex.')) {
    console.log('[A/B Test] Meta Description Variant:', variant);
    console.log('[A/B Test] User Source:', 'Organic Search');
  }
})();
      `,
    },
    
    {
      id: 2,
      name: 'Fix Missing/Multiple H1 Tags for SEO',
      priority: 'MEDIUM',
      hypothesis: `If we ensure exactly one H1 per page with target keyword, search ranking visibility will improve by 8%, because H1s are critical SEO signals & help screen readers.`,
      affected_pages: findings.missingH1 + findings.multipleH1,
      
      scenario: {
        control: 'Current: Missing or multiple H1 tags',
        variant: 'Fixed: Single H1 with primary keyword, positioned near top of content'
      },
      
      metrics: {
        primary: 'Organic search impressions (from GSC)',
        secondary: ['Average position in search results', 'Organic clicks'],
        sample_size_per_variant: Math.ceil(sampleSize * 1.5),
        total_sample_size: Math.ceil(sampleSize * 3),
        duration_estimate_weeks: Math.ceil(testDurationWeeks * 1.5),
        confidence_level: '95%',
      },
      
      success_criteria: '>8% increase in search impressions or +0.5 avg position improvement',
      
      implementation: `
// Test 2: H1 SEO Optimization
(function() {
  // Verify single H1 exists on page
  const h1s = document.querySelectorAll('h1');
  if (h1s.length !== 1) {
    console.warn('[A/B Test] Page has', h1s.length, 'H1 tags (expected 1)');
  } else {
    console.log('[A/B Test] H1 Tag is correct:', h1s[0].textContent.substring(0, 50));
  }
})();
      `,
    },
    
    {
      id: 3,
      name: 'Add Alt Text to Missing Product Images',
      priority: 'MEDIUM',
      hypothesis: `If we add descriptive alt text to all images, accessibility score improves & image search traffic increases by 5%, because alt text helps both users & search engines.`,
      affected_pages: findings.imagesWithoutAlt,
      
      scenario: {
        control: 'Current: Missing alt attributes on images',
        variant: 'Fixed: Descriptive alt text (context + keyword): "Blue Air Jordan 1 High-Top Sneakers"'
      },
      
      metrics: {
        primary: 'Image search impressions + clicks',
        secondary: ['Accessibility audit score', 'Page load time'],
        sample_size_per_variant: Math.ceil(sampleSize * 0.75),
        total_sample_size: Math.ceil(sampleSize * 1.5),
        duration_estimate_weeks: Math.ceil(testDurationWeeks * 2),
        confidence_level: '90%',
      },
      
      success_criteria: '>5% increase in image search traffic or +10 accessibility score points',
      
      implementation: `
// Test 3: Image Alt Text Validation
(function() {
  const images = document.querySelectorAll('img');
  const missingAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
  console.log('[A/B Test] Images without alt text:', missingAlt.length, '/', images.length);
  
  missingAlt.forEach((img, i) => {
    if (i < 3) console.log('  -', img.src.substring(0, 50));
  });
})();
      `,
    }
  ];
  
  return {
    methodology: 'Statistical A/B testing with minimum sample size calculation',
    visitor_metrics: {
      monthly_visitors: monthlyVisitors,
      estimated_monthly_conversions: Math.floor(monthlyVisitors * baseConversionRate),
      base_conversion_rate: `${(baseConversionRate * 100).toFixed(1)}%`,
      desired_lift: `${(desiredLift * 100).toFixed(0)}%`,
    },
    tests,
    implementation_notes: [
      'Use localStorage to assign variants consistently per user',
      'Track all conversions with analytics events',
      'Run tests simultaneously to reduce total test duration',
      'Use Google Analytics 4 custom events for tracking',
      'Minimum 4 weeks per test at current traffic levels',
    ]
  };
}

function main() {
  try {
    const seoData = JSON.parse(fs.readFileSync(
      path.join(OUTPUT_DIR, 'seo-audit.json'),
      'utf8'
    ));
    
    const abPlan = generateABTestPlan(seoData);
    
    // Save plan as JSON
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'ab-test-plan.json'),
      JSON.stringify(abPlan, null, 2)
    );
    
    // Generate Markdown version
    const markdown = `# A/B Testing Plan - Streater Sneakers

## Executive Summary
- **Monthly Visitors**: ${abPlan.visitor_metrics.monthly_visitors}
- **Monthly Conversions**: ${abPlan.visitor_metrics.estimated_monthly_conversions}
- **Current Conversion Rate**: ${abPlan.visitor_metrics.base_conversion_rate}
- **Target Lift**: ${abPlan.visitor_metrics.desired_lift}

---

${abPlan.tests.map((test, i) => `
## Test #${i + 1}: ${test.name}

**Priority**: ${test.priority}  
**Affected Pages**: ${test.affected_pages}

### Hypothesis
> ${test.hypothesis}

### Scenario
- **Control (A)**: ${test.scenario.control}
- **Variant (B)**: ${test.scenario.variant}

### Metrics
- **Primary Metric**: ${test.metrics.primary}
- **Secondary Metrics**: ${test.metrics.secondary.join(', ')}
- **Sample Size**: ${test.metrics.sample_size_per_variant} per variant (${test.metrics.total_sample_size} total)
- **Duration**: ~${test.metrics.duration_estimate_weeks} weeks at current traffic
- **Confidence Level**: ${test.metrics.confidence_level}

### Success Criteria
${test.success_criteria}

### Implementation
\`\`\`javascript
${test.implementation}
\`\`\`

---
`).join('')}

## Implementation Notes
${abPlan.implementation_notes.map(note => `- ${note}`).join('\n')}

## Next Steps
1. Implement Test #1 first (fastest results, high priority)
2. Add Google Analytics custom events for tracking
3. Monitor daily results and stop early if one variant significantly underperforms
4. Document learnings for future test iterations

---
Generated: ${new Date().toISOString()}
`;
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'ab-test-plan.md'),
      markdown
    );
    
    console.log('✅ A/B Test Plan generated!');
    console.log('\n📊 SUMMARY:');
    console.log(`   Monthly visitors: ${abPlan.visitor_metrics.monthly_visitors}`);
    console.log(`   Tests recommended: ${abPlan.tests.length}`);
    console.log(`   Affected pages by test:`);
    abPlan.tests.forEach((t, i) => {
      console.log(`     Test ${i + 1}: ${t.affected_pages} pages`);
    });
    console.log(`\n   Test duration: ~${abPlan.tests[0].metrics.duration_estimate_weeks}-${abPlan.tests[2].metrics.duration_estimate_weeks} weeks each`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
