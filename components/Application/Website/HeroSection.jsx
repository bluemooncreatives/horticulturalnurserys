"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

gsap.registerPlugin(useGSAP);

// Horticultural credentials shown as the "trusted by" mark row — adapts the
// reference's client-logo strip to the nursery's field capabilities.
const CRAFT_MARKS = [
  "Landscape Design",
  "50-Bigha Nursery",
  "Green & Polyshed Houses",
  "Drip · Fogger · Sprinkler",
  "Imported Plants",
];

const AVATARS = [
  "/assets/images/hero/01.jpg",
  "/assets/images/hero/01.jpg",
];

const HeroSection = () => {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-word", { yPercent: 12, autoAlpha: 0, duration: 0.9 })
        .from(".hero-tag > *", { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.5")
        .from(".hero-frame", { scale: 0.985, autoAlpha: 0, duration: 1, ease: "power2.out" }, "-=0.5")
        .from(".hero-overlay", { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.12 }, "-=0.6")
        .from(".hero-mark", { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.05 }, "-=0.5");
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="website-gutter pt-[2.75rem] sm:pt-[3.5rem]">
      <div className="mx-auto max-w">
        {/* ── Framed hero card — image fills the whole card, content overlaid ── */}
        <div className="hero-frame relative flex min-h-[calc(100svh_-_2.75rem)] flex-col justify-between overflow-hidden rounded-[var(--radius-section)] bg-[var(--background)] sm:min-h-[calc(100svh_-_3.5rem)]">

          {/* Full-bleed background image */}
          <Image
            src="/assets/images/hero/01.jpg"
            alt="A landscaped garden developed by Horticultural Development Centre, Kolkata"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_38%]"
          />
          {/* Light wash on top → keeps the dark wordmark legible over the photo.
              It fades from --background, not --brand-warm-bg: the two differ
              (#F4F3F1 vs #EFEEEA), and any mismatch shows as a hard band along
              the card's top edge where the wash meets the page. Fading to the
              same colour at zero alpha rather than `transparent` also keeps the
              ramp neutral instead of drifting through grey. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[62%] bg-gradient-to-b from-[var(--background)] via-[var(--background)]/78 to-[var(--background)]/0"
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
            <h1 className="hero-word font-wordmark text-[var(--brand-ink)] leading-[0.88] [font-weight:700]">
              {/* The upper clamp bound is what governs the dead space to the
                  right: below ~1370px the vw term wins and the headline tracks
                  the viewport, but once the cap binds the headline stops while
                  its 1fr column keeps growing. Raising the cap keeps the two
                  lines scaling far enough that the gap stays tight on wide
                  screens. The second line's cap is held at ~0.49x the first so
                  the longer string never out-measures it. */}
              <span className="block whitespace-nowrap text-[clamp(2.1rem,10.5vw,12.5rem)]">
                Horticultural
              </span>
              <span className="block whitespace-nowrap text-[clamp(1.05rem,5.2vw,6.1rem)]">
                Development Centre
                <sup className="relative top-[0.12em] ml-[0.05em] align-top text-[0.26em] font-normal leading-none opacity-80">®</sup>
              </span>
            </h1>

            {/* This column is pinned to the right padding edge, so its own width
                is what sets the empty space to its left — widening it is what
                closes the gap against the headline, not the grid gap. It steps
                up with the viewport because the headline is nowrap at ~68vw and
                would otherwise be squeezed past its min-content at 1024-1280. */}
            <div className="hero-tag w-full max-w-md lg:w-[16rem] lg:pt-3 xl:w-[18rem] 2xl:w-[20rem]">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {AVATARS.map((src, i) => (
                    <span
                      key={i}
                      className="relative size-7 overflow-hidden rounded-full border-2 border-[var(--background)]"
                    >
                      <Image src={src} alt="" fill sizes="28px" className="object-cover object-top" />
                    </span>
                  ))}
                </div>
                <span aria-hidden className="h-px w-6 bg-black/25" />
                <span className="text-[0.75rem] font-medium uppercase text-[var(--muted-foreground)]">
                  [ Kolkata · Since 1989 ]
                </span>
              </div>
              <p className="mt-3.5 text-justify text-[0.88rem] leading-[1.4] text-[var(--brand-primary)]">
                Qualified horticulturists designing, building and maintaining
                gardens across West Bengal - backed by our own 50-bigha nursery
                and an Alipore counter that stocks every plant, tool and input a
                garden needs under one roof.
              </p>
            </div>
          </div>

          {/* Bottom region: trust strip + floating card (overlaid) */}
          {/* Bottom inset matches the horizontal one at every breakpoint so the
              floating card sits the same distance from the card's bottom edge
              as it does from its right edge (was pb-6/pb-8 against px-8/px-11). */}
          <div className="relative z-[2] flex items-end justify-between gap-4 px-5 pb-5 sm:px-8 sm:pb-8 lg:px-11 lg:pb-11">
            {/* bottom-left: trusted-by + craft marks */}
            <div className="hero-overlay">
              <p className="max-w-xs text-[0.72rem] leading-snug text-white/85 sm:text-[0.8rem]">
                Entrusted with the Assembly House, National Library, Alipore Zoo
                and Rabindra Sarobar.
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7">
                {CRAFT_MARKS.map((mark) => (
                  <span
                    key={mark}
                    className="hero-mark flex items-center gap-1.5 text-[0.66rem] font-medium tracking-wide text-white/70 sm:text-[0.72rem]"
                  >
                    <span aria-hidden className="text-[var(--brand-lime)]">✦</span>
                    {mark}
                  </span>
                ))}
              </div>
            </div>

            {/* bottom-right: floating vertical product card */}
            <Link
              href={WEBSITE_SHOP}
              className="hero-overlay group hidden w-52 shrink-0 overflow-hidden rounded-[var(--radius-2xl)] bg-white/95 shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5 sm:block"
            >
              <span className="relative block aspect-[16/10] w-full overflow-hidden">
                <Image src="/assets/images/hero/01.jpg" alt="" fill sizes="208px" className="object-cover object-top" />
              </span>
              <span className="flex items-center justify-between gap-2 px-3.5 py-3">
                <span className="min-w-0">
                  <span className="block truncate text-[0.85rem] font-medium text-[var(--brand-primary)]">
                    Winter Seedlings®
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-[0.68rem] text-[var(--muted-foreground)]">
                    August – December <span className="opacity-60">2026°</span>
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-[var(--brand-primary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
