import { db } from "../index.js";
import { pipeline_actions } from "../schema.js";
import {eq} from "drizzle-orm";
export async function createPipelineAction(actionId:number, pipelineId:number){
    const [result]=await db.insert(pipeline_actions).values({
        action_id:actionId,
         pipeline_id:pipelineId
        }).returning();
        return result;
}
export async function getPipelineActions(pipelineId:number){
    const result= await db.select().from(pipeline_actions).where(eq(pipeline_actions.pipeline_id,pipelineId));
    return result;
}
