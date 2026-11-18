import { articleRepository } from "../repositories/article.repository.js";
import { avisRepository } from "../repositories/avis.repository.js";
import { menuRepository } from "../repositories/menu.repository.js";
import { pointDeVenteRepository } from "../repositories/pointDeVente.repository.js";
import { reclamationRepository } from "../repositories/reclamation.repository.js";

export const dashboardService = {
  async stats() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [articles, menus, pointsDeVente, byStatut, byPoint, last7Days, avisByPublie, avisAvg] = await Promise.all([
      articleRepository.count(),
      menuRepository.count(),
      pointDeVenteRepository.findAll(),
      reclamationRepository.countByStatut(),
      reclamationRepository.countByPointDeVente(),
      reclamationRepository.countSince(weekAgo),
      avisRepository.countByPublie(),
      avisRepository.averageNote(),
    ]);

    const avisPublies = avisByPublie.find((r) => r.publie)?._count._all ?? 0;
    const avisEnAttente = avisByPublie.find((r) => !r.publie)?._count._all ?? 0;
    const moyenne = avisAvg._avg.note;

    const reclamations = { NOUVELLE: 0, EN_COURS: 0, TRAITEE: 0 };
    for (const row of byStatut) reclamations[row.statut] = row._count._all;
    const total = reclamations.NOUVELLE + reclamations.EN_COURS + reclamations.TRAITEE;

    return {
      articles,
      menus,
      pointsDeVente: pointsDeVente.length,
      reclamations: { ...reclamations, total, last7Days },
      avis: {
        total: avisPublies + avisEnAttente,
        enAttente: avisEnAttente,
        moyenne: moyenne === null ? null : Math.round(moyenne * 10) / 10,
      },
      tauxTraitement: total === 0 ? 100 : Math.round((reclamations.TRAITEE / total) * 100),
      parPointDeVente: pointsDeVente.map((p) => ({
        id: p.id,
        nom: p.nom,
        count: byPoint.find((r) => r.pointDeVenteId === p.id)?._count._all ?? 0,
      })),
    };
  },
};
