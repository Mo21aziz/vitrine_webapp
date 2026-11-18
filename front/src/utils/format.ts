import type { Statut } from '../types'

const prixFormatter = new Intl.NumberFormat('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** 12.5 → "12,500 DT" */
export function formatPrix(value: number): string {
  return `${prixFormatter.format(value)} DT`
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export const STATUT_LABELS: Record<Statut, string> = {
  NOUVELLE: 'Nouvelle',
  EN_COURS: 'En cours',
  TRAITEE: 'Traitée',
}

export const STATUTS: Statut[] = ['NOUVELLE', 'EN_COURS', 'TRAITEE']
