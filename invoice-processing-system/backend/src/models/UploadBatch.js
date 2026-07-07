const mongoose = require("mongoose");

const uploadBatchSchema = new mongoose.Schema({

    fileName: {
        type: String,
        required: true
    },

    originalFileName: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
        default: "PENDING"
    },

    totalRows: {
        type: Number,
        default: 0
    },

    processedRows: {
        type: Number,
        default: 0
    },

    successfulRows: {
        type: Number,
        default: 0
    },

    failedRows: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("UploadBatch", uploadBatchSchema);