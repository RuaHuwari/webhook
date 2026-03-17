import { Response } from "express";
import { getUserMetrics, getAdminMetrics } from "../db/queries/metrics.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

// ---------------- USER METRICS ----------------
export const getUserMetricsController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.userId as string);
    const metrics = await getUserMetrics(userId);
    return res.status(200).json(metrics);
  } catch (error) {
    console.error("Error getting user metrics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- ADMIN METRICS ----------------
export const getAdminMetricsController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized, admin only" });
    }
    const metrics = await getAdminMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error("Error getting admin metrics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};