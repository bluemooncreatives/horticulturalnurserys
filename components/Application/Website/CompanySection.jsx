'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, MapPin, MessageCircle, Phone } from 'lucide-react'

import {
    FLAGSHIP_PROJECTS,
    NURSERY_BIGHAS,
    OPERATING_SINCE_YEAR,
    UNDER_COVER_SQM,
    WHOLESALE_PHONE_DISPLAY,
    WHOLESALE_PHONE_TEL,
    WHOLESALE_WHATSAPP_URL,
    yearsInBusiness,
} from '@/lib/companyInfo'
import { RevealUp } from '@/components/ui/reveal'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'

/* ────────────────────────────────────────────────────────────────
   CompanySection - the page's closing conversion band: who the
   company is, stated as verifiable record rather than adjectives,
   followed by every way of reaching it.

   It deliberately does NOT repeat AboutUsSection (the pinned stat
   block higher up) or card 01 of EditorialCardsSection ("Our
   Story"): those introduce the company, this one closes on it -
   a credential ledger, the projects that back it, and the four
   actions a convinced visitor actually wants (site visit, call,
   WhatsApp, or walk into the Alipore counter).

   Surface: --surface-warm paper on the same gutter and vertical
   rhythm as every other homepage section, so its edges line up with
   the cards above it. No green fill - the forest green stays as type
   and hairlines, so the band reads as its own sheet of paper rather
   than a dark slab.
   ──────────────────────────────────────────────────────────────── */

// Images chosen against the copy rather than reused from the cards above:
// the story frame for the portrait plate, and the Alipore sale counter for
// the inset - the counter the action stack below it invites you to visit.
const PORTRAIT_IMAGE = 'https://res.cloudinary.com/heog9fna/image/upload/v1787744100/WhatsApp_Image_2026-08-26_at_4.57.12_PM_2_uhcbcb.jpg'
const INSET_IMAGE = 'https://res.cloudinary.com/heog9fna/image/upload/v1787582197/pklraaorrpqqvfss304g.jpg'

const COUNTER_ADDRESS = '2/5 Judges Court Road, Alipore, Kolkata 700027'
const COUNTER_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Horticultural Development Centre, ${COUNTER_ADDRESS}`
)}`

// A ledger, not a feature list - every row is a number someone could check.
const LEDGER = [
    {
        num: '01',
        label: 'Established',
        value: `Kolkata, ${OPERATING_SINCE_YEAR}`,
        note: `${yearsInBusiness()} years of continuous practice`,
    },
    {
        num: '02',
        label: 'Own farm',
        value: `${NURSERY_BIGHAS} bighas at Bibirhut`,
        note: 'Every plant raised here, never traded in',
    },
    {
        num: '03',
        label: 'Under cover',
        value: `${UNDER_COVER_SQM.toLocaleString('en-US')} sqm`,
        note: 'Polyshed, green house and fanpad houses',
    },
    {
        num: '04',
        label: 'Credentials',
        value: 'State Govt. & CPWD approved',
        note: 'Cleared to execute public-sector works',
    },
]

// Six of the named flagship projects - enough to establish the class of work
// without turning the band into a client wall.
const PROOF_PROJECTS = FLAGSHIP_PROJECTS.slice(0, 6)

// Shared shape for the two secondary actions, so Call and WhatsApp stay
// pixel-identical instead of drifting apart on separate class strings.
const SECONDARY_ACTION =
    'inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--brand-primary)]/25 bg-[var(--brand-white)] px-4 text-[0.9375rem] font-medium text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)] hover:bg-[var(--secondary)] sm:h-14'

