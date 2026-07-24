"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

/* ────────────────────────────────────────────────────────────────
   CrossfadeImage — reusable, advanced GSAP image cross-dissolve.

   Give it the full set of `images` and the `activeIndex` that should be
   showing; whenever that index changes it plays a layered transition
   between the two frames:

     • cross-dissolve   outgoing opacity → 0, incoming → 1 (they overlap)
     • scale settle     incoming eases from `scaleFrom` → 1 (never < 1, so
                        object-cover never uncovers an edge)
     • motion blur      incoming de-blurs `blur`px → 0 as it resolves
     • Ken Burns        the resting frame slowly drifts to `kenBurnsScale`
                        over `kenBurnsDuration`s so it never sits dead-still

   Design notes
   ─────────────
   • Every frame is mounted up-front (all `images` rendered as stacked
     layers) so a transition never waits on a network/decode → no flash.
     With only a handful of hero frames this is far more robust than an
     A/B buffer, and the browser de-dupes repeated URLs.
   • Transitions are interruption-safe: each run kills the prior tweens on
     every layer and re-targets, and the incoming layer only re-seeds its
     `from` (scale/blur) when it was actually hidden — so a rapid click
     mid-dissolve eases from where it is instead of snapping.
   • `isolation: isolate` traps the internal z-index so the stack can never
     paint above sibling overlays/content that sit on top of it.
   • Respects prefers-reduced-motion (snaps opacity, no movement/blur/KB).

   The parent owns the index + timing; this component owns *how* two frames
   trade places. Reuse it anywhere by feeding a different `activeIndex`.
   ──────────────────────────────────────────────────────────────── */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CrossfadeImage({
  images,
  activeIndex = 0,
  alt = "",
  alts,
  sizes = "100vw",
  priority = false,
  objectClassName = "object-cover",
  className = "absolute inset-0",
  duration = 1.2,
  ease = "power2.inOut",
  scaleFrom = 1.12,
  blur = 14,
  kenBurns = true,
  kenBurnsScale = 1.06,
  kenBurnsDuration = 7,
  enterX = 0, // incoming slides in from this xPercent (negative = from the left)
  stillOutgoing = false, // when true the outgoing frame holds position — pure fade, no shift/scale/blur
}) {
  const layerRefs = useRef([]);
  const current = useRef(activeIndex);
  const mounted = useRef(false);
  // The frame visible at first paint: it's both the LCP candidate (pin
  // `priority` to it so it doesn't hop between frames) and the seed for the
  // static first-paint inline styles below. Captured once, never changes.
  const initialIndex = useRef(activeIndex).current;

  // Slow drift on the frame that's currently at rest. Runs with
  // overwrite:false so it layers onto the settled scale without cancelling
  // anything else; the next transition kills it via killTweensOf.
  const kenBurnsDrift = (el) => {
    if (!el || !kenBurns || prefersReduced()) return;
    gsap.to(el, {
      scale: kenBurnsScale,
      duration: kenBurnsDuration,
      ease: "sine.inOut",
      overwrite: false,
    });
  };

  // First paint: show the active frame immediately (no entrance animation
  // so we never delay the LCP), hide the rest, then start the drift.
  useEffect(() => {
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        opacity: i === activeIndex ? 1 : 0,
        scale: 1,
        xPercent: 0,
        filter: "blur(0px)",
        zIndex: i === activeIndex ? 2 : 0,
      });
    });
    current.current = activeIndex;
    kenBurnsDrift(layerRefs.current[activeIndex]);
    mounted.current = true;

    const layers = layerRefs.current;
    return () => layers.forEach((el) => el && gsap.killTweensOf(el));
    // Mount-only: the transition effect below handles every later change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every subsequent activeIndex change plays the layered transition.
  useEffect(() => {
    if (!mounted.current) return;
    const from = current.current;
    const to = activeIndex;
    if (from === to) return;
    const reduce = prefersReduced();

    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.killTweensOf(el);

      if (i === to) {
        // Incoming — dissolve up, settle scale, de-blur, optional slide-in
        // from `enterX`, then hand off to Ken Burns.
        gsap.set(el, { zIndex: 2 });
        if (reduce) {
          gsap.set(el, { opacity: 1, scale: 1, xPercent: 0, filter: "blur(0px)" });
          return;
        }
        const wasHidden = Number(gsap.getProperty(el, "opacity")) < 0.02;
        if (wasHidden) gsap.set(el, { scale: scaleFrom, xPercent: enterX, filter: `blur(${blur}px)` });
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          filter: "blur(0px)",
          duration,
          ease,
          onComplete: () => kenBurnsDrift(el),
        });
      } else if (i === from) {
        if (reduce) {
          gsap.set(el, { opacity: 0, zIndex: 0 });
          return;
        }
        if (stillOutgoing) {
          // Outgoing holds its position — pure fade out, no shift/scale/blur.
          // Fades over the full duration so it stays put beneath the incoming
          // until the new frame has slid fully into place.
          gsap.to(el, {
            opacity: 0,
            duration,
            ease,
            onComplete: () => gsap.set(el, { zIndex: 0, xPercent: 0, scale: 1, filter: "blur(0px)" }),
          });
        } else {
          // Default outgoing — dissolve down with a touch of push-in + soft blur.
          gsap.to(el, {
            opacity: 0,
            scale: "+=0.06",
            filter: `blur(${blur * 0.5}px)`,
            duration: duration * 0.85,
            ease,
            onComplete: () => gsap.set(el, { zIndex: 0, filter: "blur(0px)", scale: 1 }),
          });
        }
      } else {
        // Any other frame stays parked and hidden.
        gsap.set(el, { opacity: 0, zIndex: 0, xPercent: 0 });
      }
    });

    current.current = to;
  }, [activeIndex, duration, ease, scaleFrom, blur, enterX, stillOutgoing]);

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ isolation: "isolate" }}
      aria-hidden={!alt && !alts ? true : undefined}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          ref={(el) => (layerRefs.current[i] = el)}
          className="absolute inset-0 will-change-transform"
          // Seed ONLY the first-paint state here, keyed off the initial index
          // (a constant), never the live `activeIndex`. If these were derived
          // from `activeIndex`, React would re-commit opacity/z to hard target
          // values on every change and stomp the GSAP crossfade (hard cut).
          // Because the values never change between renders, React leaves the
          // DOM alone after mount and GSAP fully owns opacity / scale / z.
          style={{
            opacity: i === initialIndex ? 1 : 0,
            zIndex: i === initialIndex ? 2 : 0,
            willChange: "transform, opacity",
          }}
        >
          <Image
            src={src}
            alt={alts?.[i] ?? alt}
            fill
            sizes={sizes}
            priority={priority && i === initialIndex}
            loading={priority && i === initialIndex ? undefined : "eager"}
            className={objectClassName}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
