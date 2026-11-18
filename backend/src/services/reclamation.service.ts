import { pointDeVenteRepository } from "../repositories/pointDeVente.repository.js";
import { reclamationRepository } from "../repositories/reclamation.repository.js";
import { HttpError } from "../types/http-error.js";
import type { CreateReclamationInput, Statut } from "../types/schemas.js";

export const reclamationService = {
  list(statut?: Statut) {
    return reclamationRepository.findAll(statut);
  },

  async create(data: CreateReclamationInput) {
    if (!(await pointDeVenteRepository.findById(data.pointDeVenteId))) {
      throw new HttpError(400, "Point de vente invalide");
    }
    const { id, createdAt } = await reclamationRepository.create(data);
    return { id, createdAt };
  },

  async updateStatut(id: number, statut: Statut) {
    if (!(await reclamationRepository.findById(id))) {
      throw new HttpError(404, "Réclamation introuvable");
    }
    return reclamationRepository.updateStatut(id, statut);
  },
};
