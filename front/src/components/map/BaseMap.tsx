import 'leaflet/dist/leaflet.css'
import type { ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import styles from './Map.module.css'

/**
 * OpenStreetMap France tiles: free, no API key, and labels in French when OSM has them
 * (the default OSM style shows local names, i.e. Arabic in Tunisia). Attribution is required.
 * https://www.openstreetmap.fr/fonds-de-carte/
 */
const TILES = 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · fond OSM France'

interface BaseMapProps {
  center: [number, number]
  zoom?: number
  scrollWheelZoom?: boolean
  className?: string
  label: string
  children?: ReactNode
}

export function BaseMap({ center, zoom = 13, scrollWheelZoom = false, className, label, children }: BaseMapProps) {
  return (
    <div className={`${styles.frame} ${className ?? ''}`} role="region" aria-label={label}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom} className={styles.map}>
        <TileLayer url={TILES} attribution={ATTRIBUTION} subdomains="abc" maxZoom={19} />
        {children}
      </MapContainer>
    </div>
  )
}
