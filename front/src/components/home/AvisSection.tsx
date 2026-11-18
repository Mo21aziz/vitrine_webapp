import { useCallback, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { publicApi } from '../../api/public'
import { useAsync } from '../../hooks/useAsync'
import { Button } from '../ui/Button'
import { TextArea, TextField } from '../ui/Field'
import { ArrowUpRight, Check } from '../ui/Icons'
import { StarInput, Stars } from '../ui/Stars'
import styles from './AvisSection.module.css'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

type Errors = Partial<Record<'nom' | 'note' | 'commentaire', string>>

export function AvisSection({ articleId, articleNom }: { articleId: number; articleNom: string }) {
  const load = useCallback(() => publicApi.avis(articleId), [articleId])
  const { data } = useAsync(load)

  const [nom, setNom] = useState('')
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [site, setSite] = useState('') // honeypot
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    const found: Errors = {}
    if (nom.trim().length < 2) found.nom = 'Indiquez votre prénom ou votre nom'
    if (note < 1) found.note = 'Choisissez une note de 1 à 5 étoiles'
    if (commentaire.trim().length < 5) found.commentaire = 'Dites-nous en un peu plus (5 caractères minimum)'
    setErrors(found)
    if (Object.keys(found).length) return

    setSending(true)
    setServerError(null)
    try {
      await publicApi.envoyerAvis(articleId, { nom: nom.trim(), note, commentaire: commentaire.trim(), site })
      setSent(true)
      setNom('')
      setNote(0)
      setCommentaire('')
    } catch (err) {
      if (err instanceof ApiError && err.details.length) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])))
      }
      setServerError(err instanceof ApiError ? err.message : 'Envoi impossible, réessayez.')
    } finally {
      setSending(false)
    }
  }

  const total = data?.total ?? 0

  return (
    <section className={styles.section} id="avis" aria-labelledby="avis-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={`eyebrow ${styles.eyebrow}`}>Recensioni</p>
          <h2 id="avis-title" className={styles.title}>
            Vos <em>avis.</em>
          </h2>

          {data && data.moyenne !== null ? (
            <div className={styles.summary}>
              <strong className={styles.score}>{data.moyenne.toLocaleString('fr-FR')}</strong>
              <div>
                <Stars value={data.moyenne} size={20} />
                <span className={styles.summaryCount}>
                  {total} avis {total > 1 ? 'publiés' : 'publié'}
                </span>
              </div>
            </div>
          ) : (
            <p className={styles.emptyText}>Aucun avis pour l’instant. Soyez le premier à goûter et à nous le dire !</p>
          )}

          {data && data.avis.length > 0 && (
            <ul className={styles.list}>
              {data.avis.map((a) => (
                <li key={a.id} className={styles.item}>
                  <header>
                    <span className={styles.avatar} aria-hidden="true">
                      {a.nom.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <strong>{a.nom}</strong>
                      <time dateTime={a.createdAt}>{dateFormatter.format(new Date(a.createdAt))}</time>
                    </div>
                    <Stars value={a.note} size={14} className={styles.itemStars} />
                  </header>
                  <p>{a.commentaire}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.formCard}>
          {sent ? (
            <div className={styles.thanks} role="status">
              <span className={styles.thanksIcon}>
                <Check size={22} />
              </span>
              <h3>Grazie mille !</h3>
              <p>Votre avis a bien été envoyé. Il apparaîtra ici dès que notre équipe l’aura validé.</p>
              <Button variant="outline" size="sm" onClick={() => setSent(false)} icon={<ArrowUpRight size={14} />}>
                Écrire un autre avis
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className={styles.form}>
              <h3>Vous avez goûté la {articleNom} ?</h3>
              <p className={styles.formLead}>Votre avis aide les autres gourmands — et notre cuisine.</p>

              <StarInput
                value={note}
                onChange={(n) => {
                  setNote(n)
                  setErrors((e) => ({ ...e, note: undefined }))
                }}
                error={errors.note}
              />
              <TextField
                label="Votre nom"
                autoComplete="given-name"
                maxLength={80}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                error={errors.nom}
              />
              <TextArea
                label="Votre avis"
                rows={4}
                maxLength={1000}
                placeholder="La pâte, la cuisson, les saveurs…"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                error={errors.commentaire}
                hint={`${commentaire.length}/1000`}
              />

              {/* Honeypot: invisible to people, bots fill it */}
              <input
                type="text"
                name="site"
                tabIndex={-1}
                autoComplete="off"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className={styles.honeypot}
                aria-hidden="true"
              />

              {serverError && (
                <p className={styles.formError} role="alert">
                  {serverError}
                </p>
              )}

              <Button type="submit" variant="red" disabled={sending} icon={<ArrowUpRight size={16} />}>
                {sending ? 'Envoi…' : 'Publier mon avis'}
              </Button>
              <small className={styles.notice}>Les avis sont relus par notre équipe avant d’être publiés.</small>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
