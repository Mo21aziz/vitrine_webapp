import { useMemo } from 'react'
import { Marker } from 'react-leaflet'
import type { PointDeVente } from '../../types'
import { directionsUrl } from '../../utils/maps'
import { ArrowUpRight } from '../ui/Icons'
import { BaseMap } from './BaseMap'
import { pinIcon } from './pin'
import styles from './PlaceMap.module.css'

/** Map of a single restaurant, shown when its card is expanded */
export function PlaceMap({ point, label }: { point: PointDeVente & { latitude: number; longitude: number }; label: string }) {
  const icon = useMemo(() => pinIcon(label, true), [label])
  const directions = directionsUrl(point)

  return (
    <div className={styles.wrap}>
      <BaseMap label={`Carte : ${point.nom}`} center={[point.latitude, point.longitude]} zoom={16} className={styles.frame}>
        <Marker position={[point.latitude, point.longitude]} icon={icon} title={point.nom} />
      </BaseMap>
      {directions && (
        <a href={directions} target="_blank" rel="noreferrer" className={styles.directions}>
          Itinéraire <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  )
}
