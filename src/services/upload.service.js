import Papa from "papaparse";
import {
  createUploadBatchWithInvoices,
  getUploadBatchById,
  getAllUploadBatches,
} from "../repositories/upload.repository.js";

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
    const fileText = await file.text();

    let parsedInvoices = [];

    if (fileText && fileText.trim().length > 0) {
      const parseResult = Papa.parse(fileText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (parseResult.data && parseResult.data.length > 0) {
        parsedInvoices = parseResult.data.map((row, index) => ({
          invoiceNumber:
            row.invoiceNumber ||
            row["Invoice Number"] ||
            row.id ||
            row.ID ||
            `INV-${1000 + index}`,
          vendor:
            row.vendor ||
            row.Vendor ||
            row.customer ||
            row.Customer ||
            row.supplier ||
            "Default Vendor",
          amount:
            parseFloat(
              row.amount || row.Amount || row.price || row.Price || 0
            ) || 0,
          status: row.status || row.Status || "MATCHED",
          error: row.error || row.Error || null,
        }));
      }
    }

    // Call Repository to store in PostgreSQL database
    const batchResult = await createUploadBatchWithInvoices(
      {
        fileName,
        originalFileName,
        totalRows: parsedInvoices.length,
        userId,
      },
      parsedInvoices
    );

    return {
      success: true,
      message: "File uploaded and processed successfully",
      batch: batchResult,
    };
  },

  async getUploadStatus(uploadId) {
    const batch = await getUploadBatchById(uploadId);
    if (!batch) {
      throw new Error("Upload batch not found");
    }
    return {
      uploadId: batch.id,
      fileName: batch.originalFileName,
      status: batch.status,
      totalRows: batch.totalRows,
      invoices: batch.invoices,
    };
  },

  async getAllUploads() {
    return await getAllUploadBatches();
  },
};

export default uploadService;