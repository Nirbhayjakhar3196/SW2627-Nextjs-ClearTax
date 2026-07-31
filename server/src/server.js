import express from "express";
import cors from "cors";
import path from "path";

// Load Environment Configuration
import { env } from "./config/env.js";

// Load Database and Redis Connection Handlers
import { connectPrisma, disconnectPrisma, prisma } from "./config/prisma.js";
import { closeRedis } from "./config/redis.js";

// Load Application Route Handlers
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

// Load Background Worker Factory
import { createInvoiceWorker } from "./workers/invoice.worker.js";

// Initialize Express Application Instance
const app = express();
const PORT = env.PORT;

// Configure allowed frontend origins for CORS security
const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:3000"
];

// Configure CORS (Cross-Origin Resource Sharing) middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or non-browser requests (e.g. Postman or integration scripts)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches allowed localhost or production Vercel domain pattern
      let isAllowed = false;

      if (allowedOrigins.includes(origin)) {
        isAllowed = true;
      } else if (origin.endsWith(".vercel.app")) {
        isAllowed = true;
      } else if (origin.startsWith("http://localhost:")) {
        isAllowed = true;
      }

      if (isAllowed) {
        callback(null, true);
      } else {
        // Disallow origin safely without throwing Express 500 exception
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse incoming JSON payloads and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve profile picture avatars statically from public/avatars folder
app.use("/avatars", express.static(path.join(process.cwd(), "public/avatars")));

// Mount API route modules
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

// GET /api/progress - Simple progress status route placeholder
app.get("/api/progress", (req, res) => {
  res.json({ ok: true, message: "Progress API placeholder" });
});

// GET /api/health - Health check endpoint for server uptime verification
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "backend-api",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/test-db - Health check endpoint for database connectivity verification
app.get("/api/test-db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "Database Connected Successfully 🚀",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Global server listener and worker references
let serverListener = null;
let invoiceWorker = null;

/**
 * Main application bootstrap function.
 * Connects database, starts background BullMQ worker, and launches Express web server.
 */
async function bootstrap() {
  try {
    console.log("[Bootstrap] Starting server setup...");

    // 1. Connect database client
    await connectPrisma();

    // 2. Start background worker for CSV processing
    invoiceWorker = createInvoiceWorker();
    console.log("[Bootstrap] BullMQ Worker started successfully.");

    // 3. Start listening for HTTP requests on configured PORT
    serverListener = app.listen(PORT, () => {
      console.log(`[Bootstrap] REST API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[Bootstrap] Crash during startup:", error);
    await shutdown(1);
  }
}

/**
 * Graceful shutdown handler.
 * Closes HTTP server, BullMQ worker, Redis client, and database connection.
 */
async function shutdown(exitCode = 0) {
  console.log("\n[Shutdown] Initiating graceful shutdown...");

  // 1. Stop accepting new HTTP requests
  if (serverListener) {
    await new Promise((resolve) => {
      serverListener.close(() => {
        console.log("✔ Express Server stopped accepting requests.");
        resolve();
      });
    });
  }

  // 2. Close BullMQ background worker
  if (invoiceWorker) {
    try {
      await invoiceWorker.close();
      console.log("✔ BullMQ Worker stopped successfully.");
    } catch (err) {
      console.error("❌ Error shutting down BullMQ Worker:", err.message);
    }
  }

  // 3. Close main Redis client connection
  await closeRedis();

  // 4. Disconnect Prisma database client
  await disconnectPrisma();

  console.log("[Shutdown] Graceful shutdown complete. Exiting.");
  process.exit(exitCode);
}

// Bind process termination signals for graceful exit
process.on("SIGINT", () => {
  console.log("[Process] Received SIGINT (Ctrl+C).");
  shutdown(0);
});

process.on("SIGTERM", () => {
  console.log("[Process] Received SIGTERM.");
  shutdown(0);
});

// Catch uncaught errors to prevent dirty crashes
process.on("uncaughtException", (error) => {
  console.error("❌ [Process] Uncaught Exception occurred:", error);
  shutdown(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ [Process] Unhandled Rejection at:", promise, "reason:", reason);
  shutdown(1);
});

// Start the backend server
bootstrap();

