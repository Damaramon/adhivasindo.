import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      details: err.details ?? null
    });
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  return res.status(500).json({ success: false, message });
}
