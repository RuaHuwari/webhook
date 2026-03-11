import { db } from "../index.js";
import { pipeline_actions } from "../schema.js";
export async function createPipelineAction(actionId:number, pipelineId:number){
    const [result]=await db.insert(pipeline_actions).values({
        action_id:actionId,
         pipeline_id:pipelineId
        }).returning();
        return result;
}
