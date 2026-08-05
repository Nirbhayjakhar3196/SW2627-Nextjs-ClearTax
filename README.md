# ClearTax — Bulk Invoice Processing System 🚀

A high-performance, fault-tolerant monorepo web application designed to handle **bulk CSV invoice uploads** with **asynchronous background processing**, **real-time Server-Sent Events (SSE) progress tracking**, and a **dynamic interactive UI**.

---

## 👥 Team Information

| Role | Name |
| :--- | :--- |
| **Team Leader** 👑 | **Payal Vats** |
| **Team Member** 💻 | **Nirbhay Jakhar** |
| **Team Member** 💻 | **Priyanshu Dolwani** |

---

## 📌 Problem Statement & Solution

Businesses and reconciliation teams often handle bulk invoice files containing thousands of rows. Processing these synchronously causes server timeouts, UI freezes, and catastrophic failure when a single row contains invalid data.

**ClearTax Bulk Invoice Processing System** addresses this challenge with:
- **Non-blocking asynchronous queuing**: Users upload CSV files and can immediately continue using the application while background workers process the dataset.
- **Real-Time Live Streaming**: Server-Sent Events (SSE) stream live progress metrics (completion %, success count, failure count) directly to the user interface.
- **Row-Level Resilience**: Individual invoice processing failures are captured gracefully with detailed error messages without aborting the entire batch.

---

## ✨ Key Features

- **⚡ Fast CSV Upload & Parsing**: Streamlined bulk upload supporting PapaParse CSV parsing with instant payload validation.
- **🔄 Asynchronous Queueing with BullMQ & Redis**: Heavy invoice reconciliation jobs are offloaded to background workers.
- **📡 Live Real-Time SSE Updates**: Zero-polling progress updates delivered over an open HTTP SSE connection.
- **🛡️ Row-Level Fault Tolerance**: Detailed status tracking (`MATCHED`, `MISMATCHED`, `FAILED`, `PENDING`) for each invoice line item.
- **📊 Interactive Analytics & Dashboard**: Responsive Next.js UI featuring interactive charts, metrics, dark mode styling, and scrollable tabular invoice views.
- **🔐 User & Batch Management**: Secured authentication with JWT, role-based access controls, and Prisma PostgreSQL ORM storage.
- **🐳 Dockerized Architecture**: Standardized container setup with `docker-compose.yml` for effortless orchestration.

---

## 🛠️ Tech Stack

### **Frontend (`/client`)**
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, Lucide React, Framer Motion
- **State & Data Fetching**: TanStack Query v5, Zustand, React Hook Form + Zod
- **Data Visualization**: Recharts, PapaParse, Sonner Notifications

### **Backend (`/server`)**
- **Runtime & Server**: Node.js, Express.js
- **Database & ORM**: PostgreSQL, Prisma ORM 6
- **Queue & Caching**: Redis (ioredis), BullMQ background worker system
- **Real-Time Delivery**: Server-Sent Events (SSE)
- **Utilities**: Multer (file handling), JWT Auth, Nodemailer, Zod validation

---

## 🏗️ Architecture & Workflow

```
┌─────────────────┐       1. Upload CSV       ┌─────────────────┐
│ Next.js Client  │ ────────────────────────> │  Express Server │
│   (App Router)  │                           │   & Controller  │
└────────┬────────┘                           └────────┬────────┘
         │                                             │
         │ 3. Listen to SSE Stream                     │ 2. Create UploadBatch &
         │    for real-time progress                   │    Enqueue BullMQ Jobs
         ▼                                             ▼
┌─────────────────┐   4. Process Rows         ┌─────────────────┐
│  Server-Sent    │ <──────────────────────── │  BullMQ Worker  │
│   Events (SSE)  │                           │     & Redis     │
└─────────────────┘                           └────────┬────────┘
                                                       │
                                                       │ 5. Store Invoices & Status
                                                       ▼
                                              ┌─────────────────┐
                                              │   PostgreSQL    │
                                              │  (via Prisma)   │
                                              └─────────────────┘
```

---

## 📁 Repository Structure

```
clearTax/
├── client/                 # Next.js Frontend Application
│   ├── app/                # Next.js App Router pages & layouts
│   ├── components/         # UI components & interactive widgets
│   ├── lib/                # API clients, utilities, & custom hooks
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express Backend API & Worker Engine
│   ├── src/                # Express controllers, routes, & workers
│   │   ├── config/         # Redis, Prisma, & BullMQ setup
│   │   ├── controllers/    # API endpoint handlers
│   │   ├── routes/         # Express routes
│   │   └── workers/        # BullMQ background invoice workers
│   ├── prisma/             # Prisma schema & migration files
│   ├── package.json
│   └── Dockerfile.dev
├── docs/                   # Product & Architecture Documentation
│   ├── PRD.md              # Product Requirements Document
│   └── tech-stack.md       # Technical Stack Overview
├── scripts/                # Utility scripts (e.g. port management)
├── docker-compose.yml      # Orchestration for client & server
├── package.json            # Root monorepo configuration with Concurrently
└── README.md               # Project Documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js**: `v18+` or `v20+`
- **npm** or **yarn** / **pnpm**
- **PostgreSQL**: Local instance or cloud database (e.g. Supabase / ElephantSQL)
- **Redis**: Local server or cloud instance (Upstash / Redis Cloud)
- **Docker & Docker Compose** *(Optional, for containerized run)*

---

### ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/https://github.com/kalviumcommunity/SW2627-Nextjs-ClearTax.git/clearTax.git
   cd clearTax
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Create `.env` in the root and `/server` directories:

   **`server/.env`**:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/cleartax?schema=public"
   REDIS_HOST="127.0.0.1"
   REDIS_PORT=6379
   JWT_SECRET="your_jwt_secret_key"
   ```

   **`client/.env`**:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000"
   ```

4. **Run Database Migrations & Seed**:
   ```bash
   # Generate Prisma client and push schema to database
   npm run prisma:generate
   npm run prisma:push
   ```

---

### 🏃 Running the Application

#### **Mode 1: Concurrent Development Server**
Run both client (Next.js) and server (Express) concurrently:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000` (or `http://localhost:3001`)
- **Backend API**: `http://localhost:5000`

#### **Mode 2: Individual Workspace Commands**
```bash
# Run server only
npm run dev:server

# Run client only
npm run dev:client
```

#### **Mode 3: Docker Compose**
```bash
docker-compose up --build
```

---

## 🗄️ Database Schema Overview

The database uses **Prisma** with **PostgreSQL**. Core entities include:

- **`User`**: Account management (`id`, `name`, `email`, `password`, `role`).
- **`UploadBatch`**: Upload session metadata (`fileName`, `totalRows`, `processedRows`, `successfulRows`, `failedRows`, `status`).
- **`Invoice`**: Row-level invoice entry (`invoiceNumber`, `vendor`, `amount`, `status`, `errorMessage`, `uploadBatchId`).

---

## 🧪 Testing & Verification

You can test bulk upload using sample CSV files provided in the root directory:
```bash
test_invoices.csv
test_invoices_new.csv
```

---

## 📄 License

This project is maintained by the team for internal development and evaluation.

---

<p center="align">
  Crafted with ❤️ by <b>Payal Vats</b>, <b>Nirbhay Jakhar</b>, and <b>Priyanshu Dolwani</b>.
</p>
