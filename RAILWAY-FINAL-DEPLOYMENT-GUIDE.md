# Complete Railway Deployment Guide

## Overview
This guide provides a complete solution to fix all Railway production issues including database schema, dynamic require errors, and automatic table creation.

## Issues Fixed ✅

### 1. Dynamic Require Error
**Problem**: `Error: Dynamic require of "stripe" is not supported`
**Solution**: Fixed ES module imports and created proper build configuration

### 2. Database Schema Issues  
**Problem**: Missing columns (`subscription_plan`), missing tables (`qr_scans`)
**Solution**: Created automatic migration system that runs on startup

### 3. Build Configuration
**Problem**: esbuild bundling issues with Node.js dependencies
**Solution**: Simplified build process with external package handling

## Files Created/Modified

### New Migration System
- ✅ `server/migrations.ts` - Comprehensive database migration system
- ✅ `server/migrate.ts` - Updated to use new migration system  
- ✅ `server/index.ts` - Runs migrations automatically on startup

### Build System  
- ✅ `server/stripe.ts` - Fixed ES module imports
- ✅ `esbuild-simple.js` - Simplified build configuration for Railway
- ✅ `build.js` - Updated build wrapper script
- ✅ `esbuild.config.js` - Custom esbuild configuration

## Railway Deployment Steps

### Step 1: Code Deployment
1. Push all the updated code to your connected GitHub repository
2. Railway will automatically detect the changes and start building

### Step 2: Set Build Command
In Railway Dashboard → Your Project → Settings → Build:
```bash
node build.js
```

### Step 3: Required Environment Variables
Set these in Railway Dashboard → Your Project → Variables:

**Required:**
```
DATABASE_URL=postgresql://... (auto-provided by Railway PostgreSQL)
SESSION_SECRET=your-random-session-secret-here
NODE_ENV=production
```

**Optional (for Stripe functionality):**
```
STRIPE_SECRET_KEY=sk_test_... (use test keys for testing)
VITE_STRIPE_PUBLIC_KEY=pk_test_... (use test keys for testing)
```

**Optional (for email functionality):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

### Step 4: Database Tables
**NO MANUAL ACTION REQUIRED!** 

The application now automatically:
- Creates all required tables on startup
- Adds missing columns to existing tables  
- Fixes schema inconsistencies
- Handles both new deployments and existing databases

The migration system will:
```sql
-- Fix users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS monthly_scans_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS scan_reset_date TIMESTAMP DEFAULT NOW();

-- Create qr_scans table
CREATE TABLE IF NOT EXISTS qr_scans (
  id SERIAL PRIMARY KEY,
  qr_code_id INTEGER NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR,
  country VARCHAR,
  city VARCHAR,  
  device_type VARCHAR,
  referrer TEXT
);

-- And more...
```

### Step 5: Verify Deployment
After Railway builds and deploys:

1. Check Deploy Logs for:
   ```
   Stripe initialized in TEST mode
   Running database migrations...  
   Database migrations completed successfully
   ✓ All required database tables exist
   serving on port XXXX
   ```

2. Visit your Railway app URL - it should load without errors

3. Test authentication:
   - Register a new account
   - Login/logout functionality
   - QR code generation

## Expected Result ✅

Your Railway production should now:
- ✅ Start without any errors
- ✅ Have all database tables created automatically
- ✅ Handle authentication properly
- ✅ Support QR code generation and analytics
- ✅ Work with or without Stripe configuration
- ✅ Be ready for production traffic

## Troubleshooting

### If Build Fails:
Check that `node build.js` is set as the build command

### If App Won't Start:
Check environment variables are set, especially `DATABASE_URL` and `SESSION_SECRET`

### If Database Errors:
The migration system should handle all database issues automatically. Check deploy logs for migration status.

### If Stripe Errors:
The app works without Stripe - payment features will be disabled if keys aren't provided

## Production Ready ✅

This deployment is production-ready with:
- Automatic database migrations
- Error handling for missing services
- Secure session management
- Proper CORS configuration
- Node.js 18+ compatibility
- SSL database support