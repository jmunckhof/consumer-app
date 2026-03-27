import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "../lib/db";

export const adminAuth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  basePath: "/api/admin/auth",
  trustedOrigins: ["http://localhost:3001"],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "adminUser",
  },
  session: {
    modelName: "adminSession",
  },
  account: {
    modelName: "adminAccount",
  },
  verification: {
    modelName: "adminVerification",
  },
  plugins: [organization()],
});
