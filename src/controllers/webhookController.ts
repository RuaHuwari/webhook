import {  Request,Response } from "express";
import { getPipelineActions} from "../db/queries/pipeline_actions.js";
import { createJob } from "../db/queries/jobs.js";

export async function injectWebhook(req: Request, res: Response) {
  try {
    const pipelineId = Number(req.params.pipelineId);
    if (!pipelineId) {
      return res.status(400).json({
        message: "Invalid pipelineId"
      });
    }
    const payload = req.body;
    const actions = await getPipelineActions(pipelineId);

    if (!actions || actions.length === 0) {
      return res.status(404).json({
        message: "No actions found for this pipeline"
      });
    }

    const createdJobs = [];
    if(typeof(payload.payload) ==='undefined' ){
      console.log('undefined payload structure, it should have the structure of {payload:string}');
      return;
    }
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