import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

/**
 * Sends a password reset OTP code to the user's email.
 * @param {string} toEmail 
 * @param {string} otp 
 */
export async function sendResetEmail(toEmail, otp) {
  const mailOptions = {
    from: env.SMTP_FROM,
    to: toEmail,
    subject: "Your ClearTax Password Reset Code",
    text: `Your password reset code (OTP) is: ${otp}. It is valid for 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #9670f8; margin: 0; font-size: 24px; font-weight: 700;">ClearTax</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Password Reset Request</p>
        </div>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hello,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">We received a request to reset your password. Use the following 6-digit verification code to proceed:</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: 700; color: #1e1b4b; background-color: #f7f5ff; padding: 12px 28px; border-radius: 8px; letter-spacing: 6px; border: 1px solid #e0d9ff;">
            ${otp}
          </span>
        </div>
        
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; text-align: center;">
          This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; margin-top: 28px; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          If you did not request this reset, please ignore this email or contact support.
        </div>
      </div>
    `,
  };

  // Write to a local debug file for developer convenience (bypasses console buffering)
  try {
    const debugFilePath = path.join(process.cwd(), "otp_debug.log");
    fs.writeFileSync(debugFilePath, `Email: ${toEmail}\nOTP: ${otp}\nTimestamp: ${new Date().toISOString()}\n`);
  } catch (err) {
    console.error("Failed to write OTP debug log:", err.message);
  }

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email] Reset code sent to ${toEmail}: ${info.messageId}`);
      return info;
    } catch (err) {
        console.error("[Email] SMTP Error:", err);
        throw err;
      }
  }

  // Fallback log to terminal
  console.log(`
========================================================================
[PASSWORD RESET EMAIL FALLBACK]
To: ${toEmail}
OTP: ${otp}
========================================================================
`);
  return { message: "Printed to console fallback" };
}
