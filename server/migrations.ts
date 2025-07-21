import { db } from './db';
import { sql } from 'drizzle-orm';

export async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    // Ensure all required tables exist with proper structure
    
    // 1. Fix users table - add missing columns and fix defaults
    await db.execute(sql`
      -- Add missing columns to users table
      ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR DEFAULT 'free',
        ADD COLUMN IF NOT EXISTS monthly_scans_used INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS scan_reset_date TIMESTAMP DEFAULT NOW();
      
      -- Fix subscription_status default (Railway might have wrong default)
      ALTER TABLE users 
        ALTER COLUMN subscription_status SET DEFAULT 'inactive';
        
      -- Remove any incompatible columns that might exist
      ALTER TABLE users 
        DROP COLUMN IF EXISTS subscription_ends_at;
    `);

    // 2. Fix qr_codes table structure
    await db.execute(sql`
      -- Remove columns that don't match our schema
      ALTER TABLE qr_codes 
        DROP COLUMN IF EXISTS color,
        DROP COLUMN IF EXISTS customization;
    `);

    // 3. Create qr_scans table if it doesn't exist
    await db.execute(sql`
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
    `);

    // 4. Ensure sessions table has proper structure
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
    `);

    // 5. Update any existing users to have proper defaults
    await db.execute(sql`
      UPDATE users 
      SET 
        subscription_plan = COALESCE(subscription_plan, 'free'),
        subscription_status = COALESCE(subscription_status, 'inactive'),
        monthly_scans_used = COALESCE(monthly_scans_used, 0),
        scan_reset_date = COALESCE(scan_reset_date, NOW())
      WHERE subscription_plan IS NULL 
        OR subscription_status IS NULL 
        OR monthly_scans_used IS NULL 
        OR scan_reset_date IS NULL;
    `);

    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    // Don't throw error - let app continue even if migrations fail
    // This prevents the app from crashing in Railway
  }
}

// Helper function to check if all required tables exist
export async function verifyDatabaseSchema(): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'qr_codes', 'qr_scans', 'sessions')
      ORDER BY table_name;
    `);

    const tableNames = result.rows.map((row: any) => row.table_name);
    const requiredTables = ['qr_codes', 'qr_scans', 'sessions', 'users'];
    
    const allTablesExist = requiredTables.every(table => tableNames.includes(table));
    
    if (allTablesExist) {
      console.log('✓ All required database tables exist');
      return true;
    } else {
      console.log('⚠ Missing tables:', requiredTables.filter(table => !tableNames.includes(table)));
      return false;
    }
  } catch (error) {
    console.error('Database schema verification failed:', error);
    return false;
  }
}