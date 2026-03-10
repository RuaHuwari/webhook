import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env variables at the very top
dotenv.config();

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL,  // ✅ access env variable here
    },
});