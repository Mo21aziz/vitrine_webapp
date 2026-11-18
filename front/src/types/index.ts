export type Statut = 'NOUVELLE' | 'EN_COURS' | 'TRAITEE'

export interface Article {
  id: number
  nom: string
  prix: number
  prixFinal: number
  composition: string
  remise: number
  menuId: number | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface ArticleDetail extends Article {
  menu: { id: number; nom: string }
  position: { index: number; total: number }
  precedent: { id: number; nom: string } | null
  suivant: { id: number; nom: string } | null
  autres: Article[]
}

export interface ArticleInput {
  nom: string
  prix: number
  composition: string
  remise: number
  menuId: number | null
  imageUrl: string | null
}

export interface Menu {
  id: number
  nom: string
  description: string | null
  imageUrl: string | null
  nbArticles: number
  createdAt: string
}

export interface MenuDetail extends Menu {
  articles: Article[]
}

export interface MenuInput {
  nom: string
  description: string | null
  imageUrl: string | null
}

export interface PointDeVente {
  id: number
  nom: string
  adresse: string | null
  latitude: number | null
  longitude: number | null
}

export interface PointDeVenteInput {
  nom: string
  adresse: string | null
  latitude: number | null
  longitude: number | null
}

export interface GeocodeResult {
  latitude: number
  longitude: number
  adresse: string
  label: string
}

export interface Reclamation {
  id: number
  nom: string | null
  prenom: string | null
  telephone: string | null
  email: string
  message: string
  statut: Statut
  pointDeVenteId: number
  pointDeVente: { id: number; nom: string }
  createdAt: string
}

export interface ReclamationInput {
  nom?: string
  prenom?: string
  telephone?: string
  email: string
  message: string
  pointDeVenteId: number
}

export interface AvisPublic {
  id: number
  nom: string
  note: number
  commentaire: string
  createdAt: string
}

export interface AvisSummary {
  moyenne: number | null
  total: number
  avis: AvisPublic[]
}

export interface AvisInput {
  nom: string
  note: number
  commentaire: string
  site?: string
}

export interface Avis extends AvisPublic {
  articleId: number
  publie: boolean
  article: { id: number; nom: string; imageUrl: string | null }
}

export type AvisFiltre = 'en_attente' | 'publie'

export interface Admin {
  id: number
  username: string
}

export interface DashboardStats {
  articles: number
  menus: number
  pointsDeVente: number
  reclamations: Record<Statut, number> & { total: number; last7Days: number }
  avis: { total: number; enAttente: number; moyenne: number | null }
  tauxTraitement: number
  parPointDeVente: { id: number; nom: string; count: number }[]
}
