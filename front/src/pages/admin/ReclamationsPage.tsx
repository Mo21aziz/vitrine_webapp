import { useState } from 'react'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import { ErrorState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { ReclamationList } from '../../components/dashboard/ReclamationList'
import { useAsync } from '../../hooks/useAsync'
import type { Statut } from '../../types'
import { STATUT_LABELS, STATUTS } from '../../utils/format'
import styles from './Admin.module.css'

const loadAll = () => adminApi.reclamations()

export function ReclamationsPage() {
  const { data, error, loading, reload, mutate } = useAsync(loadAll)
  const [filter, setFilter] = useState<Statut | 'ALL'>('ALL')
  const [toast, setToast] = useState<string | null>(null)

  const all = data ?? []
  const visible = filter === 'ALL' ? all : all.filter((r) => r.statut === filter)
  const countOf = (s: Statut) => all.filter((r) => r.statut === s).length

  async function changeStatut(id: number, statut: Statut) {
    const previous = all.find((r) => r.id === id)?.statut
    mutate((list) => list?.map((r) => (r.id === id ? { ...r, statut } : r)))
    try {
      await adminApi.updateStatut(id, statut)
    } catch (err) {
      mutate((list) => list?.map((r) => (r.id === id && previous ? { ...r, statut: previous } : r)))
      setToast(err instanceof ApiError ? err.message : 'Mise à jour impossible')
      setTimeout(() => setToast(null), 3500)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Service client"
        title={
          <>
            Réclamations <em>& retours</em>
          </>
        }
      >
        <div className={styles.filters} role="group" aria-label="Filtrer par statut">
          <button aria-pressed={filter === 'ALL'} onClick={() => setFilter('ALL')}>
            Toutes <span className={styles.count}>{all.length}</span>
          </button>
          {STATUTS.map((s) => (
            <button key={s} aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {STATUT_LABELS[s]} <span className={styles.count}>{countOf(s)}</span>
            </button>
          ))}
        </div>
      </PageHeader>

      <Panel>
        {error && !data && <ErrorState message={error} onRetry={reload} />}
        {loading && !data && <p>Chargement…</p>}
        {data && <ReclamationList items={visible} onStatutChange={changeStatut} />}
      </Panel>

      {toast && (
        <div className={styles.toast} role="alert">
          {toast}
        </div>
      )}
    </>
  )
}
