import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'light' | 'outline' | 'link' | 'red' | 'green' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  children: ReactNode
}

function classes(variant: Variant, size: Size, extra?: string) {
  return [styles.button, styles[variant], styles[size], extra].filter(Boolean).join(' ')
}

export function Button({
  variant = 'light',
  size = 'md',
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      <span>{children}</span>
      {icon}
    </button>
  )
}

export function ButtonLink({
  variant = 'light',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes(variant, size, className)} {...rest}>
      <span>{children}</span>
      {icon}
    </a>
  )
}
