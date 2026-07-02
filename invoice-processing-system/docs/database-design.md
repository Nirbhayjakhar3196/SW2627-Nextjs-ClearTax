# Database Design

## Overview

The system uses two primary MongoDB collections:

1. UploadBatch
2. InvoiceRow

This separation ensures scalability and allows each invoice to be processed independently.

---

# UploadBatch Collection

Purpose:
Stores metadata about each uploaded CSV file.

Fields:

- fileName
- uploadedBy
- totalRows
- processedRows
- successRows
- failedRows
- progress
- status
- createdAt
- updatedAt

---

# InvoiceRow Collection

Purpose:
Stores information for every invoice present in the uploaded CSV.

Fields:

- uploadBatchId
- rowNumber
- invoiceNumber
- vendorName
- gstNumber
- amount
- matchStatus
- status
- errorMessage
- createdAt
- updatedAt

---

# Relationship

One UploadBatch

↓

Many InvoiceRows

---

# Progress Calculation

progress = processedRows / totalRows × 100

---

# Row-Level Error Handling

Each InvoiceRow stores its own:

- status
- errorMessage

This allows failed rows to be skipped while the remaining invoices continue processing.

---

# Advantages

- Scalable
- Easy querying
- Independent invoice processing
- Efficient progress tracking
- Fault tolerant