import { useState } from 'react'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import { publicApi } from '../../api/public'
import { EmptyState, ErrorState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { PointDeVenteForm } from '../../components/dashboard/PointDeVenteForm'
import { Button } from '../../components/ui/Button'
import { ArrowUpRight, Pencil, Pin, Plus, Trash } from '../../components/ui/Icons'
import { useAsync } from '../../hooks/useAsync'
import type { PointDeVente, PointDeVenteInput } from '../../types'
import { directionsUrl, hasCoords } from '../../utils/maps'
import styles from './Admin.module.css'

export function PointsDeVentePage() {
  const { data, error, reload, mutate } = useAsync(publicApi.pointsDeVente)
  const [editing, setEditing] = useState<PointDeVente | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  async function save(input: PointDeVenteInput) {
    if (editing) {
      const updated = await adminApi.updatePointDeVente(editing.id, input)
      mutate((list) => list?.map((p) => (p.id === updated.id ? updated : p)))
      setEditing(null)
    } else {
      const created = await adminApi.createPointDeVente(input)
      mutate((list) => [...(list ?? []), created])
    }
  }

  async function remove(id: number) {
    setListError(null)
    try {
      await adminApi.deletePointDeVente(id)
      mutate((list) => list?.filter((p) => p.id !== id))
      if (editing?.id === id) setEditing(null)
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : 'Suppression impossible')
    } finally {
      setConfirmId(null)
    }
  }

  const unplaced = (data ?? []).filter((p) => !hasCoords(p)).length

  return (
    <>
      <PageHeader
        eyebrow="Venite a trovarci"
        title={
          <>
            Nos <em>adresses</em>
          </>
        }
      />

      <div className={styles.split}>
        <Panel title={`${data?.length ?? 0} restaurants`} icon={<Pin size={14} />}>
          {error && !data && <ErrorState message={error} onRetry={reload} />}
          {listError && <ErrorState message={listError} />}
          {unplaced > 0 && (
            <p className={styles.hintBanner}>
              {unplaced} {unplaced > 1 ? 'restaurants ne sont pas placés' : 'restaurant n’est pas placé'} sur la carte.
              Cliquez sur <Pencil size={13} /> pour {unplaced > 1 ? 'les' : 'le'} positionner.
            </p>
          )}
          {data && data.length === 0 && <EmptyState>Aucun restaurant pour l’instant.</EmptyState>}
          {data && data.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Restaurant</th>
                    <th>Carte</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => {
                    const url = directionsUrl(p)
                    return (
                      <tr key={p.id} className={editing?.id === p.id ? styles.editing : undefined}>
                        <td>
                          <span className={styles.name}>{p.nom}</span>
                          <span className={styles.sub}>{p.adresse ?? 'Adresse non renseignée'}</span>
                        </td>
                        <td>
                          {hasCoords(p) ? (
                            <span className={styles.tag}>
                              <Pin size={11} /> Placé
                            </span>
                          ) : (
                            <span className={styles.deal}>Non placé</span>
                          )}
                        </td>
                        <td>
                          {confirmId === p.id ? (
                            <div className={styles.confirm}>
                              Supprimer ?
                              <Button size="sm" variant="red" onClick={() => remove(p.id)}>
                                Oui
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                                Non
                              </Button>
                            </div>
                          ) : (
                            <div className={styles.rowActions}>
                              {url && (
                                <a
                                  className={styles.iconBtn}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={`Ouvrir ${p.nom} dans Google Maps`}
                                  title="Ouvrir dans Google Maps"
                                >
                                  <ArrowUpRight size={15} />
                                </a>
                              )}
                              <button
                                className={styles.iconBtn}
                                onClick={() => setEditing(p)}
                                aria-label={`Modifier ${p.nom}`}
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                className={`${styles.iconBtn} ${styles.danger}`}
                                onClick={() => setConfirmId(p.id)}
                                aria-label={`Supprimer ${p.nom}`}
                              >
                                <Trash size={15} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className={styles.sticky}>
          <Panel
            title={editing ? `Modifier « ${editing.nom} »` : 'Nouveau restaurant'}
            icon={editing ? <Pencil size={14} /> : <Plus size={14} />}
          >
            <PointDeVenteForm
              key={editing?.id ?? 'new'}
              point={editing ?? undefined}
              onSubmit={save}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </Panel>
        </div>
      </div>
    </>
  )
}
