'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { RevealLines } from '@/components/ui/reveal'

/* ────────────────────────────────────────────────────────────────
   TestimonialCard — Baseline Three-Up Quote Card.
   • Soft surface card (#F5F5F7)
   • Large brand quote glyph “
   • Blockquote with relaxed leading
   • Hairline rule with author name and role/location
   • Spring hover lift interaction (y: -8px)
   ──────────────────────────────────────────────────────────────── */

function TestimonialCard({ item, index }) {
  const cardRef = useRef(null)
  const quoteRef = useRef(null)

  const onMouseEnter = () => {
    const card = cardRef.current
    const quote = quoteRef.current
    if (!card) return
    gsap.to(card, {
      y: -8,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.09)',
    })
    if (quote) {
      gsap.to(quote, { scale: 1.15, duration: 0.3, ease: 'power2.out' })
    }
  }

  const onMouseLeave = () => {
    const card = cardRef.current
    const quote = quoteRef.current
    if (!card) return
    gsap.to(card, {
      y: 0,
      duration: 0.45,
      ease: 'power3.out',
      boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
    })
    if (quote) {
      gsap.to(quote, { scale: 1, duration: 0.4, ease: 'power3.out' })
    }
  }

  const quoteText = item.quote || item.review || ''
  const roleText =
    item.role ||
    (item.rating ? `${item.rating}★ Verified Client` : 'Verified Client · Kolkata')

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative flex h-full w-[320px] shrink-0 flex-col justify-between rounded-2xl bg-[#F5F5F7] p-7 transition-colors duration-200 select-none sm:w-[380px] sm:p-8 lg:w-[420px]"
      style={{ willChange: 'transform, box-shadow' }}
    >
      <div>
        <span
          ref={quoteRef}
          aria-hidden
          className="inline-block text-4xl font-serif leading-none text-[var(--brand-primary)] opacity-85 select-none sm:text-5xl"
        >
          &ldquo;
        </span>
        <blockquote className="mt-4 text-[1rem] font-normal leading-relaxed text-[#111111] sm:text-[1.08rem]">
          {quoteText}
        </blockquote>
      </div>

      <figcaption className="mt-7 border-t border-black/[0.08] pt-4">
        <span className="block text-[0.95rem] font-semibold text-[#111111]">
          {item.name}
        </span>
        <span className="mt-0.5 block text-[0.825rem] font-normal text-black/50">
          {roleText}
        </span>
      </figcaption>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   TestimonialClient — Infinite Loop Marquee (Left to Right)
   • Dot eyebrow: • WHAT CLIENTS SAY
   • Masked line reveal heading: "Loved by / our garden owners"
   • Infinite auto-scrolling track (left to right)
   • Seamless loop with pause on hover
   • Edge fade gradients for polished entry/exit
   ──────────────────────────────────────────────────────────────── */

export default function TestimonialClient({ testimonials = [] }) {
  if (!testimonials.length) return null

  // Ensure there are enough items for a seamless 50% loop
  const baseItems = testimonials.length < 6
    ? [...testimonials, ...testimonials, ...testimonials]
    : testimonials

  // 2 sets of baseItems for the 0% -> -50% (or -50% -> 0%) seamless infinite translation
  const trackItems = [...baseItems, ...baseItems]

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="overflow-hidden pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]"
    >
      {/* ── Centralized Eyebrow + Header ── */}
      <div className="website-gutter mx-auto max-w flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/50">
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]"
          />
          What clients say
        </span>

        <h2
          id="testimonials-title"
          className="mt-4 font-neue text-4xl font-medium leading-[0.95] tracking-tight text-[#111111] sm:text-5xl lg:text-[3.6rem] text-center"
        >
          <RevealLines items={['Loved by', 'our garden owners']} className="text-center" />
        </h2>
      </div>

      {/* ── Infinite auto-scrolling marquee (Left to Right) ── */}
      <div className="testimonial-marquee-wrapper relative mt-12 w-full overflow-hidden sm:mt-14">
        {/* Soft edge fade masks on both sides */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28" />

        {/* Moving track */}
        <div className="testimonial-track flex w-max items-stretch gap-5 pt-2 pl-5">
          {trackItems.map((item, index) => (
            <TestimonialCard
              key={`${item.name}-${index}`}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* ── Keyframes for infinite left-to-right motion ── */}
      <style jsx>{`
        .testimonial-track {
          animation: testimonial-ltr 45s linear infinite;
          will-change: transform;
        }

        .testimonial-marquee-wrapper:hover .testimonial-track {
          animation-play-state: paused;
        }

        /* Left to Right: start at -50% and travel to 0% */
        @keyframes testimonial-ltr {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-track {
            animation: none;
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  )
}
