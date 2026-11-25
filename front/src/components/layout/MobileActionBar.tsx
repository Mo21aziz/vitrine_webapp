import { useEffect, useState } from 'react'
import type { PointDeVente } from '../../types'
import { ALL_RESTAURANTS_MAPS_URL, directionsUrl } from '../../utils/maps'
import { ArrowUpRight, Pin } from '../ui/Icons'
import styles from './MobileActionBar.module.css'

/**
 * Phone-only bar pinned to the bottom of the screen once the visitor scrolls past the hero:
 * the two things people look for on a restaurant site — the menu and how to get there.
 */
export function MobileActionBar({ points }: { points?: PointDeVente[] }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // one restaurant → directions to it; several → Google Maps lists them all and the visitor picks one
  const only = points?.length === 1 ? points[0] : undefined
  const directions = only ? directionsUrl(only) : points && points.length > 1 ? ALL_RESTAURANTS_MAPS_URL : null

  return (
    <nav className={`${styles.bar} ${visible ? styles.visible : ''}`} aria-label="Accès rapide" aria-hidden={!visible}>
      <a href="/#carte" className={styles.menu} tabIndex={visible ? 0 : -1}>
        La carte <ArrowUpRight size={14} />
      </a>
      {directions ? (
        <a href={directions} target="_blank" rel="noreferrer" className={styles.go} tabIndex={visible ? 0 : -1}>
          <Pin size={15} /> Itinéraire
        </a>
      ) : (
        <a href="/#adresses" className={styles.go} tabIndex={visible ? 0 : -1}>
          <Pin size={15} /> Nous trouver
        </a>
      )}
    </nav>
  )
}