const CompanySection = () => {
    return (
        <section className="w-full bg-[var(--surface-warm)] px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))] pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-16">

                {/* ── Left: statement + ledger ───────────────────── */}
                <div className="flex flex-col">
                    <RevealUp as="span" className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)]">
                        <span aria-hidden className="size-1.5 rounded-full border border-current" />
                        The company behind the garden
                    </RevealUp>

                    <RevealUp
                        as="h2"
                        delay={70}
                        className="mt-5 text-[clamp(1.6rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.025em] text-[var(--brand-primary)]"
                    >
                        A nursery since {OPERATING_SINCE_YEAR}.
                        <br className="hidden sm:block" />{' '}
                        <span className="text-[var(--brand-primary)]/45">A landscaping house ever since.</span>
                    </RevealUp>

                    <RevealUp
                        as="p"
                        delay={140}
                        className="mt-5 max-w-lg text-[0.9375rem] leading-[1.6] text-[var(--muted-foreground)]"
                    >
                        We design, build and maintain landscapes across West Bengal, and
                        we grow the plants for them ourselves at Bibirhut - so what
                        reaches your site is stock whose age and condition we already know.
                    </RevealUp>

                    {/* Ledger */}
                    <div className="mt-9 border-t border-[var(--border)]">
                        {LEDGER.map((row, i) => (
                            <RevealUp
                                key={row.num}
                                delay={180 + i * 60}
                                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-[var(--border)] py-4 transition-colors hover:border-[var(--brand-primary)]/35 sm:grid-cols-[3rem_9rem_1fr] sm:gap-x-6"
                            >
                                <span className="text-[0.75rem] font-medium tabular-nums text-[var(--muted-foreground)]/50 transition-colors group-hover:text-[var(--brand-primary)] sm:text-[0.8rem]">
                                    [{row.num}]
                                </span>
                                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted-foreground)] sm:text-[0.8rem] sm:tracking-normal">
                                    {row.label}
                                </span>
                                <span className="col-span-2 sm:col-span-1">
                                    <span className="block text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-[var(--brand-primary)] sm:text-[1.05rem]">
                                        {row.value}
                                    </span>
                                    <span className="mt-1 block text-[0.8rem] leading-normal text-[var(--muted-foreground)]">
                                        {row.note}
                                    </span>
                                </span>
                            </RevealUp>
                        ))}
                    </div>

                    {/* Proof chips - the work the ledger above paid for. */}
                    <RevealUp delay={420} className="mt-7 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {PROOF_PROJECTS.map((project) => (
                            <span
                                key={project}
                                className="rounded-full border border-[var(--border)] bg-[var(--brand-white)] px-3 py-1.5 text-[0.75rem] font-medium text-[var(--muted-foreground)] sm:text-[0.8rem]"
                            >
                                {project}
                            </span>
                        ))}
                        <Link
                            href="/about-us"
                            className="group inline-flex items-center gap-1.5 px-1 py-1.5 text-[0.75rem] font-medium text-[var(--brand-primary)] underline underline-offset-4 transition-opacity hover:opacity-70 sm:text-[0.8rem]"
                        >
                            and more
                            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </RevealUp>
                </div>

                {/* ── Right: image collage + actions ─────────────── */}
                <div className="flex flex-col">

                    <RevealUp delay={120} className="relative">
                        {/* Portrait plate */}
                        <div className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-3xl)] sm:aspect-16/11 lg:aspect-4/3">
                            <Image
                                src={PORTRAIT_IMAGE}
                                alt="Planting stock being raised at our farm in Bibirhut"
                                fill
                                quality={82}
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="object-cover"
                            />
                        </div>

                        {/* Inset plate - the Alipore sale counter, overlapping
                            the portrait's lower-left corner. Hidden below sm,
                            where there isn't room to overlap without covering
                            the subject. The border is the band's own surface,
                            so the inset reads as a cut-out rather than a card. */}
                        <div className="absolute -bottom-6 -left-4 hidden h-28 w-36 overflow-hidden rounded-[var(--radius-2xl)] border-4 border-[var(--surface-warm)] sm:block lg:-left-6 lg:h-32 lg:w-44">
                            <Image
                                src={INSET_IMAGE}
                                alt="Our sale counter at Judges Court Road, Alipore"
                                fill
                                quality={78}
                                sizes="176px"
                                className="object-cover"
                            />
                        </div>

                        {/* Lime stat badge - the one saturated surface in the
                            band, carrying the number the copy leans on. */}
                        <div className="absolute -bottom-5 right-4 flex items-end gap-1.5 rounded-[var(--radius-2xl)] bg-[var(--brand-lime)] px-4 py-3 leading-none text-[var(--brand-lime-ink)] lg:right-6">
                            <span className="text-[1.75rem] font-semibold tracking-[-0.03em] lg:text-[2rem]">{NURSERY_BIGHAS}</span>
                            <span className="pb-0.5 text-[0.8rem] font-medium opacity-70">bighas, our own</span>
                        </div>
                    </RevealUp>

                    {/* ── Action stack ───────────────────────────── */}
                    <RevealUp delay={260} className="mt-12 flex flex-col gap-3 sm:mt-14">
                        <p className="text-[0.8rem] font-semibold uppercase text-[var(--muted-foreground)]">
                            Talk to us
                        </p>

                        <LimeArrowButton href="/services#enquiry-form" className="w-full justify-between">
                            Request a site visit
                        </LimeArrowButton>

                        {/* Two equal-weight secondary actions, for whoever
                            would rather talk than fill in a form. */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <a href={`tel:${WHOLESALE_PHONE_TEL}`} className={SECONDARY_ACTION}>
                                <Phone className="size-4" strokeWidth={1.8} />
                                <span className="truncate">Call {WHOLESALE_PHONE_DISPLAY}</span>
                            </a>
                            <a
                                href={WHOLESALE_WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={SECONDARY_ACTION}
                            >
                                <MessageCircle className="size-4" strokeWidth={1.8} />
                                WhatsApp us
                            </a>
                        </div>

                        {/* Third way in - the physical counter. A bordered row,
                            not a button, so it doesn't compete with the two
                            above it. */}
                        <a
                            href={COUNTER_MAP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-2 flex items-start gap-3 rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--brand-white)] p-4 transition-colors hover:border-[var(--brand-primary)]/35 hover:bg-[var(--secondary)]"
                        >
                            <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--brand-primary)]" strokeWidth={1.8} />
                            <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5 text-[0.9375rem] font-medium text-[var(--brand-primary)]">
                                    Visit the Alipore counter
                                    <ArrowUpRight className="size-3.5 text-[var(--muted-foreground)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                                <span className="mt-1 block text-[0.8rem] leading-normal text-[var(--muted-foreground)]">
                                    {COUNTER_ADDRESS}
                                </span>
                            </span>
                        </a>
                    </RevealUp>
                </div>
            </div>
        </section>
    )
}

export default CompanySection
