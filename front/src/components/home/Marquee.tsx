import { Fragment } from 'react'
import { Spark } from '../ui/Icons'
import styles from './Marquee.module.css'

export function Marquee({ items }: { items: string[] }) {
  // Rendered twice so the loop is seamless
  const track = (hidden: boolean) => (
    <div className={styles.track} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span>{item}</span>
          <Spark size={14} className={styles.spark} />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className={styles.marquee}>
      {track(false)}
      {track(true)}
    </div>
  )
}
