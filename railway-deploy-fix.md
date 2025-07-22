# Railway Deployment Fix - Complete Solution

## Current Issue
Railway build is failing because `vite` command is not found during the Docker build process. This happens when:
1. Docker runs `npm ci --only=production` which excludes dev dependencies
2. Build script tries to use `vite` and `esbuild` which are dev dependencies
3. Build fails with "sh: vite: not found"

## Solution Applied

### 1. Updated Dockerfile
- Changed from `npm ci --only=production` to `npm ci` to install ALL dependencies
- Added `npm prune --production` AFTER build to remove dev dependencies
- Updated build command to use our custom `railway-build.js` script

### 2. Created railway-build.js
- Custom build script that explicitly uses `npx` to run Vite and esbuild
- Includes proper error handling and build verification
- Ensures both frontend and backend artifacts are created

### 3. Railway Configuration
- Uses `railway-start.js` with MIME type fixes for static files
- Proper CORS configuration for production
- Manual static file serving to bypass Express.js issues

## Railway Deployment Steps

1. **Ensure these files are present:**
   - `Dockerfile` (updated)
   - `railway-build.js` (new build script)
   - `railway-start.js` (production server)
   - `railway.json` (start command config)

2. **Set Railway Environment Variables:**
   ```
   NODE_ENV=production
   DATABASE_URL=(auto-provided by Railway PostgreSQL)
   STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
   VITE_STRIPE_PUBLIC_KEY=pk_test_... (or pk_live_...)
   SESSION_SECRET=(random secure string)
   ```

3. **Deploy to Railway:**
   - Push updated code to your Git repository
   - Railway will automatically build using the new Dockerfile
   - Build process will install all deps, build both frontend/backend, then prune dev deps
   - Start with `railway-start.js` for proper MIME type handling

## Verification
After deployment, check:
- ✅ Application starts without errors
- ✅ Frontend loads correctly (no MIME type errors)
- ✅ JavaScript/CSS files serve with correct headers
- ✅ Database connections work
- ✅ API endpoints respond correctly

## Fallback Options
If issues persist:
1. Try Railway's native build detection by removing Dockerfile
2. Use Railway's built-in Node.js buildpack
3. Set build command in railway.json: `"buildCommand": "node railway-build.js"`