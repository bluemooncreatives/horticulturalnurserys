'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'

// One nursery, four services — the same shape as BenefitsSection's "how we
// work" list, but expandable: each row hides its tags + reference photos
// behind the +/- drawer, matching the accordion reference. Images are drawn
// from the only stock we have (hero/01-03), reused across rows.
const SERVICES = [
    {
        num: '01',
        title: 'Garden Design & Consultation',
        description: 'Every project starts with a site visit - we read the light, soil, drainage and how the space will be used, then return a planting plan with a costing. Work begins only once the layout and estimate are approved, whether it’s a balcony or a full township.',
        tags: ['Site Survey', 'Planting Plans', 'Costing'],
        images: ['/assets/images/hero/01.jpg', '/assets/images/hero/02.jpg'],
    },
    {
        num: '02',
        title: 'Nursery & Plant Supply',
        description: 'Grown on our own 50-bigha farm at Bibirhut, Ramdevpur - 2,500 sqm of polyshed, 2,000 sqm of green house and a 200 sqm fanpad house. Seasonal flowers, shrubs, ornamental trees and select imported varieties, hardened before they ever leave the farm.',
        tags: ['Own Farm Stock', 'Seasonal Flowers', 'Imported Varieties'],
        images: ['/assets/images/hero/02.jpg', '/assets/images/hero/03.jpg'],
    },
    {
        num: '03',
        title: 'Landscape Execution',
        description: 'From a roof garden - laid with geotextile net and drain cell to protect the slab - to Mexican, shade or blade grass lawns and township-scale landscapes. We also hold credentials for State Government and CPWD work: parks, lake fronts, zoo and library grounds, IT parks and tourist lodges.',
        tags: ['Roof Gardens', 'Lawns', 'Township Scale'],
        images: ['/assets/images/hero/03.jpg', '/assets/images/hero/01.jpg'],
    },
    {
        num: '04',
        title: 'Maintenance & Aftercare',
        description: 'Annual maintenance contracts for gardens we’ve built and for existing ones too - pruning, feeding, pest control, lawn upkeep and seasonal replanting by our own field staff, using the same organic and inorganic manures we stock at the counter.',
        tags: ['Pruning', 'Pest Control', 'Annual Contracts'],
        images: ['/assets/images/hero/01.jpg', '/assets/images/hero/03.jpg'],
    },
]

// Animate one drawer open/closed along one or more dimensions (['height']
// for the tag list, ['width', 'height'] for the image pair — it needs both,
// otherwise the wrapper keeps reserving its full image height even while
// collapsed to zero width) — GSAP measures the natural size via a momentary
// `auto` set, then tweens from/to 0 against that number, since neither CSS
// nor GSAP can tween directly to/from `auto`.
const animateDrawer = (el, opening, dimensions) => {
    if (!el) return
    const autoStyle = {}
    dimensions.forEach((d) => (autoStyle[d] = 'auto'))

    if (opening) {
        gsap.set(el, autoStyle)
        const full = {}
        dimensions.forEach((d) => (full[d] = d === 'height' ? el.offsetHeight : el.offsetWidth))
        const from = {}
        dimensions.forEach((d) => (from[d] = 0))
        gsap.fromTo(
            el,
            { ...from, opacity: 0 },
            {
                ...full,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.inOut',
                onComplete: () => gsap.set(el, autoStyle), // let it reflow with the viewport again
            }
        )
    } else {
        const to = {}
        dimensions.forEach((d) => (to[d] = 0))
        gsap.to(el, { ...to, opacity: 0, duration: 0.5, ease: 'power3.inOut' })
    }
}

