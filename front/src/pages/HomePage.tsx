import { useMemo } from 'react'
import { publicApi } from '../api/public'
import { Hero } from '../components/home/Hero'
import { Marquee } from '../components/home/Marquee'
import { MenuSection } from '../components/home/MenuSection'
import { ReclamationSection } from '../components/home/ReclamationSection'
import { StorySection } from '../components/home/StorySection'
import { TestimonialsSection } from '../components/home/TestimonialsSection'
import { MobileActionBar } from '../components/layout/MobileActionBar'
import { VisitSection } from '../components/home/VisitSection'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { useAsync } from '../hooks/useAsync'

const MARQUEE_WORDS = [
  'Buon appetito',
  'Benvenuti',
  'Pizza napoletana',
  'Fatto con amore',
  'Mamma mia !',
  'La dolce vita',
  'A tavola !',
  'Grazie mille',
]

export function HomePage() {
  const articles = useAsync(publicApi.articles)
  const menus = useAsync(publicApi.menus)
  const points = useAsync(publicApi.pointsDeVente)
  const avis = useAsync(publicApi.avisRecents)

  const featured = useMemo(() => {
    const list = articles.data ?? []
    return [...list].sort((a, b) => b.remise - a.remise)[0]
  }, [articles.data])

  return (
    <>
      <Navbar />
      <main>
        <Hero featured={featured} adresses={points.data?.length} />
        <Marquee items={MARQUEE_WORDS} />
        <MenuSection menus={menus.data} loading={menus.loading} error={menus.error} onRetry={menus.reload} />
        <TestimonialsSection data={avis.data ?? undefined} />
        <StorySection />
        <VisitSection pointsDeVente={points.data} />
        <ReclamationSection pointsDeVente={points.data ?? undefined} />
      </main>
      <Footer />
      <MobileActionBar points={points.data ?? undefined} />
    </>
  )
}
