import express from "express";
import { getUserJobs, getSystemJobs } from "../controllers/jobsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/myjobs", authenticate, getUserJobs);

router.get("/all", authenticate, getSystemJobs); //admin only

export default router;