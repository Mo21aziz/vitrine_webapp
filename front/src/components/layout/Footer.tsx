import { Logo } from '../ui/Logo'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p>Pizzeria · Cucina · Famiglia</p>
        </div>

        <nav className={styles.links} aria-label="Pied de page">
          <a href="/#carte">La carte</a>
          <a href="/#histoire">Notre histoire</a>
          <a href="/#adresses">Nos adresses</a>
          <a href="/#contact">Contact</a>
        </nav>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Di Napoli. Tous droits réservés.</span>
          <span>Fatto con amore</span>
        </div>
      </div>
    </footer>
  )
}
