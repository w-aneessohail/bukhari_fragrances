import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloudinary_url: env.CLOUDINARY_URL
});

export default cloudinary;
