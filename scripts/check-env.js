#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * check-env.js - Validate required environment variables
 * Used by deployment guard system to ensure all vars are configured
 * Runs on: pre-commit, pre-push, GitHub Actions
 */

// Load .env file
require('dotenv').config();

const requiredEnv = [
  'NEXT_PUBLIC_API_BASE_URL',
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
];

const missingEnv = requiredEnv.filter((env) => !process.env[env]);

if (missingEnv.length > 0) {
  console.error('\n❌ DEPLOYMENT GUARD: Missing environment variables');
  console.error('Required variables not found:\n');
  missingEnv.forEach((env) => {
    console.error(`  - ${env}`);
  });
  console.error('\n⚠️  Copy .env.example to .env and configure each variable.');
  console.error('📖 Documentation: https://sneakerportfolio.me/docs/deployment\n');
  process.exit(1);
}

console.log('✅ All required environment variables are configured');
process.exit(0);
