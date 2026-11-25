import type { Request, Response } from "express";
import { avisService } from "../services/avis.service.js";
import { avisQuerySchema, createAvisSchema, idParamSchema, updateAvisSchema } from "../types/schemas.js";

export const avisController = {
  // public — /avis/recents
  async recent(_req: Request, res: Response) {
    res.json(await avisService.listRecent());
  },

  // public — /articles/:id/avis
  async listPublic(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await avisService.listPublic(id));
  },

  async create(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.status(201).json(await avisService.create(id, createAvisSchema.parse(req.body)));
  },

  // admin — /admin/avis
  async list(req: Request, res: Response) {
    res.json(await avisService.list(avisQuerySchema.parse(req.query)));
  },

  async update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const { publie } = updateAvisSchema.parse(req.body);
    res.json(await avisService.setPublie(id, publie));
  },

  async remove(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await avisService.remove(id);
    res.status(204).end();
  },
};
