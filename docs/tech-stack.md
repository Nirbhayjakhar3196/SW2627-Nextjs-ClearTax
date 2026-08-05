# Bulk Invoice Upload - Technology Overview

## Problem Statement

ClearTax requires a bulk invoice upload feature where users can upload invoices through a CSV file. The uploaded invoices are processed in the background, allowing users to continue using the application while the upload is in progress. The UI shows progress, and once processing is complete, invoices appear in a scrollable table with match or mismatch status. If one invoice fails, the remaining invoices continue processing, with errors displayed for the failed rows.

---

## 1. Current Stack

### Frontend

- Next.js 16.2.10 with the App Router
- React 19.2.4
- Zustand for auth/session state
- Axios for API calls
- Framer Motion for motion
- PapaParse for CSV export and parsing helpers
- Tailwind CSS 4 for styling

### Backend

- Node.js + Express
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- Multer for CSV uploads
- Zod for validation
- bcryptjs, jsonwebtoken, and nodemailer for auth and notifications

---

## 2. What is CSV?

**CSV (Comma-Separated Values)** is a simple text file format used to store tabular data. Each line represents a row, and commas separate the values in each column.

Example:

```csv
Invoice No,Customer,Amount
INV001,ABC Ltd,1000
INV002,XYZ Ltd,2500
```

### Why use CSV?

* Easy to create using spreadsheet software like Excel.
* Lightweight and widely supported.
* Ideal for bulk data import and export.
* Simple to parse programmatically.

In this project, users upload invoice details in a CSV file, which is then processed by the system.

---

## 3. Why Background Processing?

Background processing allows long-running tasks to execute separately from the user's request, preventing the application from becoming slow or unresponsive.

### Benefits

* Users do not have to wait for thousands of invoices to be processed.
* The application remains responsive during processing.
* Large uploads can be handled efficiently.
* Individual row failures do not stop the remaining invoices from being processed.
* Progress can be tracked independently.

For the ClearTax requirement, background processing ensures that invoice validation, matching, and database operations happen asynchronously while users can monitor the progress.

---

## 4. What is BullMQ?

BullMQ is a Node.js job queue library built on top of Redis. It is used to manage background jobs efficiently.

### Features

* Queue-based job processing.
* Supports retries for failed jobs.
* Handles multiple workers concurrently.
* Tracks job status and progress.
* Scales easily for high-volume processing.

### Role in this project

* Each uploaded CSV is converted into processing jobs.
* Workers process invoice rows one by one.
* Failed rows are recorded without stopping the queue.
* Progress updates are generated as invoices are processed.

---

## 5. What is Redis?

Redis is an in-memory data store commonly used as a cache, message broker, and queue backend.

### Why Redis?

* Extremely fast read/write operations.
* Stores queue data efficiently.
* Enables communication between the application and background workers.
* Supports high throughput for job processing.

### Role in this project

BullMQ uses Redis to store queued jobs, track their state (waiting, active, completed, failed), and coordinate workers processing invoice uploads.

---

## 6. How Progress Works in This App

The app does not currently use SSE. Progress is stored in the `UploadBatch` record and the frontend polls the batch details endpoint every 1.5 seconds while a job is still processing.

### Benefits

* Simple to implement and debug.
* Works with the current Express API and Next.js client.
* Keeps progress tied to persisted database state.

### Role in this project

While invoice processing runs in the background, the server updates `processedRows`, `successfulRows`, `failedRows`, and `status` in PostgreSQL. The results page reads those values repeatedly until the batch reaches `COMPLETED` or `FAILED`.

---

# How These Technologies Work Together

1. The user uploads a CSV file containing invoice data.
2. The application validates the CSV and creates processing jobs using BullMQ.
3. BullMQ stores and manages the jobs in Redis.
4. Background workers process each invoice independently.
5. If a row fails, the error is recorded while the remaining invoices continue processing.
6. The frontend polls the batch details endpoint for progress updates.
7. Once processing completes, the processed invoices are displayed in a scrollable table with **Match** or **Mismatch** status and row-level error messages where applicable.

This architecture provides a scalable, responsive, and fault-tolerant solution for bulk invoice uploads, ensuring that large datasets are processed efficiently while giving users real-time visibility into the upload progress.
