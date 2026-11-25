import { useEffect, useState } from 'react'
import { PHONE_DISPLAY, PHONE_HREF } from '../../utils/contact'
import { ArrowUpRight, Phone } from '../ui/Icons'
import { Logo } from '../ui/Logo'
import styles from './Navbar.module.css'

// "/#id" works from the home page (smooth scroll) and from other pages (navigates home)
const NAV_LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'carte', label: 'La carte' },
  { id: 'avis', label: 'Satisfaction client' },
  { id: 'histoire', label: 'Notre histoire' },
  { id: 'adresses', label: 'Nos adresses' },
  { id: 'reclamation', label: 'Réclamation' },
  { id: 'contact', label: 'Contact' },
]

interface NavbarProps {
  /** Force the highlighted link on pages that are not the home page */
  current?: string
}

export function Navbar({ current }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [inView, setInView] = useState('accueil')
  const active = current ?? inView

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view (home page only)
  useEffect(() => {
    if (current) return
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setInView(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [current])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Logo variant="dark" />

        <nav className={`${styles.pill} ${open ? styles.open : ''}`} aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              className={active === link.id ? styles.active : undefined}
              aria-current={active === link.id ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={PHONE_HREF} className={styles.phone}>
            <span className={styles.phoneIcon} aria-hidden="true">
              <Phone size={14} />
            </span>
            <span className="sr-only">Appeler Di Napoli au </span>
            <span className={styles.phoneNumber}>{PHONE_DISPLAY}</span>
          </a>
          <a href="/#adresses" className={styles.cta}>
            Nous trouver <ArrowUpRight size={15} />
          </a>
          <button
            className={styles.burger}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
