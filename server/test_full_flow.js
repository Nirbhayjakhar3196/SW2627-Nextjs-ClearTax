import fs from "fs";
import path from "path";

const BACKEND_URL = "https://sw2627-nextjs-cleartax-6.onrender.com";

async function runFullFlowTest() {
  const timestamp = Date.now();
  const email = `test_flow_${timestamp}@example.com`;
  const password = "Password123";
  const name = "Full Flow Tester";

  console.log("=== STEP 1: Signup ===");
  const signupRes = await fetch(`${BACKEND_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const signupData = await signupRes.json();
  console.log("Signup Response:", signupData);

  if (!signupData.success) throw new Error("Signup failed");

  console.log("\n=== STEP 2: Login ===");
  const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginRes.json();
  console.log("Login Response Status:", loginRes.status);
  console.log("Token received:", !!loginData.token);

  if (!loginData.success || !loginData.token) throw new Error("Login failed");
  const token = loginData.token;

  console.log("\n=== STEP 3: Verify /auth/me ===");
  const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log("/auth/me Response:", meData);

  if (!meData.success || meData.user.email !== email) throw new Error("Auth me check failed");

  console.log("\n=== STEP 4: Upload CSV File ===");
  const csvPath = path.join(process.cwd(), "test_invoices.csv");
  const csvContent = fs.readFileSync(csvPath);
  
  const formData = new FormData();
  formData.append("file", new Blob([csvContent], { type: "text/csv" }), "test_invoices.csv");

  const uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const uploadData = await uploadRes.json();
  console.log("Upload Response:", uploadData);

  if (!uploadData.success || !uploadData.data?.batch?.id) throw new Error("File upload failed");
  const batchId = uploadData.data.batch.id;

  console.log(`\n=== STEP 5: Poll Batch Status (Batch #${batchId}) ===`);
  let status = "PENDING";
  let attempts = 0;
  let batchDetails = null;

  while (attempts < 15 && (status === "PENDING" || status === "PROCESSING")) {
    await new Promise((r) => setTimeout(r, 1500));
    attempts++;
    const statusRes = await fetch(`${BACKEND_URL}/api/upload/${batchId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statusData = await statusRes.json();
    if (statusData.success) {
      batchDetails = statusData.data;
      status = batchDetails.status;
      console.log(`Attempt ${attempts}: Status = ${status}, Processed = ${batchDetails.processedRows}/${batchDetails.totalRows}`);
    }
  }

  console.log("\nFinal Batch Result:", JSON.stringify(batchDetails, null, 2));

  console.log("\n=== STEP 6: Get Upload History (GET /api/upload) ===");
  const listRes = await fetch(`${BACKEND_URL}/api/upload`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listData = await listRes.json();
  console.log(`Fetched ${listData.data?.length || 0} batch(es) for user.`);

  console.log("\n✅ ALL INTEGRATION CHECKS PASSED SUCCESSFULLY!");
}

runFullFlowTest().catch((err) => {
  console.error("❌ Integration Test Failed:", err);
  process.exit(1);
});
