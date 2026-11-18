import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { adminApi } from '../../api/admin'
import { ApiError, mediaUrl } from '../../api/client'
import { ImageIcon, Trash } from './Icons'
import styles from './ImageField.module.css'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

interface ImageFieldProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  /** lets the parent form block submit while a photo is still uploading */
  onUploadingChange?: (uploading: boolean) => void
}

/** Picks a photo, uploads it right away, and hands the resulting /uploads/… URL to the form. */
export function ImageField({ label, value, onChange, onUploadingChange }: ImageFieldProps) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File) {
    setError(null)
    if (!ACCEPTED.includes(file.type)) return setError('Choisissez une image JPG, PNG ou WebP')
    if (file.size > MAX_SIZE) return setError('Image trop lourde (5 Mo maximum)')

    setUploading(true)
    onUploadingChange?.(true)
    try {
      const { url } = await adminApi.uploadImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Envoi impossible')
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow choosing the same file again
    if (file) void upload(file)
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) void upload(file)
  }

  return (
    <div className={styles.field}>
      <span className={styles.label} id={`${id}-label`}>
        {label}
      </span>

      <div
        className={`${styles.zone} ${dragging ? styles.dragging : ''} ${value ? styles.filled : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {value ? (
          <img src={mediaUrl(value)} alt="" className={styles.preview} />
        ) : (
          <div className={styles.empty}>
            <ImageIcon size={26} />
            <span>Glissez une photo ici</span>
            <small>JPG, PNG ou WebP · 5 Mo max</small>
          </div>
        )}

        {uploading && (
          <div className={styles.busy} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            Envoi…
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.pick}
          onClick={() => input.current?.click()}
          disabled={uploading}
          aria-describedby={`${id}-label`}
        >
          <ImageIcon size={15} />
          {value ? 'Changer la photo' : 'Choisir une photo'}
        </button>
        {value && !uploading && (
          <button type="button" className={styles.remove} onClick={() => onChange(null)}>
            <Trash size={14} /> Retirer
          </button>
        )}
      </div>

      <input ref={input} type="file" accept={ACCEPTED.join(',')} hidden onChange={onPick} />
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
