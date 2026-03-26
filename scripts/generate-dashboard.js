/**
 * Generate comprehensive HTML audit dashboard
 * Reads all audit JSON files and creates interactive report
 */

const fs = require('fs');
const path = require('path');

const ANALYSIS_DIR = path.join(__dirname, '../analysis');

function getAuditData() {
  const seoFile = path.join(ANALYSIS_DIR, 'seo-audit.json');
  
  if (!fs.existsSync(seoFile)) {
    console.error('❌ seo-audit.json not found. Please run SEO audit first.');
    process.exit(1);
  }
  
  const seoData = JSON.parse(fs.readFileSync(seoFile, 'utf8'));
  return seoData;
}

function generateSummary(seoData) {
  const results = seoData.results || [];
  
  const summary = {
    totalPages: results.length,
    criticalIssues: 0,
    warnings: 0,
    issuesByType: {},
    topIssues: [],
  };
  
  // Count issues
  for (const result of results) {
    if (result.issues && result.issues.length > 0) {
      summary.criticalIssues++;
      for (const issue of result.issues) {
        const key = issue.substring(0, 50);
        summary.issuesByType[key] = (summary.issuesByType[key] || 0) + 1;
      }
    }
    if (result.warnings && result.warnings.length > 0) {
      summary.warnings++;
    }
  }
  
  // Get top issues
  summary.topIssues = Object.entries(summary.issuesByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([issue, count]) => ({ issue, count }));
  
  return summary;
}

function getSeverity(issues, warnings) {
  if (issues && issues.length > 0) return 'CRITICAL';
  if (warnings && warnings.length > 0) return 'WARNING';
  return 'OK';
}

