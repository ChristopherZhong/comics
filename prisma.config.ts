import "dotenv/config";
import { defineConfig } from "prisma/config";

// Retrieve DB properties from environment variables with no fallbacks for user and password
const user = process.env.POSTGRES_USER || "";
const password = process.env.POSTGRES_PASSWORD ? encodeURIComponent(process.env.POSTGRES_PASSWORD) : "";
const host = process.env.POSTGRES_HOST || "localhost";
const port = process.env.POSTGRES_PORT || "5432";
const database = process.env.POSTGRES_DATABASE || "comics_db";

const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;

export default defineConfig({
  schema: "apps/backend/prisma/schema.prisma",
  migrations: {
    path: "apps/backend/prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
