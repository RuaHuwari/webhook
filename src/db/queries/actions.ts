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
export async function getActionByID(actionID:number){
  const result= await db.select().from(actions).where(eq(actions.id,actionID));
  return result[0];
  
}
export async function getAllActions(){

  const result = await db.select().from(actions);
  return result;

}