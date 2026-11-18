import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import { publicApi } from '../../api/public'
import { ArticleForm } from '../../components/dashboard/ArticleForm'
import { Thumb } from '../../components/dashboard/Thumb'
import { EmptyState, ErrorState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Button } from '../../components/ui/Button'
import { Flame, Pencil, Plus, Trash } from '../../components/ui/Icons'
import { useAsync } from '../../hooks/useAsync'
import type { Article, ArticleInput } from '../../types'
import { formatPrix } from '../../utils/format'
import styles from './Admin.module.css'

export function ArticlesPage() {
  const { data, error, reload, mutate } = useAsync(publicApi.articles)
  const menus = useAsync(publicApi.menus)
  const [params, setParams] = useSearchParams()
  const [editing, setEditing] = useState<Article | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const menuFilter = params.get('menu') ? Number(params.get('menu')) : null
  const menuName = (id: number | null) => menus.data?.find((m) => m.id === id)?.nom
  const all = data ?? []
  const visible = menuFilter ? all.filter((a) => a.menuId === menuFilter) : all

  function setFilter(id: number | null) {
    setParams(id ? { menu: String(id) } : {})
  }

  async function save(input: ArticleInput) {
    if (editing) {
      const updated = await adminApi.updateArticle(editing.id, input)
      mutate((list) => list?.map((a) => (a.id === updated.id ? updated : a)))
      setEditing(null)
    } else {
      const created = await adminApi.createArticle(input)
      mutate((list) => [...(list ?? []), created])
    }
  }

  async function remove(id: number) {
    setDeleteError(null)
    try {
      await adminApi.deleteArticle(id)
      mutate((list) => list?.filter((a) => a.id !== id))
      if (editing?.id === id) setEditing(null)
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Suppression impossible')
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Il menu"
        title={
          <>
            Les <em>articles</em>
          </>
        }
      >
        {menus.data && menus.data.length > 0 && (
          <div className={styles.filters} role="group" aria-label="Filtrer par menu">
            <button aria-pressed={menuFilter === null} onClick={() => setFilter(null)}>
              Tous <span className={styles.count}>{all.length}</span>
            </button>
            {menus.data.map((m) => (
              <button key={m.id} aria-pressed={menuFilter === m.id} onClick={() => setFilter(m.id)}>
                {m.nom} <span className={styles.count}>{all.filter((a) => a.menuId === m.id).length}</span>
              </button>
            ))}
          </div>
        )}
      </PageHeader>

      <div className={styles.split}>
        <Panel title={`${visible.length} articles`} icon={<Flame size={14} />}>
          {error && !data && <ErrorState message={error} onRetry={reload} />}
          {deleteError && <ErrorState message={deleteError} />}
          {data && visible.length === 0 && <EmptyState>Aucun article ici. Ajoutez-en un avec le formulaire.</EmptyState>}
          {data && visible.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Menu</th>
                    <th>Prix</th>
                    <th>Remise</th>
                    <th>Prix final</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((a) => (
                    <tr key={a.id} className={editing?.id === a.id ? styles.editing : undefined}>
                      <td>
                        <div className={styles.withThumb}>
                          <Thumb url={a.imageUrl} />
                          <div>
                            <span className={styles.name}>{a.nom}</span>
                            <span className={styles.sub}>{a.composition}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {menuName(a.menuId) ? (
                          <span className={styles.tag}>{menuName(a.menuId)}</span>
                        ) : (
                          <span className={styles.deal} title="Non visible sur le site">
                            Sans menu
                          </span>
                        )}
                      </td>
                      <td className={styles.num}>{formatPrix(a.prix)}</td>
                      <td>{a.remise > 0 ? <span className={styles.deal}>-{a.remise}%</span> : '—'}</td>
                      <td className={styles.num}>
                        <strong>{formatPrix(a.prixFinal)}</strong>
                      </td>
                      <td>
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
                          <div className={styles.rowActions}>
                            <button className={styles.iconBtn} onClick={() => setEditing(a)} aria-label={`Modifier ${a.nom}`}>
                              <Pencil size={15} />
                            </button>
                            <button
                              className={`${styles.iconBtn} ${styles.danger}`}
                              onClick={() => setConfirmId(a.id)}
                              aria-label={`Supprimer ${a.nom}`}
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className={styles.sticky}>
          <Panel
            title={editing ? `Modifier « ${editing.nom} »` : 'Nouvel article'}
            icon={editing ? <Pencil size={14} /> : <Plus size={14} />}
          >
            <ArticleForm
              key={`${editing?.id ?? 'new'}-${menuFilter ?? ''}-${menus.data ? 'ready' : 'loading'}`}
              article={editing ?? undefined}
              menus={menus.data ?? []}
              defaultMenuId={menuFilter ?? undefined}
              onSubmit={save}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </Panel>
        </div>
      </div>
    </>
  )
}
