import { Suspense, useState, type FormEvent } from 'react'
import { lazyWithRetry } from '../../utils/lazy'
import { googleMapsSearchUrl } from '../../utils/maps'
import { ApiError } from '../../api/client'
import styles from '../../pages/admin/Admin.module.css'
import type { PointDeVente, PointDeVenteInput } from '../../types'
import type { Coords } from '../map/LocationPicker'
import { Button } from '../ui/Button'
import { TextField } from '../ui/Field'

const LocationPicker = lazyWithRetry(() => import('../map/LocationPicker').then((m) => ({ default: m.LocationPicker })))

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
  const [mapsQuery, setMapsQuery] = useState(point?.googleMapsQuery ?? '')
  const [telephone, setTelephone] = useState(point?.telephone ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const testQuery = mapsQuery.trim() || [nom.trim(), adresse.trim()].filter(Boolean).join(', ')

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
        googleMapsQuery: mapsQuery.trim() || null,
        telephone: telephone.trim() || null,
      })
      if (!point) {
        setNom('')
        setAdresse('')
        setCoords(null)
        setMapsQuery('')
        setTelephone('')
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

      <TextField
        label="Téléphone"
        type="tel"
        inputMode="tel"
        placeholder="+216 71 000 000"
        hint="Affiché sur la carte du restaurant — les clients peuvent appeler d’un simple toucher."
        maxLength={32}
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
      />

      <div className={styles.mapsQuery}>
        <TextField
          label="Recherche Google Maps (bouton Itinéraire)"
          placeholder="Di Napoli Manzah 5, Rue Mustapha Abdessalem, Ariana 2091"
          hint="Ce texte est tapé dans la barre de recherche de Google Maps quand un client appuie sur « Itinéraire ». Écrivez-le comme le restaurant apparaît sur Google. Vide = la position du repère est utilisée."
          maxLength={191}
          value={mapsQuery}
          onChange={(e) => setMapsQuery(e.target.value)}
        />
        {testQuery && (
          <a href={googleMapsSearchUrl(testQuery)} target="_blank" rel="noreferrer" className={styles.testLink}>
            Tester dans Google Maps ↗
          </a>
        )}
      </div>

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
