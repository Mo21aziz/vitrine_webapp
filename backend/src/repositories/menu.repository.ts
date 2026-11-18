import { prisma } from "../config/prisma.js";
import type { MenuInput } from "../types/schemas.js";

export const menuRepository = {
  findAll() {
    return prisma.menu.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { articles: true } } },
    });
  },

  findById(id: number) {
    return prisma.menu.findUnique({ where: { id } });
  },

  findWithArticles(id: number) {
    return prisma.menu.findUnique({
      where: { id },
      include: { articles: { orderBy: { createdAt: "asc" } } },
    });
  },

  count() {
    return prisma.menu.count();
  },

  create(data: MenuInput) {
    return prisma.menu.create({ data });
  },

  update(id: number, data: MenuInput) {
    return prisma.menu.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.menu.delete({ where: { id } });
  },

  countArticles(id: number) {
    return prisma.article.count({ where: { menuId: id } });
  },
};
