import { useState } from 'react'
import type { Reclamation, Statut } from '../../types'
import { formatDate, STATUT_LABELS, STATUTS } from '../../utils/format'
import { EmptyState } from './Panel'
import styles from './ReclamationList.module.css'
import { StatusBadge } from './StatusBadge'

interface ReclamationListProps {
  items: Reclamation[]
  onStatutChange?: (id: number, statut: Statut) => void
  compact?: boolean
}

function displayName(r: Reclamation) {
  const name = [r.prenom, r.nom].filter(Boolean).join(' ')
  return name || 'Client anonyme'
}

export function ReclamationList({ items, onStatutChange, compact }: ReclamationListProps) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (items.length === 0) return <EmptyState>Aucune réclamation pour le moment.</EmptyState>

  return (
    <ul className={styles.list}>
      {items.map((r) => {
        const open = openId === r.id
        return (
          <li key={r.id} className={`${styles.item} ${open ? styles.open : ''}`}>
            <button
              className={styles.summary}
              onClick={() => setOpenId(open ? null : r.id)}
              aria-expanded={open}
            >
              <span className={styles.avatar}>{displayName(r).charAt(0).toUpperCase()}</span>
              <span className={styles.who}>
                <strong>{displayName(r)}</strong>
                <span>{r.email}</span>
              </span>
              {!compact && <span className={styles.place}>{r.pointDeVente.nom}</span>}
              <span className={styles.date}>{formatDate(r.createdAt)}</span>
              {!onStatutChange && <StatusBadge statut={r.statut} />}
            </button>

            {onStatutChange && (
              <select
                className={`${styles.statut} ${styles[r.statut]}`}
                value={r.statut}
                onChange={(e) => onStatutChange(r.id, e.target.value as Statut)}
                aria-label={`Statut de la réclamation de ${displayName(r)}`}
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {STATUT_LABELS[s]}
                  </option>
                ))}
              </select>
            )}

            {open && (
              <div className={styles.details}>
                <p className={styles.message}>{r.message}</p>
                <dl className={styles.meta}>
                  <div>
                    <dt>Restaurant</dt>
                    <dd>{r.pointDeVente.nom}</dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>{r.email}</dd>
                  </div>
                  {r.telephone && (
                    <div>
                      <dt>Téléphone</dt>
                      <dd>{r.telephone}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
