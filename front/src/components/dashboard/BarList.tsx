import styles from './BarList.module.css'

export interface BarItem {
  label: string
  value: number
  color?: string
}

export function BarList({ items }: { items: BarItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.label} className={styles.row}>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.track}>
            <span
              className={styles.bar}
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </span>
          <span className={styles.value}>{item.value}</span>
        </li>
      ))}
    </ul>
  )
}
