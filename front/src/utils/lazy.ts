import { lazy, type ComponentType } from 'react'

const KEY = 'dinapoli_chunk_reload'

/** true the first time only (per tab session), so a broken file can't cause a reload loop */
function claimRetry(): boolean {
  try {
    if (sessionStorage.getItem(KEY) === '1') return false
    sessionStorage.setItem(KEY, '1')
    return true
  } catch {
    return false // storage blocked: don't risk looping
  }
}

function forgetRetry() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* storage blocked: nothing to forget */
  }
}

/**
 * React.lazy that survives a failed chunk download.
 * Happens after a new deploy (an old tab asks for a file that no longer exists) or when the Vite dev
 * server re-optimises dependencies ("504 Outdated Optimize Dep"). We reload the page once; if it
 * still fails, the error reaches the nearest error boundary.
 */
// same constraint as React.lazy itself
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy<T>(async () => {
    try {
      const mod = await load()
      forgetRetry()
      return mod
    } catch (err) {
      if (claimRetry()) {
        window.location.reload()
        return new Promise<{ default: T }>(() => undefined) // wait for the reload
      }
      throw err
    }
  })
}
