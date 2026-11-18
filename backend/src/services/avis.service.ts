import { articleRepository } from "../repositories/article.repository.js";
import { avisRepository } from "../repositories/avis.repository.js";
import { HttpError } from "../types/http-error.js";
import type { AvisQuery, CreateAvisInput } from "../types/schemas.js";

const round1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

/** Only dishes shown on the site (placed in a menu) can receive reviews */
async function ensureVisibleArticle(articleId: number) {
  const article = await articleRepository.findById(articleId);
  if (!article || article.menuId === null) throw new HttpError(404, "Plat introuvable");
}

export const avisService = {
  /** Public: published reviews of a dish + average */
  async listPublic(articleId: number) {
    await ensureVisibleArticle(articleId);
    const [avis, stats] = await Promise.all([
      avisRepository.findPublished(articleId),
      avisRepository.publishedStats(articleId),
    ]);
    return { moyenne: round1(stats._avg.note), total: stats._count._all, avis };
  },

  async create(articleId: number, { nom, note, commentaire, site }: CreateAvisInput) {
    await ensureVisibleArticle(articleId);
    if (site) throw new HttpError(400, "Envoi refusé"); // honeypot filled → bot
    const { id, createdAt } = await avisRepository.create({ articleId, nom, note, commentaire });
    return { id, createdAt };
  },

  /** Admin */
  list(query: AvisQuery) {
    return avisRepository.findAll(query);
  },

  async setPublie(id: number, publie: boolean) {
    if (!(await avisRepository.findById(id))) throw new HttpError(404, "Avis introuvable");
    return avisRepository.setPublie(id, publie);
  },

  async remove(id: number) {
    if (!(await avisRepository.findById(id))) throw new HttpError(404, "Avis introuvable");
    await avisRepository.delete(id);
  },
};
