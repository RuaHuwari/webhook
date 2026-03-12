import {  Response } from "express";
import { getPipelineActions} from "../db/queries/pipeline_actions.js";
import { checkPipelineBelongToUser } from "../db/queries/pipelines.js";
import { createJob } from "../db/queries/jobs.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
export async function injectWebhook(req: AuthenticatedRequest, res: Response) {
  try {
    const user_id= parseInt(req.userId as string);
    const pipelineId = Number(req.params.pipelineId);
    const belongs= await checkPipelineBelongToUser(user_id,pipelineId);
    if(!belongs){
        return res.status(403).json({error: "unAuthorized access"});
    }
    const payload = req.body;

    if (!pipelineId) {
      return res.status(400).json({
        message: "Invalid pipelineId"
      });
    }

    const actions = await getPipelineActions(pipelineId);

    if (!actions || actions.length === 0) {
      return res.status(404).json({
        message: "No actions found for this pipeline"
      });
    }

    const createdJobs = [];

    for (const action of actions) {
      const job = await createJob(action.id, payload);
      createdJobs.push(job);
    }

    return res.status(201).json({
      message: "Jobs created successfully",
      jobs: createdJobs
    });

  } catch (error) {
    console.error("Webhook injection error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}