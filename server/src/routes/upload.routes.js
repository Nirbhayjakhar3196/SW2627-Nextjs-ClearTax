import express from "express";
import multer from "multer";
import uploadService from "../services/upload.service.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/invoices
router.get("/invoices", authenticateUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const status = req.query.status;
    const uploadBatchId = req.query.uploadBatchId;
    const search = req.query.search;

    const result = await uploadService.getInvoicesPaged({
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      uploadBatchId: uploadBatchId ? parseInt(uploadBatchId) : undefined,
      search,
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

// GET /api/uploads
router.get("/uploads", authenticateUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const status = req.query.status;
    const search = req.query.search;

    const result = await uploadService.getUploadsPaged({
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      search,
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

// GET /api/upload
router.get("/upload", authenticateUser, async (req, res) => {
  try {
    const uploads = await uploadService.getAllUploads(req.user.id);
    res.json({ success: true, data: uploads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/upload
router.post("/upload", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No valid file found in request. Please upload a file.",
      });
    }

    const file = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype || "text/csv",
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

// GET /api/upload/:id
// GET /api/uploads/:id
router.get(["/upload/:id", "/uploads/:id"], authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await uploadService.getUploadStatus(parseInt(id), req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("GET Upload Details Error:", error);
    let status = 500;
    if (error.message === "Forbidden") {
      status = 403;
    } else if (error.message === "Upload batch not found") {
      status = 404;
    }
    res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch upload batch details",
    });
  }
});

// GET /api/uploads/:id/progress
router.get("/uploads/:id/progress", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await uploadService.getUploadStatus(parseInt(id), req.user.id);
    const percentage = data.totalRows > 0
      ? Math.round((data.processedRows / data.totalRows) * 100)
      : 0;

    res.json({
      status: data.status,
      totalRows: data.totalRows,
      processedRows: data.processedRows,
      successfulRows: data.successfulRows,
      failedRows: data.failedRows,
      percentage,
    });
  } catch (error) {
    console.error("GET Upload Progress Error:", error);
    let status = 500;
    if (error.message === "Forbidden") {
      status = 403;
    } else if (error.message === "Upload batch not found") {
      status = 404;
    }
    res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch progress metrics",
    });
  }
});

// POST /api/uploads/:id/retry
router.post("/uploads/:id/retry", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await uploadService.retryUploadBatch(parseInt(id), req.user.id);
    res.json(result);
  } catch (error) {
    console.error("POST Upload Retry Error:", error);
    let status = 500;
    if (error.message === "Forbidden") {
      status = 403;
    } else if (error.message === "Upload batch not found") {
      status = 404;
    }
    res.status(status).json({
      success: false,
      message: error.message || "Failed to trigger retry processing",
    });
  }
});

// GET /api/reports/statistics
router.get("/reports/statistics", authenticateUser, async (req, res) => {
  try {
    const { dateRange } = req.query;
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
