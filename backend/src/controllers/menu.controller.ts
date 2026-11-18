import type { Request, Response } from "express";
import { menuService } from "../services/menu.service.js";
import { idParamSchema, menuSchema } from "../types/schemas.js";

export const menuController = {
  async list(_req: Request, res: Response) {
    res.json(await menuService.list());
  },

  async get(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await menuService.get(id));
  },

  async create(req: Request, res: Response) {
    res.status(201).json(await menuService.create(menuSchema.parse(req.body)));
  },

  async update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await menuService.update(id, menuSchema.parse(req.body)));
  },

  async remove(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await menuService.remove(id);
    res.status(204).end();
  },
};
