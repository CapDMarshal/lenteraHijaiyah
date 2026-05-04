import nodemailer from "nodemailer";

type PasswordResetEmailPayload = {
  to: string;
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createTransporter() {
  const host = getRequiredEnv("BREVO_SMTP_HOST");
  const port = Number(getRequiredEnv("BREVO_SMTP_PORT"));
  const user = getRequiredEnv("BREVO_SMTP_USER");
  const pass = getRequiredEnv("BREVO_SMTP_PASSWORD");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildPasswordResetEmail(payload: PasswordResetEmailPayload) {
  const { name, resetUrl, expiresInMinutes } = payload;
  const safeName = name?.trim() || "Sahabat Lentera";
  const subject = "Reset Password Akun Lentera Hijaiyah";
  const text = [
    `Halo ${safeName},`,
    "Kami menerima permintaan untuk mereset password akun Anda.",
    `Gunakan tautan berikut untuk membuat password baru: ${resetUrl}`,
    `Tautan ini berlaku selama ${expiresInMinutes} menit.`,
    "Jika Anda tidak meminta reset password, abaikan email ini.",
    "Salam hangat,",
    "Tim Lentera Hijaiyah",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="color: #0f172a;">Reset Password Akun Lentera Hijaiyah</h2>
      <p>Halo <strong>${safeName}</strong>,</p>
      <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
      <p style="margin: 24px 0;">
        <a
          href="${resetUrl}"
          style="background: #16a34a; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;"
        >
          Buat Password Baru
        </a>
      </p>
      <p>Tautan ini berlaku selama <strong>${expiresInMinutes} menit</strong>.</p>
      <p style="font-size: 14px; color: #6b7280;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
      <p style="margin-top: 24px;">Salam hangat,<br />Tim Lentera Hijaiyah</p>
    </div>
  `;

  return { subject, text, html };
}

export async function sendPasswordResetEmail(payload: PasswordResetEmailPayload) {
  const transporter = createTransporter();
  const { subject, text, html } = buildPasswordResetEmail(payload);
  const senderEmail = getRequiredEnv("BREVO_SENDER_EMAIL");
  const senderName = process.env.BREVO_SENDER_NAME || "Lentera Hijaiyah";

  await transporter.sendMail({
    from: `${senderName} <${senderEmail}>`,
    to: payload.to,
    subject,
    text,
    html,
  });
}
