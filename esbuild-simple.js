#!/usr/bin/env node

// Simple esbuild configuration for Railway deployment that avoids process issues
import { execSync } from 'child_process';

try {
  console.log('Building backend with simplified esbuild...');
  
  // Use a simple esbuild command that works reliably in Railway
  const buildCommand = `npx esbuild server/index.ts --bundle --platform=node --format=esm --outdir=dist --packages=external --target=node18`;
  
  execSync(buildCommand, { stdio: 'inherit' });
  
  console.log('Backend build completed!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}