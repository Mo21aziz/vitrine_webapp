import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { loginSchema } from "../types/schemas.js";

export const authController = {
  async login(req: Request, res: Response) {
    res.json(await authService.login(loginSchema.parse(req.body)));
  },

  async me(req: Request, res: Response) {
    res.json(await authService.me(req.adminId!));
  },
};
