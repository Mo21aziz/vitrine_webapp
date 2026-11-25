import { prisma } from "../config/prisma.js";
import type { AvisQuery } from "../types/schemas.js";

const withArticle = { article: { select: { id: true, nom: true, imageUrl: true } } } as const;

export const avisRepository = {
  findAll({ statut, articleId }: AvisQuery) {
    return prisma.avis.findMany({
      where: {
        articleId,
        publie: statut === undefined ? undefined : statut === "publie",
      },
      include: withArticle,
      orderBy: { createdAt: "desc" },
    });
  },

  findPublished(articleId: number) {
    return prisma.avis.findMany({
      where: { articleId, publie: true },
      select: { id: true, nom: true, note: true, commentaire: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },

  /** Latest published reviews across all dishes visible on the site (home page) */
  findRecentPublished(limit: number) {
    return prisma.avis.findMany({
      where: { publie: true, article: { menuId: { not: null } } },
      select: {
        id: true,
        nom: true,
        note: true,
        commentaire: true,
        createdAt: true,
        article: { select: { id: true, nom: true, imageUrl: true } },
      },
      orderBy: [{ note: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  },

  allPublishedStats() {
    return prisma.avis.aggregate({
      where: { publie: true, article: { menuId: { not: null } } },
      _avg: { note: true },
      _count: { _all: true },
    });
  },

  publishedStats(articleId: number) {
    return prisma.avis.aggregate({
      where: { articleId, publie: true },
      _avg: { note: true },
      _count: { _all: true },
    });
  },

  findById(id: number) {
    return prisma.avis.findUnique({ where: { id } });
  },

  create(data: { articleId: number; nom: string; note: number; commentaire: string }) {
    return prisma.avis.create({ data });
  },

  setPublie(id: number, publie: boolean) {
    return prisma.avis.update({ where: { id }, data: { publie }, include: withArticle });
  },

  delete(id: number) {
    return prisma.avis.delete({ where: { id } });
  },

  countByPublie() {
    return prisma.avis.groupBy({ by: ["publie"], _count: { _all: true } });
  },

  averageNote() {
    return prisma.avis.aggregate({ _avg: { note: true } });
  },
};
