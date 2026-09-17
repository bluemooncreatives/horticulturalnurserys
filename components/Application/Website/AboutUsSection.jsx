'use client'

import Image from 'next/image'
import { TbTopologyStar3 } from 'react-icons/tb'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NURSERY_BIGHAS, UNDER_COVER_SQM, yearsInBusiness } from '@/lib/companyInfo'

// Collaborator cluster (card 1). Two overflowing rows of garden project
// shots so the side-fade mask always has photos behind its soft edges - the
// cluster reads as a continuous, larger set than the card can show. Row B is
// offset so the two rows never duplicate vertically adjacent photos.
const AVATAR_SRCS = [
    'https://res.cloudinary.com/heog9fna/image/upload/v1788117797/ChatGPT_Image_Aug_31_2026_12_52_06_AM_npdux3.png',
    'https://res.cloudinary.com/heog9fna/image/upload/v1787731802/ekw9icnf59busuhimjw4.jpg',
    'https://res.cloudinary.com/heog9fna/image/upload/v1787667630/zuiiigfsl9h1rupinhq0.jpg',
    'https://res.cloudinary.com/heog9fna/image/upload/v1787582197/pklraaorrpqqvfss304g.jpg',
    'https://res.cloudinary.com/heog9fna/image/upload/v1787578383/usn3usn3621dmmxihpoa.png',
    'https://res.cloudinary.com/heog9fna/image/upload/v1787579099/zghj02urhtxrjsddsgkx.jpg',
    'https://res.cloudinary.com/heog9fna/image/upload/v1788117479/ChatGPT_Image_Aug_31_2026_12_46_54_AM_pso8e1.png',
    'https://res.cloudinary.com/heog9fna/image/upload/v1787731929/mb3shitmk9vb0qdxw0bi.jpg',
]
const AVATAR_ROW_A = Array.from({ length: 8 }, (_, i) => AVATAR_SRCS[i % AVATAR_SRCS.length])
const AVATAR_ROW_B = Array.from({ length: 8 }, (_, i) => AVATAR_SRCS[(i + 3) % AVATAR_SRCS.length])

// Signature of the reference cards: content fades to nothing at the left/right
// edges. Used as a mask on both the avatar rows and the big count, always bled
// to the card edge so the fade sits in the padding gutter, never on the faces
// or the digits.
const SIDE_FADE = 'linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%)'

// Circular caption that wraps the seal (card 2). Rendered as SVG text on a
// circle path; the middle dot separates the loop so the phrase reads as a
// continuous ring. Kept short enough to fit one revolution at the seal size.
const SEAL_TEXT = ' YEARS IN THE FIELD · ROOTED IN EXPERIENCE · '

// The whole statement is one green voice now (no black lead). It renders as
// per-word spans so the scroll timeline can brighten it a line at a time; the
// words are grouped into visual lines at runtime from their measured position.
const HEADING =
    "Kolkata's leading landscaper since 1989 - we raise our own plants on our farm at Bibirhut, / design and build the space they will live in, and stay on to maintain it long after the handover."

