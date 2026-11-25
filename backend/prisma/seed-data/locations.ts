/**
 * The 6 Di Napoli restaurants: name, address, map position and Google Maps search text.
 * Same values as in the admin today.
 *
 * Safe to run several times: missing restaurants are created, old names are renamed, and a restaurant
 * that already exists is never modified (so pins refined or phones added in the admin are kept).
 */
import { prisma } from "../../src/config/prisma.js";

interface Location {
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  /** text searched in Google Maps by the Itinéraire button (Google finds the exact business) */
  googleMapsQuery: string | null;
  /** earlier names of the same restaurant, renamed instead of duplicated */
  previously?: string[];
}

export const LOCATIONS: Location[] = [
  {
    nom: "Di Napoli Bizerte Centre",
    adresse: "20 Rue Taieb M'Hiri, 7000 Bizerte",
    googleMapsQuery: "Pizza Di Napoli, 20 Rue Taieb M'Hiri, Bizerte 7000",
    latitude: 37.273097, // exact point from Google Maps (given by the owner)
    longitude: 9.869499,
    previously: ["Di Napoli Centre-ville"],
  },
  {
    nom: "Di Napoli Corniche",
    adresse: "Rue de Corniche, 7000 Bizerte",
    googleMapsQuery: "Di Napoli Corniche, Rue de Corniche, Bizerte 7000",
    latitude: 37.295938, // plus code 7VW9+95
    longitude: 9.867938,
    previously: ["Di Napoli La Marsa"],
  },
  {
    nom: "Di Napoli Manzah 5",
    adresse: "Rue Mustapha Abdessalem, El Menzah 5, 2091 Ariana",
    googleMapsQuery: "Di Napoli Manzah 5, Rue Mustapha Abdessalem, Ariana 2091",
    latitude: 36.85206,
    longitude: 10.17369,
  },
  {
    nom: "Di Napoli Raoued",
    adresse: "El Medina El Fadhla, 2083 Raoued",
    googleMapsQuery: null,
    latitude: 36.890162, // plus code V5RC+3M8
    longitude: 10.171703,
  },
  {
    nom: "Di Napoli Bardo",
    adresse: "Avenue Habib Bourguiba, 2000 Le Bardo",
    googleMapsQuery: "Di Napoli Bardo, Avenue Habib Bourguiba, Le Bardo",
    latitude: 36.81104,
    longitude: 10.14189,
  },
  {
    nom: "Di Napoli Boumhel",
    adresse: "Résidence le Carré d'Or, 2097 Bou Mhel El Bassatine",
    googleMapsQuery: "Di Napoli Boumhel, Résidence le Carré d'Or, Bou Mhel El Bassatine",
    latitude: 36.73317,
    longitude: 10.31243,
  },
];

export async function seedLocations() {
  for (const { previously = [], ...loc } of LOCATIONS) {
    if (await prisma.pointDeVente.findUnique({ where: { nom: loc.nom } })) {
      console.log(`  kept     ${loc.nom}`);
      continue;
    }

    const old = await prisma.pointDeVente.findFirst({ where: { nom: { in: previously } } });
    if (old) {
      await prisma.pointDeVente.update({ where: { id: old.id }, data: loc });
      console.log(`  renamed  ${old.nom} → ${loc.nom}`);
    } else {
      await prisma.pointDeVente.create({ data: loc });
      console.log(`  created  ${loc.nom}`);
    }
  }
}
