import type { Admin, Article, ArticleDetail, AvisInput, AvisSummary, Menu, MenuDetail, PointDeVente, ReclamationInput } from '../types'
import { request } from './client'

export const publicApi = {
  articles: () => request<Article[]>('/articles'),
  article: (id: number) => request<ArticleDetail>(`/articles/${id}`),
  avis: (articleId: number) => request<AvisSummary>(`/articles/${articleId}/avis`),
  envoyerAvis: (articleId: number, data: AvisInput) =>
    request<{ id: number; createdAt: string }>(`/articles/${articleId}/avis`, { method: 'POST', body: data }),
  menus: () => request<Menu[]>('/menus'),
  menu: (id: number) => request<MenuDetail>(`/menus/${id}`),
  pointsDeVente: () => request<PointDeVente[]>('/points-de-vente'),
  envoyerReclamation: (data: ReclamationInput) =>
    request<{ id: number; createdAt: string }>('/reclamations', { method: 'POST', body: data }),
  login: (username: string, password: string) =>
    request<{ token: string; admin: Admin }>('/auth/login', { method: 'POST', body: { username, password } }),
}
