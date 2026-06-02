import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { httpLogger } from "./middleware/logger.middleware.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import routes from "./routes/index.js";

const app = express();

const corsWhitelist = [env.FRONTEND_URL];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsWhitelist.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(httpLogger);
app.use("/api", generalLimiter, routes);

app.use(errorHandler);

export default app;
