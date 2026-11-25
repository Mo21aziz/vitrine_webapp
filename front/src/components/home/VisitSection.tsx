import { Suspense, useState, type ReactNode } from 'react'
import type { PointDeVente } from '../../types'
import { lazyWithRetry } from '../../utils/lazy'
import { ALL_RESTAURANTS_MAPS_URL, directionsUrl, hasCoords } from '../../utils/maps'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { ArrowUpRight, Phone, Pin } from '../ui/Icons'
import { SectionHeading } from './SectionHeading'
import styles from './VisitSection.module.css'

// Leaflet is ~150 kB: only loaded the first time a visitor opens a map
const PlaceMap = lazyWithRetry(() => import('../map/PlaceMap').then((m) => ({ default: m.PlaceMap })))
const LocationsMap = lazyWithRetry(() => import('../map/LocationsMap').then((m) => ({ default: m.LocationsMap })))

/** "+216 71 000 000" → "tel:+21671000000" */
function telHref(phone: string) {
  return 'tel:' + phone.replace(/[^+0-9]/g, '')
}

type Open = number | null

/** Loads a map lazily; if it cannot load, shows a Google Maps link instead of breaking the page */
function MapSlot({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <a className={styles.mapError} href={ALL_RESTAURANTS_MAPS_URL} target="_blank" rel="noreferrer">
          Carte indisponible pour le moment — ouvrir Google Maps <ArrowUpRight size={13} />
        </a>
      }
    >
      <Suspense fallback={<div className={styles.mapFallback} />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export function VisitSection({ pointsDeVente }: { pointsDeVente?: PointDeVente[] }) {
  const points = pointsDeVente ?? []
  const [openId, setOpenId] = useState<Open>(null)
  // maps stay mounted after their first opening so closing can animate smoothly
  const [mounted, setMounted] = useState<Exclude<Open, null>[]>([])
  const placedCount = points.filter(hasCoords).length

  function toggle(id: Exclude<Open, null>) {
    setOpenId((current) => (current === id ? null : id))
    setMounted((list) => (list.includes(id) ? list : [...list, id]))
  }

  return (
    <section className={`${styles.section} texture`}>
      <div className={`container ${styles.inner}`}>
        <div id="adresses" className={styles.locations}>
          <SectionHeading
            align="left"
            eyebrow="Venite a trovarci"
            title={
              <>
                Une table vous <em>attend.</em>
              </>
            }
            intro="Sur place ou à emporter, retrouvez Di Napoli dans nos restaurants. Touchez une adresse pour l’itinéraire, ou le repère pour voir la carte."
          />

          {points.length > 0 && (
            <div className={styles.toolbar} data-reveal>
              {placedCount > 1 && (
                <span className={styles.toolBadge}>
                  <Pin size={16} />
                  Nos {placedCount} restaurants sur la carte
                </span>
              )}
              <a href={ALL_RESTAURANTS_MAPS_URL} target="_blank" rel="noreferrer" className={styles.toolLink}>
                Itinéraire · Google Maps <ArrowUpRight size={14} />
                <span className="sr-only"> (liste de tous nos restaurants dans Google Maps)</span>
              </a>
            </div>
          )}

          {/* map of all restaurants, always visible (Leaflet still loads lazily, after the page) */}
          {placedCount > 1 && (
            <div id="carte-tous" className={styles.allMap} data-reveal>
              <MapSlot>
                <LocationsMap points={points} />
              </MapSlot>
            </div>
          )}

          <ul className={styles.list} data-reveal>
            {points.map((p, i) => {
              const label = String(i + 1).padStart(2, '0')
              const url = directionsUrl(p)
              const open = openId === p.id
              const drawerId = `carte-${p.id}`

              return (
                <li key={p.id} className={`${styles.item} ${open ? styles.open : ''}`}>
                  <div className={styles.place}>
                    <span className={styles.placeIndex}>{label}</span>
                    <div className={styles.placeBody}>
                      <h3>{p.nom}</h3>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" className={styles.address}>
                          {p.adresse ?? 'Voir l’emplacement'}
                          <ArrowUpRight size={13} />
                          <span className="sr-only"> (itinéraire dans une application de cartes)</span>
                        </a>
                      ) : (
                        <p className={styles.noAddress}>Adresse bientôt disponible</p>
                      )}
                      {p.telephone && (
                        <a href={telHref(p.telephone)} className={styles.phone}>
                          <span className={styles.phoneIcon} aria-hidden="true">
                            <Phone size={14} />
                          </span>
                          <span className="sr-only">Appeler {p.nom} au </span>
                          <span>{p.telephone}</span>
                        </a>
                      )}
                    </div>
                    {hasCoords(p) ? (
                      <button
                        type="button"
                        className={styles.locate}
                        onClick={() => toggle(p.id)}
                        aria-expanded={open}
                        aria-controls={drawerId}
                        title={open ? 'Masquer la carte' : 'Voir la carte'}
                      >
                        <Pin size={20} />
                        <span className="sr-only">
                          {open ? 'Masquer' : 'Voir'} la carte de {p.nom}
                        </span>
                      </button>
                    ) : (
                      <Pin size={20} className={styles.pin} />
                    )}
                  </div>

                  {hasCoords(p) && (
                    <div id={drawerId} className={styles.drawer} aria-hidden={!open} inert={!open}>
                      <div className={styles.drawerInner}>
                        {mounted.includes(p.id) && (
                          <MapSlot>
                            <PlaceMap point={p} label={label} />
                          </MapSlot>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
            {!pointsDeVente && <li className={styles.placeholder}>Chargement des adresses…</li>}
          </ul>
        </div>
      </div>
    </section>
  )
}
