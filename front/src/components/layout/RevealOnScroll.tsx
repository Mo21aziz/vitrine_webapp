import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Elements marked with `data-reveal` rise gently into place when they scroll into view.
 * Optional `style={{ '--reveal-delay': '120ms' }}` staggers items in a list.
 * Content is only hidden once JS is running (html.can-reveal), so nothing disappears if JS fails,
 * and visitors who reduce motion see everything immediately.
 */
export function RevealOnScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.classList.add('can-reveal')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    const scan = () =>
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => io.observe(el))
    scan()

    // content loaded from the API appears after the first render
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
