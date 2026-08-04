# Bulk Invoice Upload System

## Problem Statement

ClearTax wants a bulk invoice upload (CSV) feature that processes uploaded invoices in the background and displays progress. Processed invoices should appear in a scrollable table with match or mismatch status. If one invoice fails during processing, remaining invoices should continue processing. Row-level errors should be visible to the user.

---

# 1. Who are the Users?

- Business Owners
- Accountants
- Finance Teams
- Tax Consultants

---

# 2. What Problem Are We Solving?

Currently, users may need to upload invoices one by one.

This is slow, repetitive, and inefficient.

Our system allows users to upload thousands of invoices through a CSV file and process them automatically in the background while displaying live progress.

---

# 3. User Story

As a business user,

I want to upload a CSV containing multiple invoices,

So that I don't manually upload each invoice,

While seeing processing progress,

And if one invoice fails, remaining invoices should continue processing.

---

# 4. Functional Requirements

- User uploads CSV file.
- System validates uploaded file.
- System creates a background processing job.
- User immediately receives confirmation.
- Background worker processes invoices.
- Progress updates are reflected through polling.
- Every invoice is processed independently.
- Failed invoices do not stop processing.
- Match / Mismatch status is calculated.
- Results are displayed in a scrollable table.
- Errors are shown for failed rows.

---

# 5. Non Functional Requirements

- Fast Upload Response
- Scalable Architecture
- Fault Tolerance
- Near-Real-Time Progress
- Responsive UI
- Efficient Memory Usage
- Secure File Upload
- High Availability

---

# 6. Assumptions

- CSV format is predefined.
- User uploads one CSV at a time.
- Invoice format follows company template.
- Maximum upload size will be configurable.

---

# 7. Success Criteria

A successful upload means:

- CSV uploaded successfully.
- Background job created.
- Every invoice processed.
- Successful invoices stored.
- Failed invoices logged.
- User receives progress updates through periodic refresh.
- Final results displayed successfully.