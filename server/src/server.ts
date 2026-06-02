import "dotenv/config";
import { createServer } from "http";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function bootstrap() {
  await connectDatabase();

  const server = createServer(app);

  server.listen(env.PORT, () => {
    console.log(`Bukhari Perfumes API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
