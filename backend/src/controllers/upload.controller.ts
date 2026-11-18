import type { Request, Response } from "express";
import { uploadService } from "../services/upload.service.js";
import { HttpError } from "../types/http-error.js";

export const uploadController = {
  async image(req: Request, res: Response) {
    if (!req.file) throw new HttpError(400, "Aucune image reçue (champ « image »)");
    res.status(201).json(await uploadService.saveImage(req.file.buffer));
  },

  /** GET /uploads/:file — filenames are random UUIDs, so the response can be cached forever */
  async serve(req: Request, res: Response) {
    const image = await uploadService.getImage(String(req.params.file));
    if (!image) throw new HttpError(404, "Image introuvable");
    res.set({
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    res.send(Buffer.from(image.data));
  },
};
