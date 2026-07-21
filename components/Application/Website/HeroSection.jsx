"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

gsap.registerPlugin(useGSAP);

// Craft credentials shown as the "trusted by" mark row — adapts the reference's
// client-logo strip to a fashion label's making credentials.
const CRAFT_MARKS = [
  "Handloom",
  "Pure Cotton",
  "Hand-Embroidered",
  "Natural Dyes",
  "Made in India",
];

const AVATARS = [
  "/assets/images/hero/02.webp",
  "/assets/images/hero/03.webp",
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
        <div className="hero-frame relative flex min-h-[calc(100svh_-_2.75rem)] flex-col justify-between overflow-hidden rounded-[var(--radius-section)] bg-[var(--brand-warm-bg)] sm:min-h-[calc(100svh_-_3.5rem)]">

          {/* Full-bleed background image */}
          <Image
            src="/assets/images/hero/01.webp"
            alt="MomStitched handcrafted women's ethnic wear collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_38%]"
          />
          {/* Light wash on top → keeps the dark wordmark legible over the photo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[62%] bg-gradient-to-b from-[var(--brand-warm-bg)] via-[var(--brand-warm-bg)]/78 to-transparent"
          />
          {/* Dark wash on bottom → keeps the white trust strip legible */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%] bg-gradient-to-t from-black/70 via-black/15 to-transparent"
          />

          {/* Top region: wordmark + tagline (overlaid) */}
          <div className="relative z-[2] grid grid-cols-1 gap-6 px-5 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10 lg:px-11 lg:pt-12">
            <h1 className="hero-word font-wordmark whitespace-nowrap text-[var(--brand-ink)] text-[clamp(2.4rem,11vw,9.5rem)] leading-[0.9] [font-weight:700]">
              MomStitched
              <sup className="relative top-[0.12em] ml-[0.03em] align-top text-[0.26em] font-normal leading-none opacity-80">®</sup>
            </h1>

            <div className="hero-tag w-full max-w-md lg:w-[17rem] lg:pt-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {AVATARS.map((src) => (
                    <span
                      key={src}
                      className="relative size-7 overflow-hidden rounded-full border-2 border-[var(--brand-warm-bg)]"
                    >
                      <Image src={src} alt="" fill sizes="28px" className="object-cover object-top" />
                    </span>
                  ))}
                </div>
                <span aria-hidden className="h-px w-6 bg-black/25" />
                <span className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                  [ Handcrafted ]
                </span>
              </div>
              <p className="mt-3.5 text-justify text-[0.78rem] leading-[1.5] text-[var(--text-body)]">
                We craft heirloom ethnic wear for weddings, festivals, and everyday
                women who want more than fast fashion — pieces stitched with a
                mother&apos;s devotion and an artisan&apos;s eye.
              </p>
            </div>
          </div>

          {/* Bottom region: trust strip + floating card (overlaid) */}
          <div className="relative z-[2] flex items-end justify-between gap-4 px-5 pb-5 sm:px-8 sm:pb-6 lg:px-11 lg:pb-8">
            {/* bottom-left: trusted-by + craft marks */}
            <div className="hero-overlay">
              <p className="max-w-xs text-[0.72rem] leading-snug text-white/85 sm:text-[0.8rem]">
                Trusted by 100+ women turning everyday moments into occasions worth
                dressing for.
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
                <Image src="/assets/images/hero/04.webp" alt="" fill sizes="208px" className="object-cover object-top" />
              </span>
              <span className="flex items-center justify-between gap-2 px-3.5 py-3">
                <span className="min-w-0">
                  <span className="block truncate text-[0.85rem] font-medium text-[var(--brand-primary)]">
                    Festive Edit®
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-[0.68rem] text-[var(--muted-foreground)]">
                    New Collection <span className="opacity-60">2026°</span>
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
