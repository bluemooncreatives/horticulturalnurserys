'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardList,
  PencilRuler,
  Calculator,
  Hammer,
} from 'lucide-react'
import { RevealLines, RevealUp } from '@/components/ui/reveal'
import { SectionHeading, SectionLabel } from '../SectionHeader'

/* ────────────────────────────────────────────────────────────────
   LandscapeDevelopmentContent

   A bespoke, long-form layout for /services/landscape-development.
   The other three service pages still use the shared
   ServiceDetailContent; this one carries far more data (process,
   capabilities, lawn grades, materials, sectors, credentials, farm)
   than that layout's single sidebar can hold, so it gets its own.

   Band rhythm is light → dark → light → dark → light, so the page
   breathes instead of running as one continuous column.
   ──────────────────────────────────────────────────────────────── */

const STEP_ICONS = [ClipboardList, PencilRuler, Calculator, Hammer]

/* Cell edges for the hero stat rail, indexed by position. The grid is 2-up on
   mobile and 4-up from lg, so which cells start a row (and therefore take no
   left rule and no left padding) changes with the breakpoint. Spelled out per
   index rather than composed from conditions: every pair here is a base class
   plus a responsive override of the SAME property, which Tailwind always emits
   in that order - composing them from separate conditions produced competing
   `border-l` / `border-l-0` utilities whose winner depended on stylesheet
   order rather than on intent. */
const STAT_CELL_EDGES = [
  'px-5 pl-0 lg:px-6 lg:pl-0',
  'border-l px-5 lg:px-6',
  'border-t px-5 pl-0 lg:border-l lg:border-t-0 lg:px-6',
  'border-l border-t px-5 lg:border-t-0 lg:px-6',
]

/* ── Page ─────────────────────────────────────────────────────── */

