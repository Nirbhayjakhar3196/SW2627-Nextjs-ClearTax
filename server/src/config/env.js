import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// 1. Find the .env file path
// If .env exists in the current folder, use it; otherwise check the parent folder.
let envPath = path.join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  envPath = path.join(process.cwd(), "../.env");
}

// 2. Load environment variables into process.env
dotenv.config({ path: envPath });

// 3. Verify mandatory environment variables exist
const requiredEnvKeys = ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"];
const missingEnvKeys = [];

for (let i = 0; i < requiredEnvKeys.length; i++) {
  const key = requiredEnvKeys[i];
  if (!process.env[key]) {
    missingEnvKeys.push(key);
  }
}

// If any required variable is missing, stop the server startup
if (missingEnvKeys.length > 0) {
  console.error(`❌ [Config] Critical missing environment variables: ${missingEnvKeys.join(", ")}`);
  process.exit(1);
}

// 4. Export configuration object for the application
export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || '"ClearTax Support" <support@cleartax.com>',
};

