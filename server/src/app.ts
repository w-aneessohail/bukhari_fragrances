import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import "./config/passport.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { httpLogger } from "./middleware/logger.middleware.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { stripeWebhookHandler } from "./routes/payment.webhook.js";
import routes from "./routes/index.js";
import seoRoutes from "./routes/seo.routes.js";

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

app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(express.json());
app.use(passport.initialize());
app.use(httpLogger);
app.use(seoRoutes);
app.use("/api", generalLimiter, routes);

app.use(errorHandler);

export default app;
