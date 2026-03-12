import { getActions } from "../controllers/actionsController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

router.get("/",authenticate,getActions);
export default router;