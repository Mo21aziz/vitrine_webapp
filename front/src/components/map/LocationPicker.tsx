import type L from 'leaflet'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Marker, useMap, useMapEvents } from 'react-leaflet'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import type { GeocodeResult } from '../../types'
import { DEFAULT_CENTER } from '../../utils/maps'
import { Pin, Trash } from '../ui/Icons'
import { BaseMap } from './BaseMap'
import { pinIcon } from './pin'
import styles from './LocationPicker.module.css'

export interface Coords {
  latitude: number
  longitude: number
}

interface LocationPickerProps {
  value: Coords | null
  onChange: (coords: Coords | null) => void
  /** called with a readable address after a search pick or a reverse lookup */
  onAddressFound: (adresse: string) => void
}

/**
 * Admin map: search an address, click the map, or drag the pin.
 * Uses the backend's free OpenStreetMap geocoding proxy (no API key).
 */
export function LocationPicker({ value, onChange, onAddressFound }: LocationPickerProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const lastQuery = useRef('')

  // debounced search (the backend also throttles to respect OSM's 1 req/s policy)
  useEffect(() => {
    const q = query.trim()
    if (q.length < 3 || q === lastQuery.current) return
    const timer = setTimeout(async () => {
      lastQuery.current = q
      setSearching(true)
      setMessage(null)
      try {
        const found = await adminApi.geocodeSearch(q)
        setResults(found)
        if (!found.length) setMessage('Aucune adresse trouvée. Essayez autrement ou cliquez directement sur la carte.')
      } catch (err) {
        setMessage(err instanceof ApiError ? err.message : 'Recherche impossible')
      } finally {
        setSearching(false)
      }
    }, 650)
    return () => clearTimeout(timer)
  }, [query])

  function pickResult(r: GeocodeResult) {
    onChange({ latitude: r.latitude, longitude: r.longitude })
    onAddressFound(r.adresse)
    setResults([])
    setQuery('')
    lastQuery.current = ''
  }

  async function placeAt(latitude: number, longitude: number) {
    onChange({ latitude, longitude })
    setLocating(true)
    setMessage(null)
    try {
      const found = await adminApi.geocodeReverse(latitude, longitude)
      if (found) onAddressFound(found.adresse)
      else setMessage('Point placé. Aucune adresse connue ici : saisissez-la à la main.')
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Adresse introuvable, saisissez-la à la main.')
    } finally {
      setLocating(false)
    }
  }

  return (
    <div className={styles.picker}>
      <div className={styles.search}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Rechercher une adresse (ex. Avenue Habib Bourguiba, La Marsa)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher une adresse"
          aria-autocomplete="list"
          aria-controls="geocode-results"
        />
        {searching && <span className={styles.spinner} aria-label="Recherche…" />}
        {results.length > 0 && (
          <ul id="geocode-results" className={styles.results} role="listbox">
            {results.map((r) => (
              <li key={`${r.latitude},${r.longitude}`}>
                <button type="button" onClick={() => pickResult(r)}>
                  <Pin size={14} />
                  <span>
                    <strong>{r.adresse}</strong>
                    <small>{r.label}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BaseMap
        label="Choisir l’emplacement du restaurant"
        center={value ? [value.latitude, value.longitude] : DEFAULT_CENTER}
        zoom={value ? 16 : 12}
        scrollWheelZoom
        className={styles.map}
      >
        <ClickToPlace onPlace={placeAt} />
        <FollowValue value={value} />
        {value && <DraggablePin value={value} onMove={placeAt} />}
      </BaseMap>

      <div className={styles.footer}>
        <span className={styles.status} role="status">
          {locating
            ? 'Recherche de l’adresse…'
            : (message ??
              (value
                ? `Position : ${value.latitude.toFixed(5)}, ${value.longitude.toFixed(5)} — glissez le repère pour l’ajuster`
                : 'Cliquez sur la carte pour placer le restaurant'))}
        </span>
        {value && (
          <button type="button" className={styles.clear} onClick={() => onChange(null)}>
            <Trash size={13} /> Retirer
          </button>
        )}
      </div>
    </div>
  )
}

function ClickToPlace({ onPlace }: { onPlace: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPlace(e.latlng.lat, e.latlng.lng) })
  return null
}

/** Re-centre when the value comes from the search box */
function FollowValue({ value }: { value: Coords | null }) {
  const map = useMap()
  useEffect(() => {
    if (!value) return
    if (!map.getBounds().pad(-0.2).contains([value.latitude, value.longitude])) {
      map.flyTo([value.latitude, value.longitude], Math.max(map.getZoom(), 16), { duration: 0.8 })
    }
  }, [map, value])
  return null
}

function DraggablePin({ value, onMove }: { value: Coords; onMove: (lat: number, lng: number) => void }) {
  const marker = useRef<L.Marker>(null)
  const icon = useMemo(() => pinIcon('DN', true), [])
  return (
    <Marker
      ref={marker}
      position={[value.latitude, value.longitude]}
      icon={icon}
      draggable
      eventHandlers={{
        dragend: () => {
          const pos = marker.current?.getLatLng()
          if (pos) onMove(pos.lat, pos.lng)
        },
      }}
    />
  )
}
