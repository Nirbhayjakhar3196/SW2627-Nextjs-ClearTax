import express from "express";
import multer from "multer";
import uploadService from "../services/upload.service.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();
// Multer memory storage holds uploaded CSV files temporarily in RAM buffer
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/invoices - Paginated invoice query endpoint
router.get("/invoices", authenticateUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const status = req.query.status;
    const uploadBatchId = req.query.uploadBatchId;
    const search = req.query.search;

    let parsedBatchId = undefined;
    if (uploadBatchId) {
      parsedBatchId = parseInt(uploadBatchId, 10);
    }

    const result = await uploadService.getInvoicesPaged({
      page: page,
      limit: limit,
      sortBy: sortBy,
      sortOrder: sortOrder,
      status: status,
      uploadBatchId: parsedBatchId,
      search: search,
      userId: req.user.id,
    });

    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("GET Invoices List Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve invoices list",
    });
  }
});

// GET /api/uploads - Paginated upload batch query endpoint
router.get("/uploads", authenticateUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const status = req.query.status;
    const search = req.query.search;

    const result = await uploadService.getUploadsPaged({
      page: page,
      limit: limit,
      sortBy: sortBy,
      sortOrder: sortOrder,
      status: status,
      search: search,
      userId: req.user.id,
    });

    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("GET Uploads List Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve uploads list",
    });
  }
});

// GET /api/upload - Legacy simple list endpoint for upload history
router.get("/upload", authenticateUser, async (req, res) => {
  try {
    const uploads = await uploadService.getAllUploads(req.user.id);
    res.json({ success: true, data: uploads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/upload - Upload CSV file endpoint
router.post("/upload", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No valid file found in request. Please upload a file.",
      });
    }

    // Convert multer file buffer into Web API File object expected by service layer
    const fileMimeType = req.file.mimetype || "text/csv";
    const file = new File([req.file.buffer], req.file.originalname, {
      type: fileMimeType,
    });

    const result = await uploadService.processFileUpload(file, userId);

    if (!result.batch) {
      return res.status(400).json({
        success: false,
        message: "Failed to create upload batch",
      });
    }

    res.status(201).json({
      success: true,
      message: "File uploaded and processed successfully!",
      data: result,
    });
  } catch (error) {
    console.error("API Upload Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process file upload.",
    });
  }
});

// GET /api/upload/:id & GET /api/uploads/:id - Get single upload batch details
router.get(["/upload/:id", "/uploads/:id"], authenticateUser, async (req, res) => {
  try {
    const batchId = parseInt(req.params.id, 10);
    const data = await uploadService.getUploadStatus(batchId, req.user.id);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error("GET Upload Details Error:", error);
    let statusCode = 500;
    if (error.message === "Forbidden") {
      statusCode = 403;
    } else if (error.message === "Upload batch not found") {
      statusCode = 404;
    }
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch upload batch details",
    });
  }
});

// GET /api/uploads/:id/progress - Polling endpoint for background processing metrics
router.get("/uploads/:id/progress", authenticateUser, async (req, res) => {
  try {
    const batchId = parseInt(req.params.id, 10);
    const data = await uploadService.getUploadStatus(batchId, req.user.id);

    let percentage = 0;
    if (data.totalRows > 0) {
      percentage = Math.round((data.processedRows / data.totalRows) * 100);
    }

    res.json({
      status: data.status,
      totalRows: data.totalRows,
      processedRows: data.processedRows,
      successfulRows: data.successfulRows,
      failedRows: data.failedRows,
      percentage: percentage,
    });
  } catch (error) {
    console.error("GET Upload Progress Error:", error);
    let statusCode = 500;
    if (error.message === "Forbidden") {
      statusCode = 403;
    } else if (error.message === "Upload batch not found") {
      statusCode = 404;
    }
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch progress metrics",
    });
  }
});

// POST /api/uploads/:id/retry - Trigger retry for a failed or stalled upload batch
router.post("/uploads/:id/retry", authenticateUser, async (req, res) => {
  try {
    const batchId = parseInt(req.params.id, 10);
    const result = await uploadService.retryUploadBatch(batchId, req.user.id);
    res.json(result);
  } catch (error) {
    console.error("POST Upload Retry Error:", error);
    let statusCode = 500;
    if (error.message === "Forbidden") {
      statusCode = 403;
    } else if (error.message === "Upload batch not found") {
      statusCode = 404;
    }
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to trigger retry processing",
    });
  }
});

// GET /api/reports/statistics - Reports dashboard analytics endpoint
router.get("/reports/statistics", authenticateUser, async (req, res) => {
  try {
    const dateRange = req.query.dateRange;
    const stats = await uploadService.getReportsStatistics(req.user.id, dateRange);
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("GET Reports Statistics Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve reports statistics",
    });
  }
});

export default router;

