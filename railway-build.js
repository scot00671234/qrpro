#!/usr/bin/env node

// Railway Build Script - Ensures proper build for production deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Railway Build Process Starting...');
console.log('📦 Environment:', process.env.NODE_ENV || 'development');

try {
  // Clean up any existing build artifacts
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning existing dist/ directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build frontend with Vite
  console.log('🎯 Building frontend with Vite...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend with esbuild
  console.log('🔧 Building backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18', { 
    stdio: 'inherit' 
  });

  // Verify build outputs
  const frontendExists = fs.existsSync('dist/public');
  const backendExists = fs.existsSync('dist/index.js');
  
  console.log('✅ Build Status:');
  console.log(`   Frontend: ${frontendExists ? '✓' : '✗'} (dist/public)`);
  console.log(`   Backend: ${backendExists ? '✓' : '✗'} (dist/index.js)`);

  if (!frontendExists || !backendExists) {
    throw new Error('Build artifacts missing');
  }

  console.log('🎉 Railway build completed successfully!');

} catch (error) {
  console.error('❌ Railway build failed:', error.message);
  process.exit(1);
}