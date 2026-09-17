'use client'

import Image from 'next/image'
import {
    Boxes,
    Bus,
    Headset,
    Leaf,
    MessageCircle,
    MonitorSmartphone,
    Package,
    Phone,
    TrainFront,
} from 'lucide-react'

import {
    NURSERY_BIGHAS,
    WHOLESALE_AUDIENCE,
    WHOLESALE_PHONE_DISPLAY,
    WHOLESALE_PHONE_TEL,
    WHOLESALE_WHATSAPP_URL,
    yearsInBusiness,
} from '@/lib/companyInfo'
import { RevealUp } from '@/components/ui/reveal'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'

/* ────────────────────────────────────────────────────────────────
   WholesaleSection - the plant-supply arm (bulk exotic, ornamental
   and fruit plants despatched pan-India), distinct from the
   design/build/maintain landscaping arm covered by BenefitsSection.

   Rebuilt from a six-up grid of identical white cards, which gave
   every claim the same weight and read as filler: the way an order
   travels is the proposition, so it now leads as a connected
   three-mode rail, and the remaining capabilities sit under it as a
   hairline list rather than five more boxes.

   Surface: --surface-warm paper on the same gutter and vertical
   rhythm as every other homepage section, closing on the lime accent
   rather than a dark green slab.
   ──────────────────────────────────────────────────────────────── */

// Rows of potted stock under cover at Bibirhut - chosen because it shows the
// nursery at the scale the wholesale copy claims.
const FARM_IMAGE = 'https://res.cloudinary.com/heog9fna/image/upload/v1787744100/WhatsApp_Image_2026-08-26_at_4.57.12_PM_1_cdnqow.jpg'

// The proposition: bus, train and courier are one capability (how an order
// travels), not three, so they render as one connected rail.
const TRANSPORT = [
    { Icon: Bus, label: 'Bus', note: 'Regional runs across Bengal' },
    { Icon: TrainFront, label: 'Train', note: 'Long-haul, bulk consignments' },
    { Icon: Package, label: 'Courier', note: 'Smaller parcels, door to door' },
]

const CAPABILITIES = [
    {
        Icon: Boxes,
        title: 'Wholesale quantity',
        description: 'Bulk consignments made up for nurseries, landscapers and garden centres.',
    },
    {
        Icon: Leaf,
        title: 'Exotic, ornamental & fruit',
        description: 'A wide range, carefully selected and hardened before it leaves the farm.',
    },
    {
        Icon: MonitorSmartphone,
        title: 'Online & offline sales',
        description: 'Order on the site, or buy across the counter at Judges Court Road.',
    },
    {
        Icon: Headset,
        title: 'Customer care support',
        description: 'A person on the line before the order, and after it has been sent.',
    },
]

