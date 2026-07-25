import express from "express";
import cors from "cors";
import path from "path";

// Load Environment Configuration
import { env } from "./config/env.js";

// Load Database and Redis Clients
import { connectPrisma, disconnectPrisma, prisma } from "./config/prisma.js";
import { closeRedis } from "./config/redis.js";

// Load Routes
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

// Load Worker Creator
import { createInvoiceWorker } from "./workers/invoice.worker.js";

// Initialize Express App
const app = express();
const PORT = env.PORT;

// Middleware
const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:3000"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith(".vercel.app") || 
                        origin.startsWith("http://localhost:");
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve avatars folder statically
app.use("/avatars", express.static(path.join(process.cwd(), "public/avatars")));

// Mount REST API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

// GET /api/progress (placeholder)
app.get("/api/progress", (req, res) => {
  res.json({ ok: true, message: "Progress API placeholder" });
});

// GET /api/health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "backend-api", timestamp: new Date().toISOString() });
});

// GET /api/test-db (global sanity check)
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

// Express Server and Worker References
let serverListener;
let invoiceWorker;

/**
 * Bootstrap function to start backend connections and services.
 */
async function bootstrap() {
  try {
    console.log("[Bootstrap] Starting server setup...");

    // 1. Connect Prisma Database Client
    await connectPrisma();

    // 2. Start Background BullMQ Worker
    invoiceWorker = createInvoiceWorker();
    console.log("[Bootstrap] BullMQ Worker started successfully.");

    // 3. Start Express Web Server Listening
    serverListener = app.listen(PORT, () => {
      console.log(`[Bootstrap] REST API Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("[Bootstrap] Crash during startup:", error);
    await shutdown(1);
  }
}

/**
 * Clean Graceful Shutdown Handler.
 * Shuts down Express, BullMQ workers, Redis connections, and Prisma clients.
 */
async function shutdown(exitCode = 0) {
  console.log("\n[Shutdown] Initiating graceful shutdown...");

  // 1. Stop accepting new requests on Express
  if (serverListener) {
    await new Promise((resolve) => {
      serverListener.close(() => {
        console.log("✔ Express Server stopped accepting requests.");
        resolve();
      });
    });
  }

  // 2. Close BullMQ Worker
  if (invoiceWorker) {
    try {
      await invoiceWorker.close();
      console.log("✔ BullMQ Worker stopped successfully.");
    } catch (err) {
      console.error("❌ Error shutting down BullMQ Worker:", err.message);
    }
  }

  // 3. Close Main Redis Client
  await closeRedis();

  // 4. Disconnect Database Client
  await disconnectPrisma();

  console.log("[Shutdown] Graceful shutdown complete. Exiting.");
  process.exit(exitCode);
}

// Bind System Signals
process.on("SIGINT", () => {
  console.log("[Process] Received SIGINT (Ctrl+C).");
  shutdown(0);
});

process.on("SIGTERM", () => {
  console.log("[Process] Received SIGTERM.");
  shutdown(0);
});

// Catch Unhandled Exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ [Process] Uncaught Exception occurred:", error);
  // Log and shutdown gracefully to avoid socket/connection leaks
  shutdown(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ [Process] Unhandled Rejection at:", promise, "reason:", reason);
  // Log and shutdown gracefully
  shutdown(1);
});

// Run Bootstrap
bootstrap();
