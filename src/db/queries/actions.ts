import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { actions } from "../schema.js";
export async function getActionByName(name: string) {
  const [result] = await db
    .select()
    .from(actions)
    .where(eq(actions.action_name, name));

  return result;
}