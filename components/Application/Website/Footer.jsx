'use client'

import Link from 'next/link'
import { MapPin, Phone, Clock, Sprout, Instagram, MessageCircle, Facebook, ArrowUp, Truck } from 'lucide-react'

import {
    WEBSITE_HOME,
    WEBSITE_SHOP,
    WEBSITE_SHOP_PLANTS,
    WEBSITE_SHOP_POTS,
    WEBSITE_SERVICES,
    WEBSITE_SERVICES_LANDSCAPE,
    WEBSITE_SERVICES_MAINTENANCE,
    WEBSITE_SERVICES_ROOF_GARDEN,
    WEBSITE_SERVICES_VERTICAL_GARDEN,
} from '@/routes/WebsiteRoute'
import { TRANSPORT_MODES, WHOLESALE_WHATSAPP_URL } from '@/lib/companyInfo'

const CONTACT_EMAIL = 'horticulturaldc@gmail.com'

// Shown when the category lookup returns nothing (empty catalogue / DB hiccup),
// so the column never renders as a bare heading.
const FALLBACK_CATEGORY_LINKS = [{ label: 'Full Catalogue', href: WEBSITE_SHOP }]

const shopLinks = [
    { label: 'All Products', href: WEBSITE_SHOP },
    { label: 'Plants', href: WEBSITE_SHOP_PLANTS },
    { label: 'Pots & Planters', href: WEBSITE_SHOP_POTS },
]

const serviceLinks = [
    { label: 'All Services', href: WEBSITE_SERVICES },
    { label: 'Landscape Development', href: WEBSITE_SERVICES_LANDSCAPE },
    { label: 'Garden Maintenance', href: WEBSITE_SERVICES_MAINTENANCE },
    { label: 'Roof Garden Design', href: WEBSITE_SERVICES_ROOF_GARDEN },
    { label: 'Vertical Garden Systems', href: WEBSITE_SERVICES_VERTICAL_GARDEN },
]

const companyLinks = [
    { label: 'Home', href: WEBSITE_HOME },
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]

const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/horticulturaldevelopmentcentre/', Icon: Instagram },
    { label: 'WhatsApp', href: WHOLESALE_WHATSAPP_URL, Icon: MessageCircle },
    { label: 'Facebook', href: 'https://www.facebook.com/horticulturaldevelopmentcentre', Icon: Facebook },
]

const contactItems = [
    {
        Icon: Phone,
        label: 'Phone',
        lines: [
            { text: '(033) 2479-5710', href: 'tel:+913324795710' },
            { text: '+91 90882 75576', href: 'tel:+919088275576' },
        ],
    },
    {
        Icon: MapPin,
        label: 'Sale Counter',
        lines: [{ text: '2/5 Judges Court Road,' }, { text: 'Alipore, Kolkata 700027' }],
    },
    {
        Icon: Sprout,
        label: 'Farm',
        lines: [{ text: 'Bibirhut, Ramdevpur,' }, { text: '24 Parganas (S)' }],
    },
    {
        Icon: Clock,
        label: 'Hours',
        lines: [{ text: 'Mon – Sat' }, { text: '10:00 – 19:00' }],
    },
]

// Small uppercase column heading. Tracking is set explicitly here rather than
// left to `.eyebrow`, which is tuned for the light sections.
const ColumnHeading = ({ children }) => (
    <p className="text-[0.75rem] font-semibold uppercase tracking-normal text-white/40">
        {children}
    </p>
)

