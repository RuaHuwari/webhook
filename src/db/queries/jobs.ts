import { db } from "../index.js";
import { jobs, pipeline_actions, pipelines } from "../schema.js";
import { eq ,and} from "drizzle-orm";

export async function createJob(pipelineActionId:number, payload :unknown) {
  const [job] = await db.insert(jobs)
    .values({
      pipeline_action_id: pipelineActionId,
      payload,
      status: 'pending'
    })
    .returning();
  return job;
}

export async function setJobToSuccess(jobId: number , result:unknown) {
  const [job] = await db.update(jobs)
    .set({
      status: 'success',
      result,
      error: null
    })
    .where(eq(jobs.id, jobId))
    .returning();
  return job;
}

export async function setJobToFailed(jobId:number, errorMessage:string) {
  const [job] = await db.update(jobs)
    .set({
      status: 'failed',
      error: errorMessage
    })
    .where(eq(jobs.id, jobId))
    .returning();
  return job;
}

export async function getOldestPendingJob() {
  const [job] = await db.select()
    .from(jobs)
    .where(eq(jobs.status, 'pending'))
    .orderBy(jobs.created_at)
    .limit(1);
  return job;
}

export async function getJobsForUser(userID: number, status?: string) {
  try {
    const conditions = [eq(pipelines.user_id, userID)];
    if (status) {
      conditions.push(eq(jobs.status, status));
    }

    const result = await db
      .select({
        job_id: jobs.id,
        pipeline_action_id: jobs.pipeline_action_id,
        status: jobs.status,
        payload: jobs.payload,
        result: jobs.result,
        error: jobs.error,
        created_at: jobs.created_at,
        pipeline_id: pipeline_actions.pipeline_id,
      })
      .from(jobs)
      .innerJoin(pipeline_actions, eq(pipeline_actions.id, jobs.pipeline_action_id))
      .innerJoin(pipelines, eq(pipelines.id, pipeline_actions.pipeline_id))
      .where(and(...conditions));

    return result;
  } catch (err) {
    console.error("Error fetching jobs for user:", err);
    throw err;
  }
}

export async function getAllJobs(status?:string){ //this is an admin feature
  try {
    if (status) {
    const result =await db
      .select({
        job_id: jobs.id,
        pipeline_action_id: jobs.pipeline_action_id,
        status: jobs.status,
        payload: jobs.payload,
        result: jobs.result,
        error: jobs.error,
        created_at: jobs.created_at,
        pipeline_id: pipeline_actions.pipeline_id,
      })
      .from(jobs)
      .innerJoin(pipeline_actions, eq(pipeline_actions.id, jobs.pipeline_action_id))
      .innerJoin(pipelines, eq(pipelines.id, pipeline_actions.pipeline_id))
      .where(eq(jobs.status, status));
    return result;  
    }else{
        const result =await db
      .select({
        job_id: jobs.id,
        pipeline_action_id: jobs.pipeline_action_id,
        status: jobs.status,
        payload: jobs.payload,
        result: jobs.result,
        error: jobs.error,
        created_at: jobs.created_at,
        pipeline_id: pipeline_actions.pipeline_id,
      })
      .from(jobs)
      .innerJoin(pipeline_actions, eq(pipeline_actions.id, jobs.pipeline_action_id))
      .innerJoin(pipelines, eq(pipelines.id, pipeline_actions.pipeline_id));
    return result; 
    }
  } catch (err) {
    console.error("Error fetching jobs:", err);
    throw err;
  }
}