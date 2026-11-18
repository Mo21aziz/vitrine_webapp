import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client'

interface AsyncState<T> {
  data: T | undefined
  error: string | null
  version: number
}

/**
 * Runs an async loader and tracks its result.
 * `loader` must be stable (a module-level function or wrapped in useCallback).
 */
export function useAsync<T>(loader: () => Promise<T>) {
  const [version, setVersion] = useState(0)
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: null, version: -1 })

  useEffect(() => {
    let cancelled = false
    loader().then(
      (data) => !cancelled && setState({ data, error: null, version }),
      (err: unknown) =>
        !cancelled &&
        setState((s) => ({
          data: s.data,
          error: err instanceof ApiError ? err.message : 'Une erreur est survenue',
          version,
        })),
    )
    return () => {
      cancelled = true
    }
  }, [loader, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const mutate = useCallback(
    (update: (data: T | undefined) => T | undefined) => setState((s) => ({ ...s, data: update(s.data) })),
    [],
  )

  return {
    data: state.data,
    error: state.error,
    loading: state.version !== version,
    reload,
    mutate,
  }
}
