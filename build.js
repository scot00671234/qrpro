#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  // Build the frontend
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build the backend with simplified esbuild
  console.log('Building backend...');
  execSync('node esbuild-simple.js', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}