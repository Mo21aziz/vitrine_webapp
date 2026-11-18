import type {
  Admin,
  Article,
  ArticleInput,
  Avis,
  AvisFiltre,
  DashboardStats,
  GeocodeResult,
  Menu,
  MenuInput,
  PointDeVente,
  PointDeVenteInput,
  Reclamation,
  Statut,
} from '../types'
import { request } from './client'

const auth = { auth: true } as const

export const adminApi = {
  me: () => request<Admin>('/admin/me', auth),
  stats: () => request<DashboardStats>('/admin/stats', auth),

  uploadImage: (file: File) => {
    const form = new FormData()
    form.append('image', file)
    return request<{ url: string }>('/admin/uploads', { ...auth, method: 'POST', body: form })
  },

  reclamations: (statut?: Statut) =>
    request<Reclamation[]>(`/admin/reclamations${statut ? `?statut=${statut}` : ''}`, auth),
  updateStatut: (id: number, statut: Statut) =>
    request<Reclamation>(`/admin/reclamations/${id}`, { ...auth, method: 'PATCH', body: { statut } }),

  avis: (filtre?: AvisFiltre) => request<Avis[]>(`/admin/avis${filtre ? `?statut=${filtre}` : ''}`, auth),
  publierAvis: (id: number, publie: boolean) =>
    request<Avis>(`/admin/avis/${id}`, { ...auth, method: 'PATCH', body: { publie } }),
  deleteAvis: (id: number) => request<void>(`/admin/avis/${id}`, { ...auth, method: 'DELETE' }),

  createArticle: (data: ArticleInput) => request<Article>('/admin/articles', { ...auth, method: 'POST', body: data }),
  updateArticle: (id: number, data: ArticleInput) =>
    request<Article>(`/admin/articles/${id}`, { ...auth, method: 'PUT', body: data }),
  deleteArticle: (id: number) => request<void>(`/admin/articles/${id}`, { ...auth, method: 'DELETE' }),

  createMenu: (data: MenuInput) => request<Menu>('/admin/menus', { ...auth, method: 'POST', body: data }),
  updateMenu: (id: number, data: MenuInput) =>
    request<Menu>(`/admin/menus/${id}`, { ...auth, method: 'PUT', body: data }),
  deleteMenu: (id: number) => request<void>(`/admin/menus/${id}`, { ...auth, method: 'DELETE' }),

  createPointDeVente: (data: PointDeVenteInput) =>
    request<PointDeVente>('/admin/points-de-vente', { ...auth, method: 'POST', body: data }),
  updatePointDeVente: (id: number, data: PointDeVenteInput) =>
    request<PointDeVente>(`/admin/points-de-vente/${id}`, { ...auth, method: 'PUT', body: data }),

  // free OpenStreetMap geocoding, proxied by the backend
  geocodeSearch: (q: string) => request<GeocodeResult[]>(`/admin/geocode/search?q=${encodeURIComponent(q)}`, auth),
  geocodeReverse: (lat: number, lng: number) =>
    request<GeocodeResult | null>(`/admin/geocode/reverse?lat=${lat}&lng=${lng}`, auth),
  deletePointDeVente: (id: number) => request<void>(`/admin/points-de-vente/${id}`, { ...auth, method: 'DELETE' }),
}
