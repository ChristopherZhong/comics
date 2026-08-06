import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "apps/backend/prisma/schema.prisma",
  migrations: {
    path: "apps/backend/prisma/migrations",
  },
  datasource: {
    url: "postgresql://comics_user:comics_password@localhost:5432/comics_db?schema=public",
  },
});
