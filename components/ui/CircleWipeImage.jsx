"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

/* ────────────────────────────────────────────────────────────────
   CircleWipeImage - reusable directional circular-wipe between frames.

   Drop it into any round (or any) `overflow-hidden` box. Give it the full
   `images` set and the `activeIndex` to show; whenever that index changes
   it plays a two-part swap:

     • incoming   revealed by a circular clip-path that grows from the
                  right edge (originX/originY) - so the new frame "blooms
                  in from the right" - while easing a small slide + scale
                  down to rest.
     • outgoing   slides off to the left and fades - so the old frame
                  "vanishes from right to left" as the reveal eats it.

   Implementation notes
   ────────────────────
   • clip-path strings can't be tweened, so the incoming radius is driven
     off the SAME tween's eased ratio (`this.ratio`) in onUpdate - one
     tween per layer, so `killTweensOf(el)` cleans up transform AND clip
     together, keeping rapid advances interruption-safe.
   • All frames are mounted up-front (no load flash); only opacity/z sit in
     React inline style, seeded from the constant first-paint index so React
     never re-commits them and GSAP fully owns the motion (same discipline
     as CrossfadeImage).
   • Respects prefers-reduced-motion (snaps, no slide/reveal).

   Reuse: feed a different `activeIndex`, or flip `originX` to wipe the
   other way. Decorative by design (images carry empty alt).
   ──────────────────────────────────────────────────────────────── */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CircleWipeImage({
  images,
  activeIndex = 0,
  sizes = "28px",
  objectClassName = "object-cover object-top",
  duration = 0.7,
  ease = "power2.out",
  delay = 0,
  originX = 100, // reveal grows from the right edge
  originY = 50,
}) {
  const layerRefs = useRef([]);
  const current = useRef(activeIndex);
  const mounted = useRef(false);
  const initialIndex = useRef(activeIndex).current;

  const clipStr = (r) => `circle(${r}px at ${originX}% ${originY}%)`;
  const setClip = (el, r) => {
    el.style.clipPath = clipStr(r);
    el.style.webkitClipPath = clipStr(r);
  };
  // Farthest corner from the origin → the radius that fully covers the box.
  const maxRadius = (el) => {
    const { width: w, height: h } = el.getBoundingClientRect();
    const cx = (originX / 100) * w;
    const cy = (originY / 100) * h;
    return (
      Math.max(
        Math.hypot(cx, cy),
        Math.hypot(w - cx, cy),
        Math.hypot(cx, h - cy),
        Math.hypot(w - cx, h - cy)
      ) + 1
    );
  };

  // First paint: reveal the active frame fully, clip the rest to nothing.
  useEffect(() => {
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      const active = i === activeIndex;
      gsap.set(el, { opacity: active ? 1 : 0, xPercent: 0, scale: 1, zIndex: active ? 2 : 0 });
      setClip(el, active ? maxRadius(el) : 0);
    });
    current.current = activeIndex;
    mounted.current = true;

    const layers = layerRefs.current;
    return () => layers.forEach((el) => el && gsap.killTweensOf(el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every later activeIndex change plays the wipe.
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
        // Incoming - circular reveal from the right + settle in.
        gsap.set(el, { zIndex: 2, opacity: 1 });
        const end = maxRadius(el);
        if (reduce) {
          gsap.set(el, { xPercent: 0, scale: 1 });
          setClip(el, end);
          return;
        }
        setClip(el, 0);
        gsap.fromTo(
          el,
          { xPercent: 15, scale: 1.18 },
          {
            xPercent: 0,
            scale: 1,
            duration,
            ease,
            delay,
            onUpdate() {
              setClip(el, this.ratio * end); // eased radius, same tween
            },
            onComplete: () => setClip(el, end),
          }
        );
      } else if (i === from) {
        // Outgoing - slide off to the left and fade.
        if (reduce) {
          gsap.set(el, { opacity: 0, zIndex: 0 });
          return;
        }
        gsap.to(el, {
          xPercent: -35,
          opacity: 0,
          duration: duration * 0.9,
          ease,
          delay,
          onComplete: () => gsap.set(el, { zIndex: 0, xPercent: 0, scale: 1 }),
        });
      } else {
        // Parked frames stay hidden and clipped away.
        gsap.set(el, { opacity: 0, zIndex: 0, xPercent: 0, scale: 1 });
        setClip(el, 0);
      }
    });

    current.current = to;
  }, [activeIndex, duration, ease, delay, originX, originY]);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          ref={(el) => (layerRefs.current[i] = el)}
          className="absolute inset-0 will-change-transform"
          style={{
            opacity: i === initialIndex ? 1 : 0,
            zIndex: i === initialIndex ? 2 : 0,
            willChange: "transform",
          }}
        >
          <Image src={src} alt="" fill sizes={sizes} className={objectClassName} draggable={false} />
        </div>
      ))}
    </div>
  );
}
