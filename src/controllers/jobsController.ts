import {  Response } from "express";
import { getJobsForUser, getAllJobs } from "../db/queries/jobs.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export async function getUserJobs(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;   // from auth middleware
    const status = req.query.status as string | undefined;

    const jobs = await getJobsForUser(parseInt(userId as string), status);

    return res.status(200).json({
      message: "User jobs fetched successfully",
      jobs
    });

  } catch (error) {
    console.error("Error fetching user jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function getSystemJobs(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    const status = req.query.status as string | undefined;

    const jobs = await getAllJobs(status);

    return res.status(200).json({
      message: "All jobs fetched successfully",
      jobs
    });

  } catch (error) {
    console.error("Error fetching all jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}