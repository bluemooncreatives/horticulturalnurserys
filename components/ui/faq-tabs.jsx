'use client'

import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// Tabbed FAQ - a category switcher above an accordion list.
//
// Adapted from a framer-motion reference to this codebase's conventions:
//   • No framer-motion. This project standardises on GSAP and is hydration-
//     tuned (see LazyHydrate), so a second animation runtime for one section
//     is not worth the bytes. Every motion below is a CSS transition, and the
//     panel swap reuses the `slide-up-fade` keyframe from design-system.css.
//   • Open/close uses the grid-rows 0fr→1fr trick: no fixed max-height and no
//     JS measurement, so answers of any length animate correctly.
//   • Colours/radii/easings come from design tokens, not shadcn's generic
//     primary/muted scale, so it re-skins with the rest of the platform.
//
// Props:
//   title      - section heading
//   meta       - optional right-aligned caption on the header row
//   categories - { key: 'Label' } - tab order follows key order
//   faqData    - { key: [{ question, answer }] } - keyed to `categories`
export const FAQ = ({
    title = 'Frequently Asked',
    meta,
    categories = {},
    faqData = {},
    children,
    className,
    ...props
}) => {
    const categoryKeys = Object.keys(categories)
    const [selected, setSelected] = useState(categoryKeys[0])
    const baseId = useId()

    if (!categoryKeys.length) return null

    const questions = faqData[selected] || []

    return (
        <section
            className={cn(
                'lumora-shell bg-background pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]',
                className
            )}
            {...props}
        >
            {/* section header - same shape as every other section on the page */}
            <div className="mb-4 flex items-end justify-between lg:mb-6">
                <div>
                    <h2 className="text-[clamp(1.7rem,4.2vw,3rem)] font-medium tracking-[-0.02em] text-[var(--brand-primary)]">
                        {title}
                    </h2>
                </div>
                {meta && (
                    <span className="hidden text-[0.68rem] font-semibold uppercase text-muted-foreground sm:block">
                        {meta}
                    </span>
                )}
            </div>

            {/* rule */}
            <div className="h-px w-full bg-foreground/10" />

            {/* category tabs */}
            <div role="tablist" aria-label="FAQ categories" className="mt-6 flex flex-wrap gap-2 lg:mt-8">
                {categoryKeys.map((key) => {
                    const active = selected === key
                    return (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            id={`${baseId}-tab-${key}`}
                            aria-selected={active}
                            aria-controls={`${baseId}-panel-${key}`}
                            onClick={() => setSelected(key)}
                            className={cn(
                                'relative overflow-hidden rounded-[var(--radius-pill)] border px-4 py-2',
                                'text-[0.68rem] font-semibold uppercase tracking-[0.12em]',
                                'transition-colors duration-300',
                                active
                                    ? 'border-[var(--brand-primary)] text-white'
                                    : 'border-foreground/15 text-muted-foreground hover:border-[var(--brand-primary)]/40 hover:text-[var(--brand-primary)]'
                            )}
                        >
                            <span className="relative z-10">{categories[key]}</span>
                            {/* brand fill slides up into place - the CSS equivalent
                                of the reference's y:100%→0% motion element.
                                Parked at 100%+2px rather than a flat 100%: at exactly
                                its own height, subpixel rounding against the rounded
                                overflow clip leaves a hairline of fill showing along
                                the bottom edge of the inactive pills. */}
                            <span
                                aria-hidden
                                className={cn(
                                    'absolute inset-0 z-0 bg-[var(--brand-primary)]',
                                    'transition-transform duration-500 ease-[var(--ease-out-expo)]',
                                    active ? 'translate-y-0' : 'translate-y-[calc(100%+2px)]'
                                )}
                            />
                        </button>
                    )
                })}
            </div>

            {/* answers - `key` on the panel restarts the enter animation per tab */}
            <div
                key={selected}
                role="tabpanel"
                id={`${baseId}-panel-${selected}`}
                aria-labelledby={`${baseId}-tab-${selected}`}
                className="mt-8 flex animate-[slide-up-fade_0.45s_var(--ease-out-quart)] flex-col gap-3 motion-reduce:animate-none lg:mt-10"
            >
                {questions.map((faq) => (
                    <FAQItem key={faq.question} faq={faq} />
                ))}
            </div>

            {/* optional footer slot - e.g. a "still have a question?" line */}
            {children}
        </section>
    )
}

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={cn(
                'rounded-[var(--radius-card)] border bg-white transition-colors duration-300',
                isOpen
                    ? 'border-[var(--brand-primary)]/25'
                    : 'border-[var(--border)] hover:border-[var(--brand-primary)]/20'
            )}
        >
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
            >
                <span
                    className={cn(
                        'font-neue text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-300 lg:text-[1rem]',
                        isOpen ? 'text-[var(--brand-primary)]' : 'text-foreground/80'
                    )}
                >
                    {faq.question}
                </span>
                <Plus
                    className={cn(
                        'size-4 shrink-0 transition-transform duration-300',
                        isOpen ? 'rotate-45 text-[var(--brand-primary)]' : 'text-muted-foreground'
                    )}
                />
            </button>

            {/* grid-rows trick - no fixed max-height, no JS measurement */}
            <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    {/* rows span the full width, but the answer is capped so the
                        line length stays readable on a wide viewport */}
                    <p className="max-w-3xl px-4 pb-4 text-[0.84rem] leading-relaxed text-[var(--text-body)]">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FAQ
