import { runMigrations } from './migrations';

// This file is kept for compatibility but now uses the new migrations system
runMigrations().catch(console.error);