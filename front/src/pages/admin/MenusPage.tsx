import { useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import { publicApi } from '../../api/public'
import { MenuForm } from '../../components/dashboard/MenuForm'
import { Thumb } from '../../components/dashboard/Thumb'
import { EmptyState, ErrorState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Button } from '../../components/ui/Button'
import { ArrowUpRight, Pencil, Plus, Spark, Trash } from '../../components/ui/Icons'
import { useAsync } from '../../hooks/useAsync'
import type { Menu, MenuInput } from '../../types'
import styles from './Admin.module.css'

export function MenusPage() {
  const { data, error, reload, mutate } = useAsync(publicApi.menus)
  const [editing, setEditing] = useState<Menu | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [listError, setListError] = useState<string | null>(null)

  async function save(input: MenuInput) {
    if (editing) {
      const updated = await adminApi.updateMenu(editing.id, input)
      mutate((list) => list?.map((m) => (m.id === updated.id ? updated : m)))
      setEditing(null)
    } else {
      const created = await adminApi.createMenu(input)
      mutate((list) => [...(list ?? []), created])
    }
  }

  async function remove(id: number) {
    setListError(null)
    try {
      await adminApi.deleteMenu(id)
      mutate((list) => list?.filter((m) => m.id !== id))
      if (editing?.id === id) setEditing(null)
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : 'Suppression impossible')
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="La carte"
        title={
          <>
            Les <em>menus</em>
          </>
        }
      />

      <div className={styles.split}>
        <Panel title={`${data?.length ?? 0} menus`} icon={<Spark size={14} />}>
          {error && !data && <ErrorState message={error} onRetry={reload} />}
          {listError && <ErrorState message={listError} />}
          {data && data.length === 0 && (
            <EmptyState>Aucun menu. Créez-en un (ex. « Pizzas ») puis ajoutez-y des articles.</EmptyState>
          )}
          {data && data.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th>Articles</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((m) => (
                    <tr key={m.id} className={editing?.id === m.id ? styles.editing : undefined}>
                      <td>
                        <div className={styles.withThumb}>
                          <Thumb url={m.imageUrl} />
                          <div>
                            <span className={styles.name}>{m.nom}</span>
                            {m.description && <span className={styles.sub}>{m.description}</span>}
                          </div>
                        </div>
                      </td>
                      <td className={styles.num}>
                        <Link to={`/admin/articles?menu=${m.id}`} className={styles.seeAll}>
                          {m.nbArticles} {m.nbArticles > 1 ? 'articles' : 'article'}
                        </Link>
                      </td>
                      <td>
                        {confirmId === m.id ? (
                          <div className={styles.confirm}>
                            Supprimer ?
                            <Button size="sm" variant="red" onClick={() => remove(m.id)}>
                              Oui
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                              Non
                            </Button>
                          </div>
                        ) : (
                          <div className={styles.rowActions}>
                            <a
                              className={styles.iconBtn}
                              href={`/carte/${m.id}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Voir ${m.nom} sur le site`}
                              title="Voir sur le site"
                            >
                              <ArrowUpRight size={15} />
                            </a>
                            <button className={styles.iconBtn} onClick={() => setEditing(m)} aria-label={`Modifier ${m.nom}`}>
                              <Pencil size={15} />
                            </button>
                            <button
                              className={`${styles.iconBtn} ${styles.danger}`}
                              onClick={() => setConfirmId(m.id)}
                              aria-label={`Supprimer ${m.nom}`}
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
            title={editing ? `Modifier « ${editing.nom} »` : 'Nouveau menu'}
            icon={editing ? <Pencil size={14} /> : <Plus size={14} />}
          >
            <MenuForm
              key={editing?.id ?? 'new'}
              menu={editing ?? undefined}
              onSubmit={save}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </Panel>
        </div>
      </div>
    </>
  )
}
