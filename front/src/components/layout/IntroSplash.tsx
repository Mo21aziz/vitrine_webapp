import { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logoSrc from '../../assets/logo-dinapoli.png'
import styles from './IntroSplash.module.css'

const KEY = 'dinapoli_intro_seen'

function shouldShow(pathname: string) {
  if (pathname.startsWith('/admin')) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(KEY) !== '1'
  } catch {
    return false
  }
}

/** Short brand intro on the first page of a visit: the logo draws in, then a curtain lifts. */
export function IntroSplash() {
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<'show' | 'leave' | 'done'>(() => (shouldShow(pathname) ? 'show' : 'done'))

  // tells the hero to hold its opening animation until the curtain lifts (set before the first paint)
  useLayoutEffect(() => {
    const root = document.documentElement
    if (phase === 'show') root.dataset.intro = 'playing'
    else delete root.dataset.intro
  }, [phase])

  useEffect(() => {
    if (phase === 'done') return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode: the intro simply plays again next time */
    }
    const leave = setTimeout(() => setPhase('leave'), 1050)
    const done = setTimeout(() => setPhase('done'), 1750)
    return () => {
      clearTimeout(leave)
      clearTimeout(done)
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`${styles.splash} ${phase === 'leave' ? styles.leave : ''}`} aria-hidden="true">
      <div className={styles.inner}>
        <img src={logoSrc} alt="" className={styles.logo} width={1000} height={313} />
        <span className={styles.bar}>
          <span />
        </span>
      </div>
    </div>
  )
}
