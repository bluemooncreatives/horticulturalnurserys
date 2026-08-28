'use client'

import { RevealUp } from '@/components/ui/reveal'

/* ────────────────────────────────────────────────────────────────
   Section furniture shared across /services and its detail pages.

   `tone` selects the palette for the band the header sits on:
   'light' for the page background, 'dark' for --brand-ink-soft bands.
   ──────────────────────────────────────────────────────────────── */

// Eyebrow label followed by a hairline rule that runs out to the edge.
export function SectionLabel({ children, tone = 'light', className = '' }) {
  const color = tone === 'dark' ? 'text-[var(--brand-lime)]' : 'text-[var(--brand-primary)]'
  const rule = tone === 'dark' ? 'bg-[var(--brand-lime)]/35' : 'bg-[var(--brand-primary)]/20'
  return (
    <RevealUp className={`flex items-center gap-4 ${className}`}>
      <span className={`shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.3em] ${color}`}>
        {children}
      </span>
      <span aria-hidden className={`h-px flex-1 ${rule}`} />
    </RevealUp>
  )
}

export function SectionHeading({ children, tone = 'light', className = '' }) {
  const color = tone === 'dark' ? 'text-white' : 'text-[var(--brand-primary)]'
  return (
    <RevealUp
      as="h2"
      delay={60}
      className={`font-neue text-[clamp(1.6rem,4vw,2.9rem)] font-medium leading-[1.05] tracking-[-0.025em] ${color} ${className}`}
    >
      {children}
    </RevealUp>
  )
}
