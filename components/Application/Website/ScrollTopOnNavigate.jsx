'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Next's own scroll-to-top-on-navigation doesn't fire reliably for every
 * route here - at least one page (about-us) loads its content via
 * `next/dynamic(..., { ssr: false })`, so the segment Next tries to scroll
 * into view is still empty when the reset would run, and the window is
 * left wherever it was on the *previous* page (often the footer, if that's
 * where the link that was clicked happened to sit). This is a blanket
 * safety net: force scroll-to-top on every pathname change, skipping
 * back/forward (which should keep the browser's own restored position) and
 * same-page hash navigation (which `scrollToAnchor.js` already handles).
 */
export default function ScrollTopOnNavigate() {
  const pathname = usePathname()
  const isPopNav = useRef(false)
  const isFirstRun = useRef(true)

  useEffect(() => {
    const onPopState = () => { isPopNav.current = true }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    if (isPopNav.current) {
      isPopNav.current = false
      return
    }
    if (window.location.hash) return

    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
