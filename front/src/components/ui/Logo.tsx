import { Link } from 'react-router-dom'
import logoSrc from '../../assets/logo-dinapoli.png'
import styles from './Logo.module.css'

interface LogoProps {
  to?: string
  /** small label shown next to the logo (e.g. "Dashboard") */
  tagline?: string
  /** light = on red/green backgrounds (logo sits on a white card), dark = on white backgrounds */
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

/** The official Di Napoli logo (green "Di", red "Napoli", Italian stripe, "Since 1987") */
export function Logo({ to = '/', tagline, variant = 'light', size = 'md' }: LogoProps) {
  return (
    <Link to={to} className={`${styles.logo} ${styles[variant]} ${styles[size]}`} aria-label="Di Napoli — accueil">
      <span className={styles.mark}>
        <img src={logoSrc} alt="Di Napoli — since 1987" width={1000} height={313} />
      </span>
      {tagline && <span className={styles.tagline}>{tagline}</span>}
    </Link>
  )
}
