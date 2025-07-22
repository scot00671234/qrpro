#!/usr/bin/env node

// Simple esbuild configuration for Railway deployment that avoids process issues
import { execSync } from 'child_process';

try {
  console.log('Building backend with simplified esbuild...');
  
  // Build production-only server without Vite dependencies
  const buildCommand = `npx esbuild server/index-production.ts --bundle --platform=node --format=esm --outfile=dist/index.js --target=node18 --packages=external`;
  
  execSync(buildCommand, { stdio: 'inherit' });
  
  console.log('Backend build completed!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}