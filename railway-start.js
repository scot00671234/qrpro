// Railway production server with proper static file MIME types
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set NODE_ENV for production
process.env.NODE_ENV = 'production';

const app = express();

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced CORS middleware for Railway
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  const allowedOrigins = [
    'https://qrprogenerator.com',
    'https://www.qrprogenerator.com',
    'https://qrprogenerator.up.railway.app'
  ];
  
  if (allowedOrigins.includes(origin || '') || !origin) {
    res.header('Access-Control-Allow-Origin', origin || 'https://qrprogenerator.com');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.path.startsWith('/api/')) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

console.log('🚀 Starting Railway production server...');

// Import and register API routes from the built server
const { registerRoutes } = await import('./dist/index.js');
const server = await registerRoutes(app);

// Enhanced static file serving with proper MIME types BEFORE catch-all route
const distPath = path.resolve(__dirname, 'dist/public');
console.log('📁 Serving static files from:', distPath);

// Static file middleware with explicit MIME type handling
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    console.log(`📄 Serving static file: ${filePath} (${ext})`);
    
    // Set explicit Content-Type headers for Railway compatibility
    switch (ext) {
      case '.js':
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        break;
      case '.mjs':
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        break;
      case '.css':
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        break;
      case '.html':
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        break;
      case '.json':
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        break;
      case '.svg':
        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        break;
      case '.png':
        res.setHeader('Content-Type', 'image/png');
        break;
      case '.jpg':
      case '.jpeg':
        res.setHeader('Content-Type', 'image/jpeg');
        break;
      case '.ico':
        res.setHeader('Content-Type', 'image/x-icon');
        break;
      case '.woff':
        res.setHeader('Content-Type', 'font/woff');
        break;
      case '.woff2':
        res.setHeader('Content-Type', 'font/woff2');
        break;
      case '.ttf':
        res.setHeader('Content-Type', 'font/ttf');
        break;
      case '.mp4':
        res.setHeader('Content-Type', 'video/mp4');
        break;
      default:
        res.setHeader('Content-Type', 'application/octet-stream');
    }
    
    // Cache headers for performance
    if (filePath.includes('assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// SPA fallback route - MUST come after static files
app.use('*', (req, res) => {
  // Skip API routes
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  console.log(`🔄 SPA fallback for: ${req.originalUrl}`);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Railway production server running on port ${port}`);
  console.log(`📁 Static files: ${distPath}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});