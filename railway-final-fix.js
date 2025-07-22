// Final Railway Fix - Direct static file serving with bypassed complex routing
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force production
process.env.NODE_ENV = 'production';

const app = express();
const distPath = path.resolve(__dirname, 'dist/public');

console.log('🚀 FINAL RAILWAY FIX - Direct Static Serving');
console.log('📁 Static path:', distPath);
console.log('🔍 Assets exist:', fs.existsSync(path.join(distPath, 'assets')));
console.log('🔍 JS file exists:', fs.existsSync(path.join(distPath, 'assets/index-kXo0AuIG.js')));
console.log('🔍 CSS file exists:', fs.existsSync(path.join(distPath, 'assets/index-f0FVMr3Y.css')));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Manual static file serving with explicit MIME types
app.use('/assets', (req, res, next) => {
  const filePath = path.join(distPath, 'assets', path.basename(req.path));
  
  console.log(`🔍 Asset request: ${req.path}`);
  console.log(`📂 Full path: ${filePath}`);
  console.log(`✅ File exists: ${fs.existsSync(filePath)}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return res.status(404).send('Asset not found');
  }
  
  // Set MIME type based on extension
  const ext = path.extname(filePath).toLowerCase();
  console.log(`🎯 Extension: ${ext}`);
  
  switch (ext) {
    case '.js':
      console.log('✅ Setting JS MIME type');
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      break;
    case '.css':
      console.log('✅ Setting CSS MIME type');
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      break;
    default:
      res.setHeader('Content-Type', 'application/octet-stream');
  }
  
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  console.log(`📤 Serving ${filePath} with MIME: ${res.getHeader('Content-Type')}`);
  res.sendFile(filePath);
});

// Serve other static files manually
app.use((req, res, next) => {
  // Skip API routes and assets (already handled)
  if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) {
    return next();
  }
  
  const filePath = path.join(distPath, req.path);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.ico':
        res.setHeader('Content-Type', 'image/x-icon');
        break;
      case '.svg':
        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        break;
      case '.png':
        res.setHeader('Content-Type', 'image/png');
        break;
      case '.mp4':
        res.setHeader('Content-Type', 'video/mp4');
        break;
      case '.txt':
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        break;
      case '.xml':
        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        break;
      default:
        return next(); // Let other middleware handle it
    }
    
    console.log(`📤 Serving static: ${req.path}`);
    return res.sendFile(filePath);
  }
  
  next();
});

// Load API routes but skip their static handling
console.log('🔧 Loading API routes...');
try {
  // Import the built server module
  const serverModule = await import('./dist/index.js');
  console.log('📦 Available exports:', Object.keys(serverModule));
  
  if (serverModule.default && typeof serverModule.default === 'function') {
    console.log('🎯 Using default export as registerRoutes');
    await serverModule.default(app);
  } else if (serverModule.registerRoutes) {
    console.log('🎯 Using named registerRoutes export');
    await serverModule.registerRoutes(app);  
  } else {
    console.log('⚠️  No registerRoutes found, continuing without API routes');
  }
  
  console.log('✅ Server module loaded');
} catch (error) {
  console.error('❌ Failed to load server module:', error.message);
  console.log('⚠️  Continuing with static files only');
}

// Final catch-all for SPA
app.get('*', (req, res) => {
  console.log(`🔄 SPA fallback: ${req.path}`);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Railway server running on port ${port}`);
  console.log(`🎯 Test JS: curl -I http://localhost:${port}/assets/index-kXo0AuIG.js`);
  console.log(`🎯 Test CSS: curl -I http://localhost:${port}/assets/index-f0FVMr3Y.css`);
});