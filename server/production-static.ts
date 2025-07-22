// Railway-specific static file serving with proper MIME types
import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function setupProductionStatic(app: Express) {
  // In Railway deployment, the static files are in /app/dist/public
  const distPath = path.resolve(process.cwd(), "dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log('🔥 NUCLEAR OPTION: Manual static file serving from:', distPath);

  // NUCLEAR OPTION: Complete manual file serving - NO EXPRESS STATIC MIDDLEWARE
  // Handle ALL /assets/* requests manually with explicit MIME types
  app.get('/assets/*', (req, res) => {
    const assetPath = req.path.substring(1); // Remove leading /
    const filePath = path.join(distPath, assetPath);
    const ext = path.extname(filePath).toLowerCase();
    
    console.log(`🎯 MANUAL ASSET: ${req.path} -> ${filePath} (${ext})`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Asset not found: ${filePath}`);
      return res.status(404).send('Asset not found');
    }
    
    // FORCE correct MIME type - NO RAILWAY OVERRIDE ALLOWED
    let mimeType = 'application/octet-stream';
    let charset = '';
    
    switch (ext) {
      case '.js':
      case '.mjs':
        mimeType = 'application/javascript';
        charset = '; charset=utf-8';
        console.log('🟢 FORCING JavaScript MIME type');
        break;
      case '.css':
        mimeType = 'text/css';  
        charset = '; charset=utf-8';
        console.log('🟢 FORCING CSS MIME type');
        break;
      case '.html':
        mimeType = 'text/html';
        charset = '; charset=utf-8';
        break;
      case '.json':
        mimeType = 'application/json';
        charset = '; charset=utf-8';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        charset = '; charset=utf-8';
        break;
      case '.png':
        mimeType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
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
        console.log(`⚠️  Unknown asset type: ${ext}`);
    }
    
    // NUCLEAR HEADERS - OVERRIDE EVERYTHING
    res.setHeader('Content-Type', mimeType + charset);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log(`✅ Serving ${req.path} as ${mimeType}${charset}`);
    
    // Send file manually
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('❌ Error serving asset:', err);
        res.status(500).send('Error serving asset');
      } else {
        console.log('🎉 Asset served successfully with correct MIME type');
      }
    });
  });

  // Manual serving of root static files (favicon, etc.)
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