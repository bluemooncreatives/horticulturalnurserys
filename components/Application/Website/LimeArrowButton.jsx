'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { handleAnchorClick } from '@/lib/scrollToAnchor'

/*
 * The site's primary CTA: a lime pill with the label on the left and a dark
 * circular arrow badge on the right that spins 45° on hover.
 *
 * This started as one-off markup inside ServicesSection ("Explore All
 * Services") while every other section rolled its own lime pill, so the
 * primary action looked different in each place. Extracted here so they all
 * render the same button.
 *
 * Props:
 *   icon     - optional leading mark (e.g. WhatsApp) shown before the label
 *   external - opens in a new tab with the usual rel guard
 *   tone     - 'lime' (default) or 'ink', the inverse for placing the same
 *              button on a lime surface, where a lime pill would disappear.
 *              A variant rather than per-call class overrides, because the
 *              three coloured parts (fill, label, arrow badge) all have to
 *              swap together to stay legible.
 */
const TONES = {
    lime: {
        pill: 'bg-[var(--brand-lime)] hover:bg-[var(--brand-lime-hover)]',
        label: 'text-[var(--brand-lime-ink)]',
        badge: 'bg-[var(--brand-primary)] text-white',
    },
    ink: {
        pill: 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]',
        label: 'text-white',
        badge: 'bg-[var(--brand-lime)] text-[var(--brand-lime-ink)]',
    },
}

const LimeArrowButton = ({ href, children, icon: Icon, external = false, tone = 'lime', className, ...rest }) => {
    const palette = TONES[tone] ?? TONES.lime

    return (
    <Link
        href={href}
        onClick={(e) => handleAnchorClick(e, href)}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cn(
            'group inline-flex h-11 max-w-full items-center gap-2.5 rounded-full py-1.5 pl-5 pr-1.5 transition-colors',
            'sm:h-14 sm:gap-4 sm:py-2 sm:pl-7 sm:pr-2.5',
            palette.pill,
            className
        )}
        {...rest}
    >
        {Icon && (
            <Icon
                className={cn('size-4 shrink-0', palette.label)}
                strokeWidth={1.8}
                aria-hidden
            />
        )}

        <span className={cn('min-w-0 truncate whitespace-nowrap cta-text font-neue font-medium tracking-tight', palette.label)}>
            {children}
        </span>

        <span className={cn(
            'grid size-8 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-out group-hover:rotate-45 sm:size-9',
            palette.badge
        )}>
            <ArrowUpRight className="size-3.5 sm:size-4" />
        </span>
    </Link>
    )
}

export default LimeArrowButton
