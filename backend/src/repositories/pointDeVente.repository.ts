import { prisma } from "../config/prisma.js";
import type { PointDeVenteInput } from "../types/schemas.js";

export const pointDeVenteRepository = {
  findAll() {
    return prisma.pointDeVente.findMany({ orderBy: { id: "asc" } });
  },

  findById(id: number) {
    return prisma.pointDeVente.findUnique({ where: { id } });
  },

  count() {
    return prisma.pointDeVente.count();
  },

  create(data: PointDeVenteInput) {
    return prisma.pointDeVente.create({ data });
  },

  update(id: number, data: PointDeVenteInput) {
    return prisma.pointDeVente.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.pointDeVente.delete({ where: { id } });
  },

  countReclamations(id: number) {
    return prisma.reclamation.count({ where: { pointDeVenteId: id } });
  },
};
