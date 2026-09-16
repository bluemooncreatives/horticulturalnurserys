'use client'

import { Ruler, Sprout, Store, CalendarCheck } from 'lucide-react'

import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'

const BENEFITS = [
    { num: '01', Icon: Ruler, title: 'Survey & Design', description: 'Qualified horticulturists read your site - light, soil, drainage - before a single plant is chosen.' },
    { num: '02', Icon: Sprout, title: 'Grown, Not Traded', description: 'Stock comes off our own farm at Bibirhut, hardened under shade and ready to establish.' },
    { num: '03', Icon: Store, title: 'Everything One Roof', description: 'Plants, manure, pots, implements, pebbles and roof-garden materials from a single counter.' },
    { num: '04', Icon: CalendarCheck, title: 'Season Maintenance', description: 'Pruning, feeding, pest control and replanting on a schedule, so a garden holds its first-year look.' },
]

const BenefitsSection = () => {
    return (
        <section className="w-full mx-auto px-(--website-gutter) sm:px-[calc(var(--website-gutter)+clamp(0rem,4vw,var(--space-12)))] pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="dark-panel relative overflow-hidden p-5 sm:p-8 lg:p-14">

                {/* watermark */}
                <div aria-hidden className="pointer-events-none absolute -right-6 -top-10 select-none font-wordmark text-[16rem] leading-none text-white/[0.03] lg:text-[22rem]">
                    ✦
                </div>

                {/* header */}
                <div className="relative flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-[clamp(1.4rem,5vw,2.9rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white sm:mt-3">
                            From First Survey To Season After Season
                        </h2>
                    </div>
                    <p className="max-w-xs text-[0.78rem] leading-relaxed text-white/45 sm:text-[0.82rem]">
                        Landscaping, nursery and supply sit in one house - so nothing is
                        handed off and nothing gets lost between them.
                    </p>
                </div>

                {/* divider */}
                <div className="my-5 h-px w-full bg-white/15 sm:my-10 lg:my-12" />

                {/* items */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-0">
                    {BENEFITS.map((item) => (
                        <div
                            key={item.num}
                            className="relative lg:px-8 [&:first-child]:lg:pl-0 [&:not(:last-child)]:lg:border-r [&:not(:last-child)]:lg:border-white/10"
                        >
                            <div className="mb-3 flex items-center justify-between sm:mb-6">
                                <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] sm:size-11">
                                    <item.Icon className="size-4 text-[var(--brand-lime)] sm:size-[18px]" strokeWidth={1.6} />
                                </span>
                                <span className="text-[0.72rem] font-medium text-white/30 sm:text-[0.8rem]">[{item.num}]</span>
                            </div>
                            <h3 className="text-[0.9rem] font-medium tracking-[-0.01em] text-white sm:text-[1.05rem]">{item.title}</h3>
                            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-white/45 sm:mt-2.5 sm:text-[0.82rem]">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-6 flex justify-center sm:mt-12 lg:mt-14">
                    <LimeArrowButton href={WEBSITE_SHOP}>Browse the Catalogue</LimeArrowButton>
                </div>
            </div>
        </section>
    )
}

export default BenefitsSection
