import express from "express";
import { createPipeline } from "../controllers/pipelinesController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createPipeline);

export default router;