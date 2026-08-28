'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealLines, RevealUp } from '@/components/ui/reveal'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ────────────────────────────────────────────────────────────────
   ServiceDetailContent - shared layout for every /services/* page.

   Props:
     service = {
       num, title, tagline, intro, body[], tags[], images[], accent, slug
       highlights: [{ icon, label, value }]
       related: [{ title, slug }]
     }
   ──────────────────────────────────────────────────────────────── */

// Animated section label that appears on scroll (GSAP reveal)
function RevealLabel({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.from(el, {
      opacity: 0,
      y: 10,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
    })
    return () => tween.kill()
  }, [])
  return (
    <span ref={ref} className="block text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-lime)]/70">
      {children}
    </span>
  )
}

// Glyph-roll heading - CSS-only stagger
const RollHeading = ({ text, className = '' }) => {
  let gi = 0
  return (
    <span aria-label={text} className={className}>
      {text.split(' ').flatMap((word, wi, words) => [
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch, ci) => {
            const delay = `${gi++ * 12}ms`
            return (
              <span key={ci} className="group/h relative inline-block overflow-hidden align-baseline">
                <span
                  className="inline-block transition-transform duration-[400ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/h:-translate-y-full"
                  style={{ transitionDelay: delay }}
                >{ch}</span>
                <span
                  className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-[400ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/h:translate-y-0"
                  style={{ transitionDelay: delay }}
                >{ch}</span>
              </span>
            )
          })}
        </span>,
        wi < words.length - 1 ? ' ' : null,
      ])}
    </span>
  )
}

export default function ServiceDetailContent({ service }) {
  const heroImgRef = useRef(null)

  // Subtle parallax on the hero image
  useEffect(() => {
    const el = heroImgRef.current
    if (!el) return
    const onScroll = () => {
      const scrollY = window.scrollY
      el.style.transform = `translateY(${scrollY * 0.25}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="min-h-screen bg-[var(--background)]">

      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-[var(--brand-ink-soft)] lg:h-[80vh]">
        {/* Parallax image */}
        <div ref={heroImgRef} className="absolute inset-0 will-change-transform" style={{ top: '-10%', bottom: '-10%' }}>
          <Image
            src={service.images[0]}
            alt={service.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Layered scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E0D]/95 via-[#0B1E0D]/50 to-[#0B1E0D]/20" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ background: `radial-gradient(ellipse at 20% 80%, ${service.accent} 0%, transparent 60%)` }}
          aria-hidden
        />

        {/* Content pinned to the bottom */}
        <div className="website-gutter absolute inset-x-0 bottom-0 z-10 pb-10 lg:pb-14">
          {/* Back link */}
          <Link
            href="/services"
            className="group mb-8 inline-flex items-center gap-2 text-[0.78rem] font-medium text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            All Services
          </Link>

          <RevealUp as="p" delay={60} className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-lime)]/70">
            Service {service.num}
          </RevealUp>

          <RevealLines
            items={[service.title]}
            delay={100}
            stagger={0}
            duration={1000}
            className="block"
          />
          <style>{`.rv-line { overflow: hidden } .rv-inner { font-family: var(--font-neue); font-size: clamp(2.4rem,6.5vw,5.5rem); font-weight: 600; line-height: 0.95; letter-spacing: -0.03em; color: white; }`}</style>

          <RevealUp as="p" delay={260} className="mt-4 max-w-lg text-[0.95rem] italic leading-relaxed text-white/55">
            {service.tagline}
          </RevealUp>
        </div>
      </section>

      {/* ── Body ── */}
      <article className="website-gutter py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_340px] lg:gap-20">

          {/* Left: intro + body paragraphs */}
          <div className="flex flex-col gap-8">
            <RevealLabel>Overview</RevealLabel>
            <p className="text-[1.05rem] font-medium leading-relaxed text-[var(--foreground)] lg:text-[1.15rem]">
              {service.intro}
            </p>
            {service.body.map((para, i) => (
              <p key={i} className="text-[0.9rem] leading-[1.8] text-[var(--muted-foreground)]">
                {para}
              </p>
            ))}

            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--brand-primary)]/20 bg-[var(--secondary)] px-4 py-1 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[var(--brand-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: highlights sidebar + second image */}
          <div className="flex flex-col gap-8">
            {/* Second image */}
            {service.images[1] && (
              <div className="relative h-52 overflow-hidden rounded-2xl lg:h-64">
                <Image src={service.images[1]} alt="" fill sizes="340px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-ink-soft)]/60 to-transparent" />
              </div>
            )}

            {/* Highlights */}
            {service.highlights?.length > 0 && (
              <div className="rounded-2xl bg-[var(--brand-ink-soft)] p-6">
                <RevealLabel>At a glance</RevealLabel>
                <ul className="mt-5 flex flex-col gap-4">
                  {service.highlights.map((h) => (
                    <li key={h.label} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)]/30 text-base" aria-hidden>
                        {h.icon}
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/40">{h.label}</span>
                        <span className="text-[0.9rem] font-medium text-white">{h.value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* ── Related services ── */}
      {service.related?.length > 0 && (
        <section className="website-gutter pb-20">
          <RevealLabel>Also explore</RevealLabel>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-[0.9rem] font-medium text-[var(--brand-primary)] transition-all hover:border-[var(--brand-primary)]/30 hover:bg-[var(--secondary)] hover:shadow-sm"
              >
                {rel.title}
                <ArrowUpRight className="size-4 -translate-x-1 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="website-gutter pb-20">
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-[var(--brand-ink-soft)] px-8 py-12 text-center lg:py-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-lime)]/70">
            Interested?
          </p>
          <h2 className="font-neue text-[clamp(1.4rem,3.5vw,2.4rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
            Start with a site visit.
          </h2>
          <p className="max-w-sm text-[0.88rem] leading-relaxed text-white/50">
            No obligation. One of our qualified horticulturists visits your site, assesses the space and gives you an honest brief and estimate.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-lime)] px-7 py-3 text-[0.88rem] font-semibold text-[var(--brand-lime-ink)] transition-all hover:bg-[var(--brand-lime-hover)] hover:shadow-lg hover:shadow-[var(--brand-lime)]/20"
          >
            Contact us
            <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </section>
    </main>
  )
}
