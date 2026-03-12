import { eq ,and} from "drizzle-orm";
import { db } from "../index.js";
import { deliveries, jobs, pipeline_actions, pipelines } from "../schema.js";
export async function getDeliveriesForUser(userId:number, status?:string){
    if(status){
        const result= await db.select().from(deliveries)
        .leftJoin(jobs,eq(deliveries.job_id,jobs.id))
        .leftJoin(pipeline_actions,eq(jobs.pipeline_action_id,pipeline_actions.id))
        .leftJoin(pipelines,eq(pipeline_actions.pipeline_id,pipelines.id))
        .where(and(eq(pipelines.user_id,userId) && eq(deliveries.status,status)));
        return result;
    }
    const result= await db.select().from(deliveries)
    .leftJoin(jobs,eq(deliveries.job_id,jobs.id))
    .leftJoin(pipeline_actions,eq(jobs.pipeline_action_id,pipeline_actions.id))
    .leftJoin(pipelines,eq(pipeline_actions.pipeline_id,pipelines.id))
    .where(eq(pipelines.user_id,userId));
    return result;
};
export async function getAllDeliveries( status?:string){
if(status){
    const result= await db.select().from(deliveries)
.leftJoin(jobs,eq(deliveries.job_id,jobs.id))
.leftJoin(pipeline_actions,eq(jobs.pipeline_action_id,pipeline_actions.id))
.leftJoin(pipelines,eq(pipeline_actions.pipeline_id,pipelines.id))
.where(eq(deliveries.status,status));
return result;
}
    const result= await db.select().from(deliveries)
.leftJoin(jobs,eq(deliveries.job_id,jobs.id))
.leftJoin(pipeline_actions,eq(jobs.pipeline_action_id,pipeline_actions.id))
.leftJoin(pipelines,eq(pipeline_actions.pipeline_id,pipelines.id));
return result;
};
export async function createDeliveryRecord(job_id:number, subscriber_url:string, attemptCount:number,status:string){
const [result] = await db.insert(deliveries).values({
    job_id:job_id,
    subscriber_url:subscriber_url,
    attempt_count:attemptCount,
    status:status
}).returning();
return result;
};
export async function getDeliveryByPipeline(pipeline_id:number, user_id:number){
    const result= await db.select().from(deliveries)
.leftJoin(jobs,eq(deliveries.job_id,jobs.id))
.leftJoin(pipeline_actions,eq(jobs.pipeline_action_id,pipeline_actions.id))
.leftJoin(pipelines,eq(pipeline_actions.pipeline_id,pipelines.id))
.where(and(eq(pipelines.id,pipeline_id)&& eq(pipelines.user_id,user_id)));
return result;
};
