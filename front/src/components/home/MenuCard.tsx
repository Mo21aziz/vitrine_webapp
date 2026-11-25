import { Link } from 'react-router-dom'
import { mediaUrl } from '../../api/client'
import type { Article } from '../../types'
import { formatPrix } from '../../utils/format'
import styles from './MenuCard.module.css'

export function MenuCard({ article, index }: { article: Article; index: number }) {
  const onSale = article.remise > 0
  const economie = Math.round((article.prix - article.prixFinal) * 1000) / 1000
  const deal = onSale && (
    <span className={styles.deal}>
      <small>Promo</small>-{article.remise}%
    </span>
  )

  return (
    <Link
      to={`/plat/${article.id}`}
      className={`${styles.card} ${article.imageUrl ? styles.withPhoto : ''} ${onSale ? styles.onSale : ''}`}
      aria-label={`${article.nom}, ${formatPrix(article.prixFinal)} — voir le détail`}
    >
      {article.imageUrl ? (
        <div className={styles.photo}>
          <img src={mediaUrl(article.imageUrl)} alt={article.nom} loading="lazy" />
          <span className={styles.photoIndex}>{String(index + 1).padStart(2, '0')}</span>
          {deal}
        </div>
      ) : (
        <header className={styles.top}>
          <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
          {deal}
        </header>
      )}

      <h3 className={styles.name}>{article.nom}</h3>
      <p className={styles.composition}>{article.composition}</p>

      <footer className={styles.price}>
        <span className={styles.dots} aria-hidden="true" />
        {onSale && (
          <s>
            <span className="sr-only">Prix initial </span>
            {formatPrix(article.prix)}
          </s>
        )}
        <strong>{formatPrix(article.prixFinal)}</strong>
      </footer>
      {onSale && <p className={styles.saving}>Vous économisez {formatPrix(economie)}</p>}
    </Link>
  )
}
