import { Response } from "express";
import { insertPipelineIntoDB, getUserPipelines } from "../db/queries/pipelines.js";
import { getActionByName } from "../db/queries/actions.js";
import { createPipelineAction } from "../db/queries/pipeline_actions.js";
import { createSubscriber } from "../db/queries/subscribers.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const createPipeline = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { name, actions, subscribers } = req.body;

    if (!name || !actions || !subscribers) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const pipeline = await insertPipelineIntoDB(parseInt(userId as string), name);

    const pipelineId = pipeline.id;

    for (const actionName of actions) {
      const action = await getActionByName(actionName);

      if (!action) {
        return res.status(400).json({
          message: `Action ${actionName} not found`
        });
      }

      await createPipelineAction(action.id, pipelineId);
    }

    for (const url of subscribers) {
      await createSubscriber(pipelineId, url);
    }

    return res.status(201).json({
      message: "Pipeline created successfully",
      pipeline
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};
export const getPipelines=async(req:AuthenticatedRequest,res:Response)=>{
  const userId= parseInt(req.userId as string);
  const pipelines= await getUserPipelines(userId);
  if(pipelines.length===0){
    return res.status(200).json({message:"no pipelines found for you, create one to get started"})
  }
  return res.status(200).json(pipelines);
}