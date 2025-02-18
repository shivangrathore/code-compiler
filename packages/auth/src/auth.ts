import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { z } from "zod";
import db from "@repo/db/client";
import { configDotenv } from "dotenv";
import path from "path";

configDotenv({ path: path.resolve(__dirname, "../.env") });

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

const config = envSchema.parse(process.env);

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
  },
  database: prismaAdapter(db, { provider: "postgresql" }),
  trustedOrigins: ["http://localhost:3000", "https://cc.seekhcode.me"],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".cc.seekhcode.me",
    },
  },
});
