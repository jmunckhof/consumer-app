import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../lib/db";

export const consumerAuth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  basePath: "/api/consumer/auth",
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "consumerUser",
    additionalFields: {
      orgId: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  session: {
    modelName: "consumerSession",
  },
  account: {
    modelName: "consumerAccount",
  },
  verification: {
    modelName: "consumerVerification",
  },
});
