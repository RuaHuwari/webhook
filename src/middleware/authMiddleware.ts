import { Request, Response, NextFunction } from "express";
import { getBearerToken, validateJWT } from "../auth.js";
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?:string;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req);
    const { userId, role } = validateJWT(token, JWT_SECRET);

    req.userId = userId;
    req.role = role;

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
}