"use client";

import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import Link from "next/link";
import gsap from "gsap";

/* ────────────────────────────────────────────────────────────────
   RollingText / RollingLink - reusable animated text link with GSAP.

   Each glyph is a fixed-height mask (overflow-hidden) holding a THREE-
   cell vertical column of the SAME glyph: [duplicate · base · duplicate].
   At rest every column shows its MIDDLE cell (one uniform offset for all
   letters) so the base reads exactly like normal text - no zigzag, no
   drift. On hover the column slides one cell:
     • even glyphs slide UP   → reveal the bottom cell (roll in from below)
     • odd  glyphs slide DOWN → reveal the top cell   (roll in from above)
   …staggered left-to-right. A hairline underline wipes IN from the left
   on enter and OUT to the right on leave.

   Both RollingLink (standalone anchor) and RollingText (sub-element for
   triggers and custom controls) share the identical GSAP roll engine.
   ──────────────────────────────────────────────────────────────── */

const ROLL = { duration: 0.5, ease: "power3.inOut" };
const STAGGER = 0.03;
const UNDERLINE = { duration: 0.4, ease: "power3.out" };
const CELL = "1.3em"; // mask + cell height; roomy enough to clear descenders

// 3-cell column: rest shows the middle cell for ALL glyphs.
const REST = -100 / 3; // -33.33%  → middle cell in the window
// hover reveals the opposite cell, alternating per glyph.
const hoverY = (i) => (i % 2 === 0 ? -200 / 3 : 0); // even → bottom, odd → top

export const RollingText = forwardRef(function RollingText(
  {
    children,
    className = "",
    underline = true,
    background = null,
    onEnter,
    onLeave,
    ...props
  },
  ref
) {
  const rootRef = useRef(null);
  const charTl = useRef(null);

  const text = String(children ?? "");
  const chars = [...text];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const underlineEl = root.querySelector("[data-roll-underline]");
      if (underlineEl) gsap.set(underlineEl, { scaleX: 0, transformOrigin: "left center" });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    charTl.current?.play();
    const root = rootRef.current;
    if (!root) return;
    const u = root.querySelector("[data-roll-underline]");
    if (u)
      gsap.to(u, {
        scaleX: 1,
        transformOrigin: "left center",
        ...UNDERLINE,
      });
    onEnter?.();
  }, [onEnter]);

  const leave = useCallback(() => {
    charTl.current?.reverse();
    const root = rootRef.current;
    if (!root) return;
    const u = root.querySelector("[data-roll-underline]");
    if (u)
      gsap.to(u, {
        scaleX: 0,
        transformOrigin: "right center",
        ...UNDERLINE,
      });
    onLeave?.();
  }, [onLeave]);

  useImperativeHandle(ref, () => ({
    play: enter,
    reverse: leave,
  }));

  return (
    <span
      ref={rootRef}
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

      {/* Decorative tripled glyphs - the real label lives in aria-label. */}
      <span aria-hidden className="relative z-10 inline-flex items-center">
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i} aria-hidden style={{ width: "0.32em" }} />
          ) : (
            <span
              key={i}
              className="relative inline-block overflow-hidden"
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

      {/* Underline - inherits link colour via bg-current. */}
      {underline && (
        <span
          data-roll-underline
          aria-hidden
          className="pointer-events-none absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-current"
          style={{ transform: "scaleX(0)" }}
        />
      )}
    </span>
  );
});

export default function RollingLink({
  href,
  children,
  className = "",
  underline = true,
  background = null,
  ...props
}) {
  const rollRef = useRef(null);

  return (
    <Link
      href={href}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => rollRef.current?.play()}
      onMouseLeave={() => rollRef.current?.reverse()}
      onFocus={() => rollRef.current?.play()}
      onBlur={() => rollRef.current?.reverse()}
      {...props}
    >
      <RollingText
        ref={rollRef}
        underline={underline}
        background={background}
      >
        {children}
      </RollingText>
    </Link>
  );
}
