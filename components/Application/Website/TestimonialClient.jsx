'use client'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import Link from 'next/link'
import { Star, ArrowUpRight, Quote } from 'lucide-react'

import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

gsap.registerPlugin(ScrollTrigger)

const clampRating = (rating) => Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))

const Stars = ({ rating, className = '' }) => (
    <div className={`flex gap-0.5 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`size-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-current text-current opacity-20'}`}
            />
        ))}
    </div>
)

const TestimonialClient = ({ testimonials = [] }) => {
    const sectionRef = useRef(null)

    // Cap the grid so a large review set doesn't create an unwieldy wall.
    const cards = testimonials.slice(0, 8)

    const avg = testimonials.length
        ? (testimonials.reduce((s, t) => s + (Number(t.rating) || 0), 0) / testimonials.length)
        : 0
    const avgLabel = avg ? avg.toFixed(1) : '5.0'

    useGSAP(() => {
        gsap.fromTo(
            '.voices-head > *',
            { autoAlpha: 0, y: 30 },
            {
                autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
            }
        )
        gsap.fromTo(
            '.voices-card',
            { autoAlpha: 0, y: 34 },
            {
                autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
                scrollTrigger: { trigger: '.voices-grid', start: 'top 85%', once: true },
            }
        )
    }, { scope: sectionRef })

    if (!cards.length) return null

    return (
        <section ref={sectionRef} className="lumora-shell py-16 lg:py-24">

            {/* ── Header ── */}
            <div className="voices-head mb-8 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <span className="eyebrow flex items-center gap-2">
                        <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                        Testimonials
                    </span>
                    <h2 className="mt-3 text-[clamp(1.8rem,4.4vw,3.2rem)] font-medium tracking-[-0.02em] text-[var(--brand-primary)]">
                        From Our Gardens
                    </h2>
                </div>
                <p className="max-w-sm text-[0.9rem] leading-relaxed text-[var(--muted-foreground)]">
                    Notes from the people whose terraces, courtyards and campuses we have planted.
                </p>
            </div>

            {/* ── Rating tile + card grid ── */}
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">

                {/* Black average-rating tile */}
                <div className="flex shrink-0 flex-col justify-between rounded-[var(--radius-card)] bg-[var(--brand-ink-soft)] p-6 text-white lg:w-[300px] lg:p-7">
                    <div>
                        <span className="eyebrow text-white/40">Customer Rating</span>
                        <p className="mt-5 flex items-end gap-1 leading-none">
                            <span className="text-[3.5rem] font-medium tracking-[-0.02em]">{avgLabel}</span>
                            <span className="mb-1.5 text-xl text-white/40">/ 5</span>
                        </p>
                        <Stars rating={clampRating(avg)} className="mt-3 text-white" />
                        <p className="mt-5 text-[0.85rem] leading-relaxed text-white/50">
                            Homes, farm houses and public grounds across West Bengal — planted once, tended season after season.
                        </p>
                    </div>
                    <Link href={WEBSITE_SHOP} className="pill pill-lime group mt-8 self-start">
                        Browse &amp; Review
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>

                {/* Masonry card grid */}
                <div className="voices-grid flex-1 gap-3 sm:columns-2 sm:gap-4 [column-fill:_balance] xl:columns-3">
                    {cards.map((item, i) => {
                        const rating = clampRating(item.rating)
                        return (
                            <figure
                                key={`${item.name}-${i}`}
                                className="voices-card mb-3 break-inside-avoid rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-6 sm:mb-4"
                            >
                                <Quote className="size-6 rotate-180 text-[var(--brand-primary)]/15" />
                                <blockquote className="mt-3 text-[0.95rem] leading-relaxed text-[var(--brand-primary)]">
                                    {item.review}
                                </blockquote>
                                <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-[0.9rem] font-medium text-[var(--brand-primary)]">{item.name}</p>
                                        <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Verified Client</p>
                                    </div>
                                    <Stars rating={rating} className="shrink-0 text-[var(--brand-primary)]" />
                                </figcaption>
                            </figure>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default TestimonialClient
