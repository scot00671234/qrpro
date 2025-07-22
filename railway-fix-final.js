// FINAL RAILWAY MIME TYPE FIX - COMPLETE OVERRIDE APPROACH
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force production environment
process.env.NODE_ENV = 'production';

const app = express();
const distPath = path.resolve(__dirname, 'dist/public');

console.log('🚀 RAILWAY FINAL FIX - COMPLETE MIME TYPE OVERRIDE');
console.log('📁 Static files from:', distPath);

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// CORS - completely permissive for Railway
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// COMPLETE OVERRIDE: Handle ALL static files manually with explicit MIME types
app.get('/assets/*', (req, res) => {
  const filePath = path.join(distPath, req.path);
  const ext = path.extname(filePath).toLowerCase();
  
  console.log(`🎯 STATIC FILE: ${req.path} (${ext})`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return res.status(404).send('File not found');
  }
  
  // Set MIME type based on extension
  let mimeType = 'application/octet-stream';
  let charset = '';
  
  switch (ext) {
    case '.js':
      mimeType = 'application/javascript';
      charset = '; charset=utf-8';
      break;
    case '.mjs':
      mimeType = 'application/javascript';
      charset = '; charset=utf-8';
      break;
    case '.css':
      mimeType = 'text/css';
      charset = '; charset=utf-8';
      break;
    case '.html':
      mimeType = 'text/html';
      charset = '; charset=utf-8';
      break;
    case '.json':
      mimeType = 'application/json';
      charset = '; charset=utf-8';
      break;
    case '.png':
      mimeType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      mimeType = 'image/jpeg';
      break;
    case '.svg':
      mimeType = 'image/svg+xml';
      charset = '; charset=utf-8';
      break;
    case '.ico':
      mimeType = 'image/x-icon';
      break;
    case '.woff':
      mimeType = 'font/woff';
      break;
    case '.woff2':
      mimeType = 'font/woff2';
      break;
    case '.ttf':
      mimeType = 'font/ttf';
      break;
    default:
      console.log(`⚠️  Unknown file type: ${ext}`);
  }
  
  // Force the correct headers
  res.setHeader('Content-Type', mimeType + charset);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  
  console.log(`✅ Serving ${req.path} as ${mimeType}${charset}`);
  
  // Send the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ Error serving file:', err);
      res.status(500).send('Error serving file');
    }
  });
});

// Load and configure backend routes 
console.log('🔧 Loading backend routes...');
try {
  // Import the backend module
  const backendModule = await import('./dist/index.js');
  
  // The backend should export a function that registers routes on an Express app
  if (typeof backendModule.default === 'function') {
    console.log('✅ Found route registration function');
    backendModule.default(app);
    console.log('✅ Backend routes registered');
  } else if (backendModule.app) {
    console.log('✅ Found Express app export');
    app.use('/', backendModule.app);
    console.log('✅ Backend app mounted');
  } else {
    console.log('⚠️  No route registration function found, continuing with static files only');
  }
} catch (error) {
  console.error('❌ Failed to load backend:', error.message);
  console.log('🔄 Continuing with static file serving only...');
}

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not built - index.html not found');
  }
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Railway FINAL FIX server running on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}`);
});