import IORedis from "ioredis";
import { env } from "./env.js";

/**
 * Creates connection options for Redis following ioredis and BullMQ rules.
 */
function getRedisConfig(customOptions = {}) {
  const isTls = env.REDIS_URL.startsWith("rediss://");

  // Base options for Redis connection
  const options = {
    keepAlive: 10000,      // Send keep-alive packet every 10 seconds to maintain open TCP connection
    connectTimeout: 10000, // Fail if connection takes longer than 10 seconds
    retryStrategy(times) {
      // Reconnect delay starts at 100ms and caps at 3000ms (3 seconds)
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    reconnectOnError(err) {
      if (err.message.includes("READONLY")) {
        return true; // Reconnect automatically if database becomes read-only
      }
      return false;
    },
  };

  // Enable SSL/TLS for cloud Redis services like Upstash or Render
  if (isTls) {
    options.tls = { rejectUnauthorized: false };
  }

  // Merge custom options
  if (customOptions.maxRetriesPerRequest !== undefined) {
    options.maxRetriesPerRequest = customOptions.maxRetriesPerRequest;
  }

  return options;
}

/**
 * Attaches logging event listeners to a Redis client.
 */
function registerLogging(client) {
  client.on("connect", () => {
    console.log("✓ Redis Connected");
  });
  client.on("ready", () => {
    console.log("✓ Redis Ready");
  });
  client.on("reconnecting", () => {
    console.log("✓ Redis Reconnecting");
  });
  client.on("close", () => {
    console.log("✓ Redis Closed");
  });
  client.on("error", (err) => {
    console.error("✓ Redis Error:", err.message);
  });
}

// 1. Primary Redis client instance for general server operations
export const redis = new IORedis(env.REDIS_URL, getRedisConfig({ maxRetriesPerRequest: null }));
registerLogging(redis);

/**
 * Factory function to create dedicated Redis client instances for BullMQ queue listeners.
 */
export function createRedisClient(customOptions = {}) {
  const options = getRedisConfig(customOptions);
  options.maxRetriesPerRequest = null;
  const client = new IORedis(env.REDIS_URL, options);
  registerLogging(client);
  return client;
}

/**
 * Disconnects the main Redis client gracefully when the server stops.
 */
export async function closeRedis() {
  try {
    if (redis.status !== "end") {
      await redis.quit();
    }
    console.log("🔌 Redis Main Client Disconnected Gracefully");
  } catch (error) {
    console.error("❌ Redis Main Client Disconnection Error:", error.message);
  }
}

