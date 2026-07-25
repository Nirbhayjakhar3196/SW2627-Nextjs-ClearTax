import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Detect and load the .env file either in the server directory or root directory
const envPath = fs.existsSync(path.join(process.cwd(), ".env"))
  ? path.join(process.cwd(), ".env")
  : path.join(process.cwd(), "../.env");
dotenv.config({ path: envPath });

const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`❌ [Config] Critical missing environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
};
