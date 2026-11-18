import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import styles from '../../pages/admin/Admin.module.css'
import type { Menu, MenuInput } from '../../types'
import { Button } from '../ui/Button'
import { TextArea, TextField } from '../ui/Field'
import { ImageField } from '../ui/ImageField'

interface MenuFormProps {
  menu?: Menu
  onSubmit: (data: MenuInput) => Promise<void>
  onCancel?: () => void
}

export function MenuForm({ menu, onSubmit, onCancel }: MenuFormProps) {
  const [nom, setNom] = useState(menu?.nom ?? '')
  const [description, setDescription] = useState(menu?.description ?? '')
  const [imageUrl, setImageUrl] = useState<string | null>(menu?.imageUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!nom.trim()) {
      setError('Le nom du menu est requis')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit({ nom: nom.trim(), description: description.trim() || null, imageUrl })
      if (!menu) {
        setNom('')
        setDescription('')
        setImageUrl(null)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Enregistrement impossible')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <TextField
        label="Nom du menu"
        placeholder="Pizzas, Pâtes, Desserts…"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <TextArea
        label="Description"
        hint="Affichée sur la carte du site (optionnel)"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <ImageField label="Photo du menu" value={imageUrl} onChange={setImageUrl} onUploadingChange={setUploading} />

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <div className={styles.formActions}>
        <Button type="submit" variant="green" disabled={saving || uploading}>
          {saving ? 'Enregistrement…' : menu ? 'Mettre à jour' : 'Créer le menu'}
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
