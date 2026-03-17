import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { getPipelineByID } from "../db/queries/pipelines.js";
import { pipelines } from "../db/schema.js";

/**
 * Pipeline-based rate limiter (5 requests per minute per pipeline)
 */
const createPipelineRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per pipeline per minute
  message: { message: "Too many requests for this pipeline, try again later" },
  keyGenerator: (req) => {
    const pipelineId = req.params.pipelineId;
    if (Array.isArray(pipelineId)) return pipelineId[0]; 
    if (!pipelineId) return "unknown_pipeline";
    return pipelineId;
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export interface PipelineRequest extends Request {
  pipeline?: typeof pipelines.$inferSelect;
}

export const verifyWebhookSignature = async (
  req: PipelineRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const pipelineId = Number(req.params.pipelineId);
    if (!pipelineId) {
      return res.status(400).json({ message: "Invalid pipelineId" });
    }

    const pipeline = await getPipelineByID(pipelineId);
    if (!pipeline) {
      return res.status(404).json({ message: "Pipeline not found" });
    }

    const signature = req.headers["x-signature"] as string;
    if (!signature) {
      return res.status(401).json({ message: "Missing signature" });
    }

    const payloadString = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", pipeline.webhook_secret)
      .update(payloadString)
      .digest("hex");

    // Optional: use timingSafeEqual for security
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      return res.status(401).json({ message: "Invalid signature" });
    }

      req.pipeline = pipeline; 

    next();
  } catch (error) {
    console.error("Webhook verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const webhookMiddleware = [createPipelineRateLimiter, verifyWebhookSignature];