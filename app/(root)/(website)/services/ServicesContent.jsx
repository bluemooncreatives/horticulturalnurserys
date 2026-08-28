'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ClipboardList, PencilRuler, Calculator, Hammer } from 'lucide-react'
import gsap from 'gsap'
import { RevealLines, RevealUp } from '@/components/ui/reveal'
import { SectionHeading, SectionLabel } from './SectionHeader'

/* ────────────────────────────────────────────────────────────────
   ServicesContent — the /services index.

   Layout: hero + stat rail → approach → card grid (one feature card
   over a row of three) → shared process → what backs the work → CTA.
   All content arrives as props from page.jsx so the data stays in the
   server component, matching the service detail pages.
   ──────────────────────────────────────────────────────────────── */

const STEP_ICONS = [ClipboardList, PencilRuler, Calculator, Hammer]

/* Hero stat rail cell edges, indexed by position. 2-up on mobile, 4-up from
   lg, so which cells start a row changes with the breakpoint. Spelled out per
   index so every pair is a base class plus a responsive override of the SAME
   property — composing them from conditions yields competing border-l /
   border-l-0 utilities whose winner depends on stylesheet order. */
const STAT_CELL_EDGES = [
  'px-5 pl-0 lg:px-6 lg:pl-0',
  'border-l px-5 lg:px-6',
  'border-t px-5 pl-0 lg:border-l lg:border-t-0 lg:px-6',
  'border-l border-t px-5 lg:border-t-0 lg:px-6',
]

/* ── Glyph-roll title (CSS-only) ─────────────────────────────── */
const RollTitle = ({ text, className = '' }) => {
  let gi = 0
  return (
    <span aria-label={text} className={className}>
      {text.split(' ').flatMap((word, wi, words) => [
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch, ci) => {
            const delay = `${gi++ * 14}ms`
            return (
              <span key={ci} className="relative inline-block overflow-hidden align-baseline">
                <span
                  className="inline-block transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
                  style={{ transitionDelay: delay }}
                >
                  {ch}
                </span>
                <span
                  className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                  style={{ transitionDelay: delay }}
                >
                  {ch}
                </span>
              </span>
            )
          })}
        </span>,
        wi < words.length - 1 ? ' ' : null,
      ])}
    </span>
  )
}

