"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ────────────────────────────────────────────────────────────────
   useHeroCarousel — reusable auto-advancing index driver.

   ONE GSAP tween is the single source of truth for timing: it runs for
   `interval` seconds, reports its 0→1 fraction through `onProgress` every
   frame (drive a progress ring/bar with it), and on complete advances the
   index and restarts itself. Because the countdown and the ring are the
   same tween, they can never drift apart, and pause/resume are exact.

   Returns:
     index    – current frame index (0-based)
     advance  – step forward one frame now + restart the clock (manual click)
     pause    – hold the clock (hover / focus in)  · reference-counted
     resume   – release the clock (mouse / focus out)
     paused   – whether the clock is currently held (for optional UI)

   Edge cases handled:
     • manual advance resets the countdown so it never double-fires
     • pause/resume are reference-counted, so overlapping hover+focus
       (e.g. a click that both hovers and focuses) stay balanced
     • the tab going hidden pauses the clock (no janky catch-up) and
       resumes on return only if nothing else is holding it
     • length < 2 → no clock (nothing to cycle), advance is a no-op-ish step
     • full teardown on unmount (tween killed, listener removed)
   ──────────────────────────────────────────────────────────────── */

export default function useHeroCarousel({ length, interval = 7, onProgress } = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const clock = useRef(null);
  const stepRef = useRef(() => {});
  const onProgressRef = useRef(onProgress);
  const holds = useRef(0); // reference count of active pause holders
  const hidden = useRef(false); // tab visibility

  // Keep the latest onProgress without forcing the clock to be recreated.
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const startClock = useCallback(() => {
    clock.current?.kill();
    onProgressRef.current?.(0);
    if (!length || length < 2) return;
    const proxy = { v: 0 };
    clock.current = gsap.to(proxy, {
      v: 1,
      duration: interval,
      ease: "none",
      onUpdate: () => onProgressRef.current?.(proxy.v),
      onComplete: () => stepRef.current(),
    });
  }, [length, interval]);

  const step = useCallback(() => {
    setIndex((prev) => (length ? (prev + 1) % length : prev));
    startClock();
    // If something is holding the clock (hovering/focused) or the tab is
    // hidden, keep it paused after the restart so it stays consistent.
    if (holds.current > 0 || hidden.current) clock.current?.pause();
  }, [length, startClock]);

  // stepRef lets the clock's onComplete always call the freshest step.
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const advance = useCallback(() => step(), [step]);

  const pause = useCallback(() => {
    holds.current += 1;
    clock.current?.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    holds.current = Math.max(0, holds.current - 1);
    if (holds.current === 0 && !hidden.current) {
      clock.current?.resume();
      setPaused(false);
    }
  }, []);

  useEffect(() => {
    startClock();

    const onVisibility = () => {
      if (document.hidden) {
        hidden.current = true;
        clock.current?.pause();
      } else {
        hidden.current = false;
        if (holds.current === 0) {
          clock.current?.resume();
          setPaused(false);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clock.current?.kill();
    };
  }, [startClock]);

  return { index, advance, pause, resume, paused };
}
