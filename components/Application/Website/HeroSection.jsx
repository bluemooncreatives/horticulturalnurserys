"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeftRight } from "lucide-react";

import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import CircleReveal from "@/components/ui/CircleReveal";
import CrossfadeImage from "@/components/ui/CrossfadeImage";
import CircleWipeImage from "@/components/ui/CircleWipeImage";
import useHeroCarousel from "@/components/ui/useHeroCarousel";
import { RevealLines, RevealUp } from "@/components/ui/reveal";
import { useLoader } from "@/components/Application/Website/LoaderProvider";
import { NURSERY_BIGHAS, OPERATING_SINCE_YEAR, FLAGSHIP_PROJECTS } from "@/lib/companyInfo";

// Entrance cascade timings, ms - mirrors the Baseline hero's staggered
// reveal (headline first, then the surrounding cards), tuned to this hero's
// four content groups instead of Baseline's two.
const REVEAL = {
  titleStagger: 130,
  titleDuration: 1000,
  tagDelay: 420,
  tagDuration: 820,
  trustDelay: 560,
  trustDuration: 820,
  cardDelay: 760,
  cardDuration: 780,
};

// Product-card title, split into characters so each glyph can roll
// independently with a staggered delay on hover (see the card button below).
const CARD_TITLE = "Winter Seedlings®";

// Horticultural credentials shown as the "trusted by" mark row - adapts the
// reference's client-logo strip to the nursery's field capabilities.
const CRAFT_MARKS = [
  "Landscape Design",
  `${NURSERY_BIGHAS}-Bigha Nursery`,
  "Green & Polyshed Houses",
  "Drip · Fogger · Sprinkler",
  "Imported Plants",
];

// The three hero frames. The big screen shows HERO_IMAGES[i]; the floating
// thumbnail always shows the *next* frame, HERO_IMAGES[i + 1]. A single
// index (see useHeroCarousel) drives both, so they can never fall out of step.
const HERO_IMAGES = [
  "/assets/images/hero/01.jpg",
  "/assets/images/hero/02.jpg",
  "/assets/images/hero/03.jpg",
];

// Only the first (LCP) frame carries a descriptive alt; the cycling frames
// behind it are decorative, so a screen reader isn't handed three near-
// identical background descriptions. The page's headline carries the meaning.
const HERO_ALTS = [
  "A landscaped garden developed by Horticultural Development Centre, Kolkata",
  "",
  "",
];

// Countdown-ring geometry (36×36 viewBox, centred at 18).
const RING_R = 15.5;
const RING_C = 2 * Math.PI * RING_R;

