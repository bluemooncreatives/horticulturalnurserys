'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Small avatar set reused to build the "collaborations" cluster.
const CLUSTER = [
    '/assets/images/hero/02.webp',
    '/assets/images/hero/03.webp',
    '/assets/images/hero/04.webp',
    '/assets/images/hero/01.webp',
    '/assets/images/hero/03.webp',
    '/assets/images/hero/02.webp',
    '/assets/images/hero/04.webp',
    '/assets/images/hero/01.webp',
]

const AboutUsSection = () => {
    const sectionRef = useRef(null)

    useGSAP(() => {
        gsap.fromTo(
            '.about-statement > *',
            { autoAlpha: 0, y: 24 },
            {
                autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
                scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
            }
        )
        gsap.fromTo(
            '.about-stat',
            { autoAlpha: 0, y: 34 },
            {
                autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
                scrollTrigger: { trigger: '.about-stats', start: 'top 88%', once: true },
            }
        )
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} className="lumora-shell py-16 lg:py-24">

            {/* ── Statement ── */}
            <div className="about-statement grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-8">
                <span className="flex items-start gap-2 text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[var(--muted-foreground)] lg:pt-3">
                    <span aria-hidden className="mt-1.5 size-1.5 rounded-full border border-current" />
                    About Company
                </span>
                <h2 className="max-w-4xl text-[clamp(1.5rem,3.4vw,2.35rem)] font-medium leading-[1.28] tracking-[-0.01em] text-[var(--brand-ink)]">
                    We believe the most cherished garments are not simply bought, but
                    <span className="px-1.5 text-[var(--muted-foreground)]">/</span>
                    worn into memory —
                    <span className="text-[var(--muted-foreground)]"> quietly holding a moment, and carrying its grace long after the occasion it was made for.</span>
                </h2>
            </div>

            {/* ── Stat cards ── */}
            <div className="about-stats mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4">

                {/* 1 · Avatar cluster */}
                <div className="about-stat flex min-h-[13.5rem] flex-col justify-between rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5 lg:min-h-[15rem]">
                    <div className="flex flex-wrap gap-1.5">
                        {CLUSTER.map((src, i) => (
                            <span key={i} className="relative size-9 overflow-hidden rounded-full border-2 border-white ring-1 ring-black/5">
                                <Image src={src} alt="" fill sizes="36px" className="object-cover object-top" />
                            </span>
                        ))}
                        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-lime)] text-[0.62rem] font-semibold text-[var(--brand-lime-ink)]">
                            45+
                        </span>
                    </div>
                    <p className="mt-5 text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                        Loved Across India
                    </p>
                </div>

                {/* 2 · Dark number + seal */}
                <div className="about-stat relative flex min-h-[13.5rem] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-[var(--brand-ink-soft)] p-5 text-white lg:min-h-[15rem]">
                    <span className="text-[0.7rem] uppercase tracking-[0.16em] text-white/45">Years of Craft</span>
                    {/* circular seal */}
                    <span aria-hidden className="absolute right-4 top-4 flex size-[4.2rem] items-center justify-center rounded-full border border-white/15">
                        <span className="absolute inset-1 rounded-full border border-dashed border-white/15" />
                        <Star className="size-5 text-[var(--brand-lime)]" strokeWidth={1.5} fill="currentColor" />
                    </span>
                    <p className="text-[3rem] font-medium leading-none tracking-[-0.03em]">6+</p>
                </div>

                {/* 3 · Text */}
                <div className="about-stat flex min-h-[13.5rem] flex-col justify-between rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5 lg:min-h-[15rem]">
                    <p className="text-[0.92rem] leading-snug text-[var(--brand-ink)]">
                        From everyday comfort to festive charm, each piece is approached as
                        a world of its own — made to be cherished.
                    </p>
                    <div>
                        <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Pieces Delivered</span>
                        <span className="mt-1 block text-[1.9rem] font-medium leading-none tracking-[-0.02em] text-[var(--brand-ink)]">4k+</span>
                    </div>
                </div>

                {/* 4 · Image + number */}
                <div className="about-stat relative flex min-h-[13.5rem] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-5 text-white lg:min-h-[15rem]">
                    <Image
                        src="/assets/images/hero/03.webp"
                        alt="MomStitched craft"
                        fill
                        sizes="(min-width:1024px) 25vw, 50vw"
                        className="object-cover object-top"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
                    <div className="relative">
                        <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-white/70">Cities Reached</span>
                        <span className="mt-1 block text-[3rem] font-medium leading-none tracking-[-0.03em]">18+</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUsSection
