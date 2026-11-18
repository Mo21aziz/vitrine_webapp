import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

/** Connection settings from DATABASE_URL (mysql://user:password@host:port/database) */
function connectionFromUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("Missing required environment variable: DATABASE_URL");
  const url = new URL(raw);
  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
  };
}

const adapter = new PrismaMariaDb({
  ...connectionFromUrl(),
  connectionLimit: 5,
  // MySQL 8 (caching_sha2_password) over a non-SSL connection needs this
  allowPublicKeyRetrieval: true,
});

export const prisma = new PrismaClient({ adapter });
