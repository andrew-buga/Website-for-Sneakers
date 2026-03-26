#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * check-deploy.js - Pre-deployment readiness verification
 * Manual script for local pre-deploy checks before pushing to GitHub
 * Usage: npm run check:deploy
 * 
 * Checks:
 * 1. Git status (no uncommitted changes)
 * 2. TypeScript compilation
 * 3. ESLint validation
 * 4. Build success
 * 5. All pages generated (120/120)
 * 6. Environment variables configured
 * 7. No merge conflicts
 */

// Load .env file
require('dotenv').config();

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const checks = [
  {
    name: 'Git status',
    run: () => {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        throw new Error(
          `Uncommitted changes found:\n${status}\n` +
          'Please commit or stash changes before deploying.'
        );
      }
    },
  },
  {
    name: 'TypeScript compilation',
    run: () => {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
    },
  },
  {
    name: 'ESLint validation',
    run: () => {
      execSync('npm run lint', { stdio: 'pipe' });
    },
  },
  {
    name: 'Environment variables',
    run: () => {
      execSync('node scripts/check-env.js', { stdio: 'pipe' });
    },
  },
  {
    name: 'Build verification',
    run: () => {
      const output = execSync('npm run build 2>&1', { encoding: 'utf8' });
      if (!output.includes('120/120')) {
        throw new Error('Build did not generate all 120 pages');
      }
    },
  },
  {
    name: 'No merge conflicts',
    run: () => {
      const status = execSync('git diff --check 2>&1', { encoding: 'utf8' });
      if (status.trim()) {
        throw new Error(`Merge conflicts detected:\n${status}`);
      }
    },
  },
];

console.log(`\n${colors.cyan}🚀 DEPLOYMENT READINESS CHECK${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════${colors.reset}\n`);

let passed = 0;
let failed = 0;

for (const check of checks) {
  process.stdout.write(`⏳ ${check.name}... `);

  try {
    check.run();
    console.log(`${colors.green}✅${colors.reset}`);
    passed++;
  } catch (error) {
    console.log(`${colors.red}❌${colors.reset}`);
    console.error(
      `\n${colors.red}Error: ${check.name}${colors.reset}\n` +
      `${error.message}\n`
    );
    failed++;
  }
}

console.log(`\n${colors.cyan}═══════════════════════════════${colors.reset}`);
console.log(`Results: ${colors.green}${passed} passed${colors.reset}, ${failed > 0 ? colors.red + failed + ' failed' + colors.reset : 'none failed'}`);

if (failed > 0) {
  console.log(
    `\n${colors.red}❌ Deployment not ready${colors.reset}\n` +
    'Fix the errors above before deploying.'
  );
  process.exit(1);
}

console.log(
  `\n${colors.green}✅ Ready to deploy!${colors.reset}\n` +
  'All checks passed. You can safely push to GitHub.'
);
process.exit(0);
