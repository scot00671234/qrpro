#!/bin/bash
# Railway build script - nuclear MIME type fix

echo "🔥 NUCLEAR RAILWAY BUILD - MIME TYPE FIX"

# Build frontend  
echo "Building frontend..."
npx vite build

# Build backend with nuclear production fix (NO VITE DEPENDENCIES)
echo "Building backend with nuclear MIME fix..."
npx esbuild server/index-production.ts --bundle --platform=node --format=esm --outfile=dist/index.js --target=node18 --packages=external

# Verify build outputs
echo "Verifying build outputs..."
ls -la dist/
ls -la dist/public/assets/

# Check that backend doesn't contain vite imports
if grep -q "vite" dist/index.js; then
    echo "❌ ERROR: Backend still contains Vite imports!"
    exit 1
else
    echo "✅ Backend is clean - no Vite dependencies"
fi

echo "🎉 Nuclear build completed successfully!"