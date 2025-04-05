import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Import Telegram module to ensure it's initialized
import "./telegram";
import compression from 'compression';

const app = express();
app.use(compression()); // Add compression middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
    app.use(express.static('dist', {
      maxAge: '1d',
      etag: true,
      lastModified: true
    }));
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  const startServer = (retryPort = port) => {
    server.listen({
      port: retryPort,
      host: "0.0.0.0",
    }, () => {
      log(`serving on port ${retryPort}`);
    }).on('error', (e: any) => {
      if (e.code === 'EADDRINUSE' && retryPort < 5010) {
        log(`Port ${retryPort} is busy, trying ${retryPort + 1}`);
        startServer(retryPort + 1);
      } else {
        log(`Failed to start server: ${e.message}`);
        process.exit(1);
      }
    });
  };
  
  startServer();
})();