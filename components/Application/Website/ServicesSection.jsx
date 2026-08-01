'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'

// Row title, hover-rolled — same glyph-roll technique as the hero's
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

// The two reference photos get their own built-once GSAP timeline — played
// forward on open, reversed (not re-tweened) on close, so the close is a
// true mirror of the open rather than a second, separately-tuned animation.
// Each photo layers three things on the same clock:
//   · wrap   — a clip-path iris: a horizontal band widens open (like a
//              camera aperture) instead of the whole shape just fading in.
//              The rounding is matched per-shape so the mid-transition band
//              still reads as "this photo", not a generic rectangle.
//   · inner  — counter-zoom (starts zoomed in, settles to 1) so the photo
//              itself has depth as the iris opens, the way the About
//              section's card photos counter-zoom under their clip reveal.
//   · veil   — a lime wash that flashes in and clears, tying the reveal to
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
    // via `hidden sm:block` — same shapes/timeline machinery, separate refs
    // so both can be measured and animated independently per breakpoint.
    const mobileImagesRefs = useRef([])
    const mobilePhotoRefs = useRef([])
    const mobilePhotoTimelines = useRef([])
    const iconRefs = useRef([])
    const ringRefs = useRef([])

    // Row 0's open state is baked into the JSX below via a plain inline
    // `style` (not set here) so the server-rendered HTML is already correct
    // — otherwise there'd be a flash of every row's tags/photos expanded
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
    // paint (useLayoutEffect, not useEffect) — the timeline's first `fromTo`
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

    // Dashed ring around each toggle — a slow, ambient spin (echoes the About
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

    // Curried setter for the three per-photo refs (wrap/inner/veil) — keeps
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
        <section className="website-gutter py-8 lg:py-10">
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
                            Kolkata&apos;s landscaper since 1989 - 35+ years, 50 bighas of our own farm at Bibirhut and 4,700 m² under cover. From a single balcony pot to State Government and CPWD landscapes, one nursery carries every service below, start to finish.
                        </p>
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                            {['Design', 'Nursery', 'Build', 'Maintain'].map((label) => (
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
                                <button
                                    type="button"
                                    onClick={() => toggle(i)}
                                    aria-expanded={isOpen}
                                    className="group flex w-full items-start gap-4 py-7 text-left sm:gap-6 lg:gap-10 lg:py-9"
                                >
                                    {/* number — pinned top-left, extra margin so it doesn't crowd the title */}
                                    <span className="mr-4 w-6 shrink-0 pt-1 text-[0.7rem] font-medium text-white/80 sm:mr-8 sm:w-9 lg:mr-14 lg:pt-1.5">
                                        [{service.num}]
                                    </span>

                                    {/* title + description stacked, tags reveal below on open */}
                                    <span className="min-w-0 flex-1">
                                        <RollTitle
                                            text={service.title}
                                            className="block text-[1.15rem] font-medium text-white lg:text-[1.55rem]"
                                        />
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
                                                    <span key={tag} className="tag-chip">{tag}</span>
                                                ))}
                                            </span>
                                        </span>

                                        {/* mobile-only reference photos — same shapes/lime-veil reveal as
                                            the desktop pair below, but stacked in-flow full width (edge to
                                            edge within the card) instead of hidden, so nothing needs a
                                            popup/overlay to be seen on a phone. */}
                                        <span
                                            ref={(el) => (mobileImagesRefs.current[i] = el)}
                                            className="block overflow-hidden sm:hidden"
                                            style={i === 0 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                                        >
                                            <span className="flex items-center gap-3 pt-5">
                                                {service.images.map((src, pi) => (
                                                    <span
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
                                                    </span>
                                                ))}
                                            </span>
                                        </span>
                                    </span>

                                    {/* reference photos — vertically centred against the whole row, only on
                                        open. Hidden below sm: the row's fixed-width items (number badge +
                                        two size-32/40 photos + toggle) already exceed a phone's content
                                        width, so these would force the title/description off-row; the
                                        mobile-only pair above (full width, in-flow) covers phones instead. */}
                                    <span
                                        ref={(el) => (imagesRefs.current[i] = el)}
                                        className="hidden self-center overflow-hidden sm:block"
                                        style={i === 0 ? { width: 'auto', height: 'auto', opacity: 1 } : { width: 0, height: 0, opacity: 0 }}
                                    >
                                        <span className="flex items-center gap-5">
                                            {service.images.map((src, pi) => (
                                                <span
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
                                                        // Row 0 renders open server-side, before the timeline's
                                                        // own opacity:0 end-state has a chance to apply — without
                                                        // this the lime veil would flash solid over its photos
                                                        // for a frame (or permanently with JS disabled).
                                                        style={i === 0 ? { opacity: 0 } : undefined}
                                                    />
                                                </span>
                                            ))}
                                        </span>
                                    </span>

                                    {/* toggle — pinned top-right. Dashed ring spins slowly at rest;
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
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* CTA — lime card with a solid circular arrow badge, matching
                    the hero's floating product card (minus its writeup line). */}
                <div className="relative mt-10 flex justify-center lg:mt-12">
                    <Link
                        href="/contact"
                        className="group flex items-center gap-4 rounded-[var(--radius-full)] bg-[var(--brand-lime)] py-3 pl-6 pr-3 transition-colors hover:bg-[var(--brand-lime-hover)]"
                    >
                        <span className="text-[1rem] font-semibold text-[var(--brand-lime-ink)]">
                            Let&apos;s Talk
                        </span>
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)] text-white transition-transform duration-300 ease-out group-hover:rotate-45">
                            <ArrowUpRight className="size-4" />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ServicesSection
