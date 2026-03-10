import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/drizzle/migrations",
    dialect: "postgresql", 
    dbCredentials: {
        url: "postgres://ruahuwari:0595204077@webhook_pg:5432/webhook_db",
    } 
});