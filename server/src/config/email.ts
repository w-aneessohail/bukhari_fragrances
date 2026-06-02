import nodemailer from "nodemailer";
import { env } from "./env.js";

export const emailTransporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: env.SENDGRID_API_KEY
  }
});

export const defaultFromEmail = env.SENDGRID_FROM_EMAIL;
