import heroPizza from '../../assets/hero-pizza.jpg'
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
  return (
    <section id="accueil" className={`${styles.hero} texture`}>
      <div className={styles.copy}>
        <p className={`eyebrow ${styles.eyebrow}`}>Pizzeria · Cucina · Famiglia</p>

        <h1 className={styles.title}>
          Fait avec <em>passion</em>.
          <br />
          Servi avec joie.
        </h1>

        <p className={styles.lead}>
          Un petit morceau de Naples au cœur de la ville. Installez-vous à notre table pour une cuisine honnête, des
          pizzas sorties du four à bois et des histoires qui durent toute la soirée.
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
            <dt>Depuis</dt>
            <dd>1987</dd>
          </div>
          <div>
            <dt>Four à bois</dt>
            <dd>450°C</dd>
          </div>
          <div>
            <dt>Adresses</dt>
            <dd>{adresses ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.media}>
        <img src={heroPizza} alt="Pizza margherita napolitaine sortie du four à bois" className={styles.image} />
        <div className={styles.shade} />

        <div className={styles.badge}>
          <RotatingBadge />
        </div>

        <span className={`${styles.caption} ${styles.captionLeft}`}>Via della Passione</span>
        <span className={`${styles.caption} ${styles.captionRight}`}>Napoli · Italia</span>

        {featured && (
          <a href="#carte" className={styles.featured}>
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
      </div>
    </section>
  )
}
