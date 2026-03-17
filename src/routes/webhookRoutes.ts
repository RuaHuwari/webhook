import express from "express";
import { injectWebhook } from "../controllers/webhookController.js";
import {webhookMiddleware} from "../middleware/webhookMiddleware.js";
const router = express.Router();

router.post("/:pipelineId", webhookMiddleware,injectWebhook);

export default router;