import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import "./telegram";
import compression from 'compression';
const app = express();
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (req.path.startsWith("/api")) {
        log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
      }
    });
  }
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