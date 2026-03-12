import express from "express";
import { injectWebhook } from "../controllers/webhookController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/inject/:pipelineId",authenticate, injectWebhook);

export default router;