/* ── Service card ────────────────────────────────────────────── */
function ServiceCard({ service, index, feature = false }) {
  const imgRef = useRef(null)
  const tweenRef = useRef(null)
  const cycleRef = useRef(null)
  const [activeImg, setActiveImg] = useState(0)

  // Both timers are owned by refs and cleared on unmount — the hover handler
  // previously left a bare setTimeout running, which fired a state update
  // after navigation if you moved off the card fast enough.
  useEffect(() => {
    return () => {
      tweenRef.current?.kill()
      clearTimeout(cycleRef.current)
    }
  }, [])

  const onEnter = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    tweenRef.current?.kill()
    tweenRef.current = gsap.to(img, { scale: 1.06, duration: 0.7, ease: 'power2.out' })
    clearTimeout(cycleRef.current)
    cycleRef.current = setTimeout(
      () => setActiveImg((p) => (p + 1) % service.images.length),
      300
    )
  }, [service.images.length])

  const onLeave = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    tweenRef.current?.kill()
    tweenRef.current = gsap.to(img, { scale: 1, duration: 0.55, ease: 'power3.out' })
    clearTimeout(cycleRef.current)
  }, [])

  return (
    <Link
      href={`/services/${service.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative block overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--brand-ink-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
    >
      {/* Background image stack */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          {service.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes={feature ? '100vw' : '(max-width: 1024px) 100vw, 33vw'}
              quality={82}
              className="object-cover transition-opacity duration-700"
              style={{ opacity: i === activeImg ? 1 : 0 }}
              priority={index === 0 && i === 0}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E0D]/95 via-[#0B1E0D]/55 to-[#0B1E0D]/15" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.14]"
          style={{ background: service.accent }}
        />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col justify-between p-8 md:p-10 ${
          feature ? 'min-h-[480px] lg:min-h-[560px]' : 'min-h-[400px] lg:min-h-[460px]'
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="font-neue text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/45">
            {service.num}
          </span>
          <span className="flex size-9 items-center justify-center rounded-[var(--radius-full)] border border-white/20 text-white/50 transition-all duration-300 group-hover:rotate-45 group-hover:border-[var(--brand-lime)] group-hover:text-[var(--brand-lime)]">
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>

        <div className={`flex flex-col gap-3 ${feature ? 'max-w-2xl' : ''}`}>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/45 transition-colors duration-300 group-hover:text-[var(--brand-lime)]/80">
            {service.tagline}
          </p>

          <RollTitle
            text={service.title}
            className={`block font-neue font-medium leading-[1.06] tracking-[-0.025em] text-white ${
              feature ? 'text-[clamp(1.9rem,4.5vw,3.1rem)]' : 'text-[1.55rem] md:text-[1.75rem]'
            }`}
          />

          <span aria-hidden className="mt-1 h-px w-9 bg-[var(--brand-lime)] transition-all duration-400 group-hover:w-16" />

          <p
            className={`mt-1 text-[0.86rem] leading-[1.75] text-white/55 ${
              feature ? '' : 'line-clamp-3'
            }`}
          >
            {service.desc}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {(feature ? service.tags : service.tags.slice(0, 3)).map((tag) => (
              <span
                key={tag}
                className="rounded-[var(--radius-pill)] border border-white/15 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-white/50 transition-colors duration-300 group-hover:border-white/30 group-hover:text-white/75"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function ServicesContent({ services, heroStats, approach, process, foundations }) {
  const [feature, ...rest] = services

  return (
    <main className="min-h-screen bg-[var(--background)]">

      {/* ══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative flex min-h-[62vh] flex-col justify-end overflow-hidden bg-[var(--brand-ink-soft)] pt-32">
        {/* Blueprint grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(var(--brand-lime) 1px, transparent 1px), linear-gradient(90deg, var(--brand-lime) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Soft radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[12%] top-1/2 size-[640px] -translate-y-1/2 rounded-full opacity-[0.13]"
          style={{ background: 'radial-gradient(circle, var(--brand-lime) 0%, transparent 70%)' }}
        />

        <div className="lumora-shell relative z-10 w-full pb-10 lg:pb-12">
          <RevealUp
            as="p"
            className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-lime)]"
          >
            What we do
          </RevealUp>

          {/* One .rv-line per rendered line — .rv-line is overflow-hidden, so a
              wrap driven by a max-width would be clipped rather than wrapped. */}
          <div className="sv-hero-title">
            <RevealLines items={['Our', 'Services']} delay={60} stagger={90} duration={1050} />
          </div>

          <RevealUp as="p" delay={300} className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-white/60">
            From a single balcony to a township-scale landscape — we design, plant and maintain
            green spaces across Kolkata and West Bengal.
          </RevealUp>
        </div>

        {/* Stat rail */}
        <div className="relative z-10 border-t border-white/15">
          <div className="lumora-shell">
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {heroStats.map((stat, i) => (
                <RevealUp
                  key={stat.label}
                  delay={360 + i * 70}
                  className={`border-white/10 py-5 lg:py-6 ${STAT_CELL_EDGES[i % 4]}`}
                >
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/40">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5 font-neue text-[clamp(1.05rem,2vw,1.4rem)] font-medium leading-tight tracking-[-0.01em] text-white">
                    {stat.value}
                  </dd>
                </RevealUp>
              ))}
            </dl>
          </div>
        </div>

        {/* Scoped to this hero so the global .rv-inner rule — and every other
            masked reveal on the page — keeps its own sizing. */}
        <style>{`
          .sv-hero-title .rv-inner {
            font-family: var(--font-neue);
            font-size: clamp(2.8rem, 7.5vw, 6rem);
            font-weight: 600;
            line-height: 0.94;
            letter-spacing: -0.035em;
            color: #fff;
          }
        `}</style>
      </section>

      {/* ══ Approach ═══════════════════════════════════════════ */}
      <section className="lumora-shell py-16 lg:py-24">
        <SectionLabel>Our approach</SectionLabel>

        <RevealUp
          as="p"
          delay={80}
          className="mt-8 max-w-4xl font-neue text-[clamp(1.25rem,2.6vw,2rem)] font-medium leading-[1.32] tracking-[-0.02em] text-[var(--brand-primary)]"
        >
          {approach.lead}
        </RevealUp>

        <div className="mt-12 grid gap-x-14 gap-y-6 lg:grid-cols-2">
          {approach.body.map((para, i) => (
            <RevealUp
              key={i}
              as="p"
              delay={120 + i * 60}
              className="text-[0.92rem] leading-[1.85] text-[var(--muted-foreground)]"
            >
              {para}
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ══ Service cards ══════════════════════════════════════ */}
      <section className="lumora-shell pb-16 lg:pb-24">
        <SectionLabel>Four service lines</SectionLabel>
        <SectionHeading className="mt-6 max-w-2xl">
          One nursery carries all of them, start to finish.
        </SectionHeading>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          <RevealUp distance={28} className="lg:col-span-3">
            <ServiceCard service={feature} index={0} feature />
          </RevealUp>

          {rest.map((service, i) => (
            <RevealUp key={service.slug} delay={90 + i * 90} distance={28}>
              <ServiceCard service={service} index={i + 1} />
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ══ Process ════════════════════════════════════════════ */}
      <section className="lumora-shell pb-16 lg:pb-24">
        <SectionLabel>How every project runs</SectionLabel>
        <SectionHeading className="mt-6 max-w-2xl">
          Four steps, in order. Nothing skipped.
        </SectionHeading>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length]
            return (
              <RevealUp
                key={step.title}
                as="li"
                delay={80 + i * 90}
                className="group flex flex-col gap-4 bg-[var(--brand-white)] p-7 transition-colors duration-300 hover:bg-[var(--secondary)] lg:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-[var(--radius-full)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] transition-colors duration-300 group-hover:bg-[var(--brand-lime)] group-hover:text-[var(--brand-lime-ink)]">
                    <Icon className="size-[1.05rem]" strokeWidth={1.6} />
                  </span>
                  <span className="font-neue text-[1.6rem] font-medium leading-none text-[var(--brand-primary)]/15">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-[1.02rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)]">
                  {step.title}
                </h3>
                <p className="text-[0.84rem] leading-[1.7] text-[var(--muted-foreground)]">
                  {step.desc}
                </p>
              </RevealUp>
            )
          })}
        </ol>
      </section>

      {/* ══ What backs the work — dark band ════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--brand-ink-soft)] py-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background: 'radial-gradient(ellipse at 85% 10%, var(--brand-lime) 0%, transparent 55%)',
          }}
        />
        <div className="lumora-shell relative">
          <SectionLabel tone="dark">What backs the work</SectionLabel>
          <SectionHeading tone="dark" className="mt-6 max-w-3xl">
            Every service above runs off the same farm, the same crew and the same credentials.
          </SectionHeading>

          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
            {foundations.map((item, i) => (
              <RevealUp
                key={item.title}
                delay={80 + i * 90}
                className="group flex flex-col gap-5 rounded-[var(--radius-4xl)] border border-white/10 bg-white/[0.035] p-7 transition-all duration-300 hover:border-[var(--brand-lime)]/40 hover:bg-white/[0.07] lg:p-8"
              >
                <span className="font-neue text-[clamp(1.9rem,3.6vw,2.6rem)] font-medium leading-none tracking-[-0.03em] text-[var(--brand-lime)]">
                  {item.figure}
                </span>
                <h3 className="font-neue text-[1.15rem] font-medium tracking-[-0.02em] text-white">
                  {item.title}
                </h3>
                <p className="text-[0.86rem] leading-[1.75] text-white/55">{item.desc}</p>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════ */}
      <section className="lumora-shell py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--brand-ink-soft)] px-8 py-14 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              background: 'radial-gradient(ellipse at 10% 100%, var(--brand-lime) 0%, transparent 60%)',
            }}
          />
          <div className="relative flex flex-col items-start gap-6 lg:max-w-2xl">
            <RevealUp
              as="p"
              className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-lime)]"
            >
              Ready to start?
            </RevealUp>
            <RevealUp
              as="h2"
              delay={70}
              className="font-neue text-[clamp(1.7rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white"
            >
              Let&apos;s build your green space.
            </RevealUp>
            <RevealUp as="p" delay={140} className="max-w-md text-[0.92rem] leading-[1.8] text-white/50">
              Every project starts with a site visit and a conversation — no obligation, just honest
              advice from qualified horticulturists.
            </RevealUp>
            <RevealUp delay={200}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-lime)] px-7 py-3.5 text-[0.88rem] font-semibold text-[var(--brand-lime-ink)] transition-all duration-300 hover:bg-[var(--brand-lime-hover)] hover:shadow-[0_12px_36px_-10px_rgba(201,242,78,0.45)]"
              >
                Get in touch
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </RevealUp>
          </div>
        </div>
      </section>
    </main>
  )
}