const LinkColumn = ({ title, links }) => (
    <div>
        <ColumnHeading>{title}</ColumnHeading>
        <nav aria-label={`${title} links`}>
            <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
                {links.map(({ label, href }) => (
                    <li key={`${title}-${label}`}>
                        <Link
                            href={href}
                            className="inline-block py-0.5 text-[0.875rem] leading-snug tracking-normal text-white/65 transition-colors duration-200 hover:text-[var(--brand-lime)]"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
)

const Footer = ({ categoryLinks = [] }) => {
    const categories = categoryLinks.length ? categoryLinks : FALLBACK_CATEGORY_LINKS

    const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="website-gutter pt-[clamp(1.25rem,2.5vw,2rem)] pb-4" aria-label="Site footer">
            <div className="dark-panel relative overflow-hidden px-5 py-7 sm:px-10 sm:py-12 lg:px-14 lg:py-14">

                {/* ── Wordmark ── */}
                <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:gap-6 sm:pb-8 sm:flex-row sm:items-start sm:justify-between lg:pb-10">
                    <h2 className="font-wordmark leading-[0.9] text-white">
                        <span className="block text-[clamp(2.4rem,10vw,6.4rem)]">Horticultural</span>
                        <span className="block text-[clamp(1.15rem,4.9vw,3.15rem)]">Development Centre</span>
                    </h2>
                    <div className="shrink-0 sm:text-right">
                        <p className="text-[0.8rem] tracking-normal text-white/50">Est. 1989 · Kolkata</p>
                        <span aria-hidden className="mt-3 block h-px w-24 bg-white/25 sm:ml-auto" />
                    </div>
                </div>

                {/* ── Brand block + link columns ──
                    Brand column is widest; the four link columns share the rest
                    evenly so their headings sit on one baseline. */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-6 py-7 sm:gap-x-8 sm:gap-y-9 sm:py-10 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-x-10 lg:gap-y-10 lg:py-12">

                    {/* Brand: blurb, email, social. Full width until the columns
                        get their own track at lg. */}
                    <div className="col-span-2 lg:col-span-1">
                        <p className="max-w-xs text-[0.875rem] leading-normal tracking-normal text-white/55">
                            Designing, growing and maintaining gardens across West Bengal
                            since 1989 - and supplying plants wholesale, all over India.
                        </p>

                        <Link
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="mt-4 inline-block break-all border-b border-white/25 pb-1.5 sm:mt-6 sm:pb-2 text-[clamp(1rem,2.2vw,1.35rem)] font-medium tracking-[-0.01em] text-white transition-colors duration-200 hover:border-[var(--brand-lime)] hover:text-[var(--brand-lime)]"
                        >
                            {CONTACT_EMAIL}
                        </Link>

                        <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
                            {socialLinks.map(({ label, href, Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Horticultural Development Centre on ${label}`}
                                    className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-colors duration-200 hover:border-[var(--brand-lime)] hover:bg-[var(--brand-lime)] hover:text-[var(--brand-lime-ink)]"
                                >
                                    <Icon className="size-[17px]" strokeWidth={1.6} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <LinkColumn title="Shop" links={shopLinks} />
                    <LinkColumn title="Categories" links={categories} />
                    <LinkColumn title="Services" links={serviceLinks} />
                    <LinkColumn title="Company" links={companyLinks} />
                </div>

                {/* ── Contact strip ── */}
                <div className="border-t border-white/10 pt-6 sm:pt-8 lg:pt-10">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-8 sm:gap-y-7 lg:grid-cols-4">
                        {contactItems.map(({ Icon, label, lines }) => (
                            <div key={label}>
                                <p className="flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-normal text-white/35">
                                    <Icon className="size-3.5" strokeWidth={1.7} />
                                    {label}
                                </p>
                                <div className="mt-2.5 space-y-1">
                                    {lines.map(({ text, href }) =>
                                        href ? (
                                            <Link
                                                key={text}
                                                href={href}
                                                className="block text-[0.875rem] leading-snug tracking-normal text-white/65 transition-colors duration-200 hover:text-[var(--brand-lime)]"
                                            >
                                                {text}
                                            </Link>
                                        ) : (
                                            <p key={text} className="text-[0.875rem] leading-snug tracking-normal text-white/65">
                                                {text}
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Wholesale despatch note + back-to-top */}
                    <div className="mt-6 flex items-center justify-between gap-3 rounded-[var(--radius-2xl)] border border-white/10 bg-white/[0.03] px-4 py-3 sm:mt-8 sm:gap-4 sm:px-5 sm:py-4 lg:mt-10">
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] tracking-normal text-white/50">
                            <Truck className="size-4 shrink-0 text-[var(--brand-lime)]" strokeWidth={1.7} />
                            Wholesale despatch all over India
                            <span aria-hidden className="text-white/20">·</span>
                            <span className="text-white/40">{TRANSPORT_MODES.join(' · ')}</span>
                        </p>

                        <button
                            type="button"
                            onClick={toTop}
                            aria-label="Back to top"
                            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:bg-white hover:text-[var(--brand-ink)]"
                        >
                            <ArrowUp className="size-[18px]" strokeWidth={1.8} />
                        </button>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="mt-6 flex flex-col gap-1.5 border-t border-white/10 pt-5 text-[0.8rem] sm:mt-8 sm:gap-2 sm:pt-6 tracking-normal text-white/40 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Horticultural Development Centre. All rights reserved.</p>
                    <p>
                        Crafted by{' '}
                        <Link
                            href="https://www.instagram.com/bluemoon.creatives/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 underline decoration-white/25 underline-offset-2 transition-colors duration-200 hover:text-[var(--brand-lime)]"
                        >
                            Blue Moon Creatives
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
