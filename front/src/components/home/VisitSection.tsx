import { lazy, Suspense, useState } from 'react'
import type { PointDeVente } from '../../types'
import { directionsUrl, hasCoords } from '../../utils/maps'
import { ArrowUpRight, Pin } from '../ui/Icons'
import { ReclamationForm } from './ReclamationForm'
import { SectionHeading } from './SectionHeading'
import styles from './VisitSection.module.css'

// Leaflet is ~150 kB: only loaded the first time a visitor opens a map
const PlaceMap = lazy(() => import('../map/PlaceMap').then((m) => ({ default: m.PlaceMap })))

export function VisitSection({ pointsDeVente }: { pointsDeVente?: PointDeVente[] }) {
  const points = pointsDeVente ?? []
  const [openId, setOpenId] = useState<number | null>(null)
  // maps stay mounted after their first opening so closing can animate smoothly
  const [mounted, setMounted] = useState<number[]>([])

  function toggle(id: number) {
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

          <ul className={styles.list}>
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
                          <Suspense fallback={<div className={styles.mapFallback} />}>
                            <PlaceMap point={p} label={label} />
                          </Suspense>
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

        <div id="contact" className={styles.card}>
          <p className="eyebrow">Parlons-en</p>
          <h3 className={styles.cardTitle}>Une remarque, un souci ?</h3>
          <p className={styles.cardIntro}>
            Votre avis compte. Écrivez-nous et l’équipe du restaurant concerné vous répondra rapidement.
          </p>
          <ReclamationForm pointsDeVente={points} />
        </div>
      </div>
    </section>
  )
}
