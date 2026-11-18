import { useCallback, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mediaUrl } from '../api/client'
import { publicApi } from '../api/public'
import { AvisSection } from '../components/home/AvisSection'
import { MenuCard } from '../components/home/MenuCard'
import { RotatingBadge } from '../components/home/RotatingBadge'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { ButtonLink } from '../components/ui/Button'
import { ArrowUpRight, ImageIcon, Pin } from '../components/ui/Icons'
import { useAsync } from '../hooks/useAsync'
import type { ArticleDetail } from '../types'
import { formatPrix } from '../utils/format'
import styles from './ArticlePage.module.css'

/** "Tomate, mozzarella et basilic" → ["Tomate", "mozzarella", "basilic"] */
function ingredients(composition: string) {
  return composition
    .split(/,|;|\n|\s+et\s+|\s*\+\s*/i)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter(Boolean)
}

/** /plat/:id — remounts per dish so prev/next navigation starts clean */
export function ArticlePage() {
  const { id } = useParams()
  return <ArticlePageContent key={id} id={Number(id)} />
}

function ArticlePageContent({ id }: { id: number }) {
  const load = useCallback(() => publicApi.article(id), [id])
  const { data, error } = useAsync(load)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (data) document.title = `${data.nom} — ${data.menu.nom} · Di Napoli`
    return () => {
      document.title = 'Di Napoli — Pizzeria · Cucina · Famiglia'
    }
  }, [data])

  return (
    <>
      <Navbar current="carte" />
      <main>
        {error && !data ? <NotFound message={error} /> : data ? <Detail article={data} /> : <Loading />}
      </main>
      <Footer />
    </>
  )
}

function Detail({ article }: { article: ArticleDetail }) {
  const list = ingredients(article.composition)
  const economie = Math.round((article.prix - article.prixFinal) * 1000) / 1000
  const numero = String(article.position.index).padStart(2, '0')

  return (
    <>
      <section className={`${styles.hero} texture`}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.info}>
            <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
              <a href="/#carte">La carte</a>
              <span aria-hidden="true">/</span>
              <Link to={`/carte/${article.menu.id}`}>{article.menu.nom}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{article.nom}</span>
            </nav>

            <p className={styles.kicker}>
              <span className={styles.numero}>N° {numero}</span>
              {article.menu.nom} · {article.position.index} sur {article.position.total}
            </p>
            <h1 className={styles.title}>{article.nom}</h1>
            <p className={styles.lead}>{article.composition}</p>

            <div className={styles.priceCard}>
              <div>
                <span className={styles.priceLabel}>Prix</span>
                <div className={styles.priceRow}>
                  <strong className={styles.price}>{formatPrix(article.prixFinal)}</strong>
                  {article.remise > 0 && (
                    <s className={styles.oldPrice}>
                      <span className="sr-only">au lieu de </span>
                      {formatPrix(article.prix)}
                    </s>
                  )}
                </div>
                {article.remise > 0 && (
                  <span className={styles.saving}>Vous économisez {formatPrix(economie)}</span>
                )}
              </div>
              {article.remise > 0 && <span className={styles.deal}>-{article.remise}%</span>}
            </div>

            <div className={styles.actions}>
              <ButtonLink href="/#adresses" variant="light" size="lg" icon={<Pin size={16} />}>
                Venir le déguster
              </ButtonLink>
              <Link to={`/carte/${article.menu.id}`} className={styles.backLink}>
                ← Tout le menu {article.menu.nom}
              </Link>
            </div>
          </div>

          <figure className={styles.visual}>
            {article.imageUrl ? (
              <img src={mediaUrl(article.imageUrl)} alt={`${article.nom} — ${article.composition}`} />
            ) : (
              <div className={styles.noPhoto} aria-hidden="true">
                <ImageIcon size={40} />
                <span>{article.nom}</span>
              </div>
            )}
            <div className={styles.badge}>
              <RotatingBadge />
            </div>
          </figure>
        </div>
      </section>

      <section className={styles.details}>
        <div className={`container ${styles.detailsGrid}`}>
          <div className={styles.block}>
            <p className="eyebrow">Ingredienti</p>
            <h2 className={styles.blockTitle}>
              Ce qu’il y a <em>dedans.</em>
            </h2>
            <ul className={styles.chips}>
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <aside className={styles.note}>
            <h2>Allergies ou envie particulière ?</h2>
            <p>
              Nos plats sont préparés à la commande. Signalez toute allergie ou intolérance à notre équipe : nous vous
              indiquerons ce qu’il est possible d’adapter.
            </p>
            <a href="/#contact" className={styles.noteLink}>
              Nous écrire <ArrowUpRight size={14} />
            </a>
          </aside>
        </div>

        {(article.precedent || article.suivant) && (
          <nav className={`container ${styles.pager}`} aria-label={`Autres plats du menu ${article.menu.nom}`}>
            {article.precedent ? (
              <Link to={`/plat/${article.precedent.id}`} className={styles.pagerLink}>
                <small>← Précédent</small>
                <span>{article.precedent.nom}</span>
              </Link>
            ) : (
              <span />
            )}
            {article.suivant && (
              <Link to={`/plat/${article.suivant.id}`} className={`${styles.pagerLink} ${styles.next}`}>
                <small>Suivant →</small>
                <span>{article.suivant.nom}</span>
              </Link>
            )}
          </nav>
        )}
      </section>

      <AvisSection articleId={article.id} articleNom={article.nom} />

      {article.autres.length > 0 && (
        <section className={styles.more}>
          <div className="container">
            <div className={styles.moreHead}>
              <h2>
                Dans le même menu, <em>aussi.</em>
              </h2>
              <Link to={`/carte/${article.menu.id}`} className={styles.moreLink}>
                Voir tout <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className={styles.moreGrid}>
              {article.autres.map((a, i) => (
                <MenuCard key={a.id} article={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function Loading() {
  return (
    <section className={`${styles.hero} texture`} aria-busy="true">
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.info}>
          <span className={styles.skeletonLine} style={{ width: '30%' }} />
          <span className={styles.skeletonTitle} />
          <span className={styles.skeletonLine} style={{ width: '70%' }} />
        </div>
        <div className={`${styles.visual} ${styles.skeletonVisual}`} />
      </div>
    </section>
  )
}

function NotFound({ message }: { message: string }) {
  return (
    <section className={`${styles.hero} texture`}>
      <div className="container">
        <h1 className={styles.title}>
          Plat <em>introuvable.</em>
        </h1>
        <p className={styles.lead}>{message}</p>
        <a href="/#carte" className={styles.backLink}>
          ← Retour à la carte
        </a>
      </div>
    </section>
  )
}
