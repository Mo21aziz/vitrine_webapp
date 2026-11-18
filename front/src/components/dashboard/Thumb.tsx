import { mediaUrl } from '../../api/client'
import styles from '../../pages/admin/Admin.module.css'
import { ImageIcon } from '../ui/Icons'

/** Small square photo for admin tables, with a placeholder when there is none. */
export function Thumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <span className={styles.thumb} title="Pas de photo">
        <ImageIcon size={20} />
      </span>
    )
  }
  return <img className={styles.thumb} src={mediaUrl(url)} alt="" loading="lazy" />
}
