#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  // Build the frontend
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build backend using nuclear production fix
  console.log('Building backend...');
  
  // Use the nuclear esbuild command directly for production backend
  const backendBuildCommand = 'npx esbuild server/index-production.ts --bundle --platform=node --format=esm --outfile=dist/index.js --target=node18 --packages=external';
  console.log('Building production backend with nuclear MIME fix...');
  execSync(backendBuildCommand, { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}