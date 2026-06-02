import { env } from "../config/env.js";
import { defaultFromEmail, emailTransporter } from "../config/email.js";

type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function submitContactMessage(input: ContactInput) {
  const html = `
    <h2>Contact form — Bukhari Perfumes</h2>
    <p><strong>Name:</strong> ${input.name}</p>
    <p><strong>Email:</strong> ${input.email}</p>
    <p><strong>Subject:</strong> ${input.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${input.message.replace(/\n/g, "<br>")}</p>
  `;

  try {
    await emailTransporter.sendMail({
      from: defaultFromEmail,
      to: defaultFromEmail,
      replyTo: input.email,
      subject: `[Contact] ${input.subject}`,
      html
    });
  } catch (error) {
    if (env.NODE_ENV === "production") {
      throw error;
    }
    console.warn("Contact email skipped in local environment.", { input: input.email, subject: input.subject });
  }

  return { received: true };
}
