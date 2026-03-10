import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import * as dotenv from "dotenv";

// Load .env variables at the very top
dotenv.config();
const conn=postgres(process.env.DB_URL!);
export const db=drizzle(conn,{schema});