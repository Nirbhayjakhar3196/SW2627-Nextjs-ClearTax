# Database Design

## Overview

The system uses three Prisma models backed by PostgreSQL:

1. User
2. UploadBatch
3. Invoice

This separation keeps user data, batch metadata, and invoice rows normalized while still allowing each invoice to be processed independently.

---

# User Model

Purpose:
Stores account details and profile metadata.

Fields:

- name
- email
- password
- role
- profilePicture
- createdAt
- updatedAt

---

# UploadBatch Model

Purpose:
Stores metadata about each uploaded CSV file.

Fields:

- fileName
- originalFileName
- totalRows
- processedRows
- successfulRows
- failedRows
- status
- createdAt
- updatedAt
- userId

---

# Invoice Model

Purpose:
Stores information for every invoice present in the uploaded CSV.

Fields:

- uploadBatchId
- invoiceNumber
- vendor
- amount
- status
- errorMessage
- createdAt
- updatedAt

---

# Relationship

One User

↓

Many UploadBatches

↓

Many Invoices

---

# Progress Calculation

progress = processedRows / totalRows × 100

---

# Row-Level Error Handling

Each Invoice stores its own:

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