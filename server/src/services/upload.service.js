import fs from "fs";
import path from "path";
import {
  createUploadBatch,
  getUploadBatchById,
  getAllUploadBatches,
  getUploadBatchesWithPagination,
  getInvoicesWithPagination,
  deleteInvoicesByBatchId,
  updateUploadBatchProgress,
} from "../repositories/upload.repository.js";
import { invoiceQueue } from "../queues/invoice.queue.js";
import { prisma } from "../config/prisma.js";

const uploadService = {
  /**
   * Processes a File Object received from request.formData()
   * @param {File} file - Standard Web API File object
   * @param {number|string|null} userId - Optional User ID
   */
  async processFileUpload(file, userId = null) {
    if (!file || typeof file.text !== "function") {
      throw new Error("Invalid file object provided. Expected standard File object.");
    }

    const originalFileName = file.name;
    const fileName = `${Date.now()}_${originalFileName}`;

    // 1. Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 2. Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    // 3. Create initial UploadBatch in database (in PENDING status, 0 rows processed/saved)
    const batchResult = await createUploadBatch({
      fileName,
      originalFileName,
      totalRows: 0,
      userId,
    });

    // 4. Add job to BullMQ queue
    const job = await invoiceQueue.add("process-upload", {
      uploadBatchId: batchResult.id,
      filePath,
      userId,
    });

    console.log("Job Added:", job.id, job.name, "for batch:", batchResult.id);

    return {
      success: true,
      message: "File uploaded and queued for background processing successfully",
      batch: batchResult,
    };
  },

  async getUploadStatus(uploadId, userId) {
    const batch = await getUploadBatchById(uploadId);
    if (!batch) {
      throw new Error("Upload batch not found");
    }
    if (userId && batch.userId !== parseInt(userId)) {
      throw new Error("Forbidden");
    }
    return {
      uploadId: batch.id,
      fileName: batch.originalFileName,
      status: batch.status,
      totalRows: batch.totalRows,
      processedRows: batch.processedRows,
      successfulRows: batch.successfulRows,
      failedRows: batch.failedRows,
      invoices: batch.invoices,
      createdAt: batch.createdAt,
    };
  },

  async getAllUploads(userId) {
    return await getAllUploadBatches(userId);
  },

  /**
   * Retrieves upload batches with pagination, sorting, search, and filtering
   */
  async getUploadsPaged(options) {
    return await getUploadBatchesWithPagination(options);
  },

  /**
   * Retrieves invoices with pagination, sorting, search, and filtering
   */
  async getInvoicesPaged(options) {
    return await getInvoicesWithPagination(options);
  },

  /**
   * Deletes old invoice records, resets progress metrics, and re-triggers background processing.
   */
  async retryUploadBatch(uploadBatchId, userId) {
    const batch = await getUploadBatchById(uploadBatchId);
    if (!batch) {
      throw new Error("Upload batch not found");
    }
    if (userId && batch.userId !== parseInt(userId)) {
      throw new Error("Forbidden");
    }

    // 1. Delete associated invoices
    await deleteInvoicesByBatchId(batch.id);

    // 2. Reset progress counters
    const resetBatch = await updateUploadBatchProgress(batch.id, {
      status: "PENDING",
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
    });

    // 3. Re-queue the job in BullMQ
    const filePath = path.join(process.cwd(), "uploads", batch.fileName);
    const job = await invoiceQueue.add("process-upload", {
      uploadBatchId: batch.id,
      filePath,
      userId: batch.userId,
    });

    console.log(`[Service] Retried job ${job.id} added for Batch ${batch.id}`);

    return {
      success: true,
      message: "Job successfully queued for retry processing.",
      batch: resetBatch,
    };
  },

  /**
   * Retrieves dashboard statistics and reports charts data based on dateRange selection.
   */
  async getReportsStatistics(userId, dateRange) {
    const now = new Date();
    const ranges = getDateRanges(dateRange, now);

    // 1. Fetch data for current period
    const currentInvoices = await prisma.invoice.findMany({
      where: {
        uploadBatch: {
          userId: parseInt(userId),
        },
        createdAt: {
          gte: ranges.startDate,
          lte: ranges.endDate,
        },
      },
      select: {
        status: true,
        createdAt: true,
      },
    });

    const currentBatches = await prisma.uploadBatch.findMany({
      where: {
        userId: parseInt(userId),
        status: "COMPLETED",
        createdAt: {
          gte: ranges.startDate,
          lte: ranges.endDate,
        },
      },
      select: {
        createdAt: true,
        updatedAt: true,
        totalRows: true,
      },
    });

    // 2. Fetch data for previous period
    const previousInvoices = await prisma.invoice.findMany({
      where: {
        uploadBatch: {
          userId: parseInt(userId),
        },
        createdAt: {
          gte: ranges.previousStartDate,
          lte: ranges.previousEndDate,
        },
      },
      select: {
        status: true,
        createdAt: true,
      },
    });

    const previousBatches = await prisma.uploadBatch.findMany({
      where: {
        userId: parseInt(userId),
        status: "COMPLETED",
        createdAt: {
          gte: ranges.previousStartDate,
          lte: ranges.previousEndDate,
        },
      },
      select: {
        createdAt: true,
        updatedAt: true,
        totalRows: true,
      },
    });

    // 3. Compute stats for current period
    const curTotal = currentInvoices.length;
    const curMatched = currentInvoices.filter((i) => i.status === "MATCHED").length;
    const curMismatched = currentInvoices.filter((i) => i.status === "MISMATCHED").length;
    const curFailed = currentInvoices.filter((i) => i.status === "FAILED").length;
    const curMatchRate = curTotal > 0 ? (curMatched / curTotal) * 100 : 0;

    let curTimeMs = 0;
    let curRowsSum = 0;
    currentBatches.forEach((b) => {
      const dur = b.updatedAt.getTime() - b.createdAt.getTime();
      if (dur > 0 && b.totalRows > 0) {
        curTimeMs += dur;
        curRowsSum += b.totalRows;
      }
    });
    const curAvgTime = curRowsSum > 0 ? (curTimeMs / curRowsSum) / 1000 : 0.15; // default fallback 0.15s per invoice

    // 4. Compute stats for previous period
    const prevTotal = previousInvoices.length;
    const prevMatched = previousInvoices.filter((i) => i.status === "MATCHED").length;
    const prevFailed = previousInvoices.filter((i) => i.status === "FAILED").length;
    const prevMatchRate = prevTotal > 0 ? (prevMatched / prevTotal) * 100 : 0;

    let prevTimeMs = 0;
    let prevRowsSum = 0;
    previousBatches.forEach((b) => {
      const dur = b.updatedAt.getTime() - b.createdAt.getTime();
      if (dur > 0 && b.totalRows > 0) {
        prevTimeMs += dur;
        prevRowsSum += b.totalRows;
      }
    });
    const prevAvgTime = prevRowsSum > 0 ? (prevTimeMs / prevRowsSum) / 1000 : 0.15;

    // 5. Compute Changes
    // Total Processed
    const totalChangePct = prevTotal === 0 ? (curTotal === 0 ? 0 : 100) : ((curTotal - prevTotal) / prevTotal) * 100;
    const totalChange = `${totalChangePct >= 0 ? "+" : ""}${totalChangePct.toFixed(1)}%`;
    const totalPositive = curTotal >= prevTotal;

    // Match Rate
    const matchRateChangePct = prevMatchRate === 0 ? (curMatchRate === 0 ? 0 : 100) : ((curMatchRate - prevMatchRate) / prevMatchRate) * 100;
    const matchRateChange = `${matchRateChangePct >= 0 ? "+" : ""}${matchRateChangePct.toFixed(1)}%`;
    const matchRatePositive = curMatchRate >= prevMatchRate;

    // Avg Processing Time
    const timeDiff = curAvgTime - prevAvgTime;
    const timeChange = `${timeDiff >= 0 ? "+" : ""}${timeDiff.toFixed(2)}s`;
    const timePositive = curAvgTime <= prevAvgTime;

    // Critical Errors
    const errDiff = curFailed - prevFailed;
    const errChange = `${errDiff >= 0 ? "+" : ""}${errDiff}`;
    const errPositive = curFailed <= prevFailed;

    // 6. Generate Chart Data slots
    const slots = getChartSlots(dateRange, now);
    currentInvoices.forEach((inv) => {
      const time = inv.createdAt.getTime();
      for (const slot of slots) {
        if (time >= slot.start.getTime() && time <= slot.end.getTime()) {
          if (inv.status === "FAILED") {
            slot.errors++;
          } else {
            slot.processed++;
          }
          break;
        }
      }
    });

    const barData = slots.map((s) => ({
      name: s.label,
      processed: s.processed,
      errors: s.errors,
    }));

    const pieData = [
      { name: "Matches", value: curMatched },
      { name: "Mismatches", value: curMismatched },
      { name: "Failed", value: curFailed },
    ];

    return {
      stats: {
        totalProcessed: { value: curTotal.toLocaleString(), change: totalChange, positive: totalPositive },
        matchRate: { value: `${curMatchRate.toFixed(1)}%`, change: matchRateChange, positive: matchRatePositive },
        avgProcessingTime: { value: `${curAvgTime.toFixed(2)}s`, change: timeChange, positive: timePositive },
        criticalErrors: { value: curFailed.toLocaleString(), change: errChange, positive: errPositive },
      },
      barData,
      pieData,
    };
  },
};

