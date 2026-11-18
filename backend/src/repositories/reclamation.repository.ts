import { prisma } from "../config/prisma.js";
import type { CreateReclamationInput, Statut } from "../types/schemas.js";

export const reclamationRepository = {
  findAll(statut?: Statut) {
    return prisma.reclamation.findMany({
      where: statut ? { statut } : undefined,
      include: { pointDeVente: { select: { id: true, nom: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: number) {
    return prisma.reclamation.findUnique({ where: { id } });
  },

  create(data: CreateReclamationInput) {
    return prisma.reclamation.create({ data });
  },

  updateStatut(id: number, statut: Statut) {
    return prisma.reclamation.update({
      where: { id },
      data: { statut },
      include: { pointDeVente: { select: { id: true, nom: true } } },
    });
  },

  countByStatut() {
    return prisma.reclamation.groupBy({ by: ["statut"], _count: { _all: true } });
  },

  countByPointDeVente() {
    return prisma.reclamation.groupBy({ by: ["pointDeVenteId"], _count: { _all: true } });
  },

  countSince(date: Date) {
    return prisma.reclamation.count({ where: { createdAt: { gte: date } } });
  },
};
