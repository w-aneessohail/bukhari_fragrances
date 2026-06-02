import rateLimit from "express-rate-limit";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";

function createRedisStore(prefix: string) {
  if (env.NODE_ENV === "development") {
    return undefined;
  }

  return new RedisStore({
    prefix,
    sendCommand: async (...args: string[]) => {
      const [command, ...commandArgs] = args;
      const response = await redis.call(command, ...commandArgs);
      return response as RedisReply;
    }
  });
}

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("bukhari:rl:general:")
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("bukhari:rl:auth:")
});
