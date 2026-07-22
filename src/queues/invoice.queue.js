import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const invoiceQueue = new Queue("invoice-processing", {
    connection : redis
})