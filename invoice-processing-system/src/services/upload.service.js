// Mock invoice data
const mockInvoices = [
  {
    id: "INV-001",
    customer: "Amazon India",
    amount: 25430,
    status: "Matched",
    error: "",
  },
  {
    id: "INV-002",
    customer: "Flipkart Pvt Ltd",
    amount: 18250,
    status: "Mismatched",
    error: "GSTIN Missing",
  },
  {
    id: "INV-003",
    customer: "Reliance Retail",
    amount: 32100,
    status: "Matched",
    error: "",
  },
  {
    id: "INV-004",
    customer: "Tata Motors",
    amount: 15750,
    status: "Processing",
    error: "",
  },
];

const uploadService = {
  uploadCSV(file) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!file) {
          reject({
            success: false,
            message: "No file selected.",
          });
          return;
        }

        resolve({
          success: true,
          uploadId: "UPLOAD_12345",
          message: "CSV uploaded successfully.",
        });
      }, 1500);
    });
  },

  getUploadStatus(uploadId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uploadId,
          progress: 75,
          status: "Processing",
        });
      }, 1000);
    });
  },

  getInvoices() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInvoices);
      }, 1000);
    });
  },
};

export default uploadService;