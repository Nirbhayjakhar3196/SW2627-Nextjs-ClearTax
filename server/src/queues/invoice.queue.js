import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

// Initialize BullMQ Queue for handling background CSV invoice parsing jobs.
export const invoiceQueue = new Queue("invoice-processing", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,                 // Retry a failed job up to 3 times
    backoff: {
      type: "exponential",       // Double the wait time after each failed attempt
      delay: 1000,               // Initial wait delay of 1 second (1000 ms)
    },
    removeOnComplete: true,      // Automatically remove successfully finished jobs from Redis
    removeOnFail: false,         // Keep failed jobs in Redis so we can inspect or retry them
  },
});