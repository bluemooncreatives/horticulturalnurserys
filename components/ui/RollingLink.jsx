"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";

/* ────────────────────────────────────────────────────────────────
   RollingLink — reusable animated text link.

   Each glyph is a fixed-height mask (overflow-hidden) holding a THREE-
   cell vertical column of the SAME glyph: [duplicate · base · duplicate].
   At rest every column shows its MIDDLE cell (one uniform offset for all
   letters) so the base reads exactly like normal text — no zigzag, no
   drift. On hover the column slides one cell:
     • even glyphs slide UP   → reveal the bottom cell (roll in from below)
     • odd  glyphs slide DOWN → reveal the top cell   (roll in from above)
   …staggered left-to-right. A hairline underline wipes IN from the left
   on enter and OUT to the right on leave.

   One paused GSAP timeline drives the columns (played on enter, reversed
   on leave); two tweens drive the underline. Colour + font-size inherit
   from the className you pass and the underline uses `bg-current`, so it
   drops into any link context:

       <RollingLink href="/shop" className="text-sm font-semibold">
         Shop
       </RollingLink>

   Respects prefers-reduced-motion (glyph roll skipped, underline only).
   ──────────────────────────────────────────────────────────────── */

const ROLL = { duration: 0.5, ease: "power3.inOut" };
const STAGGER = 0.03;
const UNDERLINE = { duration: 0.4, ease: "power3.out" };
const CELL = "1.3em"; // mask + cell height; roomy enough to clear descenders

// 3-cell column: rest shows the middle cell for ALL glyphs.
const REST = -100 / 3; // -33.33%  → middle cell in the window
// hover reveals the opposite cell, alternating per glyph.
const hoverY = (i) => (i % 2 === 0 ? -200 / 3 : 0); // even → bottom, odd → top

export default function RollingLink({
  href,
  children,
  className = "",
  underline = true,
  background = null, // optional layer rendered behind the glyphs (e.g. CircleReveal)
  ...props
}) {
  const linkRef = useRef(null);
  const charTl = useRef(null);

  const text = String(children ?? "");
  const chars = [...text];

  useEffect(() => {
    const root = linkRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const underlineEl = root.querySelector("[data-roll-underline]");
      if (underlineEl) gsap.set(underlineEl, { scaleX: 0, transformOrigin: "left center" });

      // Reduced motion → keep glyphs static, animate only the underline.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // NB: we drive a numeric proxy and write CSS translateY(%) in onUpdate
      // rather than tween gsap's `yPercent` — gsap's percentage basis for
      // these nested overflow-clipped columns is off (it over-translates,
      // blanking alternate glyphs), whereas a raw CSS % of the column height
      // is exact.
      const cols = root.querySelectorAll("[data-roll-col]");
      const tl = gsap.timeline({ paused: true });
      cols.forEach((col, i) => {
        const proxy = { v: REST };
        col.style.transform = `translateY(${REST}%)`;
        tl.to(
          proxy,
          {
            v: hoverY(i),
            ...ROLL,
            onUpdate() {
              col.style.transform = `translateY(${proxy.v}%)`;
            },
          },
          i * STAGGER
        );
      });
      charTl.current = tl;
    }, root);

    return () => {
      ctx.revert();
      charTl.current = null;
    };
  }, [text]);

  const enter = useCallback(() => {
    const root = linkRef.current;
    if (!root) return;
    charTl.current?.play();
    const u = root.querySelector("[data-roll-underline]");
    if (u)
      gsap.to(u, {
        scaleX: 1,
        transformOrigin: "left center", // wipe IN from the left
        ...UNDERLINE,
      });
  }, []);

  const leave = useCallback(() => {
    const root = linkRef.current;
    if (!root) return;
    charTl.current?.reverse();
    const u = root.querySelector("[data-roll-underline]");
    if (u)
      gsap.to(u, {
        scaleX: 0,
        transformOrigin: "right center", // wipe OUT to the right
        ...UNDERLINE,
      });
  }, []);

  return (
    <Link
      ref={linkRef}
      href={href}
      aria-label={text}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={`relative inline-flex items-center ${className}`}
      {...props}
    >
      {/* Optional background layer (e.g. a CircleReveal fill), behind glyphs. */}
      {background}

      {/* Decorative tripled glyphs — the real label lives in aria-label. */}
      <span aria-hidden className="relative z-10 inline-flex items-center">
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i} aria-hidden style={{ width: "0.32em" }} />
          ) : (
            <span
              key={i}
              className="relative inline-block overflow-hidden"
              // px padding (cancelled by -mx) widens the clip box so glyph
              // side-bearings are never shaved; height clips the roll.
              style={{
                height: CELL,
                lineHeight: CELL,
                paddingInline: "0.06em",
                marginInline: "-0.06em",
              }}
            >
              <span
                data-roll-col
                className="block will-change-transform"
                // Pre-seed the resting offset so SSR / pre-JS paint is correct.
                style={{ transform: `translateY(${REST}%)` }}
              >
                <span className="block" style={{ height: CELL }}>{ch}</span>
                <span className="block" style={{ height: CELL }}>{ch}</span>
                <span className="block" style={{ height: CELL }}>{ch}</span>
              </span>
            </span>
          )
        )}
      </span>

      {/* Underline — inherits link colour via bg-current. Optional so the
          same roll can be used on filled buttons (no underline). */}
      {underline && (
        <span
          data-roll-underline
          aria-hidden
          className="pointer-events-none absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-current"
          style={{ transform: "scaleX(0)" }}
        />
      )}
    </Link>
  );
}
