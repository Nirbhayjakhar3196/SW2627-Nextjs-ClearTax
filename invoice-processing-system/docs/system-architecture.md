# System Architecture

## Overview

The Bulk Invoice Upload System allows users to upload a CSV file containing multiple invoices.

Instead of processing the CSV immediately, the system stores the upload request and delegates invoice processing to a background worker.

This ensures that users receive an immediate response while invoice processing continues asynchronously.

---

# High-Level Architecture

User

↓

Frontend (Next.js)

↓

Express Backend

↓

Upload API

↓

MongoDB (Upload Batch)

↓

BullMQ Queue (Redis)

↓

Background Worker

↓

CSV Parser

↓

Invoice Validation

↓

Invoice Matching

↓

MongoDB (Invoice Rows)

↓

Progress Update

↓

Server Sent Events (SSE)

↓

Frontend Dashboard

---

# Components

## Frontend

Responsibilities

- Upload CSV
- Show upload progress
- Listen for progress updates
- Display invoice table
- Display row errors

---

## Backend API

Responsibilities

- Accept CSV uploads
- Validate file
- Store upload metadata
- Create background job
- Return Job ID immediately

---

## MongoDB

Responsibilities

- Store upload batches
- Store processed invoice rows
- Store row-level errors
- Store processing progress

---

## Redis

Responsibilities

- Hold background jobs
- Queue uploaded CSV files
- Distribute work to workers

---

## BullMQ Worker

Responsibilities

- Read queued jobs
- Parse CSV
- Validate invoices
- Save invoice data
- Update processing progress

---

## SSE

Responsibilities

- Push live progress updates
- Notify frontend about completion
- Notify frontend about failures

---

# Processing Flow

1. User uploads CSV.

2. Backend validates uploaded file.

3. Upload metadata is stored in MongoDB.

4. Backend creates a BullMQ job.

5. Backend immediately returns Job ID.

6. Worker receives job.

7. Worker streams CSV row by row.

8. Each invoice is validated.

9. Match / Mismatch status is calculated.

10. Invoice row is stored.

11. Progress percentage is updated.

12. SSE sends progress updates.

13. Frontend updates progress bar.

14. User views completed results.

---

# Why Background Processing?

Processing thousands of invoices may take several minutes.

If processing happens inside the upload request:

- User waits
- Request may timeout
- Poor user experience

Instead:

Upload Request

↓

Queue Job

↓

Return Response

↓

Worker Processes in Background

---

# Why BullMQ?

BullMQ provides:

- Job Queues
- Retries
- Delayed Jobs
- Failed Job Tracking
- Multiple Workers
- Scalability

---

# Why Redis?

BullMQ requires Redis.

Redis stores queued jobs in memory for very fast processing.

---

# Why MongoDB?

MongoDB stores:

- Upload batches
- Invoice rows
- Processing progress
- Errors

---

# Why SSE?

The frontend only needs updates from the server.

Server → Client

Therefore SSE is simpler than WebSockets.

---

# Summary

The architecture separates uploading from processing.

This makes the system scalable, fault tolerant, and responsive.