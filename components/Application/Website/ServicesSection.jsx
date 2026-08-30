'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { NURSERY_BIGHAS, POLYSHED_SQM, GREEN_HOUSE_SQM, FANPAD_SQM, UNDER_COVER_SQM, yearsInBusiness } from '@/lib/companyInfo'

// Row title, hover-rolled - same glyph-roll technique as the hero's
// "Winter Seedlings" card title (stacked duplicate slides up into place),
// but split word-then-character like the About section's heading so long
// titles still wrap at word boundaries instead of splitting mid-word. The
// row `<button>` already carries `group`, so no extra hover wiring is needed.
const RollTitle = ({ text, className = '' }) => {
    let gi = 0 // running glyph index → one continuous left-to-right stagger across words
    return (
        <span aria-label={text} className={className}>
            {text.split(' ').flatMap((word, wi, words) => [
                <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
                    {[...word].map((ch, ci) => {
                        const delay = `${gi++ * 16}ms`
                        return (
                            <span key={ci} className="relative inline-block overflow-hidden align-baseline">
                                <span
                                    className="inline-block transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
                                    style={{ transitionDelay: delay }}
                                >
                                    {ch}
                                </span>
                                <span
                                    className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
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

// One nursery, four services - aligned with our dedicated service divisions:
// 1. Landscape Development (/services/landscape-development)
// 2. Garden Maintenance & Aftercare (/services/garden-maintenance)
// 3. Roof Garden Design (/services/roof-garden)
// 4. Vertical Garden Systems (/services/vertical-garden)
const SERVICES = [
    {
        num: '01',
        title: 'Landscape Design & Development',
        slug: 'landscape-development',
        href: '/services/landscape-development',
        description: 'Complete landscape architecture and garden execution for homes, campuses, townships, and public grounds. We assess light angles, soil profile, and natural drainage to deliver scientific planting plans, Selection-I or Mexican lawn laying, and custom FRP/iron architectural structures - carried by qualified horticulturists from first visit to handover.',
        tags: ['Site Survey & Soil Profiling', 'Selection-I & Mexican Lawns', 'FRP & Iron Structures', 'Township & Campus Scale', 'State Govt. & CPWD Approved'],
        images: [
            'https://res.cloudinary.com/heog9fna/image/upload/v1788116698/5_hsovs6.png',
            'https://res.cloudinary.com/heog9fna/image/upload/v1788116700/4_zfdwiv.png',
        ],
    },
    {
        num: '02',
        title: 'Garden Maintenance & Aftercare',
        slug: 'garden-maintenance',
        href: '/services/garden-maintenance',
        description: 'Annual maintenance contracts (AMC) that keep gardens thriving across every season. Scheduled visits by trained horticultural staff for pruning and topiary shaping, granular and foliar feeding, integrated pest management, lawn mowing, and full seasonal replanting using inputs directly from our own farm.',
        tags: ['Annual Contracts (AMC)', 'Pruning & Topiary Shaping', 'Integrated Pest Control', 'Lawn Upkeep & Edging', 'Seasonal Replanting', 'Farm-Grown Inputs'],
        images: [
            'https://res.cloudinary.com/heog9fna/image/upload/v1787744099/WhatsApp_Image_2026-08-26_at_4.57.12_PM_v9lbib.jpg',
            'https://res.cloudinary.com/heog9fna/image/upload/v1787667630/zuiiigfsl9h1rupinhq0.jpg',
        ],
    },
    {
        num: '03',
        title: 'Roof Garden Design',
        slug: 'roof-garden',
        href: '/services/roof-garden',
        description: 'Specialist engineered rooftop ecosystems that turn concrete slabs into lush, usable green retreats. Multi-layer installations with root-barrier geotextile membranes, high-flow drainage cells, ultra-lightweight media within structural load budgets, automated drip irrigation, and weather-hardy flora.',
        tags: ['Root-Barrier Geotextile', 'High-Flow Drain Cell', 'Lightweight Media Blends', 'Automated Drip Irrigation', 'Weather-Proof Planters'],
        images: [
            'https://res.cloudinary.com/heog9fna/image/upload/v1788118026/ChatGPT_Image_Aug_31_2026_12_56_08_AM_v2dwkd.png',
            'https://res.cloudinary.com/heog9fna/image/upload/v1788118565/ChatGPT_Image_Aug_31_2026_01_05_03_AM_cgk80g.png',
        ],
    },
    {
        num: '04',
        title: 'Vertical Garden Systems',
        slug: 'vertical-garden',
        href: '/services/vertical-garden',
        description: 'Modular living-wall panels and structural trellises for building facades, interior atriums, and boundary screens. Custom-engineered with automated drip irrigation, drainage collection trays, and botanical selections tailored precisely to ambient light levels—from air-purifying indoor aroids to resilient exterior climbers.',
        tags: ['Modular Living Walls', 'Structural Trellis Frames', 'Concealed Drip Irrigation', 'Indoor Air-Purifying Flora', 'Facade Greenery'],
        images: [
            'https://res.cloudinary.com/heog9fna/image/upload/v1788117797/ChatGPT_Image_Aug_31_2026_12_52_06_AM_npdux3.png',
            'https://res.cloudinary.com/heog9fna/image/upload/v1787744100/WhatsApp_Image_2026-08-26_at_4.57.12_PM_1_cdnqow.jpg',
        ],
    },
]

// Animate one drawer open/closed along one or more dimensions (['height']
// for the tag list, ['width', 'height'] for the image pair - it needs both,
// otherwise the wrapper keeps reserving its full image height even while
// collapsed to zero width) - GSAP measures the natural size via a momentary
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

// The two reference photos get their own built-once GSAP timeline - played
// forward on open, reversed (not re-tweened) on close, so the close is a
// true mirror of the open rather than a second, separately-tuned animation.
// Each photo layers three things on the same clock:
//   · wrap   - a clip-path iris: a horizontal band widens open (like a
//              camera aperture) instead of the whole shape just fading in.
//              The rounding is matched per-shape so the mid-transition band
//              still reads as "this photo", not a generic rectangle.
//   · inner  - counter-zoom (starts zoomed in, settles to 1) so the photo
//              itself has depth as the iris opens, the way the About
//              section's card photos counter-zoom under their clip reveal.
//   · veil   - a lime wash that flashes in and clears, tying the reveal to
//              the section's lime accent (ring hover, tags, CTA) instead of
//              a plain fade.
// The two photos are staggered so the second begins its iris just as the
// first is mid-open, reading as one continuous sweep rather than two
// separate pops.
const buildPhotoTimeline = (photos) => {
    const tl = gsap.timeline({ paused: true })
    photos.forEach((p, pi) => {
        if (!p?.wrap) return
        const at = pi * 0.18
        const round = pi === 0 ? '50%' : '18px'

        tl.fromTo(
            p.wrap,
            { clipPath: `inset(44% 0% 44% 0% round ${round})`, autoAlpha: 0, scale: 0.9, rotate: pi === 0 ? -8 : 8 },
            {
                clipPath: `inset(0% 0% 0% 0% round ${round})`,
                autoAlpha: 1,
                scale: 1,
                rotate: 0,
                duration: 0.75,
                ease: 'power4.inOut',
            },
            at
        )
        if (p.inner) {
            tl.fromTo(p.inner, { scale: 1.35 }, { scale: 1, duration: 1.05, ease: 'power2.out' }, at)
        }
        if (p.veil) {
            tl.fromTo(
                p.veil,
                { autoAlpha: 0.85 },
                { autoAlpha: 0, duration: 0.55, ease: 'power2.out' },
                at + 0.1
            )
        }
    })
    return tl
}

const ServicesSection = () => {
    const [openIndex, setOpenIndex] = useState(0)
    const tagsRefs = useRef([])
    const imagesRefs = useRef([])
    // photoRefs.current[i] = [{ wrap, inner, veil }, { wrap, inner, veil }] for that row
    const photoRefs = useRef([])
    const photoTimelines = useRef([])
    // Mobile gets its own full-width photo row (rendered in-flow below the
    // tags, edge to edge within the card) instead of the desktop pair hidden
    // via `hidden sm:block` - same shapes/timeline machinery, separate refs
    // so both can be measured and animated independently per breakpoint.
    const mobileImagesRefs = useRef([])
    const mobilePhotoRefs = useRef([])
    const mobilePhotoTimelines = useRef([])
    const iconRefs = useRef([])
    const ringRefs = useRef([])

    // Row 0's open state is baked into the JSX below via a plain inline
    // `style` (not set here) so the server-rendered HTML is already correct
    // - otherwise there'd be a flash of every row's tags/photos expanded
    // before this effect ever gets to run on the client. This effect only
    // needs to clean up GSAP tweens on unmount; every open/close afterwards
    // is driven purely by `toggle`, with nothing else touching these props.
    useEffect(() => {
        return () => {
            ;[...tagsRefs.current, ...imagesRefs.current, ...mobileImagesRefs.current, ...iconRefs.current].forEach(
                (el) => el && gsap.killTweensOf(el)
            )
        }
    }, [])

    // Build each row's photo timeline exactly once, synchronously before
    // paint (useLayoutEffect, not useEffect) - the timeline's first `fromTo`
    // applies its "from" state the instant it's created, so row 0 (already
    // open server-side) needs to be jumped straight to the timeline's end
    // before the browser ever paints, or its photos would flash closed-then-
    // open on mount.
    useLayoutEffect(() => {
        photoTimelines.current = photoRefs.current.map((photos, i) => {
            const tl = buildPhotoTimeline(photos || [])
            if (i === openIndex) tl.progress(1)
            return tl
        })
        mobilePhotoTimelines.current = mobilePhotoRefs.current.map((photos, i) => {
            const tl = buildPhotoTimeline(photos || [])
            if (i === openIndex) tl.progress(1)
            return tl
        })
        return () => {
            photoTimelines.current.forEach((tl) => tl?.kill())
            photoTimelines.current = []
            mobilePhotoTimelines.current.forEach((tl) => tl?.kill())
            mobilePhotoTimelines.current = []
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Dashed ring around each toggle - a slow, ambient spin (echoes the About
    // section's seal ring) so the row markers feel alive even at rest, not
    // just on click. Independent of the toggle's own pop/rotate tween below
    // (that one lands on the inner badge, not this ring), so the two motions
    // never fight over the same transform.
    useEffect(() => {
        const rings = ringRefs.current.filter(Boolean)
        const tweens = rings.map((ring) =>
            gsap.to(ring, { rotate: 360, duration: 16, ease: 'none', repeat: -1 })
        )
        return () => tweens.forEach((t) => t.kill())
    }, [])

    // Curried setter for the three per-photo refs (wrap/inner/veil) - keeps
    // the JSX below to one ref prop per element instead of an inline object-
    // merging callback repeated six times per row.
    const setPhotoRef = (i, pi, key) => (el) => {
        if (!photoRefs.current[i]) photoRefs.current[i] = []
        if (!photoRefs.current[i][pi]) photoRefs.current[i][pi] = {}
        photoRefs.current[i][pi][key] = el
    }

    const setMobilePhotoRef = (i, pi, key) => (el) => {
        if (!mobilePhotoRefs.current[i]) mobilePhotoRefs.current[i] = []
        if (!mobilePhotoRefs.current[i][pi]) mobilePhotoRefs.current[i][pi] = {}
        mobilePhotoRefs.current[i][pi][key] = el
    }

    const toggle = (i) => {
        const opening = openIndex !== i
        const prevIndex = openIndex
        setOpenIndex(opening ? i : null)

        // Close whichever row was open, if it isn't the one just clicked.
        if (prevIndex !== null && prevIndex !== i) {
            animateDrawer(tagsRefs.current[prevIndex], false, ['height'])
            animateDrawer(imagesRefs.current[prevIndex], false, ['width', 'height'])
            animateDrawer(mobileImagesRefs.current[prevIndex], false, ['height'])
            photoTimelines.current[prevIndex]?.reverse()
            mobilePhotoTimelines.current[prevIndex]?.reverse()
        }

        animateDrawer(tagsRefs.current[i], opening, ['height'])
        animateDrawer(imagesRefs.current[i], opening, ['width', 'height'])
        animateDrawer(mobileImagesRefs.current[i], opening, ['height'])
        photoTimelines.current[i]?.[opening ? 'play' : 'reverse']()
        mobilePhotoTimelines.current[i]?.[opening ? 'play' : 'reverse']()

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
        <section className="website-gutter pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="dark-panel relative overflow-hidden p-6 sm:p-8 lg:p-14">

                {/* header */}
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="flex items-start gap-2 text-[0.8rem] font-semibold uppercase text-white lg:pt-3">
                            <span aria-hidden className="mt-1.5 size-1.5 rounded-full border border-current" />
                            Our Services
                        </span>
                        <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,3.8vw,3rem)] font-medium leading-[1.12] text-white">
                            Rooted In Craft, Grown Into Every Garden
                        </h2>
                    </div>
                    <div className="flex flex-col items-start gap-4 lg:items-end">
                        <p className="max-w-sm text-[0.85rem] leading-relaxed text-white lg:text-right">
                            Kolkata&apos;s landscaper since 1989 - {yearsInBusiness()}+ years, {NURSERY_BIGHAS} bighas of our own farm at Bibirhut and {UNDER_COVER_SQM.toLocaleString('en-US')} m² under cover. From residential terraces and living walls to State Government and CPWD public grounds, our four specialized divisions carry every project from site survey to lifelong aftercare.
                        </p>
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                            {['Landscape Development', 'Garden Maintenance', 'Roof Gardens', 'Vertical Walls'].map((label) => (
                                <span key={label} className="tag-chip">{label}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* accordion rows */}
                <div className="relative">
                    {SERVICES.map((service, i) => {
                        const isOpen = openIndex === i
                        return (
                            <div key={service.num} className="border-b border-white/80 last:border-b-0">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toggle(i)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            toggle(i)
                                        }
                                    }}
                                    aria-expanded={isOpen}
                                    className="group flex w-full cursor-pointer items-start gap-4 py-7 text-left sm:gap-6 lg:gap-10 lg:py-9"
                                >
                                    {/* number - pinned top-left, extra margin so it doesn't crowd the title */}
                                    <span className="mr-4 w-6 shrink-0 pt-1 text-[0.8rem] font-medium text-white/80 sm:mr-8 sm:w-9 lg:mr-14 lg:pt-1.5">
                                        [{service.num}]
                                    </span>

                                    {/* title + description stacked, tags reveal below on open */}
                                    <div className="min-w-0 flex-1">
                                        <RollTitle
                                            text={service.title}
                                            className="block text-[1.15rem] font-medium text-white lg:text-[1.55rem]"
                                        />
                                        <p className="mt-2.5 block max-w-lg text-[0.82rem] leading-relaxed text-white/45 lg:max-w-xl">
                                            {service.description}
                                        </p>
                                        <div
                                            ref={(el) => (tagsRefs.current[i] = el)}
                                            className="block overflow-hidden"
                                            style={i === 0 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                                        >
                                            <div className="flex flex-wrap items-center gap-2 pt-5">
                                                {service.tags.map((tag) => (
                                                    <span key={tag} className="tag-chip">{tag}</span>
                                                ))}
                                                <Link
                                                    href={service.href}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-lime)]/40 bg-[var(--brand-lime)]/10 px-3.5 py-1.5 text-[0.78rem] font-medium text-[var(--brand-lime)] transition-colors hover:bg-[var(--brand-lime)] hover:text-[var(--brand-lime-ink)]"
                                                >
                                                    <span>Explore {service.title}</span>
                                                    <ArrowUpRight className="size-3.5" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* mobile-only reference photos - same shapes/lime-veil reveal as
                                            the desktop pair below, but stacked in-flow full width (edge to
                                            edge within the card) instead of hidden, so nothing needs a
                                            popup/overlay to be seen on a phone. */}
                                        <div
                                            ref={(el) => (mobileImagesRefs.current[i] = el)}
                                            className="block overflow-hidden sm:hidden"
                                            style={i === 0 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                                        >
                                            <div className="flex items-center gap-3 pt-5">
                                                {service.images.map((src, pi) => (
                                                    <div
                                                        key={`m-${src}-${pi}`}
                                                        ref={setMobilePhotoRef(i, pi, 'wrap')}
                                                        className={`relative aspect-square w-full flex-1 overflow-hidden ${pi === 0 ? 'rounded-full' : 'rounded-2xl'}`}
                                                    >
                                                        <span ref={setMobilePhotoRef(i, pi, 'inner')} className="absolute inset-0">
                                                            <Image
                                                                src={src}
                                                                alt=""
                                                                fill
                                                                sizes="50vw"
                                                                className={pi === 0 ? 'object-cover object-top' : 'object-cover'}
                                                            />
                                                        </span>
                                                        <span
                                                            ref={setMobilePhotoRef(i, pi, 'veil')}
                                                            aria-hidden
                                                            className="pointer-events-none absolute inset-0 bg-[var(--brand-lime)]"
                                                            style={i === 0 ? { opacity: 0 } : undefined}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* reference photos - vertically centred against the whole row, only on
                                        open. Hidden below sm: the row's fixed-width items (number badge +
                                        two size-32/40 photos + toggle) already exceed a phone's content
                                        width, so these would force the title/description off-row; the
                                        mobile-only pair above (full width, in-flow) covers phones instead. */}
                                    <div
                                        ref={(el) => (imagesRefs.current[i] = el)}
                                        className="hidden self-center overflow-hidden sm:block"
                                        style={i === 0 ? { width: 'auto', height: 'auto', opacity: 1 } : { width: 0, height: 0, opacity: 0 }}
                                    >
                                        <div className="flex items-center gap-5">
                                            {service.images.map((src, pi) => (
                                                <div
                                                    key={src + pi}
                                                    ref={setPhotoRef(i, pi, 'wrap')}
                                                    className={`relative size-32 shrink-0 overflow-hidden lg:size-40 ${pi === 0 ? 'rounded-full' : 'rounded-2xl'}`}
                                                >
                                                    <span ref={setPhotoRef(i, pi, 'inner')} className="absolute inset-0">
                                                        <Image
                                                            src={src}
                                                            alt=""
                                                            fill
                                                            sizes="160px"
                                                            className={pi === 0 ? 'object-cover object-top' : 'object-cover'}
                                                        />
                                                    </span>
                                                    <span
                                                        ref={setPhotoRef(i, pi, 'veil')}
                                                        aria-hidden
                                                        className="pointer-events-none absolute inset-0 bg-[var(--brand-lime)]"
                                                        style={i === 0 ? { opacity: 0 } : undefined}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* toggle - pinned top-right. Dashed ring spins slowly at rest;
                                        the solid inner badge is what pops on click. Lime on hover
                                        (desktop) and while the row is open (mobile has no hover, so
                                        `isOpen` is what carries the same lime accent on tap there). */}
                                    <span className="relative flex size-11 shrink-0 items-center justify-center">
                                        <span
                                            ref={(el) => (ringRefs.current[i] = el)}
                                            aria-hidden
                                            className={`absolute inset-0 rounded-full border border-dashed transition-colors group-hover:border-[var(--brand-lime)]/70 ${isOpen ? 'border-[var(--brand-lime)]/70' : 'border-white/25'}`}
                                        />
                                        <span
                                            ref={(el) => (iconRefs.current[i] = el)}
                                            className={`relative flex size-7 items-center justify-center rounded-full transition-colors group-hover:bg-[var(--brand-lime)] group-hover:text-[var(--brand-lime-ink)] ${isOpen ? 'bg-[var(--brand-lime)] text-[var(--brand-lime-ink)]' : 'bg-white/10 text-white'}`}
                                        >
                                            {isOpen ? <Minus className="size-3.5" strokeWidth={1.75} /> : <Plus className="size-3.5" strokeWidth={1.75} />}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* CTA - Explore All Services + Request a Site Visit */}
                <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4 lg:mt-12">
                    <Link
                        href="/services"
                        className="group flex items-center gap-4 rounded-[var(--radius-full)] bg-[var(--brand-lime)] py-3 pl-6 pr-3 transition-colors hover:bg-[var(--brand-lime-hover)]"
                    >
                        <span className="text-[1rem] font-semibold text-[var(--brand-lime-ink)]">
                            Explore All Services
                        </span>
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)] text-white transition-transform duration-300 ease-out group-hover:rotate-45">
                            <ArrowUpRight className="size-4" />
                        </span>
                    </Link>
                    <Link
                        href="/contact"
                        className="group flex items-center gap-3 rounded-[var(--radius-full)] border border-white/20 bg-white/5 py-3 px-6 text-[1rem] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
                    >
                        <span>Request a Site Visit</span>
                        <ArrowUpRight className="size-4 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ServicesSection
