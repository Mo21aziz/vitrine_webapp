import { prisma } from "../config/prisma.js";
import type { ArticleInput } from "../types/schemas.js";

export const articleRepository = {
  findAll() {
    return prisma.article.findMany({ orderBy: { createdAt: "asc" } });
  },

  findById(id: number) {
    return prisma.article.findUnique({ where: { id } });
  },

  /** Article with its menu and the other dishes of that menu (for the public detail page) */
  findPublicById(id: number) {
    return prisma.article.findUnique({
      where: { id },
      include: {
        menu: {
          select: {
            id: true,
            nom: true,
            articles: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });
  },

  count() {
    return prisma.article.count();
  },

  create(data: ArticleInput) {
    return prisma.article.create({ data });
  },

  update(id: number, data: ArticleInput) {
    return prisma.article.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.article.delete({ where: { id } });
  },
};
