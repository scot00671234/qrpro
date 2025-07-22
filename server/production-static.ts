// Railway-specific static file serving with proper MIME types
import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function setupProductionStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log('Setting up Railway-compatible static file serving from:', distPath);

  // Enhanced static file serving with explicit MIME types for Railway
  // CRITICAL: This must come BEFORE any catch-all routes
  app.use('/assets', express.static(path.resolve(distPath, 'assets'), {
    setHeaders: (res, filePath, stat) => {
      // Set explicit Content-Type headers for Railway compatibility
      const ext = path.extname(filePath).toLowerCase();
      
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
          // For unknown types, use a safe default
          res.setHeader('Content-Type', 'application/octet-stream');
      }
      
      // Add cache headers for production
      if (filePath.includes('assets/')) {
        // Cache hashed assets for 1 year
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // Cache other files for 1 hour
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
      
      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }));

  // Serve other static files (favicon, images, etc.) from root
  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      console.log(`📄 Serving root static file: ${filePath} (${ext})`);
      
      // Only serve non-asset files from root to avoid conflicts
      if (!filePath.includes('assets/')) {
        switch (ext) {
          case '.html':
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            break;
          case '.ico':
            res.setHeader('Content-Type', 'image/x-icon');
            break;
          case '.svg':
            res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
            break;
          case '.png':
            res.setHeader('Content-Type', 'image/png');
            break;
          default:
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    }
  }));

  // SPA fallback - serve index.html for all non-API and non-asset routes
  app.use("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    
    // CRITICAL: Don't serve index.html for static assets
    if (req.originalUrl.startsWith('/assets/') || 
        req.originalUrl.includes('.js') || 
        req.originalUrl.includes('.css') ||
        req.originalUrl.includes('.ico') ||
        req.originalUrl.includes('.svg') ||
        req.originalUrl.includes('.png') ||
        req.originalUrl.includes('.mp4')) {
      console.log(`❌ Static file not found: ${req.originalUrl}`);
      return res.status(404).send('File not found');
    }
    
    console.log(`🔄 SPA fallback serving index.html for: ${req.originalUrl}`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}