'use client'

import Link from 'next/link'
import { MapPin, Phone, Clock, Sprout, Instagram, MessageCircle, Facebook, ArrowUp } from 'lucide-react'

import { WEBSITE_HOME, WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const CONTACT_EMAIL = 'horticulturaldc@gmail.com'

const fallbackCategoryLinks = [{ label: 'Full Catalogue', href: WEBSITE_SHOP }]

const navigationLinks = [
    { label: 'Home', href: WEBSITE_HOME },
    { label: 'Nursery', href: WEBSITE_SHOP },
    { label: 'About', href: '/about-us' },
    { label: 'Contact', href: '/contact' },
]

const helpLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Contact', href: '/contact' },
]

const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/horticulturaldevelopmentcentre/', Icon: Instagram },
    { label: 'WhatsApp', href: 'https://wa.me/919088275576', Icon: MessageCircle },
    { label: 'Facebook', href: 'https://www.facebook.com/horticulturaldevelopmentcentre', Icon: Facebook },
]

const LinkColumn = ({ title, links }) => (
    <div className="footer-col">
        <p className="eyebrow text-white/40">{title}</p>
        <nav aria-label={`${title} links`}>
            <ul className="mt-5 space-y-3">
                {links.map(({ label, href }) => (
                    <li key={`${title}-${label}`}>
                        <Link href={href} className="text-[0.95rem] text-white/70 transition-colors hover:text-[var(--brand-lime)]">
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
)

const Footer = ({ categoryLinks = [] }) => {
    const categories = categoryLinks.length ? categoryLinks : fallbackCategoryLinks

    const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="website-gutter pt-[clamp(1.25rem,2.5vw,2rem)] pb-4" aria-label="Site footer">
            <div className="dark-panel relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">

                {/* ── Top: wordmark + copyright mark ── */}
                <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
                    <h2 className="footer-word font-wordmark text-white leading-[0.84]">
                        <span className="block text-[clamp(2.4rem,10vw,6.4rem)]">Horticultural</span>
                        <span className="block text-[clamp(1.15rem,4.9vw,3.15rem)]">
                            Development Centre
                        </span>
                    </h2>
                    <div className="shrink-0 sm:text-right">
                        <p className="text-sm text-white/55">© 20 — 26°</p>
                        <span aria-hidden className="mt-3 block h-px w-24 bg-white/25 sm:ml-auto" />
                    </div>
                </div>

                {/* ── Middle: caption + email + columns ── */}
                <div className="footer-cols grid gap-x-8 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
                    <div className="footer-col">
                        <p className="max-w-xs text-[0.95rem] leading-relaxed text-white/55">
                            Designing, growing and maintaining gardens across West Bengal since 1989.
                        </p>
                        <Link
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="mt-6 inline-block break-all border-b border-white/25 pb-2 text-[clamp(1.1rem,2.4vw,1.6rem)] font-medium tracking-[-0.01em] text-white transition-colors hover:text-[var(--brand-lime)]"
                        >
                            {CONTACT_EMAIL}
                        </Link>
                    </div>

                    <LinkColumn title="Navigation" links={navigationLinks} />
                    <LinkColumn title="Explore" links={categories} />

                    <div className="footer-col">
                        <p className="eyebrow text-white/40">Social</p>
                        <div className="mt-5 flex flex-wrap gap-2.5">
                            {socialLinks.map(({ label, href, Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Horticultural Development Centre on ${label}`}
                                    className="flex size-11 items-center justify-center rounded-[var(--radius-2xl)] border border-white/15 bg-white/[0.04] text-white/70 transition-colors hover:border-[var(--brand-lime)] hover:text-[var(--brand-lime)]"
                                >
                                    <Icon className="size-[18px]" strokeWidth={1.6} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Contact strip + back-to-top ── */}
                <div className="flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
                        <div>
                            <p className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-white/35">
                                <Phone className="size-3.5" /> Phone
                            </p>
                            <Link href="tel:+913324795710" className="mt-2 block text-[0.95rem] text-white/70 transition-colors hover:text-[var(--brand-lime)]">
                                (033) 2479-5710
                            </Link>
                            <Link href="tel:+919088275576" className="mt-1 block text-[0.95rem] text-white/70 transition-colors hover:text-[var(--brand-lime)]">
                                +91 90882 75576
                            </Link>
                        </div>
                        <div>
                            <p className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-white/35">
                                <MapPin className="size-3.5" /> Sale Counter
                            </p>
                            <p className="mt-2 text-[0.95rem] leading-snug text-white/70">
                                2/5 Judges Court Road,
                                <br />
                                Alipore, Kolkata 700027
                            </p>
                        </div>
                        <div>
                            <p className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-white/35">
                                <Sprout className="size-3.5" /> Farm
                            </p>
                            <p className="mt-2 text-[0.95rem] leading-snug text-white/70">
                                Bibirhut, Ramdevpur,
                                <br />
                                24 Parganas (S)
                            </p>
                        </div>
                        <div>
                            <p className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-white/35">
                                <Clock className="size-3.5" /> Hours
                            </p>
                            <p className="mt-2 text-[0.95rem] text-white/70">Mon – Sat · 10:00 – 19:00</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toTop}
                        aria-label="Back to top"
                        className="icon-round shrink-0 border-white/25 text-white transition-colors hover:bg-white hover:text-[var(--brand-ink)]"
                    >
                        <ArrowUp className="size-5" />
                    </button>
                </div>

                {/* ── Bottom bar ── */}
                <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.8rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Horticultural Development Centre. All rights reserved.</p>
                    <p>
                        Crafted by{' '}
                        <Link
                            href="https://www.instagram.com/bluemoon.creatives/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 underline decoration-white/25 underline-offset-2 transition-colors hover:text-[var(--brand-lime)]"
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
