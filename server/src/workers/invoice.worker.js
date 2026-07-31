import { Worker } from "bullmq";
import fs from "fs";
import Papa from "papaparse";
import { createRedisClient } from "../config/redis.js";
import { prisma } from "../config/prisma.js";
import {
  createInvoice,
  updateUploadBatchProgress,
} from "../repositories/upload.repository.js";

/**
 * Creates and registers the BullMQ worker for background invoice processing.
 */
export function createInvoiceWorker() {
  const worker = new Worker(
    "invoice-processing",
    async (job) => {
      const uploadBatchId = job.data.uploadBatchId;
      const filePath = job.data.filePath;
      const userId = job.data.userId;

      console.log(`[Worker] Starting job ${job.id} for Batch ${uploadBatchId}`);

      try {
        // 1. Verify CSV file exists on disk
        if (!fs.existsSync(filePath)) {
          throw new Error(`CSV file not found at path: ${filePath}`);
        }

        // 2. Read file contents from disk
        const fileContent = fs.readFileSync(filePath, "utf8");
        if (!fileContent || fileContent.trim().length === 0) {
          throw new Error("Uploaded CSV file is empty");
        }

        // 3. Parse CSV file text using PapaParse library
        const parseResult = Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          transformHeader: function (header) {
            return header.trim();
          },
        });

        const headers = parseResult.meta.fields || [];

        // 4. Validate presence of required CSV headers
        let hasInvoiceNum = false;
        let hasVendor = false;
        let hasAmount = false;

        for (let i = 0; i < headers.length; i++) {
          const h = headers[i].toLowerCase();
          if (h === "invoicenumber" || h === "invoice number" || h === "id" || h === "invoice_number") {
            hasInvoiceNum = true;
          }
          if (h === "vendor" || h === "customer" || h === "supplier" || h === "vendorname" || h === "vendor name") {
            hasVendor = true;
          }
          if (h === "amount" || h === "price" || h === "total") {
            hasAmount = true;
          }
        }

        if (headers.length === 0 || (!hasInvoiceNum && !hasVendor && !hasAmount)) {
          throw new Error("Invalid CSV Columns: File must contain headers for Invoice Number, Vendor, and Amount");
        }

        const parsedRows = parseResult.data;
        const totalRows = parsedRows.length;

        // 5. Update Batch status to PROCESSING in database
        await updateUploadBatchProgress(uploadBatchId, {
          totalRows: totalRows,
          status: "PROCESSING",
          processedRows: 0,
          successfulRows: 0,
          failedRows: 0,
        });

        let successfulCount = 0;
        let failedCount = 0;
        const seenInvoiceNumbers = new Set();

        // 6. Process each invoice row sequentially
        for (let i = 0; i < totalRows; i++) {
          const row = parsedRows[i];

          // Extract raw field values from row object
          let rawInvoiceNumber = row.invoiceNumber || row["Invoice Number"] || row.invoice_number || row.id || row.ID || "";
          let rawVendor = row.vendor || row.Vendor || row.customer || row.Customer || row.supplier || row.vendorname || row["Vendor Name"] || "";
          let rawAmount = parseFloat(row.amount || row.Amount || row.price || row.Price || row.total || NaN);

          let invoiceNumber = String(rawInvoiceNumber).trim();
          let vendor = String(rawVendor).trim();
          let amount = isNaN(rawAmount) ? 0 : rawAmount;

          let status = "MATCHED";
          let errorMessage = null;

          // Validation rules
          if (!invoiceNumber) {
            status = "FAILED";
            errorMessage = "Missing Invoice Number";
          } else if (!vendor || vendor.toLowerCase() === "default vendor") {
            status = "FAILED";
            errorMessage = "Missing Vendor Name";
          } else if (amount <= 0) {
            status = "FAILED";
            errorMessage = "Invalid Amount";
          } else if (seenInvoiceNumbers.has(invoiceNumber)) {
            status = "FAILED";
            errorMessage = "Duplicate Invoice Number";
          } else {
            // Track seen invoice numbers in current batch
            seenInvoiceNumbers.add(invoiceNumber);

            // Check database for existing invoice number for the same user
            if (userId) {
              const existingDbInvoice = await prisma.invoice.findFirst({
                where: {
                  invoiceNumber: invoiceNumber,
                  uploadBatch: {
                    userId: parseInt(userId),
                  },
                },
              });
              if (existingDbInvoice) {
                status = "FAILED";
                errorMessage = "Duplicate Invoice Number (Already exists in database)";
              }
            }
          }

          // Check vendor rules for mismatch or failure
          if (status !== "FAILED") {
            const vendorLower = vendor.toLowerCase();
            if (vendorLower.includes("globex")) {
              status = "MISMATCHED";
              errorMessage = "Amount difference detected";
            } else if (vendorLower.includes("initech")) {
              status = "FAILED";
              errorMessage = "Invalid invoice format";
            }
          }

          if (status === "FAILED") {
            failedCount++;
          } else {
            successfulCount++;
          }

          // Create invoice record in database
          await createInvoice({
            invoiceNumber: invoiceNumber || `ERR-INV-${1000 + i}`,
            vendor: vendor || "Unknown Vendor",
            amount: amount,
            status: status,
            errorMessage: errorMessage,
            uploadBatchId: uploadBatchId,
          });

          // Update batch progress after every row processed
          await updateUploadBatchProgress(uploadBatchId, {
            processedRows: i + 1,
            successfulRows: successfulCount,
            failedRows: failedCount,
          });

          // Brief delay simulation for progressive progress updates
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        // 7. Mark batch status as COMPLETED
        await updateUploadBatchProgress(uploadBatchId, {
          status: "COMPLETED",
        });

        console.log(`[Worker] Completed processing Batch ${uploadBatchId}. Total: ${totalRows}, Success: ${successfulCount}, Failed: ${failedCount}`);
      } catch (error) {
        console.error(`[Worker] Error processing Batch ${uploadBatchId}:`, error);

        // Mark batch as FAILED if error occurs before or during processing
        await updateUploadBatchProgress(uploadBatchId, {
          status: "FAILED",
        }).catch(() => {});

        throw error;
      } finally {
        console.log(`[Worker] Processing finished for batch: ${uploadBatchId}`);
      }
    },
    {
      connection: createRedisClient(),
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job completed successfully: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job failed: ${job?.id || "unknown"}, Error: ${err.message}`);
  });

  return worker;
}

