import type { Article } from "../generated/prisma/client.js";
import { articleRepository } from "../repositories/article.repository.js";
import { menuRepository } from "../repositories/menu.repository.js";
import { HttpError } from "../types/http-error.js";
import type { ArticleInput } from "../types/schemas.js";
import { uploadService } from "./upload.service.js";

export function toArticleDto(article: Article) {
  const prix = article.prix.toNumber();
  const prixFinal = Math.round(prix * (100 - article.remise) * 10) / 1000; // 3 decimals (millimes)
  return { ...article, prix, prixFinal };
}

async function ensureExists(id: number) {
  const article = await articleRepository.findById(id);
  if (!article) throw new HttpError(404, "Article introuvable");
  return article;
}

async function ensureMenu(menuId: number | null) {
  if (menuId !== null && !(await menuRepository.findById(menuId))) {
    throw new HttpError(400, "Menu invalide");
  }
}

export const articleService = {
  async list() {
    return (await articleRepository.findAll()).map(toArticleDto);
  },

  /** Public detail: only dishes placed in a menu are visible on the site */
  async getPublic(id: number) {
    const found = await articleRepository.findPublicById(id);
    if (!found?.menu) throw new HttpError(404, "Plat introuvable");

    const { menu, ...article } = found;
    const siblings = menu.articles;
    const index = siblings.findIndex((a) => a.id === id);
    const pick = (a: Article | undefined) => (a ? { id: a.id, nom: a.nom } : null);

    return {
      ...toArticleDto(article),
      menu: { id: menu.id, nom: menu.nom },
      position: { index: index + 1, total: siblings.length },
      precedent: pick(siblings[index - 1]),
      suivant: pick(siblings[index + 1]),
      autres: siblings.filter((a) => a.id !== id).slice(0, 3).map(toArticleDto),
    };
  },

  async create(data: ArticleInput) {
    await ensureMenu(data.menuId);
    return toArticleDto(await articleRepository.create(data));
  },

  async update(id: number, data: ArticleInput) {
    const previous = await ensureExists(id);
    await ensureMenu(data.menuId);
    const article = await articleRepository.update(id, data);
    if (previous.imageUrl !== article.imageUrl) await uploadService.deleteImage(previous.imageUrl);
    return toArticleDto(article);
  },

  async remove(id: number) {
    const article = await ensureExists(id);
    await articleRepository.delete(id);
    await uploadService.deleteImage(article.imageUrl);
  },
};
