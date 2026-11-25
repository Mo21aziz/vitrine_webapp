import type { CSSProperties } from 'react'
import type { PointDeVente } from '../../types'
import { Check } from '../ui/Icons'
import { ReclamationForm } from './ReclamationForm'
import styles from './ReclamationSection.module.css'

const STEPS = [
  'Choisissez le restaurant concerné',
  'Décrivez ce qui s’est passé',
  'L’équipe du restaurant vous répond rapidement — votre satisfaction avant tout',
]

/** Customer complaints — its own section, separate from the restaurants and maps */
export function ReclamationSection({ pointsDeVente }: { pointsDeVente?: PointDeVente[] }) {
  return (
    <section id="reclamation" className={`${styles.section} texture`} aria-labelledby="reclamation-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy} data-reveal>
          <p className={`eyebrow ${styles.eyebrow}`}>Service client</p>
          <h2 id="reclamation-title" className={styles.title}>
            Réclamation<em>.</em>
          </h2>
          <p className={styles.intro}>
            Un problème avec une commande, un service ou une visite ? Dites-le-nous : chaque réclamation est lue et
            transmise au restaurant concerné.
          </p>
          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <li key={step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className={styles.note}>
            <Check size={14} /> Vos coordonnées servent uniquement à vous répondre.
          </p>
        </div>

        <div className={styles.card} data-reveal style={{ '--reveal-delay': '120ms' } as CSSProperties}>
          <h3 className={styles.cardTitle}>Envoyer une réclamation</h3>
          <ReclamationForm pointsDeVente={pointsDeVente ?? []} />
        </div>
      </div>
    </section>
  )
}
