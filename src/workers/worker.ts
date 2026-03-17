import {uppercase} from "../actions/StringActions/uppercase.js";
import {lowercase} from "../actions/StringActions/lowercase.js";
import {reversetext} from "../actions/StringActions/reverseText.js";
import {correctGrammer} from "../actions/AI/correctGrammer.js";
import { writeArticle } from "../actions/AI/writeArticle.js";
import { summarizeText } from "../actions/AI/summarizeText.js";
import { getPageContent } from "../actions/HTTPActions/getpagecontent.js";
//import {actions, JOB, pipeline_actions, pipelines} from "../src/db/schema.js";
import {getOldestPendingJob,setJobToFailed,setJobToSuccess} from "../db/queries/jobs.js";
import {getActionByID} from "../db/queries/actions.js";
import {getPipelineActionByID} from "../db/queries/pipeline_actions.js";
//import {getPipelineByID} from "../src/db/queries/pipelines.js";
import {getSubscripersForPipeline}from "../db/queries/subscribers.js";
import {createDeliveryRecord}from "../db/queries/deliveries.js";
type ActionResult = {
  result: string;
};

const jobsactions: Record<string, (input: {payload:string}) => Promise<ActionResult>> = {
  uppercase,
  lowercase,
  reversetext,
  correctGrammer,
  summarizeText,
  writeArticle,
  getPageContent
};
async function sendWithRetry(jobId: number, url: string, data: unknown, maxRetries = 3) {

  for (let attempt = 1; attempt <= maxRetries; attempt++) {

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {

        await createDeliveryRecord(jobId, url, attempt, "success");
        return true;

      } else {

        await createDeliveryRecord(jobId, url, attempt, "failed");

      }

    } catch (error) {

      await createDeliveryRecord(jobId, url, attempt, "failed");
      console.error(error);

    }
  }

  return false;
}
export async function processJob(){
const job= await getOldestPendingJob();
if(typeof(job)!== "undefined"){
const pipelineActionId= job.pipeline_action_id;
const pipelineAction= await getPipelineActionByID(pipelineActionId);
const pipelineId=pipelineAction.pipeline_id;
const actionID= pipelineAction.action_id;
const action= await getActionByID(actionID);
//const pipeline=await getPipelineByID(pipelineId);
if(typeof(action)==='undefined'){
  console.log('error fetching action name');
  return;
}
const action_name=action.action_name;
const actionFn = jobsactions[action_name];
const subscribers= await getSubscripersForPipeline(pipelineId);
if (!actionFn) {
  throw new Error(`Unknown action: ${action_name}`);
}
if(job.payload ===''){
  console.log('there is no payload provided');
  return;
}
const result = await actionFn(job.payload as {payload:string});

const jobId = job.id;
let delivered = true;

for (const subscriber of subscribers) {

  const success = await sendWithRetry(
    job.id,
    subscriber.url,
    { jobId: job.id, result: result.result }
  );

  if (!success) {
    delivered = false;
  }
}
if (delivered) {
  await setJobToSuccess(jobId, result.result);
} else {
  await setJobToFailed(jobId,"cannot deliver message to ALL subscribers");
}
}
}