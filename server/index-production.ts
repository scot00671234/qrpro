// Production-only server entry point - NO VITE DEPENDENCIES
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { runMigrations, verifyDatabaseSchema } from "./migrations";
import { setupProductionStatic } from "./production-static";

const app = express();

// CORS middleware for Railway production
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Production CORS for Railway
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
  
  // Add cache control headers for API routes
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging for production
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Production server initialization
export default async function startProductionServer() {
  console.log('🚀 Starting production server...');
  
  // Run database migrations
  await runMigrations();
  await verifyDatabaseSchema();
  
  // Register API routes
  const server = await registerRoutes(app);

  // Error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Production static file serving only
  setupProductionStatic(app);

  // Use Railway's provided port
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
  server.listen({
    port,
    host: "0.0.0.0", 
    reusePort: true,
  }, () => {
    console.log(`✅ Production server running on port ${port}`);
  });
  
  return app;
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startProductionServer().catch(console.error);
}