const HeroSection = () => {
  const ringRef = useRef(null);
  // Gates every entrance reveal below: the curtain lifts, then the hero
  // cascades in - nothing pops in behind it or before it.
  const { ready } = useLoader();

  // Paint the thumbnail's countdown ring straight from the carousel clock's
  // 0→1 progress - one tween drives both the auto-advance and this ring, so
  // the ring always reflects exactly how long until the next change.
  const onProgress = useCallback((p) => {
    const ring = ringRef.current;
    if (ring) ring.style.strokeDashoffset = String(RING_C * (1 - p));
  }, []);

  const { index, advance, pause, resume } = useHeroCarousel({
    length: HERO_IMAGES.length,
    interval: 10,
    onProgress,
  });

  const bigIndex = index;
  const smallIndex = (index + 1) % HERO_IMAGES.length;

  return (
    <section className="website-gutter pt-[2.75rem] pb-[clamp(2rem,4vw,3.5rem)] sm:pt-[3.5rem]">
      <div className="mx-auto max-w">
        {/* ── Framed hero card - image fills the whole card, content overlaid ── */}
        <div className="hero-frame relative flex min-h-[calc(100svh_-_2.75rem)] flex-col justify-between overflow-hidden rounded-[var(--radius-section)] bg-[var(--background)] sm:min-h-[calc(100svh_-_3.5rem)]">

          {/* Full-bleed background - the hero frames cross-fade here (frame i).
              Advanced GSAP fade in / fade out: the incoming (top) frame fades
              up while sliding in from the LEFT (enterX) with a subtle scale +
              de-blur; the outgoing (bottom) frame holds its position and only
              fades (stillOutgoing) - it never shifts. A slow Ken Burns drift
              keeps the resting frame alive. It keeps the base stacking layer,
              so the washes and content below still sit on top. */}
          <CrossfadeImage
            images={HERO_IMAGES}
            activeIndex={bigIndex}
            alt={HERO_ALTS[0]}
            alts={HERO_ALTS}
            sizes="100vw"
            priority
            objectClassName="object-cover object-[center_38%]"
            className="absolute inset-0"
            duration={1.35}
            ease="power2.inOut"
            scaleFrom={1.08}
            blur={10}
            enterX={-8}
            stillOutgoing
            kenBurns
            kenBurnsScale={1.07}
            kenBurnsDuration={10}
          />
          {/* Light wash on top → keeps the dark wordmark legible over the photo.
              It fades from --background, not --brand-warm-bg: the two differ
              (#F4F3F1 vs #EFEEEA), and any mismatch shows as a hard band along
              the card's top edge where the wash meets the page. Fading to the
              same colour at zero alpha rather than `transparent` also keeps the
              ramp neutral instead of drifting through grey. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[55%] bg-gradient-to-b from-[var(--background)] via-[var(--background)]/78 to-[var(--background)]/0"
          />
          {/* Dark wash on bottom → keeps the white trust strip legible */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%] bg-gradient-to-t from-black/70 via-black/15 to-black/0"
          />

          {/* Top region: wordmark + tagline (overlaid) */}
          <div className="relative z-[2] grid grid-cols-1 gap-6 px-5 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10 lg:px-11 lg:pt-12">
            {/* Two-line lockup: the trading name is far too long for a single
                nowrap line, so the first word carries the display size and the
                rest sits under it at roughly half scale. */}
            <h1 className="hero-word font-wordmark text-[var(--brand-primary)] leading-[0.88]">
              {/* The upper clamp bound is what governs the dead space to the
                  right: below ~1370px the vw term wins and the headline tracks
                  the viewport, but once the cap binds the headline stops while
                  its 1fr column keeps growing. Raising the cap keeps the two
                  lines scaling far enough that the gap stays tight on wide
                  screens. The second line's cap is held at ~0.49x the first so
                  the longer string never out-measures it. */}
              <RevealLines
                play={ready}
                stagger={REVEAL.titleStagger}
                duration={REVEAL.titleDuration}
                items={[
                  <span key="line-1" className="block whitespace-nowrap text-[clamp(1.9rem,9.4vw,11.2rem)]">
                    Horticultural
                  </span>,
                  <span key="line-2" className="block whitespace-nowrap text-[clamp(0.95rem,4.65vw,5.5rem)]">
                    Development Centre
                    <sup className="relative top-[0.12em] ml-[0.05em] align-top text-[0.26em] font-normal leading-none opacity-80">®</sup>
                  </span>,
                ]}
              />
            </h1>

            {/* This column is pinned to the right padding edge, so its own width
                is what sets the empty space to its left - widening it is what
                closes the gap against the headline, not the grid gap. It steps
                up with the viewport because the headline is nowrap at ~68vw and
                would otherwise be squeezed past its min-content at 1024-1280. */}
            <RevealUp
              play={ready}
              delay={REVEAL.tagDelay}
              duration={REVEAL.tagDuration}
              className="hero-tag w-full max-w-md lg:w-[16rem] lg:pt-3 xl:w-[18rem] 2xl:w-[20rem]"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {/* "Up next" preview - the two frames queued behind the big
                      screen (i+1, i+2). On each advance they circular-wipe to
                      their new frame: the incoming blooms in from the right
                      while the outgoing slides off to the left. A small stagger
                      on the second circle makes the pair read as a cascade. */}
                  {[1, 2].map((offset) => (
                    <span
                      key={offset}
                      className="relative size-7 overflow-hidden rounded-full border-2 border-[var(--background)]"
                    >
                      <CircleWipeImage
                        images={HERO_IMAGES}
                        activeIndex={(index + offset) % HERO_IMAGES.length}
                        sizes="28px"
                        objectClassName="object-cover object-top"
                        duration={0.7}
                        ease="power2.out"
                        delay={(offset - 1) * 0.08}
                      />
                    </span>
                  ))}
                </div>
                <span aria-hidden className="h-px w-6 bg-black/25" />
                <span className="text-[0.8rem] font-medium uppercase text-[var(--muted-foreground)]">
                  [ Kolkata · Since {OPERATING_SINCE_YEAR} ]
                </span>
              </div>
              <p className="mt-3.5 text-justify text-[0.88rem] leading-[1.4] text-[var(--brand-primary)]">
                Qualified horticulturists designing, building and maintaining
                gardens across West Bengal - backed by our own {NURSERY_BIGHAS}-bigha nursery
                and an Alipore counter that stocks every plant, tool and input a
                garden needs under one roof.
              </p>
            </RevealUp>
          </div>

          {/* Bottom region: trust strip + floating card (overlaid) */}
          {/* Bottom inset matches the horizontal one at every breakpoint so the
              floating card sits the same distance from the card's bottom edge
              as it does from its right edge (was pb-6/pb-8 against px-8/px-11). */}
          <div className="relative z-[2] flex flex-col items-stretch gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-8 lg:px-11 lg:pb-11">
            {/* bottom-left: trusted-by + craft marks - hidden on mobile, the
                floating product card below is the only bottom-row content there */}
            <RevealUp
              play={ready}
              delay={REVEAL.trustDelay}
              duration={REVEAL.trustDuration}
              className="hero-overlay hidden sm:block"
            >
              <p className="max-w-xs text-[0.8rem] leading-snug text-white/85 sm:text-[0.8rem]">
                Entrusted with the Assembly House, National Library, Alipore Zoo
                and Rabindra Sarobar.
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7">
                {CRAFT_MARKS.map((mark) => (
                  <span
                    key={mark}
                    className="hero-mark flex items-center gap-1.5 text-[0.8rem] font-medium tracking-wide text-white/80 sm:text-[0.8rem]"
                  >
                    <span aria-hidden className="text-[var(--brand-lime)]">✦</span>
                    {mark}
                  </span>
                ))}
              </div>
            </RevealUp>

            {/* bottom-right: floating vertical product card - image and
                content are two independently rounded, independently
                shadowed blocks stacked inside one wrapper, not a single
                continuous card shape. Popped in with a slight overshoot
                ease so it reads as a distinct card landing, not text
                settling. */}
            <RevealUp
              play={ready}
              delay={REVEAL.cardDelay}
              duration={REVEAL.cardDuration}
              distance={28}
              ease="var(--ease-pop)"
              className="hero-overlay flex w-full max-w-48 shrink-0 flex-col gap-1.5 transition-transform hover:-translate-y-0.5 sm:max-w-none sm:w-64 sm:gap-2"
            >
              {/* Floating thumbnail - shows the *next* frame (i+1) and doubles
                  as the carousel control: clicking promotes it to the big
                  screen and rolls the thumbnail forward, resetting the 10s
                  clock. It's a real <button> (was a shop link); the shop CTA
                  lives in the white card just below, so that path is intact. */}
              <button
                type="button"
                onClick={advance}
                onMouseEnter={pause}
                onMouseLeave={resume}
                onFocus={pause}
                onBlur={resume}
                aria-label={`Feature the next garden view - now showing ${smallIndex + 1} of ${HERO_IMAGES.length}`}
                className="group relative block aspect-[16/11] w-full cursor-pointer overflow-hidden rounded-[var(--radius-3xl)] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-lime)] focus-visible:ring-offset-2"
              >
                {/* Zoom wrapper: hover adds a little scale on top of the GSAP
                    crossfade running on the layers inside (different element,
                    so the transforms compose cleanly). */}
                <span className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                  <CrossfadeImage
                    images={HERO_IMAGES}
                    activeIndex={smallIndex}
                    alt=""
                    sizes="256px"
                    objectClassName="object-cover object-top"
                    className="absolute inset-0"
                    duration={0.95}
                    ease="power2.out"
                    scaleFrom={1.14}
                    blur={10}
                    kenBurns
                    kenBurnsScale={1.04}
                    kenBurnsDuration={10}
                  />
                </span>

                {/* Legibility wash behind the ring. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/35 to-transparent"
                />

                {/* Countdown ring - sweeps as the 10s clock runs, resets on advance. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-2.5 top-2.5 z-10 size-4"
                >
                  <svg viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90">
                    <circle cx="18" cy="18" r={RING_R} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <circle
                      ref={ringRef}
                      cx="18"
                      cy="18"
                      r={RING_R}
                      fill="none"
                      stroke="var(--brand-lime)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={RING_C}
                      strokeDashoffset={RING_C}
                    />
                  </svg>
                </span>

                {/* Hover affordance - signals the box is an interactive control. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-6 text-[0.8rem] font-medium text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowLeftRight aria-hidden className="size-3.5" />
                  Click to feature
                </span>
              </button>

              {/* The entire white block is now a single button. Hovering it
                  drives three coordinated micro-interactions: the card lifts,
                  the title rolls glyph-by-glyph with a stagger, and the arrow
                  circle fills while the arrow rotates 45° → 0°. */}
              <Link
                href={WEBSITE_SHOP}
                aria-label="Winter Seedlings - shop this season's seedlings"
                className="group relative flex items-center gap-2 rounded-[var(--radius-3xl)] bg-white/95 px-3 py-2 text-left shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/40 focus-visible:ring-offset-2 sm:gap-3 sm:px-4 sm:py-3.5"
              >
                {/* Lime circular reveal - sweeps in from the left on hover. */}
                <CircleReveal color="var(--brand-lime)" />

                <div className="relative z-10 min-w-0 flex-1">
                  {/* Title: per-character roll. Each glyph is stacked over a
                      duplicate; on hover the top copy rolls up and out while the
                      bottom copy rolls into place, staggered left-to-right. */}
                  <span
                    aria-label={CARD_TITLE}
                    className="flex text-[0.8rem] font-semibold leading-none text-[var(--brand-primary)] sm:text-[0.9rem]"
                  >
                    {CARD_TITLE.split("").map((ch, i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="relative inline-block overflow-hidden"
                      >
                        <span
                          className="inline-block transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
                          style={{ transitionDelay: `${i * 18}ms` }}
                        >
                          {ch === " " ? " " : ch}
                        </span>
                        <span
                          className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                          style={{ transitionDelay: `${i * 18}ms` }}
                        >
                          {ch === " " ? " " : ch}
                        </span>
                      </span>
                    ))}
                  </span>
                  {/* Description: gentler counterpart - colour deepens and the
                      line eases inward as the card is hovered. */}
                  <p className="mt-1.5 hidden text-[0.8rem] leading-[1.4] text-[var(--muted-foreground)] transition-[color,transform] duration-500 ease-out group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)] sm:block">
                    Hardy nursery-raised seedlings, ready to plant this season.
                  </p>
                </div>

                {/* Arrow circle: fill sweeps out from the centre while the
                    arrow un-rotates from 45° to horizontal. */}
                <span className="relative z-10 grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] transition-colors duration-500 group-hover:border-[var(--brand-primary)] group-hover:text-white sm:size-10">
                  <span
                    aria-hidden
                    className="absolute inset-0 scale-0 rounded-full bg-[var(--brand-primary)] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-100"
                  />
                  <ArrowRight
                    aria-hidden
                    strokeWidth={2.2}
                    className="relative size-3.5 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-0 sm:size-4"
                  />
                </span>
              </Link>
            </RevealUp>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
