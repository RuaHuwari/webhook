import { getDeliveries, getDeliveriesByPipeline,getDeliveriesforAdmin } from "../controllers/deliveriesController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();
router.get('/mydeliveries',authenticate,getDeliveries);
router.get('/all',authenticate,getDeliveriesforAdmin);
router.get('/:pipelineId',authenticate,getDeliveriesByPipeline);
export default router;


