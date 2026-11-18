import type { PointDeVente } from '../types'

/** Default view when no restaurant is placed yet: Tunis */
export const DEFAULT_CENTER: [number, number] = [36.8065, 10.1815]

export const hasCoords = (p: PointDeVente): p is PointDeVente & { latitude: number; longitude: number } =>
  p.latitude !== null && p.longitude !== null

/**
 * Link that opens directions in the visitor's maps app (Google Maps on Android/desktop,
 * offers Apple/Google Maps on iPhone). Free, no API key.
 */
export function directionsUrl(p: PointDeVente): string | null {
  if (hasCoords(p)) return `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`
  if (p.adresse) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.nom}, ${p.adresse}`)}`
  return null
}
