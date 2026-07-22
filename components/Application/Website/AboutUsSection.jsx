'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Nine thumbnails + the count chip fill a 5-column grid as two even rows, the
// way the reference lays them out. A flex-wrap here produced a ragged 6 / 2+chip
// split because the tile size and card width never divided cleanly.
const CLUSTER = Array.from({ length: 9 }, () => '/assets/images/hero/01.jpg')

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
            {/* The label column is proportional, not a fixed 14rem: the reference
                starts its statement around 35% of the container width, and a fixed
                column drifts to ~18% as the viewport grows. 1fr : 1.85fr holds the
                statement's left edge at ~35% at any width. */}
            <div className="about-statement grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_1.85fr] lg:gap-8">
                <span className="flex items-start gap-2 text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[var(--muted-foreground)] lg:pt-3">
                    <span aria-hidden className="mt-1.5 size-1.5 rounded-full border border-current" />
                    About Company
                </span>
                <h2 className="max-w text-[clamp(1.5rem,3.4vw,2.35rem)] font-medium leading-[1.28] tracking-[-0.01em] text-[var(--brand-ink)]">
                    A garden is not decorated, but
                    <span className="px-1.5 text-[var(--muted-foreground)]">/</span>
                    grown into place —
                    <span className="text-[var(--muted-foreground)]"> which is why we raise our own plants, design the space they will live in, and stay on to maintain it long after the handover.</span>
                </h2>
            </div>

            {/* ── Stat cards ── */}
            <div className="about-stats mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4">

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

                {/* 2 · Dark number + seal — label and figure grouped at the top,
                       as in the reference. `justify-between` previously flung the
                       number to the card's base and opened a void between them. */}
                <div className="about-stat relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--brand-ink-soft)] p-4 text-white lg:min-h-[13rem] lg:p-5">
                    {/* circular seal — vertically centred against the figure */}
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

                {/* 4 · Image + number — figure sits at the top like the reference,
                       so the scrim runs top-down to match; the old bottom-up ramp
                       left the label sitting on the brightest part of the photo. */}
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
        </section>
    )
}

export default AboutUsSection
