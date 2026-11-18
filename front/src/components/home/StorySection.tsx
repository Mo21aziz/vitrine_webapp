import margherita from '../../assets/margherita.jpg'
import styles from './StorySection.module.css'

const PILLARS = [
  { n: '48h', label: 'de maturation pour une pâte légère et digeste' },
  { n: '90s', label: 'de cuisson au four à bois, à la napolitaine' },
  { n: '100%', label: 'de recettes de famille, transmises à la main' },
]

export function StorySection() {
  return (
    <section id="histoire" className={`${styles.section} texture`}>
      <div className={`container ${styles.inner}`}>
        <figure className={styles.figure}>
          <img src={margherita} alt="Margherita au basilic frais sur une pelle à pizza" loading="lazy" />
          <figcaption>La Margherita, comme à Naples.</figcaption>
        </figure>

        <div className={styles.copy}>
          <p className="eyebrow">La famiglia</p>
          <h2 className={styles.title}>
            Une recette, <em>une famille,</em> un four qui ne s’éteint jamais.
          </h2>
          <p className={styles.text}>
            Depuis 1987, Di Napoli fait les choses à l’ancienne : une pâte pétrie chaque matin, des tomates mûries au
            soleil et une mozzarella fondante. Chez nous, on vient pour manger, on reste pour l’ambiance.
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

      <div className="container">
        <article className={styles.letter} aria-labelledby="lettre-titre">
          <header className={styles.letterHead}>
            <h3 id="lettre-titre" className={styles.wordmark}>
              <span className={styles.wmDi}>Di</span> <span className={styles.wmNapoli}>Napoli</span>
              <small className={styles.since}>Since 1987</small>
            </h3>
            <span className={styles.tricolore} aria-hidden="true" />
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
