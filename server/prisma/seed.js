import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Find or create a user to attach data to
  let user = await prisma.user.findFirst();
  if (!user) {
    console.log("Creating default user...");
    const hashedPassword = await bcrypt.hash("Password123", 10);
    user = await prisma.user.create({
      data: {
        name: "Test Account",
        email: "test@example.com",
        password: hashedPassword,
        role: "USER"
      }
    });
    console.log(`Created default user: ${user.email} (password: Password123)`);
  } else {
    console.log(`Found existing user to seed for: ${user.email}`);
  }

  // 2. Batch 1: Retail Operations Invoices (15 invoices)
  console.log("Creating Batch 1 (Retail Operations - 15 invoices)...");
  const batch1 = await prisma.uploadBatch.create({
    data: {
      fileName: `${Date.now()}_july_retail_ops.csv`,
      originalFileName: "july_retail_ops.csv",
      totalRows: 15,
      processedRows: 15,
      successfulRows: 10,
      failedRows: 5,
      status: "COMPLETED",
      userId: user.id,
    }
  });

  const invoices1 = [];
  for (let i = 1; i <= 15; i++) {
    let status = "MATCHED";
    let error = null;
    if (i % 3 === 0) {
      status = "MISMATCHED";
      error = "GSTIN mismatch detected with portal registry";
    } else if (i % 5 === 0) {
      status = "FAILED";
      error = "Invalid invoice date format or amount format mismatch";
    }
    invoices1.push({
      invoiceNumber: `INV-2026-R${1000 + i}`,
      vendor: ["Amazon Web Services", "Microsoft Azure", "GitHub Enterprise", "Slack Technologies", "Google Workspace"][i % 5],
      amount: parseFloat((100 + i * 45.5).toFixed(2)),
      status,
      errorMessage: error,
      uploadBatchId: batch1.id,
    });
  }
  await prisma.invoice.createMany({ data: invoices1 });

  // 3. Batch 2: Corporate Consulting Fees (10 invoices)
  console.log("Creating Batch 2 (Corporate Consulting - 10 invoices)...");
  const batch2 = await prisma.uploadBatch.create({
    data: {
      fileName: `${Date.now() + 1000}_q2_corporate_consulting.csv`,
      originalFileName: "q2_corporate_consulting.csv",
      totalRows: 10,
      processedRows: 10,
      successfulRows: 10,
      failedRows: 0,
      status: "COMPLETED",
      userId: user.id,
    }
  });

  const invoices2 = [];
  for (let i = 1; i <= 10; i++) {
    invoices2.push({
      invoiceNumber: `INV-2026-C${2000 + i}`,
      vendor: ["McKinsey & Co", "Boston Consulting Group", "Bain & Company", "Deloitte Advisory", "PwC Tax"][i % 5],
      amount: parseFloat((5000 + i * 250).toFixed(2)),
      status: "MATCHED",
      errorMessage: null,
      uploadBatchId: batch2.id,
    });
  }
  await prisma.invoice.createMany({ data: invoices2 });

  // 4. Batch 3: Deep Pagination IT Services (35 invoices)
  console.log("Creating Batch 3 (IT Infrastructure Services - 35 invoices)...");
  const batch3 = await prisma.uploadBatch.create({
    data: {
      fileName: `${Date.now() + 2000}_it_services_infrastructure.csv`,
      originalFileName: "it_services_infrastructure.csv",
      totalRows: 35,
      processedRows: 35,
      successfulRows: 24,
      failedRows: 11,
      status: "COMPLETED",
      userId: user.id,
    }
  });

  const invoices3 = [];
  for (let i = 1; i <= 35; i++) {
    let status = "MATCHED";
    let error = null;
    if (i % 4 === 0) {
      status = "MISMATCHED";
      error = "Tax rate mismatch: expected 18%, found 12% in CSV";
    } else if (i % 7 === 0) {
      status = "FAILED";
      error = "Missing vendor name field or malformed invoice number";
    }
    invoices3.push({
      invoiceNumber: `INV-2026-IT${3000 + i}`,
      vendor: ["Oracle Cloud Solutions", "Snowflake Data Inc", "Databricks Services", "Cloudflare CDN", "Auth0 Auth Services", "Vercel Enterprise"][i % 6],
      amount: parseFloat((250 + i * 115).toFixed(2)),
      status,
      errorMessage: error,
      uploadBatchId: batch3.id,
    });
  }
  await prisma.invoice.createMany({ data: invoices3 });

  console.log("🌱 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
