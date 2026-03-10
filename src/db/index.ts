import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const conn=postgres("postgres://ruahuwari:0595204077@webhook_pg:5432/webhook_db");
export const db=drizzle(conn,{schema});