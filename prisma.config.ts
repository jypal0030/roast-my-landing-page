import { defineConfig } from "prisma/config";

const url = process.env.DATABASE_URL || 
  "postgresql://postgres:placeholder@localhost:5432/postgres?sslmode=require";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url,
  },
});
