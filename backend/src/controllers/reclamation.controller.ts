import type { Request, Response } from "express";
import { reclamationService } from "../services/reclamation.service.js";
import {
  createReclamationSchema,
  idParamSchema,
  reclamationQuerySchema,
  updateReclamationSchema,
} from "../types/schemas.js";

export const reclamationController = {
  async create(req: Request, res: Response) {
    res.status(201).json(await reclamationService.create(createReclamationSchema.parse(req.body)));
  },

  async list(req: Request, res: Response) {
    const { statut } = reclamationQuerySchema.parse(req.query);
    res.json(await reclamationService.list(statut));
  },

  async updateStatut(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const { statut } = updateReclamationSchema.parse(req.body);
    res.json(await reclamationService.updateStatut(id, statut));
  },
};
