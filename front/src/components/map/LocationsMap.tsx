import L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import type { PointDeVente } from '../../types'
import { DEFAULT_CENTER, directionsUrl, hasCoords } from '../../utils/maps'
import { ArrowUpRight } from '../ui/Icons'
import { BaseMap } from './BaseMap'
import { pinIcon } from './pin'
import styles from './LocationsMap.module.css'

type Placed = PointDeVente & { latitude: number; longitude: number }

interface LocationsMapProps {
  points: PointDeVente[]
  selectedId?: number | null
  onSelect?: (id: number) => void
}

/** All restaurants on one map: framed to fit every pin, each pin opens a card with directions. */
export function LocationsMap({ points, selectedId = null, onSelect }: LocationsMapProps) {
  const placed = useMemo(() => points.filter(hasCoords), [points])
  const first = placed[0]

  return (
    <BaseMap
      label="Carte de tous nos restaurants"
      center={first ? [first.latitude, first.longitude] : DEFAULT_CENTER}
      zoom={10}
      className={styles.frame}
    >
      <FitAll points={placed} />
      {placed.map((p) => (
        <PlaceMarker
          key={p.id}
          point={p}
          label={String(points.indexOf(p) + 1).padStart(2, '0')}
          active={p.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </BaseMap>
  )
}

function PlaceMarker({
  point,
  label,
  active,
  onSelect,
}: {
  point: Placed
  label: string
  active: boolean
  onSelect?: (id: number) => void
}) {
  const marker = useRef<L.Marker>(null)
  const icon = useMemo(() => pinIcon(label, active), [label, active])
  const directions = directionsUrl(point)

  useEffect(() => {
    if (active) marker.current?.openPopup()
  }, [active])

  return (
    <Marker
      ref={marker}
      position={[point.latitude, point.longitude]}
      icon={icon}
      title={point.nom}
      eventHandlers={{ click: () => onSelect?.(point.id) }}
    >
      <Popup>
        <strong className={styles.popupTitle}>{point.nom}</strong>
        {point.adresse && <span className={styles.popupAddress}>{point.adresse}</span>}
        {directions && (
          <a href={directions} target="_blank" rel="noreferrer" className={styles.popupLink}>
            Itinéraire <ArrowUpRight size={13} />
          </a>
        )}
      </Popup>
    </Marker>
  )
}

/** Frame every restaurant (Tunis area + Bizerte) when the map opens */
function FitAll({ points }: { points: Placed[] }) {
  const map = useMap()
  const key = points.map((p) => `${p.latitude},${p.longitude}`).join('|')

  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 15)
      return
    }
    map.fitBounds(L.latLngBounds(points.map((p) => [p.latitude, p.longitude])), { padding: [48, 48], maxZoom: 14 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key])

  return null
}
