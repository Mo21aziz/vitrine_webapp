import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { HttpError } from "../types/http-error.js";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Route introuvable" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof MulterError) {
    const tooBig = err.code === "LIMIT_FILE_SIZE";
    res.status(tooBig ? 413 : 400).json({ error: tooBig ? "Image trop lourde (5 Mo maximum)" : "Envoi de l’image invalide" });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Données invalides",
      details: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  // Prisma unique constraint violation (e.g. duplicate nom / username)
  if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
    res.status(409).json({ error: "Cette valeur existe déjà" });
    return;
  }
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "JSON invalide" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
}