export default function LandscapeDevelopmentContent({ service }) {
  const heroImgRef = useRef(null)

  // Subtle parallax on the hero image. rAF-throttled so the scroll listener
  // never writes style more than once a frame, and skipped outright when the
  // visitor has asked for reduced motion.
  useEffect(() => {
    const el = heroImgRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        el.style.transform = `translate3d(0, ${window.scrollY * 0.22}px, 0)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[var(--background)]">

      {/* ══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative flex h-[88vh] min-h-[560px] flex-col justify-end overflow-hidden bg-[var(--brand-ink-soft)]">
        <div
          ref={heroImgRef}
          className="absolute inset-x-0 will-change-transform"
          style={{ top: '-12%', bottom: '-12%' }}
        >
          <Image
            src={service.images[0]}
            alt={service.title}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
            priority
          />
        </div>

        {/* Layered scrims - vertical for legibility, radial for accent warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E0D] via-[#0B1E0D]/60 to-[#0B1E0D]/15" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{ background: `radial-gradient(ellipse at 15% 90%, ${service.accent} 0%, transparent 62%)` }}
        />

        {/* Back link - pinned to the top of the hero */}
        <div className="lumora-shell absolute inset-x-0 top-0 z-10 pt-8">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-[0.78rem] font-medium text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            All Services
          </Link>
        </div>

        {/* Headline block */}
        <div className="lumora-shell relative z-10 pb-10 lg:pb-12">
          <RevealUp
            as="p"
            delay={60}
            className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-lime)]"
          >
            Service {service.num}
          </RevealUp>

          {/* Each line gets its own .rv-line box, so the masked reveal cascades
              and nothing depends on a width constraint to force the break -
              .rv-line is overflow-hidden, so any wrap driven by a max-width
              gets clipped horizontally rather than wrapped. */}
          <div className="ld-hero-title">
            <RevealLines
              items={service.titleLines ?? [service.title]}
              delay={120}
              stagger={90}
              duration={1000}
            />
          </div>

          <RevealUp
            as="p"
            delay={280}
            className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-white/60"
          >
            {service.tagline}
          </RevealUp>
        </div>

        {/* Stat rail - sits on the hero's lower edge */}
        <div className="relative z-10 border-t border-white/15">
          <div className="lumora-shell">
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {service.stats.map((stat, i) => (
                <RevealUp
                  key={stat.label}
                  delay={340 + i * 70}
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

        {/* Scoped type for the masked hero reveal - kept off the global
            .rv-inner so every other reveal on the page keeps its own sizing. */}
        <style>{`
          .ld-hero-title .rv-inner {
            font-family: var(--font-neue);
            font-size: clamp(2.5rem, 7vw, 5.75rem);
            font-weight: 600;
            line-height: 0.94;
            letter-spacing: -0.035em;
            color: #fff;
          }
        `}</style>
      </section>

      {/* ══ Overview ═══════════════════════════════════════════ */}
      <section className="lumora-shell py-16 lg:py-24">
        <SectionLabel>Overview</SectionLabel>

        <RevealUp
          as="p"
          delay={80}
          className="mt-8 max-w-4xl font-neue text-[clamp(1.25rem,2.6vw,2rem)] font-medium leading-[1.32] tracking-[-0.02em] text-[var(--brand-primary)]"
        >
          {service.intro}
        </RevealUp>

        <div className="mt-12 grid gap-x-14 gap-y-6 lg:grid-cols-2">
          {service.body.map((para, i) => (
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

        <RevealUp delay={200} className="mt-12 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius-pill)] border border-[var(--brand-primary)]/15 bg-[var(--secondary)] px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--brand-primary)]"
            >
              {tag}
            </span>
          ))}
        </RevealUp>
      </section>

      {/* ══ Process ════════════════════════════════════════════ */}
      <section className="lumora-shell pb-16 lg:pb-24">
        <SectionLabel>How we work</SectionLabel>
        <SectionHeading className="mt-6 max-w-2xl">
          Four steps, in order. Nothing skipped.
        </SectionHeading>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, i) => {
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

      {/* ══ Capabilities ═══════════════════════════════════════ */}
      <section className="lumora-shell pb-16 lg:pb-24">
        <SectionLabel>What the work covers</SectionLabel>
        <SectionHeading className="mt-6 max-w-3xl">
          Planting is half of it. The rest is everything holding the garden together.
        </SectionHeading>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:gap-5">
          {service.capabilities.map((cap, i) => (
            <RevealUp
              key={cap.title}
              delay={80 + i * 80}
              className="group relative overflow-hidden rounded-[var(--radius-4xl)] border border-[var(--border)] bg-[var(--brand-white)] p-7 transition-all duration-300 hover:border-[var(--brand-primary)]/25 hover:shadow-[0_18px_50px_-24px_rgba(29,64,32,0.35)] lg:p-9"
            >
              {/* Lime wash that grows in on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-[var(--brand-lime)]/0 blur-2xl transition-all duration-500 group-hover:bg-[var(--brand-lime)]/25"
              />

              <span className="relative text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[var(--brand-primary)]/40">
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3 className="relative mt-5 font-neue text-[clamp(1.15rem,2.2vw,1.55rem)] font-medium leading-tight tracking-[-0.02em] text-[var(--brand-primary)]">
                {cap.title}
              </h3>

              <span aria-hidden className="relative my-5 block h-px w-10 bg-[var(--brand-lime)]" />

              <p className="relative text-[0.88rem] leading-[1.8] text-[var(--muted-foreground)]">
                {cap.desc}
              </p>

              <ul className="relative mt-6 flex flex-wrap gap-1.5">
                {cap.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-[var(--radius-pill)] bg-[var(--secondary)] px-3 py-1 text-[0.7rem] font-medium text-[var(--brand-primary)]/75"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ══ Lawns - dark band ══════════════════════════════════ */}
      <section className="bg-[var(--brand-ink-soft)] py-16 lg:py-24">
        <div className="lumora-shell">
          <SectionLabel tone="dark">Lawns</SectionLabel>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading tone="dark" className="max-w-2xl">
              Three grasses. The site decides which one.
            </SectionHeading>
            <RevealUp
              as="p"
              delay={100}
              className="max-w-sm text-[0.88rem] leading-[1.75] text-white/50"
            >
              Every lawn is graded, levelled and soil-prepared before a single roll goes down, then
              handed over with a watering and mowing schedule for its first season.
            </RevealUp>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
            {service.lawns.map((grass, i) => (
              <RevealUp
                key={grass.name}
                delay={80 + i * 90}
                className="group flex flex-col gap-5 rounded-[var(--radius-4xl)] border border-white/10 bg-white/[0.035] p-7 transition-all duration-300 hover:border-[var(--brand-lime)]/40 hover:bg-white/[0.07] lg:p-8"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-neue text-[1.3rem] font-medium tracking-[-0.02em] text-white">
                    {grass.name}
                  </h3>
                  <span className="shrink-0 text-[0.68rem] italic text-white/35">{grass.latin}</span>
                </div>

                <span
                  aria-hidden
                  className="h-px w-8 bg-[var(--brand-lime)] transition-all duration-300 group-hover:w-16"
                />

                <p className="text-[0.86rem] leading-[1.75] text-white/55">{grass.note}</p>

                <dl className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-5">
                  {grass.specs.map((spec) => (
                    <div key={spec.label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/35">
                        {spec.label}
                      </dt>
                      <dd className="text-right text-[0.82rem] font-medium text-white/85">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Structures & materials ═════════════════════════════ */}
      <section className="lumora-shell py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionLabel>Structures &amp; statuary</SectionLabel>
            <SectionHeading className="mt-6">
              Built in the material the site can carry.
            </SectionHeading>
            <RevealUp
              as="p"
              delay={100}
              className="mt-6 max-w-md text-[0.92rem] leading-[1.85] text-[var(--muted-foreground)]"
            >
              Pergolas, screens, edging, water features, planters and statuary - fabricated to your
              choice of material, weighed against exposure, upkeep and budget before anything is
              ordered.
            </RevealUp>

            <div className="mt-10 flex flex-col divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {service.materials.map((mat, i) => (
                <RevealUp
                  key={mat.name}
                  delay={120 + i * 80}
                  className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:gap-6"
                >
                  <span className="shrink-0 pt-0.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary)] sm:w-28">
                    {mat.name}
                  </span>
                  <span className="text-[0.85rem] leading-[1.7] text-[var(--muted-foreground)]">
                    {mat.desc}
                  </span>
                </RevealUp>
              ))}
            </div>
          </div>

          <RevealUp
            delay={140}
            className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-4xl)] lg:aspect-[4/4.6]"
          >
            <Image
              src={service.images[1]}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={82}
              className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--brand-ink-soft)]/55 to-transparent"
            />
          </RevealUp>
        </div>
      </section>

      {/* ══ Sectors ════════════════════════════════════════════ */}
      <section className="lumora-shell pb-16 lg:pb-24">
        <SectionLabel>Who we work for</SectionLabel>
        <SectionHeading className="mt-6 max-w-2xl">
          Residential and commercial, run the same way.
        </SectionHeading>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:gap-5">
          {service.sectors.map((sector, i) => (
            <RevealUp
              key={sector.title}
              delay={80 + i * 100}
              className="flex flex-col rounded-[var(--radius-4xl)] bg-[var(--secondary)] p-8 lg:p-10"
            >
              <h3 className="font-neue text-[clamp(1.3rem,2.4vw,1.75rem)] font-medium tracking-[-0.02em] text-[var(--brand-primary)]">
                {sector.title}
              </h3>
              <p className="mt-4 text-[0.88rem] leading-[1.8] text-[var(--muted-foreground)]">
                {sector.desc}
              </p>
              <ul className="mt-7 flex flex-col gap-3 border-t border-[var(--brand-primary)]/10 pt-6">
                {sector.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[0.85rem] leading-[1.6] text-[var(--brand-primary)]/80"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-[var(--brand-olive)]"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ══ Credentials - dark band ════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--brand-ink-soft)] py-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ background: `radial-gradient(ellipse at 85% 10%, ${service.accent} 0%, transparent 55%)` }}
        />
        <div className="lumora-shell relative">
          <SectionLabel tone="dark">Public works</SectionLabel>
          <SectionHeading tone="dark" className="mt-6 max-w-3xl">
            {service.credentials.heading}
          </SectionHeading>
          <RevealUp
            as="p"
            delay={100}
            className="mt-6 max-w-2xl text-[0.92rem] leading-[1.85] text-white/55"
          >
            {service.credentials.desc}
          </RevealUp>

          <RevealUp delay={160} className="mt-12 flex flex-wrap gap-2.5">
            {service.credentials.projects.map((project) => (
              <span
                key={project}
                className="rounded-[var(--radius-pill)] border border-white/15 px-4 py-2 text-[0.78rem] font-medium text-white/70 transition-colors duration-300 hover:border-[var(--brand-lime)]/50 hover:text-white"
              >
                {project}
              </span>
            ))}
          </RevealUp>
        </div>
      </section>

      {/* ══ Farm ═══════════════════════════════════════════════ */}
      <section className="lumora-shell py-16 lg:py-24">
        <SectionLabel>Where the plants come from</SectionLabel>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading>{service.farm.heading}</SectionHeading>
          <RevealUp
            as="p"
            delay={100}
            className="text-[0.92rem] leading-[1.85] text-[var(--muted-foreground)]"
          >
            {service.farm.desc}
          </RevealUp>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--border)] lg:grid-cols-4">
          {service.farm.figures.map((figure, i) => (
            <RevealUp
              key={figure.label}
              delay={80 + i * 80}
              className="bg-[var(--brand-white)] px-6 py-8 lg:px-8 lg:py-10"
            >
              <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                {figure.label}
              </dt>
              <dd className="mt-3 font-neue text-[clamp(1.5rem,3.2vw,2.25rem)] font-medium leading-none tracking-[-0.03em] text-[var(--brand-primary)]">
                {figure.value}
              </dd>
              <dd className="mt-2 text-[0.78rem] leading-relaxed text-[var(--muted-foreground)]">
                {figure.note}
              </dd>
            </RevealUp>
          ))}
        </dl>
      </section>

      {/* ══ Related ════════════════════════════════════════════ */}
      {service.related?.length > 0 && (
        <section className="lumora-shell pb-16 lg:pb-20">
          <SectionLabel>Also explore</SectionLabel>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.related.map((rel, i) => (
              <RevealUp key={rel.slug} delay={60 + i * 70}>
                <Link
                  href={`/services/${rel.slug}`}
                  className="group flex h-full items-center justify-between gap-4 rounded-[var(--radius-4xl)] border border-[var(--border)] bg-[var(--brand-white)] px-6 py-5 transition-all duration-300 hover:border-[var(--brand-primary)]/25 hover:bg-[var(--secondary)]"
                >
                  <span className="text-[0.92rem] font-medium leading-snug text-[var(--brand-primary)]">
                    {rel.title}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 -translate-x-1 text-[var(--muted-foreground)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </RevealUp>
            ))}
          </div>
        </section>
      )}

      {/* ══ CTA ════════════════════════════════════════════════ */}
      <section className="lumora-shell pb-20 lg:pb-24">
        <div className="relative overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--brand-ink-soft)] px-8 py-14 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{ background: `radial-gradient(ellipse at 10% 100%, ${service.accent} 0%, transparent 60%)` }}
          />
          <div className="relative flex flex-col items-start gap-6 lg:max-w-2xl">
            <RevealUp
              as="p"
              className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-lime)]"
            >
              Start here
            </RevealUp>
            <RevealUp
              as="h2"
              delay={70}
              className="font-neue text-[clamp(1.7rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white"
            >
              It begins with a site visit.
            </RevealUp>
            <RevealUp as="p" delay={140} className="max-w-md text-[0.92rem] leading-[1.8] text-white/50">
              No obligation. One of our qualified horticulturists comes out, reads the space and
              gives you an honest brief and an estimate before anything is committed.
            </RevealUp>
            <RevealUp delay={200}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-lime)] px-7 py-3.5 text-[0.88rem] font-semibold text-[var(--brand-lime-ink)] transition-all duration-300 hover:bg-[var(--brand-lime-hover)] hover:shadow-[0_12px_36px_-10px_rgba(201,242,78,0.45)]"
              >
                Request a site visit
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </RevealUp>
          </div>
        </div>
      </section>
    </main>
  )
}
