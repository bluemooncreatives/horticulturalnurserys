'use client'

import Image from 'next/image'
import {
    Boxes,
    Globe2,
    Bus,
    TrainFront,
    Package,
    Headset,
    MonitorSmartphone,
    Leaf,
    MessageCircle,
} from 'lucide-react'
import {
    NURSERY_BIGHAS,
    yearsInBusiness,
    WHOLESALE_WHATSAPP_URL,
    WHOLESALE_PHONE_DISPLAY,
    WHOLESALE_AUDIENCE,
} from '@/lib/companyInfo'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'

// The despatch card carries three icons rather than three separate cards -
// bus, train and courier are one capability (how an order travels), not three.
const TRANSPORT_ICONS = [Bus, TrainFront, Package]

const CAPABILITIES = [
    {
        Icon: Boxes,
        title: 'Wholesale Quantity',
        description: 'Bulk consignments made up for nurseries, landscapers and garden centres.',
    },
    {
        Icon: Globe2,
        title: 'Supply All Over India',
        description: 'Despatched nationwide from our farm at Bibirhut and the Alipore counter.',
    },
    {
        Icon: null,
        title: 'Bus · Train · Courier',
        description: 'Whichever mode suits the size of the order and where it has to reach.',
        icons: TRANSPORT_ICONS,
    },
    {
        Icon: Leaf,
        title: 'Exotic, Ornamental & Fruit',
        description: 'A wide range, carefully selected and hardened before it leaves the farm.',
    },
    {
        Icon: MonitorSmartphone,
        title: 'Online & Offline Sales',
        description: 'Order on the site, or buy across the counter at Judges Court Road.',
    },
    {
        Icon: Headset,
        title: 'Customer Care Support',
        description: 'A person on the line before the order, and after it has been sent.',
    },
]

// Rows of potted stock under cover at Bibirhut - the one image here, chosen
// because it shows the nursery at the scale the wholesale copy claims.
const FARM_IMAGE = 'https://res.cloudinary.com/heog9fna/image/upload/v1787744100/WhatsApp_Image_2026-08-26_at_4.57.12_PM_1_cdnqow.jpg'

// Client-supplied wholesale proposition: bulk exotic, ornamental and fruit
// plants despatched pan-India by bus, train or courier, sold online and at the
// counter. Distinct from BenefitsSection, which covers the design/build/
// maintain landscaping arm - this is the plant-supply business.
const WholesaleSection = () => {
    return (
        <section className="w-full mx-auto px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))] bg-background pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">

            {/* ── Editorial header ── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-12">
                <div>
                    <span className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)]">
                        <span aria-hidden className="size-1.5 rounded-full border border-current" />
                        Wholesale &amp; Pan-India Supply
                    </span>
                    <h2 className="mt-4 text-[clamp(1.7rem,4.2vw,3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-[var(--brand-primary)]">
                        {yearsInBusiness()} years supplying quality
                        <br className="hidden sm:block" />{' '}
                        plants, nationwide.
                    </h2>
                </div>
                <p className="text-[0.9rem] leading-relaxed text-[var(--muted-foreground)] lg:pb-2">
                    Exotic, ornamental and fruit plants, grown on our own farm and
                    despatched in wholesale quantity to anywhere in India - bought
                    online or across our Alipore counter.
                </p>
            </div>

            {/* rule */}
            <div className="my-8 h-px w-full bg-foreground/10 lg:my-12" />

            {/* ── Bento: farm photo + capability cards ── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">

                {/* Photo card - the section's single image, carrying the farm
                    stat. Same overlay/bottom-anchored treatment as the editorial
                    cards, so it reads as part of the same family. */}
                <div className="group relative col-span-1 aspect-4/5 overflow-hidden rounded-[var(--radius-3xl)] sm:aspect-16/10 lg:col-span-4 lg:aspect-auto lg:min-h-[26rem]">
                    <Image
                        src={FARM_IMAGE}
                        alt="Rows of nursery plants raised under cover at our Bibirhut farm, ready for wholesale despatch"
                        fill
                        quality={82}
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                    <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                        <p className="text-[0.8rem] font-semibold uppercase text-white/50">
                            Our own farm
                        </p>
                        <p className="mt-2 flex items-end gap-1.5 leading-[0.9] tracking-[-0.03em] text-white">
                            <span className="text-[2.9rem] font-semibold lg:text-[3.25rem]">{NURSERY_BIGHAS}</span>
                            <span className="pb-1 text-[1rem] font-medium text-white/70">bighas</span>
                        </p>
                        <div className="my-3 h-px w-8 bg-[var(--brand-lime)]" />
                        <p className="text-[0.8rem] leading-relaxed text-white/70">
                            At Bibirhut, South 24 Parganas - where every consignment is
                            grown, hardened and packed before it travels.
                        </p>
                    </div>
                </div>

                {/* Capability cards */}
                <div className="col-span-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-5">
                    {CAPABILITIES.map(({ Icon, title, description, icons }) => (
                        <div
                            key={title}
                            className="flex flex-col rounded-[var(--radius-3xl)] border border-[var(--border)] bg-white p-5 transition-colors duration-300 hover:border-[var(--brand-primary)]/25 lg:p-6"
                        >
                            {/* icon - single, or the three transport marks */}
                            <span className="flex items-center gap-1.5">
                                {(icons ?? [Icon]).map((Ic, i) => (
                                    <span
                                        key={i}
                                        className="flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary)]"
                                    >
                                        <Ic className="size-[18px] text-[var(--brand-primary)]" strokeWidth={1.6} />
                                    </span>
                                ))}
                            </span>

                            <h3 className="mt-5 text-[1rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)] lg:text-[1.05rem]">
                                {title}
                            </h3>
                            <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--muted-foreground)]">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA strip - the one dark surface, anchoring the white section ── */}
            <div className="dark-panel mt-4 flex flex-col gap-5 p-6 sm:p-8 lg:mt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
                <div>
                    <p className="text-[0.8rem] font-semibold uppercase text-white/45">
                        Order or enquire
                    </p>
                    <p className="mt-2 max-w-xl text-[1.05rem] font-medium leading-snug tracking-[-0.01em] text-white lg:text-[1.35rem]">
                        Wholesale orders welcome from {WHOLESALE_AUDIENCE}.
                    </p>
                </div>

                {/* self-start keeps the pill hugging its label when the strip
                    stacks; on lg the strip is a row, so it re-centres instead. */}
                <LimeArrowButton
                    href={WHOLESALE_WHATSAPP_URL}
                    external
                    icon={MessageCircle}
                    className="shrink-0 self-start lg:self-center"
                >
                    {/* The full label is too wide for a nowrap pill on a
                        narrow phone; the icon already says WhatsApp there. */}
                    <span className="sm:hidden">{WHOLESALE_PHONE_DISPLAY}</span>
                    <span className="hidden sm:inline">WhatsApp / Call {WHOLESALE_PHONE_DISPLAY}</span>
                </LimeArrowButton>
            </div>
        </section>
    )
}

export default WholesaleSection
