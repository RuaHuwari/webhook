import express from "express";
import { getUserMetricsController, getAdminMetricsController } from "../controllers/metricsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/all", authenticate, getAdminMetricsController);
// User metrics - only pipelines the user owns
router.get("/", authenticate, getUserMetricsController);

export default router;