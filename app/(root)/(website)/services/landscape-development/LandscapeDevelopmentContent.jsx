'use client'

import { Suspense, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardList,
  PencilRuler,
  Calculator,
  Hammer,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { RevealLines, RevealUp } from '@/components/ui/reveal'
import { SectionHeading, SectionLabel } from '../SectionHeader'
import ServiceGallery from '../ServiceGallery'
import ServiceEnquiryForm from '@/components/Application/Website/ServiceEnquiryForm'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'
import { WHOLESALE_WHATSAPP_URL, WHOLESALE_PHONE_TEL, WHOLESALE_PHONE_DISPLAY } from '@/lib/companyInfo'

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
      <section className="relative flex min-h-[34rem] flex-col overflow-hidden lg:h-[88svh] lg:min-h-[560px] bg-[var(--brand-ink-soft)]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E0D] via-[#0B1E0D]/65 to-[#0B1E0D]/45" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{ background: `radial-gradient(ellipse at 15% 90%, ${service.accent} 0%, transparent 62%)` }}
        />

        {/* Back link - sits in normal flow above the headline (so it can never
            overlap it on short viewports), offset down to clear the fixed
            transparent site header instead of sitting behind it */}
        <div className="lumora-shell relative z-10 pt-20 sm:pt-22 lg:pt-24">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-[0.8rem] font-medium text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            All Services
          </Link>
        </div>

        {/* Headline block */}
        <div className="lumora-shell relative z-10 mt-9 pb-10 lg:mt-auto lg:pb-12">
          <RevealUp
            as="p"
            delay={60}
            className="mb-4 text-[0.8rem] font-semibold uppercase text-[var(--brand-lime)]"
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
            className="mt-5 max-w-xl text-[1rem] leading-relaxed text-white/75"
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
                  className={`border-white/10 py-3.5 sm:py-5 lg:py-6 ${STAT_CELL_EDGES[i % 4]} ${i > 1 ? 'hidden lg:block' : ''}`}
                >
                  <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-white/40 sm:text-[0.8rem] sm:tracking-normal">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-neue text-[0.875rem] font-medium leading-snug tracking-[-0.01em] text-white sm:mt-1.5 sm:text-[clamp(1.05rem,2vw,1.4rem)] sm:leading-tight">
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
          className="mt-8 max-w-4xl font-neue text-[clamp(1.25rem,2.6vw,2rem)] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--brand-primary)]"
        >
          {service.intro}
        </RevealUp>

        <div className="mt-12 hidden gap-x-14 gap-y-6 lg:grid lg:grid-cols-2">
          {service.body.map((para, i) => (
            <RevealUp
              key={i}
              as="p"
              delay={120 + i * 60}
              className="text-[0.9375rem] leading-[1.75] text-[var(--muted-foreground)]"
            >
              {para}
            </RevealUp>
          ))}
        </div>

        <RevealUp delay={200} className="mt-10 flex flex-wrap gap-1.5 sm:mt-12 sm:gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--brand-primary)]/15 bg-[var(--secondary)] px-2.5 py-0.5 text-[0.75rem] font-medium uppercase tracking-[0.02em] text-[var(--brand-primary)] sm:px-4 sm:py-1.5 sm:text-[0.8rem] sm:tracking-normal"
            >
              {tag}
            </span>
          ))}
        </RevealUp>

        {/* Quick-question CTA - see ServiceDetailContent.jsx for why this
            sits here rather than only at the foot of the page. */}
        <RevealUp delay={260} className="mt-8">
          <a
            href={WHOLESALE_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 sm:h-14 items-center gap-2 rounded-full border border-[var(--brand-primary)]/25 px-4 sm:px-6 text-[0.875rem] font-medium text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)] hover:bg-[var(--secondary)]"
          >
            <MessageCircle className="size-4" strokeWidth={1.8} />
            Have a quick question? WhatsApp us
          </a>
        </RevealUp>
      </section>

      {/* ══ Enquiry Form - locked to this service ═══════════════ */}
      <section id="enquiry" className="lumora-shell scroll-mt-24 pb-16 lg:pb-24">
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ServiceEnquiryForm defaultService={service.slug} lockService />
        </Suspense>
      </section>

      {/* ══ Process ════════════════════════════════════════════ */}
      <section className="lumora-shell pb-16 lg:pb-24">
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
                <p className="text-[0.875rem] leading-[1.75] text-[var(--muted-foreground)]">
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

              <span className="relative text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)]/40">
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3 className="relative mt-5 font-neue text-[clamp(1.15rem,2.2vw,1.55rem)] font-medium leading-tight tracking-[-0.02em] text-[var(--brand-primary)]">
                {cap.title}
              </h3>

              <span aria-hidden className="relative my-5 block h-px w-10 bg-[var(--brand-lime)]" />

              <p className="relative text-[0.875rem] leading-[1.75] text-[var(--muted-foreground)]">
                {cap.desc}
              </p>

              <ul className="relative mt-6 flex flex-wrap gap-1.5">
                {cap.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-[var(--secondary)] px-2.5 py-0.5 text-[0.75rem] font-medium text-[var(--brand-primary)]/75 sm:px-3 sm:py-1 sm:text-[0.8rem]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ══ Gallery ════════════════════════════════════════════ */}
      <ServiceGallery gallery={service.gallery} />

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
              className="max-w-sm text-[0.875rem] leading-[1.75] text-white/50"
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
                  <h3 className="font-neue text-[1.3rem] font-medium leading-[1.2] tracking-[-0.02em] text-white lg:leading-normal">
                    {grass.name}
                  </h3>
                  <span className="shrink-0 text-[0.8rem] italic text-white/35">{grass.latin}</span>
                </div>

                <span
                  aria-hidden
                  className="h-px w-8 bg-[var(--brand-lime)] transition-all duration-300 group-hover:w-16"
                />

                <p className="text-[0.875rem] leading-[1.75] text-white/55">{grass.note}</p>

                <dl className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-5">
                  {grass.specs.map((spec) => (
                    <div key={spec.label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-[0.8rem] font-semibold uppercase text-white/35">
                        {spec.label}
                      </dt>
                      <dd className="text-right text-[0.8rem] font-medium text-white/85">
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
              className="mt-6 max-w-md text-[0.9375rem] leading-[1.75] text-[var(--muted-foreground)]"
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
                  <span className="shrink-0 pt-0.5 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)] sm:w-28">
                    {mat.name}
                  </span>
                  <span className="text-[0.875rem] leading-[1.75] text-[var(--muted-foreground)]">
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
              <h3 className="font-neue text-[clamp(1.3rem,2.4vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--brand-primary)] lg:leading-normal">
                {sector.title}
              </h3>
              <p className="mt-4 text-[0.875rem] leading-[1.75] text-[var(--muted-foreground)]">
                {sector.desc}
              </p>
              <ul className="mt-7 flex flex-col gap-3 border-t border-[var(--brand-primary)]/10 pt-6">
                {sector.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[0.875rem] leading-[1.6] text-[var(--brand-primary)]/80"
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
            className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.75] text-white/55"
          >
            {service.credentials.desc}
          </RevealUp>

          <RevealUp delay={160} className="mt-10 flex flex-wrap gap-1.5 sm:mt-12 sm:gap-2.5">
            {service.credentials.projects.map((project) => (
              <span
                key={project}
                className="rounded-full border border-white/15 px-2.5 py-0.5 text-[0.75rem] font-medium text-white/70 transition-colors duration-300 hover:border-[var(--brand-lime)]/50 hover:text-white sm:px-4 sm:py-2 sm:text-[0.8rem]"
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
            className="text-[0.9375rem] leading-[1.75] text-[var(--muted-foreground)]"
          >
            {service.farm.desc}
          </RevealUp>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--border)] lg:grid-cols-4">
          {service.farm.figures.map((figure, i) => (
            <RevealUp
              key={figure.label}
              delay={80 + i * 80}
              className="bg-[var(--brand-white)] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
            >
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted-foreground)] sm:text-[0.8rem] sm:tracking-normal">
                {figure.label}
              </dt>
              <dd className="mt-2 font-neue text-[1.3rem] font-medium leading-none tracking-[-0.03em] text-[var(--brand-primary)] sm:mt-3 sm:text-[clamp(1.5rem,3.2vw,2.25rem)]">
                {figure.value}
              </dd>
              <dd className="mt-1.5 text-[0.75rem] leading-snug text-[var(--muted-foreground)] sm:mt-2 sm:text-[0.8rem] sm:leading-relaxed">
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
                  <span className="text-[0.9375rem] font-medium leading-snug text-[var(--brand-primary)]">
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
              className="text-[0.8rem] font-semibold uppercase text-[var(--brand-lime)]"
            >
              Start here
            </RevealUp>
            <RevealUp
              as="h2"
              delay={70}
              className="font-neue text-[clamp(1.7rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white"
            >
              It begins with a site visit.
            </RevealUp>
            <RevealUp as="p" delay={140} className="max-w-md text-[0.9375rem] leading-[1.75] text-white/50">
              No obligation. One of our qualified horticulturists comes out, reads the space and
              gives you an honest brief and an estimate before anything is committed.
            </RevealUp>
            <RevealUp delay={200} className="flex flex-wrap items-center gap-3">
              <LimeArrowButton href="#enquiry">Request a site visit</LimeArrowButton>
              <a
                href={`tel:${WHOLESALE_PHONE_TEL}`}
                className="group inline-flex h-11 sm:h-14 items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-5 sm:px-7 text-[0.875rem] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <Phone className="size-4" strokeWidth={1.8} />
                Call {WHOLESALE_PHONE_DISPLAY}
              </a>
            </RevealUp>
          </div>
        </div>
      </section>
    </main>
  )
}
