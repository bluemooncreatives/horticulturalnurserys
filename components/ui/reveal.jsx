"use client";

import { useInView } from "@/hooks/useInView";

/**
 * Entrance-reveal primitives, ported from the Baseline template's hero
 * system (masked line reveal + fade-up panel reveal) and adapted to this
 * codebase's plain-CSS-transition style instead of a spring/ticker engine.
 *
 * Both accept `play` to externally gate the reveal (the page loader gates
 * the hero); when `play` is omitted they fire the first time they scroll
 * into view. The `-play` state class is a direct function of render state,
 * not an imperative DOM write - correct here because every reveal in this
 * app fires once per mount, so there's no replay case to guard against.
 */

/** Line-by-line masked reveal - each item slides up out of an overflow-hidden box. */
export function RevealLines({
  items,
  play,
  className = "",
  stagger = 120,
  delay = 0,
  duration = 950,
  ease = "var(--ease-out-expo)",
}) {
  const gated = play !== undefined;
  const { ref, inView } = useInView({ disabled: gated });
  const shouldPlay = gated ? play : inView;

  return (
    <span ref={ref} className={["block", shouldPlay ? "rv-play" : "", className].filter(Boolean).join(" ")}>
      {items.map((node, index) => (
        <span key={index} className="rv-line">
          <span
            className="rv-inner"
            style={{
              "--rv-delay": `${delay + index * stagger}ms`,
              "--rv-duration": `${duration}ms`,
              "--rv-ease": ease,
            }}
          >
            {node}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Fade-and-rise panel reveal - for cards, badges and other block content. */
export function RevealUp({
  children,
  play,
  as: As = "div",
  className = "",
  delay = 0,
  duration = 850,
  distance = 22,
  ease = "var(--ease-out-quart)",
  ...rest
}) {
  const gated = play !== undefined;
  const { ref, inView } = useInView({ disabled: gated });
  const shouldPlay = gated ? play : inView;

  return (
    <As
      ref={ref}
      className={["rv-up", shouldPlay ? "rv-up-play" : "", className].filter(Boolean).join(" ")}
      style={{
        "--rv-up-delay": `${delay}ms`,
        "--rv-up-duration": `${duration}ms`,
        "--rv-up-distance": `${distance}px`,
        "--rv-up-ease": ease,
      }}
      {...rest}
    >
      {children}
    </As>
  );
}
