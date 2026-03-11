import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { checkPipelineBelongToUser } from "../db/queries/pipelines.js";
import { createSubscriber, getSubscripersForPipeline } from "../db/queries/subscribers.js";

export const insertSubscriber = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = parseInt(req.userId as string);
    const pipelineId = parseInt(req.params.pipelineId as string);
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Subscriber URL required" });
    }

    // check ownership
    const belongs = await checkPipelineBelongToUser(userId, pipelineId);

    if (!belongs) {
      return res.status(403).json({
        message: "Unauthorized: pipeline does not belong to user",
      });
    }

    const subscriber = await createSubscriber(pipelineId, url);

    res.status(201).json({
      message: "Subscriber added",
      subscriber,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getSubscribers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = parseInt(req.userId as string);
    const pipelineId = parseInt(req.params.pipelineId as string);
    // check if the pipeline belongs to the user
    const belongs = await checkPipelineBelongToUser(userId, pipelineId);

    if (!belongs) {
      return res.status(403).json({
        message: "Unauthorized: pipeline does not belong to user",
      });
    }

    const subscribers = await getSubscripersForPipeline(pipelineId);

    return res.status(200).json({
      message: "Subscribers fetched successfully",
      subscribers,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};