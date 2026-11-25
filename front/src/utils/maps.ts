import type { PointDeVente } from '../types'

/** Default view when no restaurant is placed yet: Tunis */
export const DEFAULT_CENTER: [number, number] = [36.8065, 10.1815]

export const hasCoords = (p: PointDeVente): p is PointDeVente & { latitude: number; longitude: number } =>
  p.latitude !== null && p.longitude !== null

/**
 * Google Maps search listing every Di Napoli restaurant one under another (with their Google
 * ratings, hours and photos); the visitor taps the one they want. Free, no API key.
 */
export const ALL_RESTAURANTS_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Di%20Napoli%20Tunisie'

/** Google Maps with `text` typed in its search bar (e.g. "Di Napoli Manzah 5, Rue …, Ariana 2091") */
export const googleMapsSearchUrl = (text: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`

/**
 * "Itinéraire" link (Google Maps on Android/desktop, offers Apple/Google Maps on iPhone). Free, no API key.
 * 1. the admin's Google Maps search text → Google opens the exact business page
 * 2. otherwise the pin's position → directions to that point
 * 3. otherwise name + address searched in Google Maps
 */
export function directionsUrl(p: PointDeVente): string | null {
  if (p.googleMapsQuery) return googleMapsSearchUrl(p.googleMapsQuery)
  if (hasCoords(p)) return `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`
  if (p.adresse) return googleMapsSearchUrl(`${p.nom}, ${p.adresse}`)
  return null
}
