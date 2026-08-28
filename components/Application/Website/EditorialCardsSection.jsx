'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const CARDS = [
    {
        num: '01',
        heading: 'Our Story',
        description: 'A nursery started in 1990 that grew into a landscaping house — parks, lakes, townships and institutional grounds across West Bengal.',
        cta: 'Read More',
        href: '/about-us',
        image: '/assets/images/hero/01.jpg',
        overlay: 'bg-gradient-to-t from-black/80 via-black/30 to-black/10',
    },
    {
        num: '02',
        heading: 'The Nursery',
        description: 'Ornamental trees, shrubs, indoor and hanging plants, topiary, seasonal flowers, lawn grass, manure, pots and implements.',
        cta: 'Browse Catalogue',
        href: WEBSITE_SHOP,
        image: '/assets/images/hero/01.jpg',
        overlay: 'bg-gradient-to-t from-[var(--dark-red)]/90 via-[var(--dark-red)]/25 to-transparent',
    },
    {
        num: '03',
        heading: 'Plan a Garden',
        description: 'Tell us about the site — terrace, courtyard, campus or township — and our horticulturists will come and see it.',
        cta: 'Request a Site Visit',
        href: '/contact',
        image: '/assets/images/hero/01.jpg',
        overlay: 'bg-gradient-to-t from-black/85 via-black/35 to-black/10',
    },
]

const EditorialCardsSection = () => {
    return (
        <section className="lumora-shell bg-background pt-[clamp(1.25rem,2.5vw,2rem)] pb-[clamp(2rem,4vw,3.5rem)]">

            {/* section header */}
            <div className="mb-4 flex items-end justify-between lg:mb-6">
                <div>
                    <h2 className="text-[clamp(1.7rem,4.2vw,3rem)] font-medium tracking-[-0.02em] text-[var(--brand-primary)]">
                        Three Ways In
                    </h2>
                </div>
                <span className="hidden text-[0.68rem] font-semibold uppercase text-muted-foreground sm:block">
                    Story · Nursery · Site Visit
                </span>
            </div>

            {/* rule */}
            <div className="mb-10 h-px w-full bg-foreground/10 lg:mb-12" />

            {/* cards grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {CARDS.map((card, i) => (
                    <Link
                        key={card.num}
                        href={card.href}
                        className="group relative overflow-hidden rounded-[var(--radius-3xl)]"
                        style={{ aspectRatio: '4/5' }}
                    >
                        {/* background image */}
                        <Image
                            src={card.image}
                            alt={card.heading}
                            fill
                            quality={82}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.07]"
                        />

                        {/* gradient overlay */}
                        <div className={`absolute inset-0 ${card.overlay} transition-opacity duration-500`} />

                        {/* content — bottom anchored */}
                        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">

                            {/* number tag */}
                            <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-white/50">
                                {card.num}
                            </p>

                            {/* heading */}
                            <h3 className="text-[1.55rem] font-medium leading-tight tracking-[-0.01em] text-white lg:text-[1.75rem]">
                                {card.heading}
                            </h3>

                            {/* divider */}
                            <div className="my-3 h-px w-8 bg-[var(--brand-lime)]" />

                            {/* description */}
                            <p className="line-clamp-2 text-[0.8rem] leading-relaxed text-white/70">
                                {card.description}
                            </p>

                            {/* CTA */}
                            <div className="mt-5 inline-flex items-center gap-1.5 text-[0.78rem] font-medium tracking-[-0.01em] text-white/85 transition-colors duration-200 group-hover:text-[var(--brand-lime)]">
                                {card.cta}
                                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default EditorialCardsSection
