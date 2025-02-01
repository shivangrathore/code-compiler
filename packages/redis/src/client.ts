import { Redis } from "ioredis";
import { z } from "zod";
import { configDotenv } from "dotenv";
import path from "path";

configDotenv({ path: path.resolve(__dirname, "../.env") });

const envSchema = z.object({
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
});

const { REDIS_PORT, REDIS_HOST } = envSchema.parse(process.env);

export default new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});
