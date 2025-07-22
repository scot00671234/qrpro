// Railway Static-Only Server - Serves files with correct MIME types
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

console.log('🚀 RAILWAY STATIC SERVER');
console.log('📁 Static path:', distPath);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
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

// Manual asset serving with correct MIME types
app.get('/assets/*.js', (req, res) => {
  const fileName = path.basename(req.path);
  const filePath = path.join(distPath, 'assets', fileName);
  
  console.log(`🟢 JS Request: ${fileName}`);
  console.log(`📂 File path: ${filePath}`);
  console.log(`✅ Exists: ${fs.existsSync(filePath)}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ JS file not found: ${fileName}`);
    return res.status(404).send('JS file not found');
  }
  
  console.log('🎯 Setting application/javascript MIME type');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ Error sending JS file:', err);
      res.status(500).send('Error serving JS file');
    } else {
      console.log('✅ JS file sent successfully');
    }
  });
});

app.get('/assets/*.css', (req, res) => {
  const fileName = path.basename(req.path);
  const filePath = path.join(distPath, 'assets', fileName);
  
  console.log(`🟢 CSS Request: ${fileName}`);
  console.log(`📂 File path: ${filePath}`);
  console.log(`✅ Exists: ${fs.existsSync(filePath)}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ CSS file not found: ${fileName}`);
    return res.status(404).send('CSS file not found');
  }
  
  console.log('🎯 Setting text/css MIME type');
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ Error sending CSS file:', err);
      res.status(500).send('Error serving CSS file');
    } else {
      console.log('✅ CSS file sent successfully');
    }
  });
});

// Other static files
app.get('/*.ico', (req, res) => {
  const filePath = path.join(distPath, path.basename(req.path));
  res.setHeader('Content-Type', 'image/x-icon');
  res.sendFile(filePath);
});

app.get('/*.svg', (req, res) => {
  const filePath = path.join(distPath, path.basename(req.path));
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.sendFile(filePath);
});

app.get('/*.png', (req, res) => {
  const filePath = path.join(distPath, path.basename(req.path));
  res.setHeader('Content-Type', 'image/png');
  res.sendFile(filePath);
});

// Basic auth check API (minimal API for testing)
app.get('/api/auth/user', (req, res) => {
  console.log('🔒 Auth check - returning unauthorized for now');
  res.status(401).json({ message: 'Unauthorized' });
});

// SPA fallback
app.get('*', (req, res) => {
  console.log(`🔄 SPA fallback: ${req.path}`);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 3001; // Use different port to avoid conflict
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Railway static server running on port ${port}`);
  console.log(`🎯 Test: http://localhost:${port}/assets/index-kXo0AuIG.js`);
});