import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { HttpError } from "../types/http-error.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentification requise");
  }
  req.adminId = authService.verifyToken(header.slice("Bearer ".length));
  next();
}
