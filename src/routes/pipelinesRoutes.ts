import express from "express";
import { createPipeline,getPipelines } from "../controllers/pipelinesController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createPipeline);
router.get("/",authenticate,getPipelines);
export default router;