import type { Menu } from '../../types'
import styles from './MenuSection.module.css'
import { MenuTile } from './MenuTile'
import { SectionHeading } from './SectionHeading'

interface MenuSectionProps {
  menus?: Menu[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

export function MenuSection({ menus, loading, error, onRetry }: MenuSectionProps) {
  return (
    <section id="carte" className={styles.section}>
      <div className="container">
        <SectionHeading
          tone="onLight"
          eyebrow="Il menu"
          title={
            <>
              Les classiques, <em>sans détour.</em>
            </>
          }
          intro="Choisissez une catégorie pour découvrir nos plats : une pâte qui prend son temps, des produits choisis avec soin et le feu du four à bois."
        />

        {loading && !menus && (
          <div className={styles.grid} aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {error && !menus && (
          <div className={styles.state}>
            <p>{error}</p>
            <button onClick={onRetry}>Réessayer</button>
          </div>
        )}

        {menus && menus.length === 0 && (
          <div className={styles.state}>
            <p>La carte arrive bientôt. Revenez nous voir !</p>
          </div>
        )}

        {menus && menus.length > 0 && (
          <div className={styles.grid}>
            {menus.map((menu, i) => (
              <div key={menu.id} className={styles.cell} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                <MenuTile menu={menu} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
