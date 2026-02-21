import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";

export type JwtUser = { id: number; email: string; role: string };

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing Authorization Bearer token"));
  }

  const token = auth.substring("Bearer ".length);
  try {
    const secret = process.env.JWT_SECRET || "change_this_in_production";
    const payload = jwt.verify(token, secret) as JwtUser;
    req.user = payload;
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, "Unauthorized"));
  if (req.user.role !== "admin") return next(new HttpError(403, "Admin only"));
  return next();
}
