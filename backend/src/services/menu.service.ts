import { menuRepository } from "../repositories/menu.repository.js";
import { HttpError } from "../types/http-error.js";
import type { MenuInput } from "../types/schemas.js";
import { toArticleDto } from "./article.service.js";
import { uploadService } from "./upload.service.js";

async function ensureExists(id: number) {
  const menu = await menuRepository.findById(id);
  if (!menu) throw new HttpError(404, "Menu introuvable");
  return menu;
}

export const menuService = {
  async list() {
    const menus = await menuRepository.findAll();
    return menus.map(({ _count, ...menu }) => ({ ...menu, nbArticles: _count.articles }));
  },

  async get(id: number) {
    const menu = await menuRepository.findWithArticles(id);
    if (!menu) throw new HttpError(404, "Menu introuvable");
    const articles = menu.articles.map(toArticleDto);
    return { ...menu, nbArticles: articles.length, articles };
  },

  async create(data: MenuInput) {
    return { ...(await menuRepository.create(data)), nbArticles: 0 };
  },

  async update(id: number, data: MenuInput) {
    const previous = await ensureExists(id);
    const menu = await menuRepository.update(id, data);
    if (previous.imageUrl !== menu.imageUrl) await uploadService.deleteImage(previous.imageUrl);
    return { ...menu, nbArticles: await menuRepository.countArticles(id) };
  },

  async remove(id: number) {
    const menu = await ensureExists(id);
    if ((await menuRepository.countArticles(id)) > 0) {
      throw new HttpError(409, "Ce menu contient des articles : déplacez-les ou supprimez-les d’abord");
    }
    await menuRepository.delete(id);
    await uploadService.deleteImage(menu.imageUrl);
  },
};
