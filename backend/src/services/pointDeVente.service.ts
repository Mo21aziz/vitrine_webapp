import { pointDeVenteRepository } from "../repositories/pointDeVente.repository.js";
import { HttpError } from "../types/http-error.js";
import type { PointDeVenteInput } from "../types/schemas.js";

async function ensureExists(id: number) {
  const point = await pointDeVenteRepository.findById(id);
  if (!point) throw new HttpError(404, "Point de vente introuvable");
  return point;
}

export const pointDeVenteService = {
  list() {
    return pointDeVenteRepository.findAll();
  },

  create(data: PointDeVenteInput) {
    return pointDeVenteRepository.create(data);
  },

  async update(id: number, data: PointDeVenteInput) {
    await ensureExists(id);
    return pointDeVenteRepository.update(id, data);
  },

  async remove(id: number) {
    await ensureExists(id);
    if ((await pointDeVenteRepository.countReclamations(id)) > 0) {
      throw new HttpError(409, "Ce point de vente a des réclamations et ne peut pas être supprimé");
    }
    await pointDeVenteRepository.delete(id);
  },
};
