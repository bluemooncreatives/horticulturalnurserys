'use client'

import Link from 'next/link'
import { Ruler, Sprout, Store, CalendarCheck, ArrowUpRight } from 'lucide-react'

import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const BENEFITS = [
    { num: '01', Icon: Ruler, title: 'Survey & Design', description: 'Qualified horticulturists read your site — light, soil, drainage — before a single plant is chosen.' },
    { num: '02', Icon: Sprout, title: 'Grown, Not Traded', description: 'Stock comes off our own farm at Bibirhut, hardened under shade and ready to establish.' },
    { num: '03', Icon: Store, title: 'Everything One Roof', description: 'Plants, manure, pots, implements, pebbles and roof-garden materials from a single counter.' },
    { num: '04', Icon: CalendarCheck, title: 'Season Maintenance', description: 'Pruning, feeding, pest control and replanting on a schedule, so a garden holds its first-year look.' },
]

const BenefitsSection = () => {
    return (
        <section className="lumora-shell pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="dark-panel relative overflow-hidden p-8 lg:p-14">

                {/* watermark */}
                <div aria-hidden className="pointer-events-none absolute -right-6 -top-10 select-none font-wordmark text-[16rem] leading-none text-white/[0.03] lg:text-[22rem]">
                    ✦
                </div>

                {/* header */}
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="eyebrow flex items-center gap-2 text-white/50">
                            <span aria-hidden className="h-px w-6 bg-current opacity-50" />
                            How We Work
                        </span>
                        <h2 className="mt-3 max-w-xl text-[clamp(1.7rem,3.6vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
                            From First Survey To Season After Season
                        </h2>
                    </div>
                    <p className="max-w-xs text-[0.82rem] leading-relaxed text-white/45">
                        Landscaping, nursery and supply sit in one house — so nothing is
                        handed off and nothing gets lost between them.
                    </p>
                </div>

                {/* divider */}
                <div className="my-10 h-px w-full bg-white/15 lg:my-12" />

                {/* items */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                    {BENEFITS.map((item) => (
                        <div
                            key={item.num}
                            className="relative lg:px-8 [&:first-child]:lg:pl-0 [&:not(:last-child)]:lg:border-r [&:not(:last-child)]:lg:border-white/10"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <span className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                                    <item.Icon className="size-[18px] text-[var(--brand-lime)]" strokeWidth={1.6} />
                                </span>
                                <span className="text-[0.7rem] font-medium tracking-[0.2em] text-white/30">[{item.num}]</span>
                            </div>
                            <h3 className="text-[1.05rem] font-medium tracking-[-0.01em] text-white">{item.title}</h3>
                            <p className="mt-2.5 text-[0.82rem] leading-relaxed text-white/45">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-center lg:mt-14">
                    <Link href={WEBSITE_SHOP} className="pill pill-lime group">
                        Browse the Catalogue
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BenefitsSection
