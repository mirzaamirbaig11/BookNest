import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const { EMAIL_SERVER, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM } = process.env;

  if (!EMAIL_SERVER || !EMAIL_USERNAME || !EMAIL_PASSWORD) {
    // No SMTP configured — log so local development still works end-to-end.
    console.log(`[BookNest] Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  const transport = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: 587,
    secure: false,
    auth: { user: EMAIL_USERNAME, pass: EMAIL_PASSWORD },
  });

  await transport.sendMail({
    from: EMAIL_FROM ?? EMAIL_USERNAME,
    to,
    subject: 'Reset your BookNest password',
    html: `
      <p>We received a request to reset your BookNest password.</p>
      <p><a href="${resetUrl}">Click here to set a new password</a>. This link expires in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}
