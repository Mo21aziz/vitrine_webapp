import type { Request, Response } from "express";
import { articleService } from "../services/article.service.js";
import { articleSchema, idParamSchema } from "../types/schemas.js";

export const articleController = {
  async list(_req: Request, res: Response) {
    res.json(await articleService.list());
  },

  async get(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await articleService.getPublic(id));
  },

  async create(req: Request, res: Response) {
    res.status(201).json(await articleService.create(articleSchema.parse(req.body)));
  },

  async update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await articleService.update(id, articleSchema.parse(req.body)));
  },

  async remove(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await articleService.remove(id);
    res.status(204).end();
  },
};
