import { insertSubscriber, getSubscribers } from "../controllers/subscribersController.js";
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router({ mergeParams: true });

router.get("/",authenticate, getSubscribers);
router.post("/", authenticate, insertSubscriber);

export default router;