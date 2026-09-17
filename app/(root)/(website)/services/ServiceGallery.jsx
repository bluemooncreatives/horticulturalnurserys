'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { RevealUp } from '@/components/ui/reveal'
import { SectionLabel, SectionHeading } from './SectionHeader'

/* ────────────────────────────────────────────────────────────────
   ServiceGallery - a 3-photo proof-of-work strip shared by every
   service detail page (the shared ServiceDetailContent template and
   the bespoke LandscapeDevelopmentContent both render it the same
   way, from a `gallery: [{ src, alt }]` array on the service data).

   Asymmetric grid: one tall frame on the left, two stacked on the
   right - reads as a small portfolio rather than a repeating card
   row, and gives the page real site photography instead of the
   fixed hero + materials pair it had before.

   The last tile carries an image-overlay CTA (arrow badge, "See more
   work") - a third distinct CTA shape alongside the pill buttons and
   plain text links already used on these pages, revealed on hover /
   focus so it never competes with the photograph at rest.
   ──────────────────────────────────────────────────────────────── */
export default function ServiceGallery({ gallery, label = 'From our work', heading = 'A few sites this service has shaped.' }) {
  if (!gallery || gallery.length < 2) return null

  const [first, second, third] = gallery

  return (
    <section className="lumora-shell pb-16 lg:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading className="mt-6 max-w-2xl">{heading}</SectionHeading>
        </div>
        <Link
          href="/contact"
          className="group mb-1 inline-flex shrink-0 items-center gap-1.5 text-[0.875rem] font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-lime-ink)]"
        >
          Like what you see? Get a quote
          <ArrowUpRight className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-[1.3fr_1fr] lg:gap-5">
        <RevealUp
          delay={80}
          className="relative col-span-2 aspect-[16/11] overflow-hidden rounded-[var(--radius-4xl)] sm:aspect-[16/10] lg:col-span-1 lg:aspect-auto"
        >
          <Image
            src={first.src}
            alt={first.alt || ''}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={82}
            className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
          />
        </RevealUp>

        <div className="col-span-2 grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-1 lg:grid-cols-1">
          {second && (
            <RevealUp delay={160} className="relative aspect-square overflow-hidden rounded-[var(--radius-4xl)] lg:aspect-[16/9.5]">
              <Image
                src={second.src}
                alt={second.alt || ''}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                quality={82}
                className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
              />
            </RevealUp>
          )}

          {third && (
            <RevealUp delay={240} className="group relative aspect-square overflow-hidden rounded-[var(--radius-4xl)] lg:aspect-[16/9.5]">
              <Image
                src={third.src}
                alt={third.alt || ''}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                quality={82}
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Image-overlay CTA - only tile in the page where the call to
                  action lives on top of a photograph rather than beside it. */}
              <Link
                href="/contact"
                aria-label="See more of our completed work"
                className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <span className="text-[0.8rem] font-medium text-white">See more work</span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-lime)] text-[var(--brand-lime-ink)]">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </RevealUp>
          )}
        </div>
      </div>
    </section>
  )
}
