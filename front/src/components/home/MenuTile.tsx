import { Link } from 'react-router-dom'
import { mediaUrl } from '../../api/client'
import type { Menu } from '../../types'
import { ArrowUpRight } from '../ui/Icons'
import styles from './MenuTile.module.css'

export function MenuTile({ menu, index }: { menu: Menu; index: number }) {
  return (
    <Link to={`/carte/${menu.id}`} className={`${styles.tile} ${menu.imageUrl ? styles.withPhoto : ''}`}>
      {menu.imageUrl && (
        <>
          <img src={mediaUrl(menu.imageUrl)} alt="" className={styles.photo} loading="lazy" />
          <span className={styles.shade} aria-hidden="true" />
        </>
      )}
      <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
      <h3 className={styles.name}>{menu.nom}</h3>
      {menu.description && <p className={styles.description}>{menu.description}</p>}
      <span className={styles.footer}>
        <span>
          {menu.nbArticles} {menu.nbArticles > 1 ? 'plats' : 'plat'}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </span>
    </Link>
  )
}
