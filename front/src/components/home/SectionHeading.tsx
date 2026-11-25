import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  intro?: string
  align?: 'left' | 'split'
  /** onColor = on red/green backgrounds, onLight = on white/cream */
  tone?: 'onColor' | 'onLight'
}

export function SectionHeading({ eyebrow, title, intro, align = 'split', tone = 'onColor' }: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${styles[align]} ${styles[tone]}`} data-reveal>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {intro && <p className={styles.intro}>{intro}</p>}
    </div>
  )
}
