import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

interface LogoProps {
  to?: string
  tagline?: string
  /** light = for red/green backgrounds, dark = for white backgrounds */
  variant?: 'light' | 'dark'
}

export function Logo({ to = '/', tagline = 'Since 1987', variant = 'light' }: LogoProps) {
  return (
    <Link to={to} className={`${styles.logo} ${styles[variant]}`} aria-label="Di Napoli — accueil">
      <span className={styles.word}>
        <span className={styles.di}>Di</span>Napoli
      </span>
      {tagline && <span className={styles.tagline}>{tagline}</span>}
    </Link>
  )
}
