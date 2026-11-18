import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { adminRepository } from "../repositories/admin.repository.js";
import { HttpError } from "../types/http-error.js";
import type { LoginInput } from "../types/schemas.js";

export const authService = {
  async login({ username, password }: LoginInput) {
    const admin = await adminRepository.findByUsername(username);
    const valid = admin && (await bcrypt.compare(password, admin.passwordHash));
    if (!admin || !valid) throw new HttpError(401, "Nom d’utilisateur ou mot de passe incorrect");

    const token = jwt.sign({ sub: String(admin.id) }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });
    return { token, admin: { id: admin.id, username: admin.username } };
  },

  verifyToken(token: string): number {
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      const id = Number(typeof payload === "string" ? NaN : payload.sub);
      if (!Number.isInteger(id)) throw new Error("bad subject");
      return id;
    } catch {
      throw new HttpError(401, "Session expirée, veuillez vous reconnecter");
    }
  },

  async me(id: number) {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new HttpError(401, "Compte introuvable");
    return admin;
  },
};
