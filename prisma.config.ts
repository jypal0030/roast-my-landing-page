import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "postgresql://postgres:placeholder@localhost:5432/postgres?sslmode=require",
  },
});
