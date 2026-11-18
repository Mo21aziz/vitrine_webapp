import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Field'
import { ArrowUpRight } from '../components/ui/Icons'
import { Logo } from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'
import { useNoIndex } from '../hooks/useNoIndex'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { login, status } = useAuth()
  useNoIndex()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') return <Navigate to={from} replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Connexion impossible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`${styles.page} texture`}>
      <aside className={styles.side}>
        <Logo />
        <h1>
          Bentornato <em>in cucina.</em>
        </h1>
        <p>Gérez la carte, les adresses et les retours de vos clients depuis un seul endroit.</p>
      </aside>

      <main className={styles.main}>
        <form className={styles.card} onSubmit={onSubmit}>
          <p className="eyebrow">Espace admin</p>
          <h2>Connexion</h2>

          <TextField
            label="Nom d’utilisateur"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="red" size="lg" disabled={submitting} icon={<ArrowUpRight size={16} />}>
            {submitting ? 'Connexion…' : 'Se connecter'}
          </Button>

          <a href="/" className={styles.back}>
            ← Retour au site
          </a>
        </form>
      </main>
    </div>
  )
}
