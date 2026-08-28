'use client'

import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calculator,
  ClipboardList,
  Hammer,
  Layers,
  Mountain,
  PencilRuler,
  Scissors,
  Sprout,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealLines, RevealUp } from '@/components/ui/reveal'

/* ────────────────────────────────────────────────────────────────
   ServicesContent - the /services index.

   Structure follows the supplied wireframe: centred hero over a
   photo/stat bento, chip-led bands, a split services section with a
   2×2 card grid, and a header-left / action-right process block.
   Palette stays on this codebase's tokens - the reference's blue
   accent maps to --brand-primary, its dark card to --brand-ink-soft.

   Content arrives as props from page.jsx so the data stays in the
   server component, matching the service detail pages.
   ──────────────────────────────────────────────────────────────── */

const STEP_ICONS = [ClipboardList, PencilRuler, Calculator, Hammer]

// Keyed off the service slug so page.jsx stays free of component imports.
const SERVICE_ICONS = {
  'landscape-development': Mountain,
  'garden-maintenance': Scissors,
  'roof-garden': Building2,
  'vertical-garden': Layers,
}

/* ── Primitives ──────────────────────────────────────────────── */

// Small outlined eyebrow chip - the wireframe's EXPERTISE / SERVICES pill.
function Chip({ children, tone = 'light', className = '' }) {
  const skin =
    tone === 'dark'
      ? 'border-white/20 bg-white/5 text-white/65'
      : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]'
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.24em] ${skin} ${className}`}
    >
      {children}
    </span>
  )
}

function PrimaryButton({ href, children, className = '' }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-primary)] px-6 py-3 text-[0.85rem] font-medium text-white transition-all duration-300 hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_12px_30px_-12px_rgba(29,64,32,0.6)] ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  )
}

/* Pinned scroll-fill statement.

   The section locks to the viewport and the copy fills word by word from
   --muted-foreground to --brand-primary as you scroll through the pin, so the
   deep colour has covered the whole paragraph by the time it releases.

   Words are split in JSX rather than by rewriting textContent at runtime: this
   node is React-owned, and mutating its children behind React's back breaks on
   any re-render. Colour is the only animated property, so the spans stay
   `display: inline` and wrapping is exactly what it would be without them. */
function ScrollFillStatement({ chip, text }) {
  const pinRef = useRef(null)
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  useEffect(() => {
    const root = pinRef.current
    if (!root) return
    gsap.registerPlugin(ScrollTrigger)

    // Resolve the tokens to concrete values - GSAP cannot interpolate between
    // two `var(...)` strings, it needs the computed colours.
    const tokens = getComputedStyle(document.documentElement)
    const dim = tokens.getPropertyValue('--muted-foreground').trim() || '#6B6B6B'
    const deep = tokens.getPropertyValue('--brand-primary').trim() || '#1D4020'

    // Only an explicit `reduce` preference opts out. Testing for `reduce`
    // rather than gating on `no-preference` matters: a browser that doesn't
    // support the query matches neither, and gating the other way would leave
    // the paragraph stuck at the dim base colour with nothing to fill it.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.sv-fill-word')
      if (!targets.length) return

      // Reduced motion gets the finished state and no pin - locking the
      // viewport is precisely the effect that setting asks us to drop.
      if (reduced) {
        gsap.set(targets, { color: deep })
        return
      }

      gsap.set(targets, { color: dim })
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=120%',
            scrub: 0.4,
            pin: true,
            anticipatePin: 1,
          },
        })
        // Each word crosses over quickly; `amount` spreads their start times
        // across the whole scrub so the fill sweeps the paragraph once.
        .to(targets, { color: deep, duration: 0.25, stagger: { amount: 1 } })
    }, root)

    // Pin distance is derived from the element's height, which moves once the
    // display face swaps in - recompute rather than pin against fallback metrics.
    let disposed = false
    document.fonts?.ready?.then(() => {
      if (!disposed) ScrollTrigger.refresh()
    })

    return () => {
      disposed = true
      ctx.revert()
    }
  }, [])

  return (
    <div ref={pinRef} className="flex min-h-screen items-center py-20">
      <div className="lumora-shell w-full">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <RevealUp>
            <Chip>{chip}</Chip>
          </RevealUp>

          <p className="mt-8 font-neue text-[clamp(1.25rem,2.9vw,2.1rem)] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--muted-foreground)]">
            {words.map((word, i) => (
              <span key={i} className="sv-fill-word">
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}

function GhostButton({ href, children, className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--brand-primary)]/25 bg-[var(--card)] px-6 py-3 text-[0.85rem] font-medium text-[var(--brand-primary)] transition-all duration-300 hover:border-[var(--brand-primary)]/50 hover:bg-[var(--secondary)] ${className}`}
    >
      {children}
    </Link>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function ServicesContent({
  services,
  bento,
  approach,
  stats,
  process,
  credentials,
}) {
  return (
    <main className="min-h-screen bg-[var(--background)]">

      {/* ══ Hero - centred headline over a photo/stat bento ════ */}
      <section className="lumora-shell pb-16 pt-32 lg:pb-24 lg:pt-40">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="sv-hero-title">
            <RevealLines
              items={['Gardens designed, planted', 'and kept alive.']}
              delay={60}
              stagger={90}
              duration={1050}
            />
          </div>

          <RevealUp
            as="p"
            delay={260}
            className="mt-6 max-w-xl text-[0.92rem] leading-[1.8] text-[var(--muted-foreground)]"
          >
            From a single balcony to a township-scale landscape - designed, planted and maintained
            by qualified horticulturists across Kolkata and West Bengal.
          </RevealUp>

          <RevealUp delay={340} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton href="/contact">Request a site visit</PrimaryButton>
            <GhostButton href="/shop">Browse catalogue</GhostButton>
          </RevealUp>
        </div>

        {/* Bento: photo · stat stack · photo */}
        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          <RevealUp
            delay={80}
            className="relative min-h-[300px] overflow-hidden rounded-[var(--radius-4xl)] lg:min-h-[440px]"
          >
            <Image
              src={bento.images[0]}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              quality={82}
              className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
              priority
            />
          </RevealUp>

          {/* Middle column - the accent card over the dark card */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <RevealUp
              delay={160}
              className="flex flex-1 flex-col justify-between gap-8 rounded-[var(--radius-4xl)] bg-[var(--brand-primary)] p-7 lg:p-8"
            >
              <p className="text-[0.82rem] leading-[1.65] text-white/75">{bento.accent.caption}</p>
              <p className="font-neue text-[clamp(2.4rem,5vw,3.4rem)] font-medium leading-none tracking-[-0.035em] text-white">
                {bento.accent.figure}
              </p>
            </RevealUp>

            <RevealUp
              delay={240}
              className="flex flex-1 flex-col gap-4 rounded-[var(--radius-4xl)] bg-[var(--brand-ink-soft)] p-7 lg:p-8"
            >
              <span className="flex size-9 items-center justify-center rounded-[var(--radius-full)] bg-white/10 text-[var(--brand-lime)]">
                <Sprout className="size-4" strokeWidth={1.6} />
              </span>
              <p className="font-neue text-[clamp(2.4rem,5vw,3.4rem)] font-medium leading-none tracking-[-0.035em] text-white">
                {bento.dark.figure}
              </p>
              <p className="text-[0.82rem] leading-[1.65] text-white/50">{bento.dark.caption}</p>
            </RevealUp>
          </div>

          <RevealUp
            delay={320}
            className="relative min-h-[300px] overflow-hidden rounded-[var(--radius-4xl)] lg:min-h-[440px]"
          >
            <Image
              src={bento.images[1]}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              quality={82}
              className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
            />
          </RevealUp>
        </div>

        {/* Scoped to this hero so the global .rv-inner rule - and every other
            masked reveal on the page - keeps its own sizing. One .rv-line per
            rendered line: .rv-line is overflow-hidden, so a wrap driven by a
            max-width would be clipped horizontally rather than wrapped. */}
        <style>{`
          .sv-hero-title .rv-line { text-align: center; }
          .sv-hero-title .rv-inner {
            font-family: var(--font-neue);
            font-size: clamp(2.1rem, 5.4vw, 3.6rem);
            font-weight: 500;
            line-height: 1.06;
            letter-spacing: -0.03em;
            color: var(--brand-primary);
          }
        `}</style>
      </section>

      {/* ══ Approach - centred statement + stat row ════════════ */}
      <section className="bg-[var(--card)] pb-16 lg:pb-24">
        <ScrollFillStatement chip="Our approach" text={approach.lead} />

        <div className="lumora-shell">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {/* col-reverse so the figure reads above its label visually while
                the DOM keeps dt-before-dd - the label is announced once, as the
                term for its value, rather than twice via a hidden copy. */}
            {stats.map((stat, i) => (
              <RevealUp
                key={stat.label}
                delay={80 + i * 80}
                className="flex flex-col-reverse items-center text-center"
              >
                <dt className="mt-3 max-w-[18ch] text-[0.78rem] leading-[1.6] text-[var(--muted-foreground)]">
                  {stat.label}
                </dt>
                <dd className="font-neue text-[clamp(1.8rem,4vw,2.7rem)] font-medium leading-none tracking-[-0.035em] text-[var(--brand-primary)]">
                  {stat.value}
                </dd>
              </RevealUp>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ Services - copy left, 2×2 card grid right ══════════ */}
      <section className="lumora-shell py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left rail */}
          <div className="flex flex-col lg:sticky lg:top-28 lg:self-start">
            <RevealUp>
              <Chip>Services</Chip>
            </RevealUp>
            <RevealUp
              as="h2"
              delay={70}
              className="mt-7 font-neue text-[clamp(1.6rem,3.6vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--brand-primary)]"
            >
              Explore our comprehensive service offerings
            </RevealUp>
            <RevealUp
              as="p"
              delay={130}
              className="mt-5 max-w-sm text-[0.88rem] leading-[1.8] text-[var(--muted-foreground)]"
            >
              Four service lines, all carried by one nursery - from the first site survey through
              planting, construction and the aftercare that keeps it alive.
            </RevealUp>
            <RevealUp delay={190} className="mt-9">
              <PrimaryButton href="/contact">Get started</PrimaryButton>
            </RevealUp>
          </div>

          {/* Card grid - first card carries the accent fill */}
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {services.map((service, i) => {
              const Icon = SERVICE_ICONS[service.slug] ?? Sprout
              const accent = i === 0
              return (
                <RevealUp key={service.slug} delay={80 + i * 80} className="h-full">
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group flex h-full flex-col overflow-hidden rounded-[var(--radius-4xl)] border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 ${
                      accent
                        ? 'border-transparent bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]'
                        : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-primary)]/25 hover:shadow-[0_18px_50px_-24px_rgba(29,64,32,0.35)]'
                    }`}
                  >
                    {/* Image band. The tint lifts on hover so the photograph
                        resolves as the card is picked out. */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                        quality={82}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <span
                        aria-hidden
                        className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 ${
                          accent
                            ? 'bg-[var(--brand-primary)]/35'
                            : 'bg-[var(--brand-ink-soft)]/15'
                        }`}
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-7 lg:p-8">
                      <div className="flex items-start justify-between">
                        <span
                          className={`flex size-10 items-center justify-center rounded-[var(--radius-full)] ${
                            accent
                              ? 'bg-white/15 text-[var(--brand-lime)]'
                              : 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                          }`}
                        >
                          <Icon className="size-[1.05rem]" strokeWidth={1.6} />
                        </span>
                        <ArrowUpRight
                          className={`size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                            accent ? 'text-[var(--brand-lime)]' : 'text-[var(--brand-primary)]'
                          }`}
                        />
                      </div>

                      <h3
                        className={`mt-6 font-neue text-[1.15rem] font-medium leading-tight tracking-[-0.02em] ${
                          accent ? 'text-white' : 'text-[var(--brand-primary)]'
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p
                        className={`mt-3 text-[0.83rem] leading-[1.7] ${
                          accent ? 'text-white/65' : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {service.short}
                      </p>
                    </div>
                  </Link>
                </RevealUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ Process - heading left, action right ═══════════════ */}
      <section className="bg-[var(--card)] py-16 lg:py-24">
        <div className="lumora-shell">
          <RevealUp>
            <Chip>Process</Chip>
          </RevealUp>

          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <RevealUp
              as="h2"
              delay={70}
              className="max-w-xl font-neue text-[clamp(1.6rem,3.6vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--brand-primary)]"
            >
              How every project runs - four steps, in order
            </RevealUp>
            <RevealUp delay={130} className="shrink-0">
              <PrimaryButton href="/contact">Start a project</PrimaryButton>
            </RevealUp>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {process.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length]
              return (
                <RevealUp
                  key={step.title}
                  as="li"
                  delay={80 + i * 90}
                  className="group flex flex-col gap-4 rounded-[var(--radius-4xl)] border border-[var(--border)] bg-[var(--background)] p-7 transition-all duration-300 hover:border-[var(--brand-primary)]/25 lg:p-8"
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
        </div>
      </section>

      {/* ══ Credentials - dark band, heading left, action right ═ */}
      <section className="lumora-shell py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-[var(--radius-4xl)] bg-[var(--brand-ink-soft)] px-8 py-14 lg:px-14 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              background: 'radial-gradient(ellipse at 85% 10%, var(--brand-lime) 0%, transparent 55%)',
            }}
          />
          <div className="relative">
            <RevealUp>
              <Chip tone="dark">Public works</Chip>
            </RevealUp>

            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <RevealUp
                as="h2"
                delay={70}
                className="max-w-2xl font-neue text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white"
              >
                {credentials.heading}
              </RevealUp>
              <RevealUp delay={130} className="shrink-0">
                <Link
                  href="/about-us"
                  className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--brand-lime)] px-6 py-3 text-[0.85rem] font-semibold text-[var(--brand-lime-ink)] transition-all duration-300 hover:bg-[var(--brand-lime-hover)]"
                >
                  See more
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </RevealUp>
            </div>

            <RevealUp
              as="p"
              delay={170}
              className="mt-6 max-w-2xl text-[0.9rem] leading-[1.8] text-white/55"
            >
              {credentials.desc}
            </RevealUp>

            <RevealUp delay={220} className="mt-10 flex flex-wrap gap-2.5">
              {credentials.projects.map((project) => (
                <span
                  key={project}
                  className="rounded-[var(--radius-pill)] border border-white/15 px-4 py-2 text-[0.78rem] font-medium text-white/70 transition-colors duration-300 hover:border-[var(--brand-lime)]/50 hover:text-white"
                >
                  {project}
                </span>
              ))}
            </RevealUp>
          </div>
        </div>
      </section>

      {/* ══ CTA - centred, mirroring the hero ══════════════════ */}
      <section className="lumora-shell pb-20 lg:pb-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <RevealUp>
            <Chip>Ready to start?</Chip>
          </RevealUp>
          <RevealUp
            as="h2"
            delay={70}
            className="mt-7 font-neue text-[clamp(1.7rem,4.2vw,2.9rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--brand-primary)]"
          >
            Let&apos;s build your green space.
          </RevealUp>
          <RevealUp
            as="p"
            delay={130}
            className="mt-5 max-w-md text-[0.9rem] leading-[1.8] text-[var(--muted-foreground)]"
          >
            Every project starts with a site visit and a conversation - no obligation, just honest
            advice from qualified horticulturists.
          </RevealUp>
          <RevealUp delay={190} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton href="/contact">Get in touch</PrimaryButton>
            <GhostButton href="/about-us">About the nursery</GhostButton>
          </RevealUp>
        </div>
      </section>
    </main>
  )
}