const WholesaleSection = () => {
    return (
        <section className="w-full bg-[var(--surface-warm)] px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))] pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">
            <div>

                {/* ── Editorial header ── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-12">
                    <div>
                        <RevealUp as="span" className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)]">
                            <span aria-hidden className="size-1.5 rounded-full border border-current" />
                            Wholesale &amp; Pan-India Supply
                        </RevealUp>
                        <RevealUp
                            as="h2"
                            delay={70}
                            className="mt-4 text-[clamp(1.7rem,4.2vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--brand-primary)]"
                        >
                            {yearsInBusiness()} years supplying quality
                            <br className="hidden sm:block" />{' '}
                            plants, nationwide.
                        </RevealUp>
                    </div>
                    <RevealUp
                        as="p"
                        delay={140}
                        className="text-[0.9375rem] leading-normal text-[var(--muted-foreground)] lg:pb-2"
                    >
                        Exotic, ornamental and fruit plants, grown on our own farm and
                        despatched in wholesale quantity to anywhere in India - bought
                        online or across our Alipore counter.
                    </RevealUp>
                </div>

                {/* rule */}
                <div className="my-8 h-px w-full bg-[var(--brand-primary)]/12 lg:my-12" />

                {/* ── Bento: farm photo + the despatch rail and capabilities ── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">

                    {/* Photo card - the section's single image, carrying the
                        farm figure the rest of the copy leans on. */}
                    <RevealUp className="group relative col-span-1 aspect-4/5 overflow-hidden rounded-[var(--radius-3xl)] sm:aspect-16/10 lg:col-span-5 lg:aspect-auto lg:min-h-[30rem]">
                        <Image
                            src={FARM_IMAGE}
                            alt="Rows of nursery plants raised under cover at our Bibirhut farm, ready for wholesale despatch"
                            fill
                            quality={82}
                            sizes="(max-width: 1024px) 100vw, 42vw"
                            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.07]"
                        />
                        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                            <p className="text-[0.8rem] font-semibold uppercase text-white/50">
                                Our own farm
                            </p>
                            <p className="mt-2 flex items-end gap-1.5 leading-[0.9] tracking-[-0.03em] text-white">
                                <span className="text-[2.9rem] font-semibold lg:text-[3.5rem]">{NURSERY_BIGHAS}</span>
                                <span className="pb-1 text-[1rem] font-medium text-white/70">bighas</span>
                            </p>
                            <div className="my-3 h-px w-8 bg-[var(--brand-lime)]" />
                            <p className="max-w-sm text-[0.8rem] leading-normal text-white/70">
                                At Bibirhut, South 24 Parganas - where every consignment is
                                grown, hardened and packed before it travels.
                            </p>
                        </div>
                    </RevealUp>

                    {/* Right column - the despatch rail leads, because how an
                        order reaches the buyer is the whole proposition. */}
                    <div className="col-span-1 flex flex-col gap-4 lg:col-span-7 lg:gap-5">

                        {/* ── Despatch rail ── */}
                        <RevealUp
                            delay={80}
                            className="rounded-[var(--radius-3xl)] border border-[var(--border)] bg-[var(--brand-white)] p-6 lg:p-8"
                        >
                            <p className="text-[0.8rem] font-semibold uppercase text-[var(--muted-foreground)]">
                                Supply all over India
                            </p>
                            <h3 className="mt-2 max-w-md text-[1.15rem] font-medium leading-snug tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1.4rem]">
                                Whichever mode suits the size of the order and where it has to reach.
                            </h3>

                            {/* Three modes on one rail. The connecting hairline
                                is drawn behind the icon row and masked by each
                                badge's own background, so it reads as a single
                                continuous line rather than three separate marks. */}
                            <div className="relative mt-8">
                                <span
                                    aria-hidden
                                    className="absolute left-0 right-0 top-6 hidden h-px bg-[var(--border)] sm:block"
                                />
                                <ul className="relative grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
                                    {TRANSPORT.map(({ Icon, label, note }) => (
                                        <li key={label} className="flex items-center gap-4 sm:block">
                                            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-lime)] ring-4 ring-[var(--brand-white)]">
                                                <Icon className="size-5 text-[var(--brand-lime-ink)]" strokeWidth={1.7} />
                                            </span>
                                            <span className="min-w-0 sm:mt-4 sm:block">
                                                <span className="block text-[0.9375rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)]">
                                                    {label}
                                                </span>
                                                <span className="mt-0.5 block text-[0.8rem] leading-normal text-[var(--muted-foreground)]">
                                                    {note}
                                                </span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </RevealUp>

                        {/* ── Capability list ──
                            A hairline-divided 2x2 rather than four more cards,
                            so the rail above keeps the weight it has earned. */}
                        <RevealUp
                            delay={160}
                            className="grid flex-1 grid-cols-1 rounded-[var(--radius-3xl)] border border-[var(--border)] bg-[var(--brand-white)] sm:grid-cols-2"
                        >
                            {CAPABILITIES.map(({ Icon, title, description }, i) => (
                                <div
                                    key={title}
                                    /* One column on phones, so every row but the
                                       last needs a rule; two from sm, so only
                                       the first row does. */
                                    className={`flex gap-4 border-[var(--border)] p-5 lg:p-6 ${
                                        i % 2 === 1 ? 'sm:border-l' : ''
                                    } ${i < 3 ? 'border-b' : ''} ${i === 2 ? 'sm:border-b-0' : ''}`}
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary)]">
                                        <Icon className="size-[18px] text-[var(--brand-primary)]" strokeWidth={1.6} />
                                    </span>
                                    <span>
                                        <span className="block text-[0.9375rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1rem]">
                                            {title}
                                        </span>
                                        <span className="mt-1.5 block text-[0.8rem] leading-normal text-[var(--muted-foreground)]">
                                            {description}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </RevealUp>
                    </div>
                </div>

                {/* ── CTA strip ──
                    Lime, not the forest-green panel this section used to close
                    on: the band is warm paper throughout, so the one saturated
                    surface is the accent and it lands on the action. ── */}
                <RevealUp
                    delay={220}
                    className="mt-4 flex flex-col gap-6 rounded-[var(--radius-4xl)] bg-[var(--brand-lime)] p-6 sm:p-8 lg:mt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10"
                >
                    <div>
                        <p className="text-[0.8rem] font-semibold uppercase text-[var(--brand-lime-ink)]/55">
                            Order or enquire
                        </p>
                        <p className="mt-2 max-w-xl text-[1.05rem] font-medium leading-snug tracking-[-0.01em] text-[var(--brand-lime-ink)] lg:text-[1.35rem]">
                            Wholesale orders welcome from {WHOLESALE_AUDIENCE}.
                        </p>
                    </div>

                    {/* Two actions - WhatsApp for a written enquiry with a
                        photo attached, a call for whoever wants an answer now.
                        self-start keeps them hugging their labels when the
                        strip stacks; on lg it re-centres as a row. */}
                    <div className="flex shrink-0 flex-wrap items-center gap-3 self-start lg:self-center">
                        <LimeArrowButton
                            href={WHOLESALE_WHATSAPP_URL}
                            external
                            icon={MessageCircle}
                            tone="ink"
                        >
                            WhatsApp us
                        </LimeArrowButton>
                        <a
                            href={`tel:${WHOLESALE_PHONE_TEL}`}
                            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--brand-lime-ink)]/25 px-5 cta-text font-medium text-[var(--brand-lime-ink)] transition-colors hover:border-[var(--brand-lime-ink)] hover:bg-[var(--brand-lime-hover)] sm:h-14 sm:px-7"
                        >
                            <Phone className="size-4" strokeWidth={1.8} />
                            {WHOLESALE_PHONE_DISPLAY}
                        </a>
                    </div>
                </RevealUp>
            </div>
        </section>
    )
}

export default WholesaleSection
