'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Nine thumbnails + the count chip fill a 5-column grid as two even rows.
const CLUSTER = Array.from({ length: 9 }, () => '/assets/images/hero/01.jpg')

// The whole statement is one green voice now (no black lead). It renders as
// per-word spans so the scroll timeline can brighten it a line at a time; the
// words are grouped into visual lines at runtime from their measured position.
const HEADING =
    'A garden is not decorated, but / grown into place - which is why we raise our own plants, design the space they will live in, and stay on to maintain it long after the handover.'

// Group already-rendered word spans into visual lines by their layout top
// (offsetTop is transform-invariant, so parallax/pin never skews it).
const groupLines = (els) => {
    const lines = []
    let top = null
    els.forEach((el) => {
        const t = Math.round(el.offsetTop)
        if (top === null || Math.abs(t - top) > 6) {
            lines.push([])
            top = t
        }
        lines[lines.length - 1].push(el)
    })
    return lines
}

const AboutUsSection = () => {
    const rootRef = useRef(null)        // section: pin target + scroll driver
    const statementRef = useRef(null)   // eyebrow + heading — parallax layer A
    const statsRef = useRef(null)       // stat cards — parallax layer B

    useEffect(() => {
        const root = rootRef.current
        if (!root) return
        gsap.registerPlugin(ScrollTrigger)

        const mm = gsap.matchMedia()

        // Build (and rebuild) the line-by-line brighten timeline. Each visual
        // line goes from --brand-primary/50 → full, one after another. Returns
        // a disposer so callers can rebuild on resize / font load without
        // touching the pin.
        const makeLineFill = (triggerVars) => {
            const words = gsap.utils.toArray('.about-fill-word', root)
            let tl = null
            let disposed = false

            const build = () => {
                if (disposed) return
                tl?.scrollTrigger?.kill()
                tl?.kill()
                gsap.set(words, { opacity: 0.5 }) // dim base: brand-primary @ 50%
                const lines = groupLines(words)
                tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...triggerVars } })
                lines.forEach((lineWords, li) => {
                    tl.to(lineWords, { opacity: 1, duration: 0.9 }, li * 0.9)
                })
            }
            build()

            // Line breaks depend on width + loaded fonts, so recompute on both.
            let raf = 0
            const onResize = () => {
                cancelAnimationFrame(raf)
                raf = requestAnimationFrame(build)
            }
            window.addEventListener('resize', onResize)
            document.fonts?.ready?.then(() => {
                if (rootRef.current) {
                    build()
                    ScrollTrigger.refresh()
                }
            })

            return () => {
                disposed = true
                window.removeEventListener('resize', onResize)
                cancelAnimationFrame(raf)
                tl?.scrollTrigger?.kill()
                tl?.kill()
            }
        }

        // ── Desktop ─────────────────────────────────────────────────────────
        // The section rises with a layered parallax, sticks to the top, and
        // while it's held the heading brightens line by line, end to end.
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(
                statementRef.current,
                { yPercent: 20 },
                { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true } }
            )
            gsap.fromTo(
                statsRef.current,
                { yPercent: 9, autoAlpha: 0.5 },
                { yPercent: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true } }
            )

            // Pin the section for the hold (kept separate from the fill so the
            // fill can be rebuilt on resize without disturbing the pin).
            const pin = ScrollTrigger.create({ trigger: root, start: 'top top', end: '+=125%', pin: true })

            const disposeFill = makeLineFill({ trigger: root, start: 'top top', end: '+=125%', scrub: true })

            ScrollTrigger.refresh()
            return () => {
                disposeFill()
                pin.kill()
            }
        })

        // ── Compact screens ─────────────────────────────────────────────────
        // Same line-by-line brighten as the section passes, but no pin.
        mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
            gsap.fromTo(
                statementRef.current,
                { yPercent: 10 },
                { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 55%', scrub: true } }
            )

            const disposeFill = makeLineFill({ trigger: statementRef.current, start: 'top 78%', end: 'bottom 42%', scrub: true })

            ScrollTrigger.refresh()
            return () => disposeFill()
        })

        return () => mm.revert()
    }, [])

    return (
        // No overlap at rest — the hero stays fully visible on load; the section
        // climbs over it on scroll. z-[2] keeps it above the hero as it rises.
        <section ref={rootRef} className="about-section relative z-[2] bg-[var(--background)]">
            <div className="lumora-shell flex flex-col justify-center py-16 lg:min-h-svh lg:py-24">

                {/* ── Statement (parallax layer A) ── */}
                <div ref={statementRef} className="about-statement grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_1.85fr] lg:gap-8">
                    <span className="flex items-start gap-2 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)] lg:pt-3">
                        <span aria-hidden className="mt-1.5 size-1.5 rounded-full border border-current" />
                        About Company
                    </span>
                    {/* One green voice, dimmed to 50% at rest; each visual line
                        brightens to full as the pinned section is scrolled. */}
                    <h2 className="max-w text-[clamp(1.5rem,3.4vw,2.35rem)] font-medium leading-[1.28] tracking-[-0.01em] text-[var(--brand-primary)]">
                        {HEADING.split(' ').flatMap((word, i) => [
                            <span key={i} className="about-fill-word">
                                {word}
                            </span>,
                            ' ',
                        ])}
                    </h2>
                </div>

                {/* ── Stat cards (parallax layer B) ── */}
                <div ref={statsRef} className="about-stats mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4">

                    {/* 1 · Avatar cluster — tiles top, label bottom */}
                    <div className="about-stat flex min-h-[11.5rem] flex-col justify-between rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-4 lg:min-h-[13rem] lg:p-5">
                        <div className="grid grid-cols-5 gap-1 lg:gap-1.5">
                            {CLUSTER.map((src, i) => (
                                <span key={i} className="relative aspect-square overflow-hidden rounded-full border-2 border-white ring-1 ring-black/5">
                                    <Image src={src} alt="" fill sizes="56px" className="object-cover object-top" />
                                </span>
                            ))}
                            <span className="flex aspect-square items-center justify-center rounded-full bg-[var(--brand-lime)] text-[0.6rem] font-semibold text-[var(--brand-lime-ink)] lg:text-[0.68rem]">
                                50+
                            </span>
                        </div>
                        <p className="mt-5 text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                            Projects Delivered
                        </p>
                    </div>

                    {/* 2 · Dark number + seal */}
                    <div className="about-stat relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--brand-ink-soft)] p-4 text-white lg:min-h-[13rem] lg:p-5">
                        <span aria-hidden className="absolute right-4 top-1/2 flex size-[4.2rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/15">
                            <span className="absolute inset-1 rounded-full border border-dashed border-white/15" />
                            <Star className="size-5 text-[var(--brand-lime)]" strokeWidth={1.5} fill="currentColor" />
                        </span>
                        <span className="relative text-[0.7rem] uppercase tracking-[0.16em] text-white/45">Years in the Field</span>
                        <p className="relative mt-3 text-[3rem] font-medium leading-none tracking-[-0.03em]">35+</p>
                    </div>

                    {/* 3 · Text top, figure bottom */}
                    <div className="about-stat flex min-h-[11.5rem] flex-col justify-between rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-4 lg:min-h-[13rem] lg:p-5">
                        <p className="text-[0.92rem] leading-snug text-[var(--brand-ink)]">
                            One potted plant at the Alipore counter or an entire township
                            landscape — both are grown on the same farm at Bibirhut.
                        </p>
                        <div className="mt-5">
                            <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Nursery Spread</span>
                            <span className="mt-1 block text-[1.9rem] font-medium leading-none tracking-[-0.02em] text-[var(--brand-ink)]">50 Bighas</span>
                        </div>
                    </div>

                    {/* 4 · Image + number */}
                    <div className="about-stat relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[var(--radius-card)] p-4 text-white lg:min-h-[13rem] lg:p-5">
                        <Image
                            src="/assets/images/hero/01.jpg"
                            alt="Protected cultivation under the green house at our Bibirhut farm"
                            fill
                            sizes="(min-width:1024px) 25vw, 50vw"
                            className="object-cover object-center"
                        />
                        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/10" />
                        <div className="relative">
                            <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-white/75">Under Cover</span>
                            <span className="mt-3 block text-[2.4rem] font-medium leading-none tracking-[-0.03em]">4,700 m²</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUsSection
