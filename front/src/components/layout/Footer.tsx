import type { CSSProperties, ReactNode } from 'react'
import { ALL_RESTAURANTS_MAPS_URL } from '../../utils/maps'
import { ArrowUpRight, Facebook, Instagram, Pencil, Pin, TikTok } from '../ui/Icons'
import { Logo } from '../ui/Logo'
import styles from './Footer.module.css'

interface Social {
  name: string
  handle: string
  href: string
  icon: ReactNode
  /** brand colour used on hover */
  color: string
}

const SOCIALS: Social[] = [
  {
    name: 'Instagram',
    handle: '@dinapoli__pizza',
    href: 'https://www.instagram.com/dinapoli__pizza/',
    icon: <Instagram size={20} />,
    color: 'linear-gradient(45deg, #f9a03f 0%, #e1306c 45%, #833ab4 100%)',
  },
  {
    name: 'Facebook',
    handle: 'Dinapolitunisie',
    href: 'https://www.facebook.com/Dinapolitunisie',
    icon: <Facebook size={20} />,
    color: '#1877f2',
  },
  {
    name: 'TikTok',
    handle: '@dinapoli1987',
    href: 'https://www.tiktok.com/@dinapoli1987',
    icon: <TikTok size={19} />,
    color: '#111111',
  },
]

const NAV = [
  { href: '/#carte', label: 'La carte' },
  { href: '/#avis', label: 'Satisfaction client' },
  { href: '/#histoire', label: 'Notre histoire' },
  { href: '/#adresses', label: 'Nos adresses' },
  { href: '/#reclamation', label: 'Réclamation' },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.flag} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>Pizzeria · Cucina · Famiglia</p>
          <p className={styles.about}>
            Une pizzeria de famille depuis 1987 : des pizzas faites à la main, servies avec le sourire dans nos
            restaurants en Tunisie.
          </p>
          <div className={styles.socialIcons}>
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialIcon}
                style={{ '--brand': s.color } as CSSProperties}
                aria-label={`${s.name} — ${s.handle}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className={styles.col} aria-label="Pied de page">
          <h2 className={styles.colTitle}>Explorer</h2>
          <ul>
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={styles.navLink}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>Contact</h2>
          <ul className={styles.contact}>
            <li>
              <a href="/#reclamation" className={styles.contactLink}>
                <span className={styles.contactIcon}>
                  <Pencil size={15} />
                </span>
                <span>
                  <strong>Nous écrire</strong>
                  <small>Une question, une réclamation</small>
                </span>
              </a>
            </li>
            <li>
              <a href="/#adresses" className={styles.contactLink}>
                <span className={styles.contactIcon}>
                  <Pin size={15} />
                </span>
                <span>
                  <strong>Nos restaurants</strong>
                  <small>Adresses et téléphones</small>
                </span>
              </a>
            </li>
            <li>
              <a href={ALL_RESTAURANTS_MAPS_URL} target="_blank" rel="noreferrer" className={styles.contactLink}>
                <span className={styles.contactIcon}>
                  <ArrowUpRight size={15} />
                </span>
                <span>
                  <strong>Itinéraire</strong>
                  <small>Ouvrir dans Google Maps</small>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>Suivez-nous</h2>
          <ul className={styles.socials}>
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialCard}
                  style={{ '--brand': s.color } as CSSProperties}
                >
                  <span className={styles.socialBadge}>{s.icon}</span>
                  <span className={styles.socialText}>
                    <strong>{s.name}</strong>
                    <small>{s.handle}</small>
                  </span>
                  <ArrowUpRight size={15} className={styles.socialArrow} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Di Napoli. Tous droits réservés.</span>
          <span className={styles.love}>
            Fatto con amore <span aria-hidden="true">♥</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
