import { useState } from 'react'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import { EmptyState, ErrorState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Thumb } from '../../components/dashboard/Thumb'
import { Button } from '../../components/ui/Button'
import { ArrowUpRight, Check, Trash } from '../../components/ui/Icons'
import { Stars } from '../../components/ui/Stars'
import { useAsync } from '../../hooks/useAsync'
import type { Avis } from '../../types'
import { formatDate } from '../../utils/format'
import styles from './Admin.module.css'

type Filtre = 'en_attente' | 'publie' | 'tous'

const FILTRES: { key: Filtre; label: string; test: (a: Avis) => boolean }[] = [
  { key: 'en_attente', label: 'À valider', test: (a) => !a.publie },
  { key: 'publie', label: 'Publiés', test: (a) => a.publie },
  { key: 'tous', label: 'Tous', test: () => true },
]

const loadAll = () => adminApi.avis()

export function AvisPage() {
  const { data, error, loading, reload, mutate } = useAsync(loadAll)
  const [filtre, setFiltre] = useState<Filtre>('en_attente')
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const all = data ?? []
  const current = FILTRES.find((f) => f.key === filtre)!
  const visible = all.filter(current.test)
  const moyenne = all.length ? all.reduce((sum, a) => sum + a.note, 0) / all.length : null

  function flash(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 3500)
  }

  async function togglePublie(avis: Avis) {
    const publie = !avis.publie
    mutate((list) => list?.map((a) => (a.id === avis.id ? { ...a, publie } : a)))
    try {
      await adminApi.publierAvis(avis.id, publie)
    } catch (err) {
      mutate((list) => list?.map((a) => (a.id === avis.id ? { ...a, publie: avis.publie } : a)))
      flash(err instanceof ApiError ? err.message : 'Mise à jour impossible')
    }
  }

  async function remove(id: number) {
    try {
      await adminApi.deleteAvis(id)
      mutate((list) => list?.filter((a) => a.id !== id))
    } catch (err) {
      flash(err instanceof ApiError ? err.message : 'Suppression impossible')
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={moyenne === null ? 'Recensioni' : `Note moyenne ${moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} / 5`}
        title={
          <>
            Avis <em>clients</em>
          </>
        }
      >
        <div className={styles.filters} role="group" aria-label="Filtrer les avis">
          {FILTRES.map((f) => (
            <button key={f.key} aria-pressed={filtre === f.key} onClick={() => setFiltre(f.key)}>
              {f.label} <span className={styles.count}>{all.filter(f.test).length}</span>
            </button>
          ))}
        </div>
      </PageHeader>

      <Panel>
        {error && !data && <ErrorState message={error} onRetry={reload} />}
        {loading && !data && <p>Chargement…</p>}
        {data && visible.length === 0 && (
          <EmptyState>
            {filtre === 'en_attente' ? 'Aucun avis en attente. Tout est à jour !' : 'Aucun avis pour le moment.'}
          </EmptyState>
        )}

        {visible.length > 0 && (
          <ul className={styles.avisList}>
            {visible.map((a) => (
              <li key={a.id} className={`${styles.avis} ${a.publie ? '' : styles.avisPending}`}>
                <Thumb url={a.article.imageUrl} />

                <div className={styles.avisBody}>
                  <div className={styles.avisMeta}>
                    <Stars value={a.note} size={15} />
                    <strong>{a.nom}</strong>
                    <span>·</span>
                    <a href={`/plat/${a.article.id}#avis`} target="_blank" rel="noreferrer" className={styles.seeAll}>
                      {a.article.nom} <ArrowUpRight size={12} />
                    </a>
                    <span>·</span>
                    <time dateTime={a.createdAt}>{formatDate(a.createdAt)}</time>
                    {a.publie ? (
                      <span className={styles.tag}>En ligne</span>
                    ) : (
                      <span className={styles.deal}>À valider</span>
                    )}
                  </div>
                  <p className={styles.avisText}>{a.commentaire}</p>
                </div>

                <div className={styles.avisActions}>
                  {confirmId === a.id ? (
                    <div className={styles.confirm}>
                      Supprimer ?
                      <Button size="sm" variant="red" onClick={() => remove(a.id)}>
                        Oui
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                        Non
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant={a.publie ? 'ghost' : 'green'}
                        onClick={() => togglePublie(a)}
                        icon={a.publie ? undefined : <Check size={14} />}
                      >
                        {a.publie ? 'Masquer' : 'Publier'}
                      </Button>
                      <button
                        className={`${styles.iconBtn} ${styles.danger}`}
                        onClick={() => setConfirmId(a.id)}
                        aria-label={`Supprimer l’avis de ${a.nom}`}
                      >
                        <Trash size={15} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {toast && (
        <div className={styles.toast} role="alert">
          {toast}
        </div>
      )}
    </>
  )
}