function generateHTML(seoData) {
  const summary = generateSummary(seoData);
  const results = seoData.results || [];
  
  const cssColors = `
    .severity-critical { background-color: #fee2e2; color: #991b1b; }
    .severity-warning { background-color: #fef3c7; color: #92400e; }
    .severity-ok { background-color: #dcfce7; color: #15803d; }
    .badge-critical { background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .badge-warning { background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .badge-ok { background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
  `;
  
  let resultRows = '';
  for (const result of results) {
    const severity = getSeverity(result.issues, result.warnings);
    const badge = severity === 'CRITICAL' ? `<span class="badge-critical">CRITICAL</span>` 
                : severity === 'WARNING' ? `<span class="badge-warning">WARNING</span>`
                : `<span class="badge-ok">OK</span>`;
    
    const titleLength = result.seo?.title?.length || 0;
    const metaLength = result.seo?.metaDescription?.length || 0;
    const h1Count = result.seo?.h1?.count || 0;
    const altImages = result.seo?.images?.withoutAlt?.length || 0;
    
    resultRows += `
      <tr class="severity-${severity.toLowerCase()}">
        <td><a href="${result.url}" target="_blank">${new URL(result.url).pathname}</a></td>
        <td>${result.locale}</td>
        <td>${result.pageType}</td>
        <td>${badge}</td>
        <td>${titleLength} <span style="color: #666;">(${titleLength < 30 || titleLength > 60 ? '⚠️' : '✓'})</span></td>
        <td>${metaLength} <span style="color: #666;">(${metaLength < 70 || metaLength > 160 ? '⚠️' : '✓'})</span></td>
        <td>${h1Count} ${h1Count !== 1 ? '⚠️' : '✓'}</td>
        <td>${altImages}</td>
        <td>${result.issues?.length || 0}</td>
        <td>${result.warnings?.length || 0}</td>
      </tr>
    `;
  }
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Streater Sneakers - Website Audit Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; color: #1f2937; }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    h1 { margin-bottom: 10px; color: #111827; }
    .subtitle { color: #6b7280; margin-bottom: 30px; font-size: 14px; }
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h3 { color: #6b7280; font-size: 14px; font-weight: 500; margin-bottom: 10px; }
    .card .value { font-size: 32px; font-weight: bold; }
    .card.critical .value { color: #dc2626; }
    .card.warning .value { color: #f59e0b; }
    .card.ok .value { color: #10b981; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
    .tab-btn { background: none; border: none; padding: 12px 24px; cursor: pointer; color: #6b7280; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { background: #f9fafb; padding: 12px; text-align: left; font-weight: 600; font-size: 13px; color: #374151; border-bottom: 1px solid #e5e7eb; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
    tr:hover { background: #f9fafb; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ${cssColors}
    .top-issues { list-style: none; }
    .top-issues li { padding: 12px; background: white; margin-bottom: 8px; border-left: 4px solid #dc2626; border-radius: 4px; }
    .top-issues .count { background: #fecaca; color: #991b1b; padding: 2px 6px; border-radius: 3px; font-weight: bold; margin-left: 10px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Streater Sneakers - Website Audit Report</h1>
    <p class="subtitle">Comprehensive audit of https://sneakerportfolio.me | Generated: ${new Date().toLocaleString()}</p>
    
    <div class="summary-cards">
      <div class="card">
        <h3>Total Pages Audited</h3>
        <div class="value">${summary.totalPages}</div>
      </div>
      <div class="card critical">
        <h3>Critical Issues</h3>
        <div class="value">${summary.criticalIssues}</div>
      </div>
      <div class="card warning">
        <h3>Pages with Warnings</h3>
        <div class="value">${summary.warnings}</div>
      </div>
      <div class="card ok">
        <h3>Pages OK</h3>
        <div class="value">${summary.totalPages - summary.criticalIssues}</div>
      </div>
    </div>
    
    <h2 style="margin-bottom: 20px;">📋 Top Issues</h2>
    <ul class="top-issues">
      ${summary.topIssues.map(issue => `
        <li>
          ${issue.issue}
          <span class="count">${issue.count} pages</span>
        </li>
      `).join('')}
    </ul>
    
    <h2 style="margin-top: 40px; margin-bottom: 20px;">📊 SEO Audit Results</h2>
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('seo-all')">All Pages</button>
      <button class="tab-btn" onclick="switchTab('seo-critical')">Critical Issues</button>
      <button class="tab-btn" onclick="switchTab('seo-warnings')">Warnings Only</button>
    </div>
    
    <div id="seo-all" class="tab-content active">
      <table>
        <thead>
          <tr>
            <th>Page URL</th>
            <th>Locale</th>
            <th>Type</th>
            <th>Status</th>
            <th>Title Length</th>
            <th>Meta Length</th>
            <th>H1 Count</th>
            <th>Missing Alt</th>
            <th>Issues</th>
            <th>Warnings</th>
          </tr>
        </thead>
        <tbody>
          ${resultRows}
        </tbody>
      </table>
    </div>
    
    <div id="seo-critical" class="tab-content">
      <table>
        <thead>
          <tr>
            <th>Page URL</th>
            <th>Severity</th>
            <th>Issues</th>
          </tr>
        </thead>
        <tbody>
          ${results
            .filter(r => r.issues && r.issues.length > 0)
            .map(r => `
              <tr class="severity-critical">
                <td><a href="${r.url}" target="_blank">${new URL(r.url).pathname}</a></td>
                <td><span class="badge-critical">CRITICAL</span></td>
                <td>${r.issues.join('<br>')}</td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    </div>
    
    <div id="seo-warnings" class="tab-content">
      <table>
        <thead>
          <tr>
            <th>Page URL</th>
            <th>Severity</th>
            <th>Warnings</th>
          </tr>
        </thead>
        <tbody>
          ${results
            .filter(r => r.warnings && r.warnings.length > 0)
            .map(r => `
              <tr class="severity-warning">
                <td><a href="${r.url}" target="_blank">${new URL(r.url).pathname}</a></td>
                <td><span class="badge-warning">WARNING</span></td>
                <td>${r.warnings.join('<br>')}</td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="footer">
      <p><strong>Report Generated:</strong> ${new Date().toISOString()}</p>
      <p>Data source: SEO Audit using Playwright browser automation</p>
    </div>
  </div>
  
  <script>
    function switchTab(tabId) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      
      // Show selected tab
      document.getElementById(tabId).classList.add('active');
      event.target.classList.add('active');
    }
  </script>
</body>
</html>`;
  
  return html;
}

function main() {
  const seoData = getAuditData();
  const html = generateHTML(seoData);
  
  const outputPath = path.join(ANALYSIS_DIR, 'audit-report.html');
  fs.writeFileSync(outputPath, html);
  
  console.log(`✅ HTML audit report generated: ${outputPath}`);
  console.log(`\n📊 To view the report, open in a web browser:`);
  console.log(`   file:///${outputPath}`);
}

main();
