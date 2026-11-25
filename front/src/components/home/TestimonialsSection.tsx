import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { mediaUrl } from '../../api/client'
import type { AvisRecents } from '../../types'
import { ArrowUpRight } from '../ui/Icons'
import { Stars } from '../ui/Stars'
import styles from './TestimonialsSection.module.css'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

/** Real reviews published by the admin. Before the first one, an invitation to leave a review. */
export function TestimonialsSection({ data }: { data?: AvisRecents }) {
  if (!data) return <section id="avis" className={styles.placeholder} aria-hidden="true" />

  if (data.avis.length === 0 || data.moyenne === null) {
    return (
      <section id="avis" className={styles.section} aria-labelledby="avis-home">
        <div className={`container ${styles.empty}`} data-reveal>
          <p className={`eyebrow ${styles.eyebrow}`}>Satisfaction client</p>
          <h2 id="avis-home" className={styles.title}>
            Ils en <em>parlent.</em>
          </h2>
          <p className={styles.emptyText}>
            Vous avez goûté l’un de nos plats ? Choisissez-le dans la carte et laissez le premier avis.
          </p>
          <a href="#carte" className={styles.emptyLink}>
            Voir la carte <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
    )
  }

  return (
    <section id="avis" className={styles.section} aria-labelledby="avis-home">
      <div className="container">
        <header className={styles.head} data-reveal>
          <div>
            <p className={`eyebrow ${styles.eyebrow}`}>Satisfaction client</p>
            <h2 id="avis-home" className={styles.title}>
              Ils en <em>parlent.</em>
            </h2>
          </div>
          <div className={styles.score}>
            <strong>{data.moyenne.toLocaleString('fr-FR')}</strong>
            <div>
              <Stars value={data.moyenne} size={20} />
              <span className={styles.scoreLabel}>
                Moyenne de {data.total} avis {data.total > 1 ? 'clients' : 'client'}
              </span>
            </div>
          </div>
        </header>

        <ul className={styles.grid}>
          {data.avis.map((a, i) => (
            <li key={a.id} data-reveal style={{ '--reveal-delay': `${(i % 3) * 100}ms` } as CSSProperties}>
              <figure className={styles.card}>
                <Stars value={a.note} size={16} />
                <blockquote className={styles.quote}>“{a.commentaire}”</blockquote>
                <figcaption className={styles.meta}>
                  <span className={styles.avatar} aria-hidden="true">
                    {a.nom.charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.who}>
                    <strong>{a.nom}</strong>
                    <time dateTime={a.createdAt}>{dateFormatter.format(new Date(a.createdAt))}</time>
                  </span>
                  <Link to={`/plat/${a.article.id}`} className={styles.dish}>
                    {a.article.imageUrl && <img src={mediaUrl(a.article.imageUrl)} alt="" loading="lazy" />}
                    <span>{a.article.nom}</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
