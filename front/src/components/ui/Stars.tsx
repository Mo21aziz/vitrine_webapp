import { useId, useState } from 'react'
import styles from './Stars.module.css'

const STAR = 'M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z'

function Star({ fill, size }: { fill: number; size: number }) {
  // fill: 0 → empty, 1 → full, in between → partial (for averages like 4.3)
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="currentColor" />
          <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <path d={STAR} fill={`url(#${id})`} />
    </svg>
  )
}

/** Read-only stars, e.g. <Stars value={4.3} /> */
export function Stars({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`${styles.stars} ${className ?? ''}`} role="img" aria-label={`${value.toLocaleString('fr-FR')} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={Math.max(0, Math.min(1, value - n + 1))} />
      ))}
    </span>
  )
}

const LABELS = ['', 'Décevant', 'Moyen', 'Bon', 'Très bon', 'Excellent']

/** Accessible star picker built on radio buttons (keyboard arrows work) */
export function StarInput({
  value,
  onChange,
  error,
}: {
  value: number
  onChange: (note: number) => void
  error?: string
}) {
  const name = useId()
  const [hover, setHover] = useState(0)
  const shown = hover || value

  return (
    <fieldset className={styles.input}>
      <legend className={styles.legend}>Votre note</legend>
      <div className={styles.row} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={styles.option} onMouseEnter={() => setHover(n)}>
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            <Star size={30} fill={n <= shown ? 1 : 0} />
            <span className="sr-only">
              {n} {n > 1 ? 'étoiles' : 'étoile'} — {LABELS[n]}
            </span>
          </label>
        ))}
        <span className={styles.caption} aria-hidden="true">
          {LABELS[shown] || 'Choisissez'}
        </span>
      </div>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </fieldset>
  )
}
