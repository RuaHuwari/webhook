import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql", 
    dbCredentials: {
        url: process.env.DB_URL,
    } 
});