import type { ReactNode } from 'react'
import styles from './StatCard.module.css'

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: string
  icon: ReactNode
  highlight?: boolean
}

export function StatCard({ label, value, hint, icon, highlight }: StatCardProps) {
  return (
    <div className={`${styles.card} ${highlight ? styles.highlight : ''}`}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
