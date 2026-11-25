import { useCallback, useEffect } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { publicApi } from '../api/public'
import { MenuCard } from '../components/home/MenuCard'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { useAsync } from '../hooks/useAsync'
import styles from './MenuPage.module.css'

/** /carte/:id — remounts per menu so data never leaks between menus */
export function MenuPage() {
  const { id } = useParams()
  return <MenuPageContent key={id} id={Number(id)} />
}

function MenuPageContent({ id }: { id: number }) {
  const loadMenu = useCallback(() => publicApi.menu(id), [id])
  const menu = useAsync(loadMenu)
  const menus = useAsync(publicApi.menus)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (menu.data) document.title = `${menu.data.nom} — Di Napoli`
    return () => {
      document.title = 'Di Napoli — Pizzeria · Cucina · Famiglia'
    }
  }, [menu.data])

  const data = menu.data

  return (
    <>
      <Navbar current="carte" />
      <main>
        <section className={`${styles.hero} texture`}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
              <a href="/#carte">La carte</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{data?.nom ?? '…'}</span>
            </nav>

            {menu.error && !data ? (
              <>
                <h1 className={styles.title}>
                  Menu <em>introuvable.</em>
                </h1>
                <p className={styles.lead}>{menu.error}</p>
                <a href="/#carte" className={styles.back}>
                  ← Retour à la carte
                </a>
              </>
            ) : (
              <>
                <h1 className={styles.title}>{data ? data.nom : <span className={styles.titleSkeleton} />}</h1>
                {data?.description && <p className={styles.lead}>{data.description}</p>}
                {data && (
                  <span className={styles.count}>
                    {data.nbArticles} {data.nbArticles > 1 ? 'plats' : 'plat'}
                  </span>
                )}
              </>
            )}
          </div>
        </section>

        {menus.data && menus.data.length > 1 && (
          <div className={styles.switcherBar}>
            <nav className={`container ${styles.switcher}`} aria-label="Autres menus">
              {menus.data.map((m) => (
                <NavLink
                  key={m.id}
                  to={`/carte/${m.id}`}
                  className={({ isActive }) => (isActive ? styles.activeTab : undefined)}
                >
                  {m.nom}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        <section className={styles.dishes}>
          <div className="container">
            {!data && !menu.error && (
              <div className={styles.grid} aria-busy="true">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className={styles.skeleton} />
                ))}
              </div>
            )}

            {data && data.articles.length === 0 && (
              <div className={styles.empty}>
                <p>Ce menu sera bientôt garni. En attendant, jetez un œil aux autres catégories !</p>
                <Link to="/" className={styles.back}>
                  ← Retour à l’accueil
                </Link>
              </div>
            )}

            {data && data.articles.length > 0 && (
              <div className={styles.grid}>
                {data.articles.map((article, i) => (
                  <div key={article.id} className={styles.cell} data-reveal style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}>
                    <MenuCard article={article} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
