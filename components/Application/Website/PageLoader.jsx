'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import logoMark from '@/public/assets/images/logo-horti.png'

// Curtain durations, ms. Completion itself is driven by real page-load
// signals (see the effect below) — these only bound how long that takes to
// *feel* like: a floor so the brand mark isn't a flash, a ceiling so a slow
// network never strands the visitor behind it.
const MIN_VISIBLE_MS = 900
const REDUCED_MIN_VISIBLE_MS = 150
const MAX_VISIBLE_MS = 4500
const EXIT_MS = 700

/**
 * Opening curtain for the public site, gated on the page's actual load
 * progress rather than a fixed timer:
 *  - readyState transitions (loading -> interactive -> complete) set
 *    progress floors,
 *  - the growing Resource Timing entry count fills the gap between them,
 *  - the curtain only lifts once `window.load` fires (all eagerly-requested
 *    assets — fonts, priority images — are in), clamped to [min, max].
 * Lazy below-the-fold images are unaffected: they haven't been requested
 * yet, so they never block `load`.
 */
export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minVisible = reducedMotion ? REDUCED_MIN_VISIBLE_MS : MIN_VISIBLE_MS
    const start = performance.now()

    // Plain overflow lock rather than reaching into Lenis: once the html
    // element itself can't scroll, Lenis has nothing to smooth.
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    let finished = false
    let rafId = null
    const timers = []

    const bump = (value) => setProgress((current) => (value > current ? value : current))

    bump(15)
    if (document.readyState !== 'loading') {
      bump(55)
    } else {
      document.addEventListener('DOMContentLoaded', () => bump(55), { once: true })
    }

    const poll = () => {
      const loaded = performance.getEntriesByType('resource').length
      // Asymptotic climb toward 92%: fast at first, never quite arriving —
      // the last stretch is reserved for the real `load` signal.
      bump(Math.min(55 + 35 * (1 - Math.exp(-loaded / 12)), 92))
      if (!finished) rafId = requestAnimationFrame(poll)
    }
    rafId = requestAnimationFrame(poll)

    const release = () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
    }

    const finish = () => {
      if (finished) return
      finished = true
      if (rafId !== null) cancelAnimationFrame(rafId)
      bump(100)

      const elapsed = performance.now() - start
      const wait = Math.max(minVisible - elapsed, 0)

      timers.push(
        window.setTimeout(() => {
          release()
          onComplete?.()
          if (reducedMotion) {
            setRemoved(true)
            return
          }
          setExiting(true)
          timers.push(window.setTimeout(() => setRemoved(true), EXIT_MS))
        }, wait),
      )
    }

    let armed = false
    const arm = () => {
      if (armed) return
      armed = true
      finish()
    }

    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })

    // Safety net: never strand the visitor behind the curtain.
    timers.push(window.setTimeout(arm, MAX_VISIBLE_MS))

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      timers.forEach(window.clearTimeout)
      window.removeEventListener('load', arm)
      release()
    }
  }, [])

  if (removed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Horticultural Development Centre"
      className={[
        'fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8',
        'bg-[var(--brand-primary)] text-white',
        'transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]',
        exiting ? '-translate-y-full pointer-events-none' : 'translate-y-0',
      ].join(' ')}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      <div className="flex flex-col items-center gap-3">
        <Image src={logoMark} alt="" priority className="size-14 rounded-full" />
        <span className="flex flex-col items-center leading-none">
          <span className="font-wordmark text-2xl">Horticultural</span>
          <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white/60">
            Development Centre
          </span>
        </span>
      </div>

      <div className="h-px w-40 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full bg-[var(--brand-lime)] transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
