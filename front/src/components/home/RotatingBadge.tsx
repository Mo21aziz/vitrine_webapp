import { Spark } from '../ui/Icons'
import styles from './RotatingBadge.module.css'

export function RotatingBadge({ text = 'Buon appetito · Buon appetito · ' }: { text?: string }) {
  return (
    <div className={styles.badge} aria-hidden="true">
      <svg viewBox="0 0 200 200" className={styles.ring}>
        <defs>
          <path id="badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <text>
          <textPath href="#badge-circle" textLength="462">
            {text}
          </textPath>
        </text>
      </svg>
      <Spark size={22} className={styles.center} />
    </div>
  )
}