// Date range calculation helper
function getDateRanges(dateRange, now) {
  let startDate, endDate, previousStartDate, previousEndDate;
  endDate = new Date(now);

  if (dateRange === "Last 7 Days") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
    previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13, 0, 0, 0, 0);
    previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 23, 59, 59, 999);
  } else if (dateRange === "Last 30 Days") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0);
    previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 59, 0, 0, 0, 0);
    previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 23, 59, 59, 999);
  } else if (dateRange === "Year to Date") {
    startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    previousStartDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
    previousEndDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
  } else {
    // "Last 6 Months" is default
    startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0);
    previousStartDate = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);
    previousEndDate = new Date(now.getFullYear(), now.getMonth() - 5, 0, 23, 59, 59, 999);
  }

  return {
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
  };
}

// Chart slots generator helper
function getChartSlots(dateRange, now) {
  const slots = [];
  if (dateRange === "Last 7 Days") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      slots.push({
        label,
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
        end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999),
        processed: 0,
        errors: 0,
      });
    }
  } else if (dateRange === "Last 30 Days") {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      slots.push({
        label,
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
        end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999),
        processed: 0,
        errors: 0,
      });
    }
  } else if (dateRange === "Year to Date") {
    const currentMonth = now.getMonth(); // 0-11
    for (let i = 0; i <= currentMonth; i++) {
      const d = new Date(now.getFullYear(), i, 1);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      slots.push({
        label,
        start: new Date(now.getFullYear(), i, 1, 0, 0, 0, 0),
        end: new Date(now.getFullYear(), i + 1, 0, 23, 59, 59, 999),
        processed: 0,
        errors: 0,
      });
    }
  } else {
    // "Last 6 Months" is default
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      slots.push({
        label,
        start: new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999),
        processed: 0,
        errors: 0,
      });
    }
  }
  return slots;
}

export default uploadService;