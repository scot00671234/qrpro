# Railway Deployment Fix - Dynamic Require Error

## Problem
Railway production was crashing with error:
```
Error: Dynamic require of "stripe" is not supported
```

## Root Cause
The issue was caused by:
1. Using `require('stripe')` instead of ES module import in `server/stripe.ts`
2. esbuild bundling configuration not properly externalizing native Node.js packages
3. Stripe API version mismatch with current package version

## Solution Applied

### 1. Fixed Stripe Import (server/stripe.ts)
**Before:**
```javascript
const Stripe = require('stripe');
stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
```

**After:**
```javascript
stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});
```

### 2. Created Custom esbuild Configuration (esbuild.config.js)
```javascript
import { build } from 'esbuild';

build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  external: ['stripe', 'pg', 'bcrypt', 'nodemailer', 'qrcode'],
  target: 'node18',
  sourcemap: false,
  minify: false,
}).catch(() => process.exit(1));
```

### 3. Created Build Wrapper Script (build.js)
```javascript
#!/usr/bin/env node
import { execSync } from 'child_process';

try {
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Building backend...');
  execSync('node esbuild.config.js', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
```

## Railway Deployment Instructions

### Option 1: Update package.json Build Script
If possible, update the build script to use the new build process:
```json
{
  "scripts": {
    "build": "node build.js"
  }
}
```

### Option 2: Manual Build Commands
If package.json cannot be updated, use these commands in Railway:
1. `npx vite build`
2. `node esbuild.config.js`

### Option 3: Alternative esbuild Command
Use this single command in Railway build settings:
```bash
npx vite build && node -p "require('esbuild').build({entryPoints:['server/index.ts'],bundle:true,platform:'node',format:'esm',outdir:'dist',packages:'external',external:['stripe','pg','bcrypt','nodemailer','qrcode'],target:'node18'}).catch(()=>process.exit(1))"
```

## Verification
- ✅ Local build completes without errors
- ✅ Frontend builds to `dist/public/`
- ✅ Backend builds to `dist/index.js`
- ✅ All native dependencies properly externalized
- ✅ ES modules format maintained
- ✅ Stripe import uses proper ES module syntax

## Expected Result
Railway production should now start successfully without the "Dynamic require" error. The application will run with all dependencies properly resolved at runtime.