// A short line naming a few flagship projects, set under the heading. Kept
// separate from HEADING so it isn't run through the per-glyph roll animation
// (a long comma list would make the roll cascade unreadable) - it fades in
// with the rest of the statement layer instead.
const NOTABLE_PROJECTS =
    'Trusted for landscapes at Alipore Zoo, National Library, Rabindra Sarobar Lake, Krishnanagar IT Park and more.'

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
    const statementRef = useRef(null)   // eyebrow + heading - parallax layer A
    const statsRef = useRef(null)       // stat cards - parallax layer B

    useEffect(() => {
        const root = rootRef.current
        if (!root) return
        gsap.registerPlugin(ScrollTrigger)

        const mm = gsap.matchMedia()

        // Build (and rebuild) the clean, solid line-by-line brighten timeline.
        // Each visual line illuminates from 35% opacity to 100% full green
        // without fragmenting or rolling individual glyphs, keeping words completely legible.
        const makeLineFill = (triggerVars) => {
            const words = gsap.utils.toArray('.about-fill-word', root)
            let tl = null
            let disposed = false

            const build = () => {
                if (disposed) return
                tl?.scrollTrigger?.kill()
                tl?.kill()
                gsap.set(words, { opacity: 0.35 }) // Soft, readable dim base
                const lines = groupLines(words)
                tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...triggerVars } })

                // One scrub: each visual line smoothly illuminates sequentially
                lines.forEach((lineWords, li) => {
                    const at = li * 0.75
                    tl.to(lineWords, { opacity: 1, duration: 0.65, ease: 'power2.out' }, at)
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

        // Card 1 motion, shared by both breakpoints. `drift` is the peak
        // ±xPercent the two avatar rows travel behind the fade mask (0 to skip
        // the drift on compact screens). The big count ticks 0→50 while the
        // whole block rises and unfolds in 3D and the "+" punches in. Everything
        // is scrubbed, so it reads on the same clock as the parallax and never
        // fires on its own timeline.
        const makeCardOne = ({ pass, settle, drift }) => {
            if (drift) {
                gsap.fromTo('.about-row-a', { xPercent: -drift }, { xPercent: drift, ease: 'none', scrollTrigger: pass })
                gsap.fromTo('.about-row-b', { xPercent: drift }, { xPercent: -drift, ease: 'none', scrollTrigger: pass })
            }

            const countEl = root.querySelector('.about-count-value')
            const numEl = root.querySelector('.about-count-num')
            const plusEl = root.querySelector('.about-count-plus')
            if (!countEl || !numEl) return

            // The counter: a scrubbed proxy drives 0→50, snapped to whole
            // numbers, written straight into the value node.
            // Distinct from the nursery-spread card's own "50" (bighas) below -
            // a coincidentally identical digit there read like a copy-paste.
            const proxy = { v: 0 }
            gsap.fromTo(proxy, { v: 0 }, {
                v: 100, ease: 'none', snap: { v: 1 },
                scrollTrigger: settle,
                onUpdate() { countEl.textContent = Math.round(proxy.v) },
            })

            // The cool part: the whole number rises out of the baseline and
            // unfolds toward the viewer (rotateX) as it counts, so the figure
            // resolves in space rather than just changing digits.
            gsap.fromTo(
                numEl,
                { yPercent: 55, scale: 0.7, rotateX: -75, opacity: 0, transformOrigin: '0% 100%' },
                { yPercent: 0, scale: 1, rotateX: 0, opacity: 1, ease: 'power3.out', scrollTrigger: settle }
            )

            // The "+" lands last with an overshoot - a small punctuation punch.
            if (plusEl) {
                gsap.fromTo(
                    plusEl,
                    { scale: 0, rotate: -120, opacity: 0, transformOrigin: '0% 100%' },
                    { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(2.5)', scrollTrigger: settle }
                )
            }
        }

        // Card 2 (the dark seal card). `pass` drives the always-on motion - the
        // ink fill fading in and the seal spinning - across the whole time the
        // section is on screen; `settle` drives the one-shot reveal - seal pop
        // and the 3D number rise - as the card arrives; `count` runs the 0→35
        // tick end to end, tied to the full scroll range so the figure climbs
        // the entire time the section is scrolled rather than snapping up on
        // entry.
        const makeCardTwo = ({ pass, settle, count }) => {
            const bg = root.querySelector('.about-card-two-bg')
            const ring = root.querySelector('.about-seal-ring')
            const ringText = root.querySelector('.about-seal-text')
            const star = root.querySelector('.about-seal-star')
            const seal = root.querySelector('.about-seal')
            const yearsWrap = root.querySelector('.about-years')
            const yearsEl = root.querySelector('.about-years-value')

            // Background transparency fades in - the ink fill deepens as the
            // card is scrolled into place.
            if (bg) {
                gsap.fromTo(bg, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none',
                    scrollTrigger: { trigger: root, start: 'top bottom', end: 'top center', scrub: true } })
            }

            // Seal: dashed ring and its circular caption orbit one way, the
            // icon counter-rotates so it stays upright - a live, machined-badge
            // feel tied to scroll. Ring + text spin together, from the same
            // centre, so the caption tracks the dashes.
            if (ring) gsap.fromTo(ring, { rotate: 0 }, { rotate: 360, ease: 'none', scrollTrigger: pass })
            if (ringText) gsap.fromTo(ringText, { rotate: 0 }, { rotate: 360, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: pass })
            if (star) gsap.fromTo(star, { rotate: 0 }, { rotate: -360, ease: 'none', scrollTrigger: pass })
            if (seal) {
                gsap.fromTo(seal, { scale: 0.35, autoAlpha: 0 },
                    { scale: 1, autoAlpha: 1, ease: 'back.out(2)', scrollTrigger: settle })
            }

            // The figure rises and unfolds toward the viewer on `settle` (a
            // quick reveal as the card arrives), then the value ticks 0→37 on
            // `count` - a separate, longer scroll range so the number climbs
            // end to end while the section is scrolled, not in a burst on entry.
            if (yearsEl && yearsWrap) {
                gsap.fromTo(
                    yearsWrap,
                    { yPercent: 45, scale: 0.7, rotateX: -70, autoAlpha: 0, transformOrigin: '0% 100%' },
                    { yPercent: 0, scale: 1, rotateX: 0, autoAlpha: 1, ease: 'power3.out', scrollTrigger: settle }
                )

                const proxy = { v: 0 }
                gsap.fromTo(proxy, { v: 0 }, {
                    v: yearsInBusiness(), ease: 'none', snap: { v: 1 },
                    scrollTrigger: count ?? settle,
                    onUpdate() { yearsEl.textContent = Math.round(proxy.v) },
                })
            }
        }

        // Card 3 (the spread card). Split like cards 2 & 4 so the sequence is
        // actually watchable: `settle` is the entrance pop as the card arrives
        // (pre-pin); `hold` runs the sequenced content across the long range
        // (the pinned hold) while the card sits fully in view - the
        // copy focuses in word by word → the image box apertures open (clip
        // reveal) with the photo counter-zooming and a colour veil clearing →
        // an accent line wipes → the label rises → the figure unfolds in 3D
        // while the number counts 0→50. Earlier the whole thing rode the
        // section-entrance window, so the copy cascade finished while the card
        // was still low on the screen / about to pin - it read as static by the
        // time the card centred.
        // Card 3 (the spread card) - robustly rendered, no stuck blurs or hidden elements
        const makeCardThree = ({ settle, hold }) => {
            const card = root.querySelector('.about-card-three')
            if (!card) return
            const img = card.querySelector('.about-c3-img')
            const accent = card.querySelector('.about-c3-accent')
            const numEl = card.querySelector('.about-c3-num')
            const proxy = { v: 0 }

            // 1 · Entrance - gentle lift into place
            gsap.fromTo(card,
                { yPercent: 8, scale: 0.98, autoAlpha: 0.8 },
                { yPercent: 0, scale: 1, autoAlpha: 1, ease: 'power3.out', scrollTrigger: settle })

            if (accent) {
                gsap.fromTo(accent, { scaleX: 0, transformOrigin: '0% 50%' },
                    { scaleX: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: settle })
            }

            if (img) {
                gsap.fromTo(img,
                    { scale: 1.15 },
                    { scale: 1, ease: 'none', scrollTrigger: hold })
            }

            if (numEl) {
                gsap.fromTo(proxy, { v: 0 }, {
                    v: NURSERY_BIGHAS, snap: { v: 1 }, ease: 'none',
                    scrollTrigger: hold,
                    onUpdate() { numEl.textContent = Math.round(proxy.v) },
                })
            }
        }

        // Card 4 (the photo card) - clean photo transitions and count
        const makeCardFour = ({ settle, hold }) => {
            const card = root.querySelector('.about-card-four')
            if (!card) return
            const wrap = card.querySelector('.about-c4-imgwrap')
            const frames = gsap.utils.toArray('.about-c4-img', card)
            const overlay = card.querySelector('.about-c4-overlay')
            const eyebrow = card.querySelector('.about-c4-eyebrow')
            const figure = card.querySelector('.about-c4-figure')
            const numEl = card.querySelector('.about-c4-num')
            const fmt = (n) => Math.round(n).toLocaleString('en-US')

            // ── Entrance (settle) - clean lift without blur ──
            gsap.fromTo(card,
                { yPercent: 8, scale: 0.98, autoAlpha: 0.8 },
                { yPercent: 0, scale: 1, autoAlpha: 1, ease: 'power3.out', scrollTrigger: settle })
            if (overlay) {
                gsap.fromTo(overlay, { autoAlpha: 0.6 }, { autoAlpha: 1, ease: 'none', scrollTrigger: settle })
            }
            if (eyebrow) {
                gsap.fromTo(eyebrow,
                    { yPercent: 30, autoAlpha: 0 },
                    { yPercent: 0, autoAlpha: 1, ease: 'power3.out', scrollTrigger: settle })
            }
            if (figure) {
                gsap.fromTo(figure,
                    { yPercent: 30, scale: 0.85, autoAlpha: 0 },
                    { yPercent: 0, scale: 1, autoAlpha: 1, ease: 'power3.out', scrollTrigger: settle })
            }

            // ── Hold - plays across scroll ──
            const span = Math.max(frames.length, 2)
            const holdTl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: hold })

            if (wrap) holdTl.fromTo(wrap, { scale: 1.2 }, { scale: 1.05, duration: span }, 0)

            if (frames.length > 1) {
                gsap.set(frames.slice(1), { autoAlpha: 0 })
                frames.slice(1).forEach((frame, i) => {
                    holdTl.to(frame, { autoAlpha: 1, duration: 0.6, ease: 'power1.inOut' }, i + 0.7)
                })
            }

            if (numEl) {
                const proxy = { v: 0 }
                holdTl.to(proxy, {
                    v: UNDER_COVER_SQM, snap: { v: 1 }, duration: span,
                    onUpdate() { numEl.textContent = fmt(proxy.v) },
                }, 0)
            }
        }

        // ── Pinned Hold & Scroll Scrub ──────────────────────────────────────
        // The section climbs into view, locks into the screen (pinned hold),
        // and while pinned the heading illuminates line by line and the stat
        // cards play their live reveals/counters. Once the hold finishes, the
        // pin releases and the following sections open up on scroll.
        // Desktop pins the section and plays the scrubs against that held
        // frame. Phones keep every scrub but drop the pin: locking a small
        // viewport for 140% of its height reads as the page having frozen, and
        // `pinSpacing` adds that much empty scroll on top. Unpinned, the same
        // timelines are keyed to the content's own travel through the viewport,
        // so the heading still illuminates line by line as it passes - it is
        // driven by scroll position either way, just without the hold.
        mm.add(
            {
                motionOk:  '(prefers-reduced-motion: no-preference)',
                isDesktop: '(min-width: 1024px)',
            },
            (ctx) => {
                const { motionOk, isDesktop } = ctx.conditions
                if (!motionOk) return

                gsap.fromTo(
                    statementRef.current,
                    { yPercent: 12 },
                    { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true } }
                )
                gsap.fromTo(
                    statsRef.current,
                    { yPercent: 6, scale: 0.98, autoAlpha: 0.8 },
                    { yPercent: 0, scale: 1, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true } }
                )

                // Pin the section to lock the screen - desktop only.
                const pin = isDesktop
                    ? ScrollTrigger.create({
                        trigger: root,
                        start: 'top top',
                        end: '+=140%',
                        pin: true,
                        pinSpacing: true,
                    })
                    : null

                // The pinned hold gives desktop a fixed 140% window to scrub
                // through. Without it, each scrub runs over the element's own
                // pass through the viewport so it still completes on screen.
                const headingScrub = isDesktop
                    ? { trigger: root, start: 'top top', end: '+=140%', scrub: true }
                    : { trigger: statementRef.current, start: 'top 85%', end: 'bottom 50%', scrub: true }

                const statsScrub = isDesktop
                    ? { trigger: root, start: 'top top', end: '+=140%', scrub: true }
                    : { trigger: statsRef.current, start: 'top 90%', end: 'bottom 60%', scrub: true }

                // Heading line brighten scrub
                const disposeFill = makeLineFill(headingScrub)

                makeCardOne({
                    pass: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
                    settle: { trigger: root, start: 'top 80%', end: 'top 30%', scrub: true },
                    drift: 4,
                })
                makeCardTwo({
                    pass: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
                    settle: { trigger: root, start: 'top 80%', end: 'top 30%', scrub: true },
                    count: statsScrub,
                })
                makeCardThree({
                    settle: { trigger: root, start: 'top 80%', end: 'top 30%', scrub: true },
                    hold: statsScrub,
                })
                makeCardFour({
                    settle: { trigger: root, start: 'top 80%', end: 'top 30%', scrub: true },
                    hold: statsScrub,
                })

                ScrollTrigger.refresh()
                return () => {
                    disposeFill()
                    pin?.kill()
                }
            }
        )

        return () => mm.revert()
    }, [])

    return (
        <section ref={rootRef} id="about-us" className="about-section relative z-[2] bg-[var(--background)]">
            <div className="w-full mx-auto px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))] flex min-h-svh flex-col justify-center pt-20 pb-10 sm:pt-22 sm:pb-12 lg:pt-24 lg:pb-14">

                {/* ── Statement (parallax layer A) ── */}
                <div ref={statementRef} className="about-statement grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_1.85fr] lg:gap-8">
                    <span className="flex items-start gap-2 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)] lg:pt-1.5">
                        <span aria-hidden className="mt-1.5 size-1.5 rounded-full border border-current" />
                        About Company
                    </span>
                    <div>
                    <h2 className="max-w text-[clamp(1.5rem,3.4vw,2.35rem)] font-medium leading-[1.35] tracking-[-0.01em] text-[var(--brand-primary)]">
                        {HEADING.split(' ').map((word, wi, arr) => (
                            <span
                                key={wi}
                                className="about-fill-word inline-block whitespace-nowrap align-baseline transition-opacity duration-200"
                            >
                                {word}
                                {wi < arr.length - 1 ? '\u00A0' : ''}
                            </span>
                        ))}
                    </h2>
                    <p className="mt-3 text-[0.875rem] text-[var(--muted-foreground)]">
                        {NOTABLE_PROJECTS}
                    </p>
                    </div>
                </div>

                {/* ── Stat cards (parallax layer B) ── */}
                <div ref={statsRef} className="about-stats mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-16 lg:grid-cols-4">

                    {/* 1 · Collaborator cluster - faded avatar rows top, big
                        faded count bottom (matches the reference cards). */}
                    <div className="about-stat relative flex min-h-[11.5rem] flex-col justify-between gap-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-4 lg:min-h-[13rem] lg:p-5">

                        {/* Two rows, bled to the card edge and side-faded via
                            mask. On scroll they drift in opposite directions
                            behind the mask (see the desktop/mobile timelines),
                            so the cluster feels alive rather than a static grid. */}
                        <div
                            className="about-avatars -mx-4 -mt-1 lg:-mx-5"
                            style={{ maskImage: SIDE_FADE, WebkitMaskImage: SIDE_FADE }}
                        >
                            <div className="about-row about-row-a flex w-max gap-1.5 pl-4 will-change-transform lg:pl-5">
                                {AVATAR_ROW_A.map((src, i) => (
                                    <span key={i} className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white ring-1 ring-black/5 lg:size-14">
                                        <Image src={src} alt="" fill sizes="56px" className="object-cover object-top" />
                                    </span>
                                ))}
                            </div>
                            <div className="about-row about-row-b mt-1.5 flex w-max gap-1.5 pl-10 will-change-transform lg:pl-14">
                                {AVATAR_ROW_B.map((src, i) => (
                                    <span key={i} className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white ring-1 ring-black/5 lg:size-14">
                                        <Image src={src} alt="" fill sizes="56px" className="object-cover object-top" />
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Label + big count. The number ticks 0→50 on scroll
                            (about-count-value) while the whole block rises and
                            unfolds in 3D, and the "+" punches in with an
                            overshoot. SSR / reduced motion paints 50+ in place. */}
                        <div>
                            <p className="text-[0.8rem] uppercase text-[var(--brand-primary)] text-semibold">
                                Projects Delivered
                            </p>
                            <p className="about-count mt-1 flex leading-[0.9] tracking-[-0.03em]" style={{ perspective: '600px' }}>
                                <span className="about-count-num inline-flex items-end font-semibold will-change-transform">
                                    <span className="about-count-value text-[2.9rem] text-[var(--brand-primary)] lg:text-[3.25rem]">100</span>
                                    <span className="about-count-plus ml-0.5 inline-block text-[1.6rem] leading-none text-[var(--brand-primary)]">+</span>
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* 2 · Dark number + seal. The ink fill is its own layer so
                        it can fade in on scroll; the seal spins (dashed ring +
                        circular caption one way, the icon the other) and the
                        figure counts 0→35 while it rises in 3D - see makeCardTwo. */}
                    <div className="about-stat relative flex min-h-[11.5rem] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-4 text-white lg:min-h-[13rem] lg:p-5">
                        {/* Ink fill layer - starts transparent, fades in on scroll */}
                        <div aria-hidden className="about-card-two-bg absolute inset-0 bg-[var(--brand-ink-soft)]" />

                        {/* Top row - label left, spinning seal right */}
                        <div className="relative flex items-start justify-between gap-2">
                            <span className="text-[0.8rem] uppercase text-white text-semibold">Years in the Field</span>
                            <span aria-hidden className="about-seal relative flex size-[5rem] shrink-0 items-center justify-center rounded-full border border-white/15 lg:size-[5.8rem]">
                                {/* Three concentric rings evenly spaced (~7.5
                                    viewBox units apart): outer border r≈50, text
                                    centred at r=42.5, dashed ring at r=35 (inset-3). */}
                                <span className="about-seal-ring absolute inset-3 rounded-full border border-dashed border-white" />
                                {/* Caption wrapping the seal - SVG text centred on a
                                    circle path (r=42.5), the middle ring. Spins with
                                    the dashed ring on scroll. */}
                                <svg className="about-seal-text absolute inset-0 size-full" viewBox="0 0 100 100">
                                    <defs>
                                        <path id="about-seal-path" fill="none" d="M50,50 m-42.5,0 a42.5,42.5 0 1,1 85,0 a42.5,42.5 0 1,1 -85,0" />
                                    </defs>
                                    {/* textLength = full path circumference (2π·42.5 ≈ 267)
                                        with lengthAdjust="spacing" makes the caption fill the
                                        whole circle, so the spacing is uniform end to end and
                                        the two "·" gaps match the seam gap - no big empty arc.
                                        dominantBaseline centres the glyphs on the ring so the
                                        text band sits midway between the other two rings. */}
                                    <text className="fill-white" dominantBaseline="central" style={{ fontSize: '9px' }}>
                                        <textPath href="#about-seal-path" startOffset="0" textLength="267" lengthAdjust="spacing">{SEAL_TEXT}</textPath>
                                    </text>
                                </svg>
                                <TbTopologyStar3 className="about-seal-star size-8 text-[var(--brand-lime)] lg:size-9" strokeWidth={1.5} />
                            </span>
                        </div>

                        {/* Big count, revealed in 3D (perspective on the wrapper) */}
                        <div className="relative" style={{ perspective: '600px' }}>
                            <p className="about-years flex items-start font-medium leading-none tracking-[-0.03em] will-change-transform">
                                <span className="about-years-value text-[3.6rem] lg:text-[6rem]">{yearsInBusiness()}</span>
                                <span className="ml-0.5 text-[2rem] leading-none text-[var(--brand-lime)]">+</span>
                            </p>
                        </div>
                    </div>

                    {/* 3 · Text top, figure bottom. On scroll the whole card
                        pops up out of a blur, the copy focuses in word by word,
                        an accent line wipes out and the metric unfolds in 3D
                        while the number counts 0→50 - see makeCardThree. The
                        perspective here powers the figure's 3D unfold. */}
                    <div
                        className="about-stat about-card-three flex min-h-[11.5rem] flex-col justify-between rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-4 will-change-transform lg:min-h-[13rem] lg:p-5"
                        style={{ perspective: '900px' }}
                    >
                        <p className="about-c3-copy text-[0.9375rem] leading-snug text-[var(--brand-ink)]">
                            One potted plant at the Alipore counter or an entire township
                            landscape - both are grown on the same farm at Bibirhut.
                        </p>

                        {/* Image box filling the gap. On scroll it apertures open
                            (clip-path), the photo counter-zooms and a colour veil
                            clears - see makeCardThree. The veil is opacity-0 by
                            default so reduced-motion / no-JS shows the photo clean. */}
                        <div className="about-c3-imgwrap relative my-4 h-16 shrink-0 overflow-hidden rounded-[10px] lg:h-24">
                            <Image
                                src="https://res.cloudinary.com/heog9fna/image/upload/v1788117797/ChatGPT_Image_Aug_31_2026_12_52_06_AM_npdux3.png"
                                alt="Foliage raised on our farm at Bibirhut"
                                fill
                                sizes="(min-width:1024px) 25vw, 50vw"
                                className="about-c3-img object-cover object-center will-change-transform"
                            />
                            <div aria-hidden className="about-c3-veil absolute inset-0 bg-[var(--brand-primary)] opacity-0 will-change-transform" />
                        </div>

                        <div className="mt-auto">
                            <span aria-hidden className="about-c3-accent mb-2 block h-px w-10 origin-left bg-[var(--brand-primary)]" />
                            <span className="about-c3-label block text-[0.8rem] uppercase text-[var(--muted-foreground)]">Nursery Spread</span>
                            <span className="about-c3-figure mt-1 flex items-baseline gap-1.5 text-[1.9rem] font-semibold leading-none text-[var(--brand-primary)] will-change-transform">
                                <span className="about-c3-num">{NURSERY_BIGHAS}</span>
                                <span>Bighas</span>
                            </span>
                        </div>
                    </div>

                    {/* 4 · Image + number. On scroll the card pops out of a
                        blur, the image STACK slow-zooms while it crossfades
                        through three frames (the changing-image swap), the
                        gradient veil deepens, the eyebrow clip-rises and the
                        area figure unfolds in 3D while the number counts to
                        4,700 - see makeCardFour. The perspective powers the
                        figure's unfold; the extra frames are opacity-0 by
                        default so SSR / reduced motion shows the base photo. */}
                    <div
                        className="about-stat about-card-four relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[var(--radius-card)] p-4 text-white will-change-transform lg:min-h-[13rem] lg:p-5"
                        style={{ perspective: '700px' }}
                    >
                        {/* Image stack - one wrapper so the Ken Burns zoom scales
                            all frames together; each frame crossfades on scroll. */}
                        <div aria-hidden className="about-c4-imgwrap absolute inset-0 will-change-transform">
                            <Image
                                src="https://res.cloudinary.com/heog9fna/image/upload/v1787667630/zuiiigfsl9h1rupinhq0.jpg"
                                alt="Protected cultivation under the green house at our Bibirhut farm"
                                fill
                                sizes="(min-width:1024px) 25vw, 50vw"
                                className="about-c4-img object-cover object-center"
                            />
                            <Image
                                src="https://res.cloudinary.com/heog9fna/image/upload/v1787578383/usn3usn3621dmmxihpoa.png"
                                alt=""
                                fill
                                sizes="(min-width:1024px) 25vw, 50vw"
                                className="about-c4-img object-cover object-center opacity-0"
                            />
                            <Image
                                src="https://res.cloudinary.com/heog9fna/image/upload/v1788117479/ChatGPT_Image_Aug_31_2026_12_46_54_AM_pso8e1.png"
                                alt=""
                                fill
                                sizes="(min-width:1024px) 25vw, 50vw"
                                className="about-c4-img object-cover object-center opacity-0"
                            />
                        </div>
                        <div aria-hidden className="about-c4-overlay absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/10" />
                        <div className="relative">
                            <span className="about-c4-eyebrow block text-[0.8rem] uppercase text-white will-change-transform">Under Cover</span>
                            <span className="about-c4-figure mt-3 flex items-baseline gap-1 text-[2.4rem] font-medium leading-none tracking-[-0.03em] will-change-transform">
                                <span className="about-c4-num">{UNDER_COVER_SQM.toLocaleString('en-US')}</span>
                                <span className="text-[1.6rem]">m²</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUsSection
