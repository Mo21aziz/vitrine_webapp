import { useMemo } from 'react'
import { publicApi } from '../api/public'
import { Hero } from '../components/home/Hero'
import { Marquee } from '../components/home/Marquee'
import { MenuSection } from '../components/home/MenuSection'
import { StorySection } from '../components/home/StorySection'
import { VisitSection } from '../components/home/VisitSection'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { useAsync } from '../hooks/useAsync'

const MARQUEE_EXTRAS = ['Four à bois', 'Pâte maturée 48h', 'Fatto a mano', 'Buon appetito']

export function HomePage() {
  const articles = useAsync(publicApi.articles)
  const menus = useAsync(publicApi.menus)
  const points = useAsync(publicApi.pointsDeVente)

  const featured = useMemo(() => {
    const list = articles.data ?? []
    return [...list].sort((a, b) => b.remise - a.remise)[0]
  }, [articles.data])

  const marquee = useMemo(
    () => [...(articles.data ?? []).map((a) => a.nom), ...MARQUEE_EXTRAS],
    [articles.data],
  )

  return (
    <>
      <Navbar />
      <main>
        <Hero featured={featured} adresses={points.data?.length} />
        <Marquee items={marquee} />
        <MenuSection menus={menus.data} loading={menus.loading} error={menus.error} onRetry={menus.reload} />
        <StorySection />
        <VisitSection pointsDeVente={points.data} />
      </main>
      <Footer />
    </>
  )
}
