import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNoIndex } from '../../hooks/useNoIndex'
import { ArrowUpRight, Logout } from '../ui/Icons'
import { Logo } from '../ui/Logo'
import styles from './AdminLayout.module.css'

const TABS = [
  { to: '/admin', label: 'Vue d’ensemble', end: true },
  { to: '/admin/reclamations', label: 'Réclamations' },
  { to: '/admin/avis', label: 'Avis' },
  { to: '/admin/menus', label: 'Menus' },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/adresses', label: 'Adresses' },
]

export function AdminLayout() {
  const { admin, logout } = useAuth()
  useNoIndex()

  return (
    <div className={`${styles.shell} texture`}>
      <header className={styles.topbar}>
        <Logo to="/admin" tagline="Dashboard" size="sm" />

        <nav className={styles.tabs} aria-label="Navigation admin">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => (isActive ? styles.active : undefined)}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.user}>
          <Link to="/" className={styles.site}>
            Voir le site <ArrowUpRight size={14} />
          </Link>
          <span className={styles.avatar} title={admin?.username}>
            {admin?.username.charAt(0).toUpperCase()}
          </span>
          <button className={styles.logout} onClick={logout} aria-label="Se déconnecter" title="Se déconnecter">
            <Logout size={18} />
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
