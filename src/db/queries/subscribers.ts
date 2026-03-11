import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { subscribers } from "../schema.js";
export async function createSubscriber(pipelineId:number, url:string){
    const [result]= await db.insert(subscribers).values({pipeline_id:pipelineId,url:url}).returning();
    return result;
}
export async function getSubscripersForPipeline(pipelineId:number){
    const result= await db.select().from(subscribers).where(eq(subscribers.pipeline_id,pipelineId));
    return result;
}