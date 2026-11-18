import { lazy, Suspense, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import styles from '../../pages/admin/Admin.module.css'
import type { PointDeVente, PointDeVenteInput } from '../../types'
import type { Coords } from '../map/LocationPicker'
import { Button } from '../ui/Button'
import { TextField } from '../ui/Field'

const LocationPicker = lazy(() => import('../map/LocationPicker').then((m) => ({ default: m.LocationPicker })))

interface PointDeVenteFormProps {
  point?: PointDeVente
  onSubmit: (data: PointDeVenteInput) => Promise<void>
  onCancel?: () => void
}

export function PointDeVenteForm({ point, onSubmit, onCancel }: PointDeVenteFormProps) {
  const [nom, setNom] = useState(point?.nom ?? '')
  const [adresse, setAdresse] = useState(point?.adresse ?? '')
  const [coords, setCoords] = useState<Coords | null>(
    point?.latitude != null && point.longitude != null ? { latitude: point.latitude, longitude: point.longitude } : null,
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!nom.trim()) {
      setError('Le nom est requis')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        nom: nom.trim(),
        adresse: adresse.trim() || null,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      })
      if (!point) {
        setNom('')
        setAdresse('')
        setCoords(null)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Enregistrement impossible')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <TextField label="Nom" placeholder="Di Napoli Centre-ville" value={nom} onChange={(e) => setNom(e.target.value)} />

      <div>
        <span className={styles.fieldLabel}>Emplacement sur la carte</span>
        <Suspense fallback={<div className={styles.mapLoading}>Chargement de la carte…</div>}>
          <LocationPicker value={coords} onChange={setCoords} onAddressFound={setAdresse} />
        </Suspense>
      </div>

      <TextField
        label="Adresse affichée sur le site"
        placeholder="Rue, code postal, ville"
        hint="Remplie automatiquement depuis la carte — vous pouvez la modifier."
        maxLength={191}
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
      />

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <div className={styles.formActions}>
        <Button type="submit" variant="green" disabled={saving}>
          {saving ? 'Enregistrement…' : point ? 'Mettre à jour' : 'Ajouter le restaurant'}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}
