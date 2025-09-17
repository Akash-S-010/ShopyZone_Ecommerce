import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER, // your Brevo SMTP login
    pass: process.env.BREVO_PASS, // your Brevo SMTP key
  },
});

export const sendEmail = async (to, subject, text, html) => {
  await transporter.sendMail({
    from: `"ShopyZone" <no-reply@yourdomain.com>`, // use your verified domain
    to,
    subject,
    text,
    html,
  });
};