import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { publicApi } from '../../api/public'
import type { PointDeVente } from '../../types'
import { Button } from '../ui/Button'
import { TextArea, TextField, SelectField } from '../ui/Field'
import { ArrowUpRight, Check } from '../ui/Icons'
import styles from './ReclamationForm.module.css'

const EMPTY = { nom: '', prenom: '', telephone: '', email: '', message: '', pointDeVenteId: '' }
type FormState = typeof EMPTY
type Errors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (!form.pointDeVenteId) errors.pointDeVenteId = 'Choisissez un restaurant'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Adresse e-mail invalide'
  if (form.message.trim().length < 10) errors.message = 'Dites-nous en un peu plus (10 caractères minimum)'
  if (form.telephone && !/^[+\d][\d\s.-]{5,}$/.test(form.telephone)) errors.telephone = 'Numéro invalide'
  return errors
}

export function ReclamationForm({ pointsDeVente }: { pointsDeVente: PointDeVente[] }) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const update = (field: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    setServerError(null)
    try {
      await publicApi.envoyerReclamation({
        nom: form.nom || undefined,
        prenom: form.prenom || undefined,
        telephone: form.telephone || undefined,
        email: form.email,
        message: form.message,
        pointDeVenteId: Number(form.pointDeVenteId),
      })
      setSent(true)
      setForm(EMPTY)
    } catch (err) {
      if (err instanceof ApiError && err.details.length) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])))
      }
      setServerError(err instanceof ApiError ? err.message : 'Envoi impossible, réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon}>
          <Check size={26} />
        </span>
        <h3>Grazie mille !</h3>
        <p>Votre message a bien été transmis à l’équipe. Nous revenons vers vous très vite par e-mail.</p>
        <Button variant="light" onClick={() => setSent(false)}>
          Envoyer un autre message
        </Button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <SelectField
        tone="dark"
        label="Restaurant concerné *"
        value={form.pointDeVenteId}
        onChange={(e) => update('pointDeVenteId')(e.target.value)}
        error={errors.pointDeVenteId}
      >
        <option value="">Sélectionnez un restaurant</option>
        {pointsDeVente.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nom}
          </option>
        ))}
      </SelectField>

      <div className={styles.row}>
        <TextField
          tone="dark"
          label="Prénom"
          autoComplete="given-name"
          value={form.prenom}
          onChange={(e) => update('prenom')(e.target.value)}
        />
        <TextField
          tone="dark"
          label="Nom"
          autoComplete="family-name"
          value={form.nom}
          onChange={(e) => update('nom')(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <TextField
          tone="dark"
          label="E-mail *"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={form.email}
          onChange={(e) => update('email')(e.target.value)}
          error={errors.email}
        />
        <TextField
          tone="dark"
          label="Téléphone"
          type="tel"
          autoComplete="tel"
          placeholder="+216 …"
          value={form.telephone}
          onChange={(e) => update('telephone')(e.target.value)}
          error={errors.telephone}
        />
      </div>

      <TextArea
        tone="dark"
        label="Votre message *"
        placeholder="Racontez-nous ce qui s’est passé…"
        value={form.message}
        onChange={(e) => update('message')(e.target.value)}
        error={errors.message}
      />

      {serverError && (
        <p className={styles.serverError} role="alert">
          {serverError}
        </p>
      )}

      <Button type="submit" variant="light" size="lg" disabled={submitting} icon={<ArrowUpRight size={16} />}>
        {submitting ? 'Envoi…' : 'Envoyer'}
      </Button>
    </form>
  )
}
