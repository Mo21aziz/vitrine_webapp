import L from 'leaflet'
import styles from './Map.module.css'

/** Brand pin (pure HTML/CSS, so no marker image files to ship). `label` must be plain text. */
export function pinIcon(label: string, active = false) {
  const safe = label.replace(/[^\w\s-]/g, '')
  return L.divIcon({
    className: '',
    html: `<span class="${styles.pin} ${active ? styles.pinActive : ''}"><span>${safe}</span></span>`,
    iconSize: [44, 54],
    iconAnchor: [22, 52],
    popupAnchor: [0, -46],
  })
}