const ServicesSection = () => {
    const [openIndex, setOpenIndex] = useState(0)
    const tagsRefs = useRef([])
    const imagesRefs = useRef([])
    const iconRefs = useRef([])

    // Row 0's open state is baked into the JSX below via a plain inline
    // `style` (not set here) so the server-rendered HTML is already correct
    // — otherwise there'd be a flash of every row's tags/photos expanded
    // before this effect ever gets to run on the client. This effect only
    // needs to clean up GSAP tweens on unmount; every open/close afterwards
    // is driven purely by `toggle`, with nothing else touching these props.
    useEffect(() => {
        return () => {
            ;[...tagsRefs.current, ...imagesRefs.current, ...iconRefs.current].forEach(
                (el) => el && gsap.killTweensOf(el)
            )
        }
    }, [])

    const toggle = (i) => {
        const opening = openIndex !== i
        const prevIndex = openIndex
        setOpenIndex(opening ? i : null)

        // Close whichever row was open, if it isn't the one just clicked.
        if (prevIndex !== null && prevIndex !== i) {
            animateDrawer(tagsRefs.current[prevIndex], false, ['height'])
            animateDrawer(imagesRefs.current[prevIndex], false, ['width', 'height'])
        }

        animateDrawer(tagsRefs.current[i], opening, ['height'])
        animateDrawer(imagesRefs.current[i], opening, ['width', 'height'])

        const icon = iconRefs.current[i]
        if (icon) {
            gsap.fromTo(
                icon,
                { rotate: opening ? -90 : 90, scale: 0.5 },
                { rotate: 0, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }
            )
        }
    }

    return (
        <section className="website-gutter py-8 lg:py-10">
            <div className="dark-panel relative overflow-hidden p-6 sm:p-8 lg:p-14">

                {/* watermark */}
                <div aria-hidden className="pointer-events-none absolute -right-6 -top-10 select-none font-wordmark text-[16rem] leading-none text-white/[0.03] lg:text-[22rem]">
                    ✦
                </div>

                {/* header */}
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="flex items-start gap-2 text-[0.8rem] font-semibold uppercase text-white/50 lg:pt-3">
                            <span aria-hidden className="mt-1.5 size-1.5 rounded-full border border-current" />
                            Our Services
                        </span>
                        <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,3.8vw,3rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
                            Rooted In Craft, Grown Into Every Garden
                        </h2>
                    </div>
                    <div className="flex flex-col items-start gap-4 lg:items-end">
                        <p className="max-w-sm text-[0.82rem] leading-relaxed text-white/45 lg:text-right">
                            Kolkata&apos;s landscaper since 1989 - 35+ years, 50 bighas of our own farm at Bibirhut and 4,700 m² under cover. From a single balcony pot to State Government and CPWD landscapes, one nursery carries every service below, start to finish.
                        </p>
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                            {['Design', 'Nursery', 'Build', 'Maintain'].map((label) => (
                                <span key={label} className="tag-chip text-white/70">{label}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* accordion rows */}
                <div className="relative">
                    {SERVICES.map((service, i) => {
                        const isOpen = openIndex === i
                        return (
                            <div key={service.num} className="border-b border-white/10 last:border-b-0">
                                <button
                                    type="button"
                                    onClick={() => toggle(i)}
                                    aria-expanded={isOpen}
                                    className="group flex w-full items-start gap-4 py-7 text-left sm:gap-6 lg:gap-10 lg:py-9"
                                >
                                    {/* number — pinned top-left, extra margin so it doesn't crowd the title */}
                                    <span className="mr-4 w-6 shrink-0 pt-1 text-[0.7rem] font-medium tracking-[0.2em] text-white/30 sm:mr-8 sm:w-9 lg:mr-14 lg:pt-1.5">
                                        [{service.num}]
                                    </span>

                                    {/* title + description stacked, tags reveal below on open */}
                                    <span className="flex-1">
                                        <span className="block text-[1.15rem] font-medium tracking-[-0.01em] text-white lg:text-[1.55rem]">
                                            {service.title}
                                        </span>
                                        <span className="mt-2.5 block max-w-lg text-[0.82rem] leading-relaxed text-white/45 lg:max-w-xl">
                                            {service.description}
                                        </span>
                                        <span
                                            ref={(el) => (tagsRefs.current[i] = el)}
                                            className="block overflow-hidden"
                                            style={i === 0 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                                        >
                                            <span className="flex flex-wrap gap-2 pt-5">
                                                {service.tags.map((tag) => (
                                                    <span key={tag} className="tag-chip text-white/70">{tag}</span>
                                                ))}
                                            </span>
                                        </span>
                                    </span>

                                    {/* reference photos — vertically centred against the whole row, only on open */}
                                    <span
                                        ref={(el) => (imagesRefs.current[i] = el)}
                                        className="self-center overflow-hidden"
                                        style={i === 0 ? { width: 'auto', height: 'auto', opacity: 1 } : { width: 0, height: 0, opacity: 0 }}
                                    >
                                        <span className="flex items-center gap-5">
                                            <span className="relative size-24 shrink-0 overflow-hidden rounded-full sm:size-32 lg:size-40">
                                                <Image src={service.images[0]} alt="" fill sizes="160px" className="object-cover object-top" />
                                            </span>
                                            <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl sm:size-32 lg:size-40">
                                                <Image src={service.images[1]} alt="" fill sizes="160px" className="object-cover" />
                                            </span>
                                        </span>
                                    </span>

                                    {/* toggle — pinned top-right */}
                                    <span
                                        ref={(el) => (iconRefs.current[i] = el)}
                                        className="icon-round shrink-0 border-white/15 bg-white/[0.04] text-white transition-colors group-hover:border-white/35"
                                    >
                                        {isOpen ? <Minus className="size-4" strokeWidth={1.75} /> : <Plus className="size-4" strokeWidth={1.75} />}
                                    </span>
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* CTA */}
                <div className="relative mt-10 flex justify-center lg:mt-12">
                    <Link href="/contact" className="pill pill-lime group">
                        Let&apos;s Talk
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ServicesSection
