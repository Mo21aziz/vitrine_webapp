import type { Request, Response } from "express";
import { geocodeService } from "../services/geocode.service.js";
import { geocodeReverseSchema, geocodeSearchSchema } from "../types/schemas.js";

export const geocodeController = {
  async search(req: Request, res: Response) {
    const { q } = geocodeSearchSchema.parse(req.query);
    res.json(await geocodeService.search(q));
  },

  async reverse(req: Request, res: Response) {
    const { lat, lng } = geocodeReverseSchema.parse(req.query);
    res.json(await geocodeService.reverse(lat, lng));
  },
};
