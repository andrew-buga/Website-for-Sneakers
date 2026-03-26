const fs = require('fs');
let content = fs.readFileSync('scripts/generate-master-report.js', 'utf8');

const replacements = [
  [/🎯/g, '[TARGET]'], [/✅/g, '[OK]'],    [/❌/g, '[FAIL]'],
  [/🔴/g, '[CRIT]'],   [/🟠/g, '[HIGH]'],  [/🟡/g, '[MED]'],
  [/🟢/g, '[LOW]'],    [/📊/g, '[CHART]'], [/📋/g, '[LIST]'],
  [/⚡/g, '[FAST]'],   [/📈/g, '[UP]'],    [/🏆/g, '[WIN]'],
  [/💰/g, '[MONEY]'],  [/🧪/g, '[TEST]'],  [/⚠️/g, '[WARN]'],
  [/═/g,  '='],        [/━/g,  '-'],        [/▸/g,  '>'],
];

replacements.forEach(([from, to]) => {
  content = content.replace(from, to);
});

fs.writeFileSync('scripts/generate-master-report.js', content, 'utf8');
console.log('✓ Fixed all emoji and Unicode characters');
