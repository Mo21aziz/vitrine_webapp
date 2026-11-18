import { Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { BarList } from '../../components/dashboard/BarList'
import { Gauge } from '../../components/dashboard/Gauge'
import { ErrorState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { ReclamationList } from '../../components/dashboard/ReclamationList'
import { StatCard } from '../../components/dashboard/StatCard'
import { Check, Flame, Pin, Spark } from '../../components/ui/Icons'
import { useAsync } from '../../hooks/useAsync'
import styles from './Admin.module.css'

const loadLatest = () => adminApi.reclamations().then((list) => list.slice(0, 5))

const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

export function OverviewPage() {
  const stats = useAsync(adminApi.stats)
  const latest = useAsync(loadLatest)
  const s = stats.data
  const greeting = new Date().getHours() < 17 ? 'Buongiorno' : 'Buonasera'

  return (
    <>
      <PageHeader
        eyebrow={today}
        title={
          <>
            {greeting}, <em>chef.</em>
          </>
        }
      />

      {stats.error && !s && <ErrorState message={stats.error} onRetry={stats.reload} />}

      {s && (
        <>
          <div className={styles.stats}>
            <StatCard
              highlight
              icon={<Spark size={16} />}
              label="Nouvelles réclamations"
              value={s.reclamations.NOUVELLE}
              hint={s.reclamations.NOUVELLE ? 'À traiter en priorité' : 'Tout est sous contrôle'}
            />
            <StatCard
              icon={<Flame size={16} />}
              label="Articles à la carte"
              value={s.articles}
              hint={`Répartis dans ${s.menus} ${s.menus > 1 ? 'menus' : 'menu'}`}
            />
            <Link to="/admin/avis" className={styles.statLink}>
              <StatCard
                icon={<Spark size={16} />}
                label="Avis à valider"
                value={s.avis.enAttente}
                hint={
                  s.avis.moyenne === null
                    ? 'Aucun avis reçu'
                    : `Note moyenne ${s.avis.moyenne.toLocaleString('fr-FR')} / 5 · ${s.avis.total} au total`
                }
              />
            </Link>
            <StatCard
              icon={<Check size={16} />}
              label="Reçues cette semaine"
              value={s.reclamations.last7Days}
              hint={`${s.reclamations.total} au total`}
            />
          </div>

          <div className={styles.trio}>
            <Panel title="Réclamations par statut" icon={<Spark size={14} />}>
              <BarList
                items={[
                  { label: 'Nouvelles', value: s.reclamations.NOUVELLE, color: 'var(--red)' },
                  { label: 'En cours', value: s.reclamations.EN_COURS, color: '#d68c28' },
                  { label: 'Traitées', value: s.reclamations.TRAITEE, color: 'var(--green-3)' },
                ]}
              />
            </Panel>

            <Panel tone="red" title="Taux de traitement" className={styles.gaugePanel}>
              <Gauge
                value={s.tauxTraitement}
                label={
                  s.reclamations.total === 0
                    ? 'Aucune réclamation reçue'
                    : `${s.reclamations.TRAITEE} sur ${s.reclamations.total} traitées`
                }
              />
            </Panel>

            <Panel title="Par restaurant" icon={<Pin size={14} />}>
              <BarList items={s.parPointDeVente.map((p) => ({ label: p.nom, value: p.count }))} />
            </Panel>
          </div>
        </>
      )}

      <Panel
        title="Dernières réclamations"
        icon={<Flame size={14} />}
        action={
          <Link to="/admin/reclamations" className={styles.seeAll}>
            Tout voir →
          </Link>
        }
      >
        {latest.error && !latest.data && <ErrorState message={latest.error} onRetry={latest.reload} />}
        {latest.data && <ReclamationList items={latest.data} />}
      </Panel>
    </>
  )
}
