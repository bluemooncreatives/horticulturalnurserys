'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

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
 */
const LimeArrowButton = ({ href, children, icon: Icon, external = false, className, ...rest }) => (
    <Link
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cn(
            'group inline-flex h-11 max-w-full items-center gap-2.5 rounded-full bg-[var(--brand-lime)] py-1.5 pl-5 pr-1.5 transition-colors hover:bg-[var(--brand-lime-hover)]',
            'sm:h-14 sm:gap-4 sm:py-2 sm:pl-7 sm:pr-2.5',
            className
        )}
        {...rest}
    >
        {Icon && (
            <Icon
                className="size-4 shrink-0 text-[var(--brand-lime-ink)]"
                strokeWidth={1.8}
                aria-hidden
            />
        )}

        <span className="min-w-0 truncate whitespace-nowrap font-neue text-[0.875rem] font-medium tracking-tight text-[var(--brand-lime-ink)] sm:text-[1.05rem]">
            {children}
        </span>

        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)] text-white transition-transform duration-300 ease-out group-hover:rotate-45 sm:size-9">
            <ArrowUpRight className="size-3.5 sm:size-4" />
        </span>
    </Link>
)

export default LimeArrowButton
