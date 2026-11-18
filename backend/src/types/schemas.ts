import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(191),
  password: z.string().min(1),
});

// Only accept URLs returned by POST /api/admin/uploads
const imageUrl = z
  .string()
  .regex(/^\/uploads\/[a-f0-9-]{36}\.(jpg|png|webp)$/, "Image invalide")
  .nullable()
  .default(null);

export const articleSchema = z.object({
  nom: z.string().trim().min(1).max(191),
  prix: z.number().positive().max(9_999_999),
  composition: z.string().trim().min(1),
  remise: z.number().int().min(0).max(100).default(0),
  menuId: z.number().int().positive().nullable().default(null),
  imageUrl,
});

export const menuSchema = z.object({
  nom: z.string().trim().min(1).max(191),
  imageUrl,
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
});

export const pointDeVenteSchema = z
  .object({
    nom: z.string().trim().min(1).max(191),
    adresse: z
      .string()
      .trim()
      .max(191)
      .optional()
      .nullable()
      .transform((v) => (v ? v : null)),
    latitude: z.number().min(-90).max(90).nullable().default(null),
    longitude: z.number().min(-180).max(180).nullable().default(null),
  })
  .refine((p) => (p.latitude === null) === (p.longitude === null), {
    message: "Latitude et longitude vont ensemble",
    path: ["latitude"],
  });

export const geocodeSearchSchema = z.object({ q: z.string().trim().min(3).max(200) });

export const geocodeReverseSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

const optionalText = z
  .string()
  .trim()
  .max(191)
  .optional()
  .transform((v) => (v ? v : null));

export const createReclamationSchema = z.object({
  nom: optionalText,
  prenom: optionalText,
  telephone: optionalText,
  email: z.email().max(191),
  message: z.string().trim().min(10).max(5000),
  pointDeVenteId: z.number().int().positive(),
});

export const statutSchema = z.enum(["NOUVELLE", "EN_COURS", "TRAITEE"]);

export const updateReclamationSchema = z.object({ statut: statutSchema });

export const reclamationQuerySchema = z.object({
  statut: statutSchema.optional(),
});

export const createAvisSchema = z.object({
  nom: z.string().trim().min(2, "Votre nom est requis").max(80),
  note: z.number().int().min(1).max(5),
  commentaire: z.string().trim().min(5, "Votre avis est trop court").max(1000),
  // Honeypot: hidden field real visitors never fill in
  site: z.string().max(0).optional(),
});

export const updateAvisSchema = z.object({ publie: z.boolean() });

export const avisQuerySchema = z.object({
  statut: z.enum(["en_attente", "publie"]).optional(),
  articleId: z.coerce.number().int().positive().optional(),
});

export type CreateAvisInput = z.infer<typeof createAvisSchema>;
export type AvisQuery = z.infer<typeof avisQuerySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type MenuInput = z.infer<typeof menuSchema>;
export type PointDeVenteInput = z.infer<typeof pointDeVenteSchema>;
export type CreateReclamationInput = z.infer<typeof createReclamationSchema>;
export type Statut = z.infer<typeof statutSchema>;
