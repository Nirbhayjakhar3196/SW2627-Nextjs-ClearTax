async function testDeployedFlow() {
  const email = `test_${Date.now()}@example.com`;
  const password = "Password123";
  const name = "Test Flow User";

  try {
    // 1. Signup
    console.log("Testing Signup...");
    const signupRes = await fetch("https://sw2627-nextjs-cleartax-6.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
    const signupData = await signupRes.json();
    console.log("Signup Response:", signupData);

    if (!signupData.success) {
      throw new Error("Signup failed");
    }

    // 2. Login
    console.log("\nTesting Login...");
    const loginRes = await fetch("https://sw2627-nextjs-cleartax-6.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    console.log("Login Response:", loginData);

    if (!loginData.success) {
      throw new Error("Login failed");
    }

    const token = loginData.token;

    // 3. Me GET
    console.log("\nTesting GET /me...");
    const meRes = await fetch("https://sw2627-nextjs-cleartax-6.onrender.com/api/auth/me", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const meData = await meRes.json();
    console.log("Me GET Response:", meData);

    // 4. Me PUT (Update Profile Name)
    console.log("\nTesting PUT /me (Update Name)...");
    const updateRes = await fetch("https://sw2627-nextjs-cleartax-6.onrender.com/api/auth/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: "Updated Flow Name" })
    });
    const updateData = await updateRes.json();
    console.log("Me PUT Response:", updateData);

  } catch (err) {
    console.error("Error in Flow:", err);
  }
}

testDeployedFlow();
