import type { Statut } from '../../types'
import { STATUT_LABELS } from '../../utils/format'
import styles from './StatusBadge.module.css'

export function StatusBadge({ statut }: { statut: Statut }) {
  return <span className={`${styles.badge} ${styles[statut]}`}>{STATUT_LABELS[statut]}</span>
}
