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
   * Processes a Web API File Object from request payload.
   */
  async processFileUpload(file, userId = null) {
    if (!file || typeof file.text !== "function") {
      throw new Error("Invalid file object provided. Expected standard File object.");
    }

    const originalFileName = file.name;
    const fileName = `${Date.now()}_${originalFileName}`;

    // 1. Ensure uploads directory exists on disk
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 2. Save file buffer to local disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    // 3. Create initial UploadBatch record in database with PENDING status
    const batchResult = await createUploadBatch({
      fileName: fileName,
      originalFileName: originalFileName,
      totalRows: 0,
      userId: userId,
    });

    // 4. Add background job to BullMQ queue for async processing
    const job = await invoiceQueue.add("process-upload", {
      uploadBatchId: batchResult.id,
      filePath: filePath,
      userId: userId,
    });

    console.log("Job Added:", job.id, job.name, "for batch:", batchResult.id);

    return {
      success: true,
      message: "File uploaded and queued for background processing successfully",
      batch: batchResult,
    };
  },

  /**
   * Retrieves status and invoice items for a single batch by ID.
   */
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

  /**
   * Retrieves all upload batches for a specific user.
   */
  async getAllUploads(userId) {
    return await getAllUploadBatches(userId);
  },

  /**
   * Retrieves upload batches with pagination, sorting, and search.
   */
  async getUploadsPaged(options) {
    return await getUploadBatchesWithPagination(options);
  },

  /**
   * Retrieves invoices with pagination, sorting, and search.
   */
  async getInvoicesPaged(options) {
    return await getInvoicesWithPagination(options);
  },

  /**
   * Resets batch status, clears previous invoice records, and re-queues job for processing.
   */
  async retryUploadBatch(uploadBatchId, userId) {
    const batch = await getUploadBatchById(uploadBatchId);
    if (!batch) {
      throw new Error("Upload batch not found");
    }
    if (userId && batch.userId !== parseInt(userId)) {
      throw new Error("Forbidden");
    }

    // 1. Delete associated invoice records from previous run
    await deleteInvoicesByBatchId(batch.id);

    // 2. Reset batch progress counters in database
    const resetBatch = await updateUploadBatchProgress(batch.id, {
      status: "PENDING",
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
    });

    // 3. Re-queue background job in BullMQ
    const filePath = path.join(process.cwd(), "uploads", batch.fileName);
    const job = await invoiceQueue.add("process-upload", {
      uploadBatchId: batch.id,
      filePath: filePath,
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
   * Computes dashboard metrics and chart analytics for current and previous time periods.
   */
  async getReportsStatistics(userId, dateRange) {
    const now = new Date();
    const ranges = getDateRanges(dateRange, now);

    // 1. Fetch invoices for current date range
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

    // Fetch batches completed in current date range
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

    // 2. Fetch invoices for previous date range
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

    // Fetch batches completed in previous date range
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

    // 3. Compute stats for current period using explicit loops
    const curTotal = currentInvoices.length;
    let curMatched = 0;
    let curMismatched = 0;
    let curFailed = 0;

    for (let i = 0; i < currentInvoices.length; i++) {
      const status = currentInvoices[i].status;
      if (status === "MATCHED") {
        curMatched++;
      } else if (status === "MISMATCHED") {
        curMismatched++;
      } else if (status === "FAILED") {
        curFailed++;
      }
    }

    let curMatchRate = 0;
    if (curTotal > 0) {
      curMatchRate = (curMatched / curTotal) * 100;
    }

    let curTimeMs = 0;
    let curRowsSum = 0;
    for (let i = 0; i < currentBatches.length; i++) {
      const b = currentBatches[i];
      const duration = b.updatedAt.getTime() - b.createdAt.getTime();
      if (duration > 0 && b.totalRows > 0) {
        curTimeMs += duration;
        curRowsSum += b.totalRows;
      }
    }

    let curAvgTime = 0.15; // default fallback 0.15s per invoice
    if (curRowsSum > 0) {
      curAvgTime = curTimeMs / curRowsSum / 1000;
    }

    // 4. Compute stats for previous period
    const prevTotal = previousInvoices.length;
    let prevMatched = 0;
    let prevFailed = 0;

    for (let i = 0; i < previousInvoices.length; i++) {
      const status = previousInvoices[i].status;
      if (status === "MATCHED") {
        prevMatched++;
      } else if (status === "FAILED") {
        prevFailed++;
      }
    }

    let prevMatchRate = 0;
    if (prevTotal > 0) {
      prevMatchRate = (prevMatched / prevTotal) * 100;
    }

    let prevTimeMs = 0;
    let prevRowsSum = 0;
    for (let i = 0; i < previousBatches.length; i++) {
      const b = previousBatches[i];
      const duration = b.updatedAt.getTime() - b.createdAt.getTime();
      if (duration > 0 && b.totalRows > 0) {
        prevTimeMs += duration;
        prevRowsSum += b.totalRows;
      }
    }

    let prevAvgTime = 0.15;
    if (prevRowsSum > 0) {
      prevAvgTime = prevTimeMs / prevRowsSum / 1000;
    }

    // 5. Compute percentage change labels
    // Total Processed
    let totalChangePct = 0;
    if (prevTotal === 0) {
      if (curTotal > 0) totalChangePct = 100;
    } else {
      totalChangePct = ((curTotal - prevTotal) / prevTotal) * 100;
    }
    const totalPrefix = totalChangePct >= 0 ? "+" : "";
    const totalChange = `${totalPrefix}${totalChangePct.toFixed(1)}%`;
    const totalPositive = curTotal >= prevTotal;

    // Match Rate
    let matchRateChangePct = 0;
    if (prevMatchRate === 0) {
      if (curMatchRate > 0) matchRateChangePct = 100;
    } else {
      matchRateChangePct = ((curMatchRate - prevMatchRate) / prevMatchRate) * 100;
    }
    const matchPrefix = matchRateChangePct >= 0 ? "+" : "";
    const matchRateChange = `${matchPrefix}${matchRateChangePct.toFixed(1)}%`;
    const matchRatePositive = curMatchRate >= prevMatchRate;

    // Avg Processing Time
    const timeDiff = curAvgTime - prevAvgTime;
    const timePrefix = timeDiff >= 0 ? "+" : "";
    const timeChange = `${timePrefix}${timeDiff.toFixed(2)}s`;
    const timePositive = curAvgTime <= prevAvgTime;

    // Critical Errors
    const errDiff = curFailed - prevFailed;
    const errPrefix = errDiff >= 0 ? "+" : "";
    const errChange = `${errPrefix}${errDiff}`;
    const errPositive = curFailed <= prevFailed;

    // 6. Generate Chart Data slots
    const slots = getChartSlots(dateRange, now);

    for (let i = 0; i < currentInvoices.length; i++) {
      const inv = currentInvoices[i];
      const time = inv.createdAt.getTime();

      for (let s = 0; s < slots.length; s++) {
        const slot = slots[s];
        if (time >= slot.start.getTime() && time <= slot.end.getTime()) {
          if (inv.status === "FAILED") {
            slot.errors++;
          } else {
            slot.processed++;
          }
          break;
        }
      }
    }

    const barData = [];
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      barData.push({
        name: s.label,
        processed: s.processed,
        errors: s.errors,
      });
    }

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
      barData: barData,
      pieData: pieData,
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
    startDate: startDate,
    endDate: endDate,
    previousStartDate: previousStartDate,
    previousEndDate: previousEndDate,
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
        label: label,
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
        label: label,
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
        end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999),
        processed: 0,
        errors: 0,
      });
    }
  } else if (dateRange === "Year to Date") {
    const currentMonth = now.getMonth(); // 0 to 11
    for (let i = 0; i <= currentMonth; i++) {
      const d = new Date(now.getFullYear(), i, 1);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      slots.push({
        label: label,
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
        label: label,
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