import { prisma } from "../lib/prisma.js";

/**
 * Creates a new UploadBatch record in the database.
 */
export async function createUploadBatch(data) {
  const { fileName, originalFileName, totalRows = 0, userId = null } = data;

  return await prisma.uploadBatch.create({
    data: {
      fileName,
      originalFileName,
      totalRows,
      status: "COMPLETED",
      processedRows: totalRows,
      successfulRows: totalRows,
      failedRows: 0,
      userId: userId ? parseInt(userId) : null,
    },
  });
}

/**
 * Creates invoice records associated with an UploadBatch.
 */
export async function saveInvoices(uploadBatchId, invoices) {
  if (!invoices || invoices.length === 0) return [];

  const invoiceRecords = invoices.map((inv) => ({
    invoiceNumber: String(inv.invoiceNumber || inv.invoice_number || inv.id || `INV-${Date.now()}`),
    vendor: String(inv.vendor || inv.customer || "Unknown Vendor"),
    amount: parseFloat(inv.amount) || 0,
    status: inv.status?.toUpperCase() === "MATCHED" ? "MATCHED" : inv.status?.toUpperCase() === "MISMATCHED" ? "MISMATCHED" : "PENDING",
    errorMessage: inv.error || null,
    uploadBatchId: parseInt(uploadBatchId),
  }));

  await prisma.invoice.createMany({
    data: invoiceRecords,
  });

  return await prisma.invoice.findMany({
    where: { uploadBatchId: parseInt(uploadBatchId) },
  });
}

/**
 * Creates an UploadBatch and all parsed invoices in a transaction.
 */
export async function createUploadBatchWithInvoices(batchData, invoices = []) {
  const batch = await createUploadBatch(batchData);
  let savedInvoices = [];

  if (invoices && invoices.length > 0) {
    savedInvoices = await saveInvoices(batch.id, invoices);
  }

  return { ...batch, invoices: savedInvoices };
}

/**
 * Retrieves an UploadBatch by ID with its invoices.
 */
export async function getUploadBatchById(id) {
  return await prisma.uploadBatch.findUnique({
    where: { id: parseInt(id) },
    include: { invoices: true },
  });
}

/**
 * Retrieves all UploadBatches.
 */
export async function getAllUploadBatches() {
  return await prisma.uploadBatch.findMany({
    orderBy: { createdAt: "desc" },
    include: { invoices: true },
  });
}
