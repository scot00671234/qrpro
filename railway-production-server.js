// Standalone Railway Production Server - Bypasses complex routing
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force production environment
process.env.NODE_ENV = 'production';

const app = express();
const server = createServer(app);

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
    res.sendStatus(200);
  } else {
    next();
  }
});

const distPath = path.resolve(__dirname, 'dist/public');
console.log('🚀 Railway Production Server');
console.log('📁 Static files from:', distPath);
console.log('🌐 Environment:', process.env.NODE_ENV);

// STEP 1: Serve assets with correct MIME types FIRST
app.get('/assets/*.js', (req, res) => {
  const filePath = path.join(distPath, req.path);
  console.log('🟢 Serving JS:', req.path);
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.sendFile(filePath);
});

app.get('/assets/*.css', (req, res) => {
  const filePath = path.join(distPath, req.path);
  console.log('🟢 Serving CSS:', req.path);
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.sendFile(filePath);
});

// Serve other static files
app.get('/*.ico', (req, res) => {
  const filePath = path.join(distPath, req.path);
  res.setHeader('Content-Type', 'image/x-icon');
  res.sendFile(filePath);
});

app.get('/*.svg', (req, res) => {
  const filePath = path.join(distPath, req.path);
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.sendFile(filePath);
});

app.get('/*.png', (req, res) => {
  const filePath = path.join(distPath, req.path);
  res.setHeader('Content-Type', 'image/png');
  res.sendFile(filePath);
});

app.get('/*.mp4', (req, res) => {
  const filePath = path.join(distPath, req.path);
  res.setHeader('Content-Type', 'video/mp4');
  res.sendFile(filePath);
});

app.get('/*.txt', (req, res) => {
  const filePath = path.join(distPath, req.path);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(filePath);
});

app.get('/*.xml', (req, res) => {
  const filePath = path.join(distPath, req.path);
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.sendFile(filePath);
});

// STEP 2: Register API routes from the built server
console.log('🔧 Registering API routes...');
const { registerRoutes } = await import('./dist/index.js');

// Patch registerRoutes to skip static file setup
const originalApp = {
  ...app,
  use: (...args) => {
    // Skip static file middleware and catch-all routes
    if (args[0] === '*' || (typeof args[0] === 'string' && args[0].includes('static'))) {
      console.log('⏭️  Skipping static middleware from registerRoutes:', args[0]);
      return app;
    }
    return app.use(...args);
  }
};

await registerRoutes(originalApp);

// STEP 3: SPA fallback for everything else
app.get('*', (req, res) => {
  console.log('🔄 SPA fallback for:', req.path);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Railway server running on port ${port}`);
  console.log(`🎯 Test: http://localhost:${port}/assets/index-kXo0AuIG.js`);
});