import { prisma } from "../config/prisma.js";

/**
 * Creates a new UploadBatch record in the database.
 */
export async function createUploadBatch(data) {
  const fileName = data.fileName;
  const originalFileName = data.originalFileName;
  const totalRows = data.totalRows || 0;
  const userId = data.userId;

  let parsedUserId = null;
  if (userId) {
    parsedUserId = parseInt(userId);
  }

  return await prisma.uploadBatch.create({
    data: {
      fileName: fileName,
      originalFileName: originalFileName,
      totalRows: totalRows,
      status: "PENDING",
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      userId: parsedUserId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Creates invoice records associated with an UploadBatch.
 */
export async function saveInvoices(uploadBatchId, invoices) {
  if (!invoices || invoices.length === 0) {
    return [];
  }

  const invoiceRecords = [];
  for (let i = 0; i < invoices.length; i++) {
    const inv = invoices[i];

    let rawNum = inv.invoiceNumber || inv.invoice_number || inv.id || `INV-${Date.now()}`;
    let rawVendor = inv.vendor || inv.customer || "Unknown Vendor";
    let amount = parseFloat(inv.amount) || 0;

    let status = "PENDING";
    if (inv.status) {
      const upperStatus = inv.status.toUpperCase();
      if (upperStatus === "MATCHED") {
        status = "MATCHED";
      } else if (upperStatus === "MISMATCHED") {
        status = "MISMATCHED";
      }
    }

    invoiceRecords.push({
      invoiceNumber: String(rawNum),
      vendor: String(rawVendor),
      amount: amount,
      status: status,
      errorMessage: inv.error || null,
      uploadBatchId: parseInt(uploadBatchId),
    });
  }

  await prisma.invoice.createMany({
    data: invoiceRecords,
  });

  return await prisma.invoice.findMany({
    where: { uploadBatchId: parseInt(uploadBatchId) },
  });
}

/**
 * Creates an UploadBatch and all parsed invoices.
 */
export async function createUploadBatchWithInvoices(batchData, invoices = []) {
  const batch = await createUploadBatch(batchData);
  let savedInvoices = [];

  if (invoices && invoices.length > 0) {
    savedInvoices = await saveInvoices(batch.id, invoices);
  }

  return {
    ...batch,
    invoices: savedInvoices,
  };
}

/**
 * Retrieves an UploadBatch by ID with its invoices and user details.
 */
export async function getUploadBatchById(id) {
  return await prisma.uploadBatch.findUnique({
    where: { id: parseInt(id) },
    include: {
      invoices: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Retrieves all UploadBatches created by a specific user.
 */
export async function getAllUploadBatches(userId) {
  if (!userId) {
    throw new Error("User ID is required to retrieve upload batches");
  }

  return await prisma.uploadBatch.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { createdAt: "desc" },
    include: {
      invoices: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Creates a single invoice record in the database.
 */
export async function createInvoice(data) {
  return await prisma.invoice.create({
    data: {
      invoiceNumber: String(data.invoiceNumber),
      vendor: String(data.vendor),
      amount: parseFloat(data.amount) || 0,
      status: data.status || "PENDING",
      errorMessage: data.errorMessage || null,
      uploadBatchId: parseInt(data.uploadBatchId),
    },
  });
}

/**
 * Updates progress metrics and status of an UploadBatch.
 */
export async function updateUploadBatchProgress(id, progressData) {
  return await prisma.uploadBatch.update({
    where: { id: parseInt(id) },
    data: progressData,
  });
}

/**
 * Retrieves UploadBatches with pagination, sorting, search, and status filtering.
 */
export async function getUploadBatchesWithPagination(options = {}) {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  const status = options.status;
  const search = options.search;
  const userId = options.userId;

  if (!userId) {
    throw new Error("User ID is required for retrieving paginated upload batches");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {};
  where.userId = parseInt(userId);

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { fileName: { contains: search, mode: "insensitive" } },
      { originalFileName: { contains: search, mode: "insensitive" } },
    ];
  }

  // Ensure sortBy is a valid column name
  const validSortFields = ["createdAt", "updatedAt", "totalRows", "processedRows", "status"];
  let finalSortBy = "createdAt";
  if (validSortFields.includes(sortBy)) {
    finalSortBy = sortBy;
  }

  let finalSortOrder = "desc";
  if (sortOrder && sortOrder.toLowerCase() === "asc") {
    finalSortOrder = "asc";
  }

  const orderBy = { [finalSortBy]: finalSortOrder };

  const data = await prisma.uploadBatch.findMany({
    where: where,
    orderBy: orderBy,
    skip: skip,
    take: take,
    include: {
      invoices: true,
    },
  });

  const total = await prisma.uploadBatch.count({
    where: where,
  });

  const totalPages = Math.ceil(total / parseInt(limit));

  return {
    data: data,
    meta: {
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: totalPages,
    },
  };
}

/**
 * Retrieves Invoices with pagination, sorting, search, and status filtering.
 */
export async function getInvoicesWithPagination(options = {}) {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  const status = options.status;
  const uploadBatchId = options.uploadBatchId;
  const search = options.search;
  const userId = options.userId;

  if (!userId) {
    throw new Error("User ID is required for retrieving paginated invoices");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (uploadBatchId) {
    where.uploadBatchId = parseInt(uploadBatchId);
  }

  where.uploadBatch = {
    userId: parseInt(userId),
  };

  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { vendor: { contains: search, mode: "insensitive" } },
      { errorMessage: { contains: search, mode: "insensitive" } },
    ];
  }

  // Ensure sortBy is a valid column name
  const validSortFields = ["createdAt", "updatedAt", "amount", "invoiceNumber", "vendor", "status"];
  let finalSortBy = "createdAt";
  if (validSortFields.includes(sortBy)) {
    finalSortBy = sortBy;
  }

  let finalSortOrder = "desc";
  if (sortOrder && sortOrder.toLowerCase() === "asc") {
    finalSortOrder = "asc";
  }

  const orderBy = { [finalSortBy]: finalSortOrder };

  const data = await prisma.invoice.findMany({
    where: where,
    orderBy: orderBy,
    skip: skip,
    take: take,
  });

  const total = await prisma.invoice.count({
    where: where,
  });

  const totalPages = Math.ceil(total / parseInt(limit));

  return {
    data: data,
    meta: {
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: totalPages,
    },
  };
}

/**
 * Deletes all invoices associated with an UploadBatch.
 */
export async function deleteInvoicesByBatchId(batchId) {
  return await prisma.invoice.deleteMany({
    where: { uploadBatchId: parseInt(batchId) },
  });
}

