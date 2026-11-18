import type { Request, Response } from "express";
import { pointDeVenteService } from "../services/pointDeVente.service.js";
import { idParamSchema, pointDeVenteSchema } from "../types/schemas.js";

export const pointDeVenteController = {
  async list(_req: Request, res: Response) {
    res.json(await pointDeVenteService.list());
  },

  async create(req: Request, res: Response) {
    res.status(201).json(await pointDeVenteService.create(pointDeVenteSchema.parse(req.body)));
  },

  async update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await pointDeVenteService.update(id, pointDeVenteSchema.parse(req.body)));
  },

  async remove(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await pointDeVenteService.remove(id);
    res.status(204).end();
  },
};
