# System Architecture

## Overview

The system lets users upload a CSV file containing multiple invoices.

Instead of processing the CSV immediately, the upload is stored and a background worker processes it asynchronously.

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

PostgreSQL (Upload Batch)

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

PostgreSQL (Invoice Rows)

↓

Progress Update

↓

Polling Endpoint

↓

Frontend Dashboard

---

# Components

## Frontend

Responsibilities

- Upload CSV
- Show upload progress
- Poll for progress updates
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

## PostgreSQL

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

## Polling

Responsibilities

- Fetch live progress from the API
- Notify frontend about completion
- Notify frontend about failures

---

# Processing Flow

1. User uploads CSV.

2. Backend validates uploaded file.

3. Upload metadata is stored in PostgreSQL.

4. Backend creates a BullMQ job.

5. Backend immediately returns Job ID.

6. Worker receives job.

7. Worker streams CSV row by row.

8. Each invoice is validated.

9. Match / Mismatch status is calculated.

10. Invoice row is stored.

11. Progress percentage is updated.

12. Frontend polls the batch progress endpoint.

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

# Why PostgreSQL?

PostgreSQL stores:

- Upload batches
- Invoice rows
- Processing progress
- Errors

---

# Why Polling?

The frontend only needs periodic updates from the server.

Polling matches the current API and keeps the implementation simple.

---

# Summary

The architecture separates uploading from processing.

This makes the system scalable, fault tolerant, and responsive.