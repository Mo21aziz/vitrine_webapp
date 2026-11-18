import styles from './Gauge.module.css'

interface GaugeProps {
  value: number // 0–100
  label: string
}

export function Gauge({ value, label }: GaugeProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={styles.gauge} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped} aria-label={label}>
      <svg viewBox="0 0 200 112" className={styles.svg}>
        <path d="M 16 100 A 84 84 0 0 1 184 100" pathLength={100} className={styles.track} />
        <path
          d="M 16 100 A 84 84 0 0 1 184 100"
          pathLength={100}
          className={styles.fill}
          style={{ strokeDasharray: `${clamped} 100`, opacity: clamped > 0 ? 1 : 0 }}
        />
      </svg>
      <div className={styles.readout}>
        <strong>{clamped}</strong>
        <span>%</span>
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  )
}
