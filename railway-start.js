#!/usr/bin/env node
// DIRECT RAILWAY START - BYPASS ALL PACKAGE.JSON

console.log('🔥 RAILWAY NUCLEAR START - Direct server execution');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PORT:', process.env.PORT || 'not set');

// Import and start the production server directly
try {
  const productionServer = await import('./dist/index.js');
  console.log('✅ Production server imported successfully');
  
  if (typeof productionServer.default === 'function') {
    await productionServer.default();
    console.log('✅ Production server started via function export');
  } else {
    console.log('✅ Production server started via direct import');
  }
} catch (error) {
  console.error('❌ Failed to start production server:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}