import {uppercase} from "../src/actions/uppercase.js";
import {lowercase} from "../src/actions/lowercase.js";
import {actions, JOB, pipeline_actions, pipelines} from "../src/db/schema.js";
import {db} from "../src/db/index.js";
import {eq} from "drizzle-orm";

type ActionResult = {
  result: string;
};

const jobsactions: Record<string, (input: string) => Promise<ActionResult>> = {
  uppercase,
  lowercase
};
async function processJob(job:JOB){
const [jobInfo] = await db.select({
  action_name: actions.action_name,
  pipeline_id: pipeline_actions.pipeline_id,
  user_id: pipelines.user_id
})
.from(pipeline_actions)
.innerJoin(actions, eq(actions.id,pipeline_actions.action_id))
.innerJoin(pipelines, eq(pipelines.id,pipeline_actions.pipeline_id))
.where(eq(pipeline_actions.id,job.pipeline_action_id));

if (!jobInfo) throw new Error("Job not found");

const { action_name, pipeline_id, user_id } = jobInfo; 
const actionFn = jobsactions[action_name];

if (!actionFn) {
  throw new Error(`Unknown action: ${action_name}`);
}

const result = await actionFn(job.payload as string);

console.log(result.result);
}