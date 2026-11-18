import type { ReactNode } from 'react'
import styles from './Panel.module.css'

interface PanelProps {
  title?: string
  icon?: ReactNode
  action?: ReactNode
  tone?: 'light' | 'red' | 'glass'
  className?: string
  children: ReactNode
}

export function Panel({ title, icon, action, tone = 'light', className, children }: PanelProps) {
  return (
    <section className={[styles.panel, styles[tone], className].filter(Boolean).join(' ')}>
      {(title || action) && (
        <header className={styles.header}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {title && <h2 className={styles.title}>{title}</h2>}
          {action && <div className={styles.action}>{action}</div>}
        </header>
      )}
      {children}
    </section>
  )
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className={styles.errorState} role="alert">
      <span>{message}</span>
      {onRetry && <button onClick={onRetry}>Réessayer</button>}
    </div>
  )
}
