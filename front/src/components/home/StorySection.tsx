import logoSrc from '../../assets/logo-dinapoli.png'
import pizzaPlaque from '../../assets/pizza-plaque.jpg'
import styles from './StorySection.module.css'

const PILLARS = [
  { n: '40 ans', label: 'd’expérience et de savoir-faire, depuis 1987' },
  { n: '1/8', label: 'à la part, en quart, en demi ou en plaque entière' },
  { n: '100%', label: 'fait maison, avec nos recettes de famille' },
]

export function StorySection() {
  return (
    <section id="histoire" className={`${styles.section} texture`}>
      <div className={`container ${styles.inner}`}>
        <figure className={styles.figure} data-reveal="zoom">
          <img src={pizzaPlaque} alt="Pizza en plaque aux crevettes, pesto et roquette sur une planche en bois" loading="lazy" />
          <figcaption>La pizza en tranche, notre signature.</figcaption>
        </figure>

        <div className={styles.copy} data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          <p className="eyebrow">La famiglia · depuis 1987</p>
          <h2 className={styles.title}>
            40 ans de passion, <em>une tranche</em> à la fois.
          </h2>
          <p className={styles.text}>
            Depuis 1987, Di Napoli régale ses clients avec sa pizza en tranche : une pâte moelleuse et croustillante,
            cuite en plaque et généreusement garnie, servie à la part ou en plaque entière à partager.
          </p>
          <p className={styles.text}>
            Quarante ans plus tard, ce sont toujours les mêmes recettes de famille, le même accueil chaleureux — et le
            même plaisir de vous voir revenir.
          </p>

          <ul className={styles.pillars}>
            {PILLARS.map((p) => (
              <li key={p.n}>
                <strong>{p.n}</strong>
                <span>{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container" data-reveal>
        <article className={styles.letter} aria-labelledby="lettre-titre">
          <header className={styles.letterHead}>
            <h3 id="lettre-titre" className={styles.wordmark}>
              <img src={logoSrc} alt="Di Napoli — since 1987" width={1000} height={313} />
            </h3>
          </header>

          <div className={styles.letterBody}>
            <p>Depuis 1987, nous croyons que la gastronomie est un véritable enchantement.</p>
            <p>
              Nous sélectionnons avec une extrême délicatesse les ingrédients les plus nobles pour vous offrir des plats
              dignes d’un conte de fée.
            </p>
            <p>
              Nous nous inspirons des techniques ancestrales pour sublimer chaque plat et vous transporter dans un
              univers de saveurs et d’arômes envoûtants.
            </p>
            <p>
              Découvrez notre cuisine faite maison, où chaque plat est un chef-d’œuvre culinaire pour les yeux et pour
              les papilles.
            </p>
          </div>

          <footer className={styles.signature}>
            Sincèrement,
            <br />
            <span>L’équipe Dinapoli</span>
          </footer>
        </article>
      </div>
    </section>
  )
}
