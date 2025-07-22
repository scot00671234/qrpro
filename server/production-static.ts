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
  app.use(express.static(distPath, {
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

  // SPA fallback - serve index.html for all non-API routes
  app.use("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}