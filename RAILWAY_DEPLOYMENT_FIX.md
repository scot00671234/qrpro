# Railway Production Deployment Fix

## Issue
Railway serves static JavaScript and CSS files with incorrect MIME types, causing browser console errors:
- `Refused to apply style from '...' because its MIME type ('text/html') is not a supported stylesheet MIME type`
- `Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"`

## Root Cause
Railway's static file serving doesn't automatically set correct Content-Type headers for JavaScript and CSS assets.

## Solution Options

### Option 1: Use Custom Railway Start Script (Recommended)
1. Build the application:
   ```bash
   npm run build
   ```

2. Use the custom `railway-start.js` script that sets proper MIME types:
   ```bash
   node railway-start.js
   ```

3. In Railway, set the start command to:
   ```
   node railway-start.js
   ```

### Option 2: Modify Railway Environment (Alternative)
1. Ensure Railway uses Node.js 18+ runtime
2. Set environment variables in Railway:
   ```
   NODE_ENV=production
   ```

3. Build command in Railway:
   ```
   npm run build
   ```

4. Start command in Railway:
   ```
   node dist/index.js
   ```

### Option 3: Manual MIME Type Configuration
If using the standard start script, ensure your Railway deployment includes these headers:
- `.js` files: `application/javascript; charset=utf-8`
- `.css` files: `text/css; charset=utf-8`
- `.html` files: `text/html; charset=utf-8`

## Verification
After deployment, check:
1. No MIME type errors in browser console
2. Static assets load correctly (check Network tab)
3. Application renders properly
4. All routes work correctly

## Current Build Output
The build creates:
- `dist/public/index.html` - Main HTML file
- `dist/public/assets/index-kXo0AuIG.js` - Bundled JavaScript
- `dist/public/assets/index-f0FVMr3Y.css` - Bundled CSS
- `dist/index.js` - Express server bundle

## Required Environment Variables for Railway
```
NODE_ENV=production
DATABASE_URL=(auto-provided by Railway PostgreSQL)
SESSION_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
VITE_STRIPE_PUBLIC_KEY=pk_test_... (or pk_live_...)
```

## Testing
1. Local build test: `npm run build && node dist/index.js`
2. Railway start test: `node railway-start.js`
3. Browser console should show no MIME type errors
4. All assets should load with status 200

This fix ensures proper static file serving with correct MIME types for Railway production environment.