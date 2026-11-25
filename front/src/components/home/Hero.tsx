import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import heroVideo from '../../assets/hero.mp4'
import type { Article } from '../../types'
import { formatPrix } from '../../utils/format'
import { ButtonLink } from '../ui/Button'
import { ArrowUpRight, Flame } from '../ui/Icons'
import styles from './Hero.module.css'
import { RotatingBadge } from './RotatingBadge'

interface HeroProps {
  featured?: Article
  adresses?: number
}

export function Hero({ featured, adresses }: HeroProps) {
  const section = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  // play while the hero is on screen (pause when scrolled away, to save battery and data)
  useEffect(() => {
    const v = video.current
    const s = section.current
    if (!v || !s) return
    const play = () => v.play().catch(() => undefined)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play()
      else v.pause()
    })
    observer.observe(s)

    // some phones (battery saver, data saver) refuse autoplay: retry on the first touch/scroll/click
    const retry = () => {
      if (v.paused) play()
    }
    const events = ['pointerdown', 'touchstart', 'scroll', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, retry, { once: true, passive: true }))

    return () => {
      observer.disconnect()
      events.forEach((e) => window.removeEventListener(e, retry))
    }
  }, [])

  return (
    <section ref={section} id="accueil" className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <video
          ref={video}
          className={styles.video}
          src={heroVideo}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          // with no poster image, make sure a paused video still shows a frame instead of a black box
          onLoadedData={(e) => {
            const v = e.currentTarget
            if (v.paused && v.currentTime === 0) v.currentTime = Math.min(2, v.duration / 3 || 0)
          }}
        />
        <div className={styles.shade} />
        <div className={`${styles.grain} texture`} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>
            <span className={styles.dot} aria-hidden="true" />
            Pizzeria · Cucina · Famiglia
          </p>

          <h1 className={styles.title} aria-label="Fait avec passion. Servi avec joie.">
            <span className={styles.line} aria-hidden="true">
              <Word i={0}>Fait</Word> <Word i={1}>avec</Word>{' '}
              <Word i={2}>
                <em>passion</em>.
              </Word>
            </span>
            <span className={styles.line} aria-hidden="true">
              <Word i={3}>Servi</Word> <Word i={4}>avec</Word> <Word i={5}>joie.</Word>
            </span>
          </h1>

          <p className={styles.lead}>
            40 ans de savoir-faire depuis 1987. Pizza en tranche, burgers, ciabattas et clubs généreux : installez-vous
            à notre table ou emportez votre part.
          </p>

          <div className={styles.actions}>
            <ButtonLink href="#carte" variant="light" size="lg" icon={<ArrowUpRight size={16} />}>
              Voir la carte
            </ButtonLink>
            <ButtonLink href="#histoire" variant="link" icon={<ArrowUpRight size={15} />}>
              Notre histoire
            </ButtonLink>
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>D’expérience</dt>
              <dd>40 ans</dd>
            </div>
            <div>
              <dt>Depuis</dt>
              <dd>1987</dd>
            </div>
            <div>
              <dt>Adresses</dt>
              <dd>{adresses ?? '—'}</dd>
            </div>
          </dl>
        </div>

        <aside className={styles.side}>
          {featured && (
            <a href={`/plat/${featured.id}`} className={styles.featured}>
              <span className={styles.featuredIcon}>
                <Flame size={18} />
              </span>
              <span className={styles.featuredBody}>
                <span className={styles.featuredLabel}>Pizza del mese</span>
                <strong>{featured.nom}</strong>
                <span className={styles.featuredPrice}>
                  {featured.remise > 0 && <s>{formatPrix(featured.prix)}</s>}
                  {formatPrix(featured.prixFinal)}
                </span>
              </span>
              {featured.remise > 0 && <span className={styles.featuredDeal}>-{featured.remise}%</span>}
            </a>
          )}
          <div className={styles.badge}>
            <RotatingBadge />
          </div>
        </aside>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <span>Via della Passione</span>
        <span>Depuis 1987 · 40 ans d’expérience</span>
      </div>
    </section>
  )
}

/** One word of the title, rising out of a mask; i = its order in the opening sequence */
function Word({ i, children }: { i: number; children: ReactNode }) {
  return (
    <span className={styles.word}>
      <span className={styles.wordInner} style={{ '--i': i } as CSSProperties}>
        {children}
      </span>
    </span>
  )
}
