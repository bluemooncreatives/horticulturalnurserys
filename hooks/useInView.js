"use client";

import { useEffect, useRef, useState } from "react";

// One IntersectionObserver per unique (rootMargin, threshold) pair, shared
// across every element that asks for it — cheaper than a new observer per
// revealed element once a page has a couple dozen of them.
const registries = new Map();

function getRegistry(rootMargin, threshold) {
  const key = `${rootMargin}|${threshold}`;
  const existing = registries.get(key);
  if (existing) return existing;

  const listeners = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        listeners.get(entry.target)?.(entry.isIntersecting);
      }
    },
    { rootMargin, threshold },
  );

  const registry = { observer, listeners };
  registries.set(key, registry);
  return registry;
}

/**
 * Report when an element first enters the viewport. Defaults pull the
 * trigger 8% up from the bottom edge so reveals start just after the
 * element is genuinely visible, not the instant it clips in.
 */
export function useInView({
  rootMargin = "0px 0px -8% 0px",
  threshold = 0,
  once = true,
  disabled = false,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const { observer, listeners } = getRegistry(rootMargin, threshold);

    const listener = (isIntersecting) => {
      if (isIntersecting) {
        setInView(true);
        if (once) {
          listeners.delete(element);
          observer.unobserve(element);
        }
      } else if (!once) {
        setInView(false);
      }
    };

    listeners.set(element, listener);
    observer.observe(element);

    return () => {
      listeners.delete(element);
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, once, disabled]);

  return { ref, inView };
}
