import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import styles from '../../pages/admin/Admin.module.css'
import type { Article, ArticleInput, Menu } from '../../types'
import { formatPrix } from '../../utils/format'
import { Button } from '../ui/Button'
import { SelectField, TextArea, TextField } from '../ui/Field'
import { ImageField } from '../ui/ImageField'

interface ArticleFormProps {
  article?: Article
  menus: Menu[]
  defaultMenuId?: number
  onSubmit: (data: ArticleInput) => Promise<void>
  onCancel?: () => void
}

type Errors = Partial<Record<keyof ArticleInput, string>>

export function ArticleForm({ article, menus, defaultMenuId, onSubmit, onCancel }: ArticleFormProps) {
  const [menuId, setMenuId] = useState(String(article?.menuId ?? defaultMenuId ?? ''))
  const [nom, setNom] = useState(article?.nom ?? '')
  const [prix, setPrix] = useState(article ? String(article.prix) : '')
  const [composition, setComposition] = useState(article?.composition ?? '')
  const [remise, setRemise] = useState(article ? String(article.remise) : '0')
  const [imageUrl, setImageUrl] = useState<string | null>(article?.imageUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const prixNumber = Number(prix.replace(',', '.'))
  const remiseNumber = Number(remise)
  const previewValid = prixNumber > 0 && remiseNumber >= 0 && remiseNumber <= 100

  async function submit(event: FormEvent) {
    event.preventDefault()
    const found: Errors = {}
    if (!menuId) found.menuId = 'Choisissez le menu où afficher cet article'
    if (!nom.trim()) found.nom = 'Nom requis'
    if (!(prixNumber > 0)) found.prix = 'Prix invalide'
    if (!composition.trim()) found.composition = 'Composition requise'
    if (!Number.isInteger(remiseNumber) || remiseNumber < 0 || remiseNumber > 100) found.remise = 'Entre 0 et 100'
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    setFormError(null)
    try {
      await onSubmit({
        nom: nom.trim(),
        prix: prixNumber,
        composition: composition.trim(),
        remise: remiseNumber,
        menuId: Number(menuId),
        imageUrl,
      })
      if (!article) {
        // keep the chosen menu so several dishes can be added in a row
        setNom('')
        setPrix('')
        setComposition('')
        setRemise('0')
        setImageUrl(null)
      }
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Enregistrement impossible')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <SelectField
        label="Menu"
        value={menuId}
        onChange={(e) => setMenuId(e.target.value)}
        error={errors.menuId}
        hint={menus.length === 0 ? 'Créez d’abord un menu dans l’onglet « Menus »' : undefined}
      >
        <option value="">Choisir un menu…</option>
        {menus.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nom}
          </option>
        ))}
      </SelectField>
      <TextField label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} error={errors.nom} />
      <div className={styles.formRow}>
        <TextField
          label="Prix (DT)"
          inputMode="decimal"
          placeholder="12,500"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          error={errors.prix}
        />
        <TextField
          label="Remise (%)"
          type="number"
          min={0}
          max={100}
          value={remise}
          onChange={(e) => setRemise(e.target.value)}
          error={errors.remise}
        />
      </div>
      <TextArea
        label="Composition"
        rows={3}
        value={composition}
        onChange={(e) => setComposition(e.target.value)}
        error={errors.composition}
      />
      <ImageField label="Photo du plat" value={imageUrl} onChange={setImageUrl} onUploadingChange={setUploading} />

      {previewValid && (
        <div className={styles.preview}>
          <span>Prix affiché sur le site</span>
          <strong>{formatPrix(Math.round(prixNumber * (100 - remiseNumber) * 10) / 1000)}</strong>
        </div>
      )}

      {formError && (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      )}

      <div className={styles.formActions}>
        <Button type="submit" variant="green" disabled={saving || uploading}>
          {saving ? 'Enregistrement…' : article ? 'Mettre à jour' : 'Ajouter à la carte'}
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
