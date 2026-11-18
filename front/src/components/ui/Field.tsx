import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import styles from './Field.module.css'

interface FieldShellProps {
  label: string
  error?: string
  hint?: string
  tone?: 'light' | 'dark'
  children: (id: string) => ReactNode
}

function FieldShell({ label, error, hint, tone = 'light', children }: FieldShellProps) {
  const id = useId()
  return (
    <div className={`${styles.field} ${styles[tone]} ${error ? styles.invalid : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children(id)}
      {error ? <span className={styles.error}>{error}</span> : hint && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}

type Shared = { label: string; error?: string; hint?: string; tone?: 'light' | 'dark' }

export function TextField({ label, error, hint, tone, ...props }: Shared & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint} tone={tone}>
      {(id) => <input id={id} className={styles.control} aria-invalid={!!error} {...props} />}
    </FieldShell>
  )
}

export function TextArea({ label, error, hint, tone, ...props }: Shared & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint} tone={tone}>
      {(id) => <textarea id={id} className={styles.control} aria-invalid={!!error} {...props} />}
    </FieldShell>
  )
}

export function SelectField({
  label,
  error,
  hint,
  tone,
  children,
  ...props
}: Shared & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint} tone={tone}>
      {(id) => (
        <select id={id} className={styles.control} aria-invalid={!!error} {...props}>
          {children}
        </select>
      )}
    </FieldShell>
  )
}
