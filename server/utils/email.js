import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Initialize transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // Gmail SMTP host
  port: 587, // Standard TLS port for Gmail
  secure: false, // Use STARTTLS (true for port 465)
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error.message);
    console.error("Please check your EMAIL_USER and EMAIL_PASS environment variables");
  } else {
    console.log("✅ SMTP connection verified successfully");
  }
});

// General sendEmail function
export const sendEmail = async (to, subject, text, html) => {
  try {
    // Basic validation
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials are missing in environment variables");
    }
    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM is not set in environment variables");
    }

    // Create mail options
    const mailOptions = {
      from: `🛒 ShopyZone" <${process.env.EMAIL_FROM}>`, // Format sender with name and emojis for highlighting
      to,
      subject,
      text,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(`Email failed to send: ${error.message}`);
  }
};

// Dedicated OTP email function
export const sendOTPEmail = async (to, otp, mailText) => {
  const subject = `🛒 ShopyZone - ${mailText}`;
  const text = `${mailText}: ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4a154b; margin: 0;">🛒 ShopyZone </h1>
      </div>
      <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">${mailText}</h2>
      <p style="font-size: 16px;">Your code is:</p>
      <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; text-align: center; margin: 15px 0;">
        <strong style="font-size: 28px; color: #4a154b; letter-spacing: 5px;">${otp}</strong>
      </div>
      <p style="color: #666;">This code expires in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #888; font-size: 12px; text-align: center;">
        <p>© ${new Date().getFullYear()} ShopyZone. All rights reserved.</p>
      </div>
    </div>
  `;

  return await sendEmail(to, subject, text, html);
};