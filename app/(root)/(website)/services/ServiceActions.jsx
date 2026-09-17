'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react'

import { RevealUp } from '@/components/ui/reveal'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'
import { handleAnchorClick } from '@/lib/scrollToAnchor'
import {
    WHOLESALE_PHONE_DISPLAY,
    WHOLESALE_PHONE_TEL,
    WHOLESALE_WHATSAPP_URL,
} from '@/lib/companyInfo'
import { WEBSITE_SERVICES, WEBSITE_SHOP } from '@/routes/WebsiteRoute'

/* ────────────────────────────────────────────────────────────────
   Shared call-to-action furniture for the four service detail pages.

   ServiceDetailContent (roof garden, vertical garden, maintenance) and
   LandscapeDevelopmentContent are two separate renderers that have
   drifted apart; putting the actions here means a change to how the
   site asks for the enquiry lands on all four pages at once instead
   of being hand-copied into both.
   ──────────────────────────────────────────────────────────────── */

/**
 * Hero actions - the enquiry pill plus a WhatsApp alternative, sitting
 * directly under the hero tagline. Previously the first action on a service
 * page was several screens down, so a visitor who was already convinced by
 * the headline had nothing to press.
 */
export function ServiceHeroActions({ delay = 340 }) {
    return (
        <RevealUp delay={delay} className="mt-7 flex flex-wrap items-center gap-3">
            <LimeArrowButton href="#enquiry">Request a site visit</LimeArrowButton>
            <a
                href={WHOLESALE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 cta-text font-medium text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10 sm:h-14 sm:px-7"
            >
                <MessageCircle className="size-4" strokeWidth={1.8} />
                WhatsApp us
            </a>
        </RevealUp>
    )
}

/**
 * Cross-sell band - placed after the provenance/farm section, where the page
 * has just finished arguing that we grow our own stock. Whoever is not ready
 * to commission a project can still buy the plants.
 */
export function ServiceCrossSell() {
    return (
        <section className="lumora-shell pb-16 lg:pb-24">
            <RevealUp className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius-4xl)] border border-[var(--border)] bg-[var(--brand-white)] p-8 sm:flex-row sm:items-center lg:p-10">
                <div>
                    <p className="text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)]">
                        Not a full project?
                    </p>
                    <h3 className="mt-2 max-w-lg font-neue text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-tight tracking-[-0.01em] text-[var(--brand-primary)]">
                        Buy the same stock across our counter.
                    </h3>
                    <p className="mt-2 max-w-md text-[0.8rem] leading-normal text-[var(--muted-foreground)]">
                        Plants, pots, manure, implements and roof-garden materials - the
                        same inventory our field teams work from.
                    </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                    <LimeArrowButton href={WEBSITE_SHOP}>Browse the catalogue</LimeArrowButton>
                    <Link
                        href={WEBSITE_SERVICES}
                        className="group inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--brand-primary)]"
                    >
                        Compare all four services
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </RevealUp>
        </section>
    )
}

/**
 * Mobile sticky action bar. Appears once the hero has been scrolled past, so
 * it never covers the hero's own actions, and hides from lg up where the page
 * already keeps a CTA in view. Sits at z-40, below MobileStickyCartBar's z-50
 * - the two never coincide, since the cart bar is scoped to shop routes.
 */
export function ServiceStickyBar() {
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <aside
            aria-label="Service enquiry actions"
            aria-hidden={!shown}
            className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[var(--brand-ink-soft)]/95 px-4 pt-2.5 backdrop-blur-md transition-transform duration-300 ease-out lg:hidden pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] ${
                shown ? 'translate-y-0' : 'pointer-events-none translate-y-full'
            }`}
        >
            <div className="mx-auto flex max-w-lg items-center gap-2.5">
                <a
                    href={`tel:${WHOLESALE_PHONE_TEL}`}
                    aria-label={`Call ${WHOLESALE_PHONE_DISPLAY}`}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10"
                >
                    <Phone className="size-4" strokeWidth={1.8} />
                </a>
                <a
                    href={WHOLESALE_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp us"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10"
                >
                    <MessageCircle className="size-4" strokeWidth={1.8} />
                </a>
                <Link
                    href="#enquiry"
                    onClick={(e) => handleAnchorClick(e, '#enquiry')}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[var(--brand-lime)] px-4 text-[0.9375rem] font-medium text-[var(--brand-lime-ink)] transition-colors hover:bg-[var(--brand-lime-hover)]"
                >
                    Request a site visit
                </Link>
            </div>
        </aside>
    )
}
