'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { RevealLines, RevealUp } from '@/components/ui/reveal'

// ── Service data ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    num: '01',
    title: 'Landscape Development',
    slug: 'landscape-development',
    tagline: 'From concept to canopy',
    desc: 'Full-spectrum outdoor landscape execution — site survey, planting plan, costing and build. Township gardens, government parks, IT campus grounds, lake fronts and tourist lodges. Approved vendor for State Government and CPWD projects.',
    tags: ['Site Survey', 'Planting Plans', 'Township Scale', 'CPWD Credentials'],
    images: ['/assets/images/hero/01.jpg', '/assets/images/hero/02.jpg'],
    accent: '#C9F24E',
  },
  {
    num: '02',
    title: 'Garden Maintenance & Aftercare',
    slug: 'garden-maintenance',
    tagline: 'Alive through every season',
    desc: `Annual maintenance contracts (AMC) for gardens we've built and those we haven't. Pruning, feeding, pest management, lawn upkeep and seasonal replanting by our own field teams — using the same organic and inorganic inputs we stock at the counter.`,
    tags: ['Annual Contracts', 'Pruning', 'Pest Control', 'Seasonal Replanting'],
    images: ['/assets/images/hero/02.jpg', '/assets/images/hero/03.jpg'],
    accent: '#A5B33D',
  },
  {
    num: '03',
    title: 'Roof Garden Design',
    slug: 'roof-garden',
    tagline: 'Protecting your slab, transforming your sky',
    desc: 'Specialist roof garden systems layered with geotextile net and drain cell to protect the structural slab. Planted with lightweight growing media, shade-tolerant species and weather-proof planters — turning rooftops into usable, beautiful green space.',
    tags: ['Geotextile Layer', 'Drain Cell', 'Lightweight Media', 'Weather-proof'],
    images: ['/assets/images/hero/03.jpg', '/assets/images/hero/01.jpg'],
    accent: '#356B38',
  },
  {
    num: '04',
    title: 'Vertical Garden Systems',
    slug: 'vertical-garden',
    tagline: 'Walls that breathe',
    desc: 'Modular living-wall and trellis systems for interiors, building facades and boundary screens. Custom-designed for the available light, irrigation source and plant species — from dense tropical moss walls to open climber frames with seasonal flowering.',
    tags: ['Living Walls', 'Trellis Systems', 'Facade Planting', 'Interior Installations'],
    images: ['/assets/images/hero/02.jpg', '/assets/images/hero/01.jpg'],
    accent: '#C9F24E',
  },
]

// ── Glyph-roll title (CSS-only, consistent with ServicesSection) ──────────────
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

// ── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, index }) {
  const cardRef = useRef(null)
  const imgRef  = useRef(null)
  const [activeImg, setActiveImg] = useState(0)
  const imgTween = useRef(null)

  // On hover: scale & brighten the image panel
  const onEnter = () => {
    const img = imgRef.current
    if (!img) return
    imgTween.current?.kill()
    imgTween.current = gsap.to(img, { scale: 1.06, duration: 0.7, ease: 'power2.out' })
    // Cycle the image after a short pause for visual interest
    setTimeout(() => setActiveImg((p) => (p + 1) % service.images.length), 300)
  }
  const onLeave = () => {
    const img = imgRef.current
    if (!img) return
    imgTween.current?.kill()
    imgTween.current = gsap.to(img, { scale: 1, duration: 0.55, ease: 'power3.out' })
  }

  const isEven = index % 2 === 0

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-[var(--brand-ink-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-lime)]"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      ref={cardRef}
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          {service.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-700"
              style={{ opacity: i === activeImg ? 1 : 0 }}
              priority={index < 2}
            />
          ))}
        </div>
        {/* Deep scrim so text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E0D]/95 via-[#0B1E0D]/60 to-[#0B1E0D]/20" />
        {/* Accent colour tint on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.12]"
          style={{ background: service.accent }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-between p-8 md:p-10 lg:min-h-[480px]">
        {/* Top row: number + arrow */}
        <div className="flex items-start justify-between">
          <span className="font-neue text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/40">
            {service.num}
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/50 transition-all duration-300 group-hover:border-[var(--brand-lime)] group-hover:text-[var(--brand-lime)] group-hover:rotate-45"
          >
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>

        {/* Bottom: tagline, title, tags */}
        <div className="flex flex-col gap-3">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/40 transition-colors duration-300 group-hover:text-[var(--brand-lime)]/70">
            {service.tagline}
          </p>

          <RollTitle
            text={service.title}
            className="block text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[2rem]"
          />

          <p className="mt-1 line-clamp-2 text-[0.85rem] leading-relaxed text-white/50">
            {service.desc}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 px-3 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-white/50 transition-colors duration-300 group-hover:border-white/25 group-hover:text-white/70"
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesContent() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Hero banner ── */}
      <section className="relative flex min-h-[44vh] items-end overflow-hidden bg-[var(--brand-ink-soft)] pt-28 pb-12 lg:min-h-[52vh] lg:pb-16">
        {/* Decorative background grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(var(--brand-lime) 1px, transparent 1px), linear-gradient(90deg, var(--brand-lime) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Soft radial glow */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--brand-lime) 0%, transparent 70%)' }}
        />
        <div className="website-gutter relative z-10 w-full">
          {/* Label */}
          <RevealUp as="p" delay={0} className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-lime)]/70">
            What we do
          </RevealUp>
          <RevealLines
            items={['Our Services']}
            delay={60}
            stagger={0}
            duration={1100}
            className="block"
          />
          <style>{`.rv-line { overflow: hidden } .rv-inner { font-family: var(--font-neue); font-size: clamp(2.8rem,7vw,6rem); font-weight: 600; line-height: 0.95; letter-spacing: -0.03em; color: white; }`}</style>
          <RevealUp as="p" delay={280} className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/50">
            From a single balcony to a township-scale landscape — we design, plant and maintain green spaces across Kolkata and West Bengal.
          </RevealUp>
        </div>
      </section>

      {/* ── Cards grid ── */}
      <section className="website-gutter py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {SERVICES.map((service, i) => (
            <RevealUp key={service.slug} delay={i * 90} distance={28}>
              <ServiceCard service={service} index={i} />
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="website-gutter pb-20">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-[var(--brand-ink-soft)] px-8 py-12 text-center lg:py-16">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-lime)]/70">
            Ready to start?
          </p>
          <h2 className="font-neue text-[clamp(1.6rem,4vw,2.8rem)] font-semibold leading-tight tracking-[-0.02em] text-white">
            Let's build your green space.
          </h2>
          <p className="max-w-md text-[0.9rem] leading-relaxed text-white/50">
            Every project starts with a site visit and a conversation. No obligation, just honest advice from qualified horticulturists.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-lime)] px-8 py-3 text-[0.9rem] font-semibold text-[var(--brand-lime-ink)] transition-all duration-300 hover:bg-[var(--brand-lime-hover)] hover:shadow-lg hover:shadow-[var(--brand-lime)]/20"
          >
            Get in touch
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>
      </section>
    </main>
  )
}
