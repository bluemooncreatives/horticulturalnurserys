"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

/* ────────────────────────────────────────────────────────────────
   CircleReveal — reusable GSAP circular background reveal.

   Drop it in as a child of any `position: relative` container; it binds
   to that container's hover/focus and sweeps a filled circle out from
   `originX/originY` (default left-centre) until it covers the whole box —
   reading as a left-to-right circular wipe of `color`.

   The radius is driven by a numeric proxy written into `clip-path` on
   each frame (clip-path strings can't be tweened directly), and the
   target radius is recomputed on every enter from the live box size, so
   it stays exact and responsive. Re-triggering kills the in-flight tween
   and eases from the current radius, so fast in/out stays smooth.

   Layering: it paints at `z-index: 0`; give the content that must stay
   on top its own stacking layer (e.g. `relative z-10`). A rounded,
   overflow-hidden wrapper clips the fill to the parent's corner radius.

   Reusable example:
     <div className="relative overflow-hidden rounded-xl bg-white">
       <CircleReveal color="var(--brand-lime)" />
       <div className="relative z-10">…content…</div>
     </div>

   Respects prefers-reduced-motion (snaps instead of animating).
   ──────────────────────────────────────────────────────────────── */

export default function CircleReveal({
  color = "var(--brand-lime)",
  originX = 0, // % from left where the circle starts
  originY = 50, // % from top
  duration = 0.6,
  ease = "power3.out",
  className = "",
}) {
  const fillRef = useRef(null);
  const tween = useRef(null);
  const radius = useRef(0);

  useEffect(() => {
    const fill = fillRef.current;
    const host = fill?.parentElement?.parentElement; // wrapper → hover host
    if (!fill || !host) return;

    const clip = (r) => `circle(${r}px at ${originX}% ${originY}%)`;
    const paint = (r) => {
      radius.current = r;
      fill.style.clipPath = clip(r);
      fill.style.webkitClipPath = clip(r);
    };
    paint(0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Farthest corner distance from the origin point → the circle that
    // fully covers the box no matter where the origin sits.
    const maxRadius = () => {
      const { width: w, height: h } = host.getBoundingClientRect();
      const cx = (originX / 100) * w;
      const cy = (originY / 100) * h;
      return Math.max(
        Math.hypot(cx, cy),
        Math.hypot(w - cx, cy),
        Math.hypot(cx, h - cy),
        Math.hypot(w - cx, h - cy)
      );
    };

    const run = (opening) => {
      tween.current?.kill();
      const end = opening ? maxRadius() : 0;
      if (reduce) {
        paint(end);
        return;
      }
      const proxy = { r: radius.current };
      tween.current = gsap.to(proxy, {
        r: end,
        duration,
        ease,
        onUpdate: () => paint(proxy.r),
      });
    };

    const enter = () => run(true);
    const leave = () => run(false);
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    host.addEventListener("focusin", enter);
    host.addEventListener("focusout", leave);

    return () => {
      tween.current?.kill();
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
      host.removeEventListener("focusin", enter);
      host.removeEventListener("focusout", leave);
    };
  }, [originX, originY, duration, ease]);

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ borderRadius: "inherit", zIndex: 0 }}
    >
      <span
        ref={fillRef}
        className="absolute inset-0"
        style={{ background: color, clipPath: "circle(0px at 0% 50%)" }}
      />
    </span>
  );
}
