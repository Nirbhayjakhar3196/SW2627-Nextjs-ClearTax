import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// Global object reference to reuse Prisma client instance during hot-reloading
const globalForPrisma = globalThis;

// Initialize Prisma client with database options
let logLevel = ["error"];
if (env.NODE_ENV === "development") {
  logLevel = ["query", "error", "warn"];
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    log: logLevel,
  });

// Store Prisma instance globally in development to prevent duplicate connections
if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Connects Prisma client to the PostgreSQL database.
 */
export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    throw error;
  }
}

/**
 * Disconnects Prisma client connection gracefully during server shutdown.
 */
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect();
    console.log("🔌 Database Disconnected Gracefully");
  } catch (error) {
    console.error("❌ Database Disconnection Error:", error.message);
  }
}

