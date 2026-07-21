'use client'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Clock, Instagram, MessageCircle, Facebook, Twitter, ArrowUp } from 'lucide-react'

import { WEBSITE_HOME, WEBSITE_SHOP } from '@/routes/WebsiteRoute'

gsap.registerPlugin(ScrollTrigger)

const CONTACT_EMAIL = 'momstitched.official@gmail.com'

const fallbackCategoryLinks = [{ label: 'All Products', href: WEBSITE_SHOP }]

const navigationLinks = [
    { label: 'Home', href: WEBSITE_HOME },
    { label: 'Shop', href: WEBSITE_SHOP },
    { label: 'About', href: '/about-us' },
    { label: 'Contact', href: '/contact' },
]

const helpLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Contact', href: '/contact' },
]

const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/mom.stitched/', Icon: Instagram },
    { label: 'WhatsApp', href: 'https://wa.me/918569874589', Icon: MessageCircle },
    { label: 'Facebook', href: 'https://www.facebook.com/people/momstitched/100087738263074/', Icon: Facebook },
    { label: 'X (Twitter)', href: 'https://twitter.com/momstitched', Icon: Twitter },
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
    const rootRef = useRef(null)
    const categories = categoryLinks.length ? categoryLinks : fallbackCategoryLinks

    useGSAP(() => {
        gsap.from('.footer-word', {
            autoAlpha: 0, y: 40, duration: 1, ease: 'power4.out',
            scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
        })
        gsap.from('.footer-col', {
            autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: '.footer-cols', start: 'top 92%', once: true },
        })
    }, { scope: rootRef })

    const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer ref={rootRef} className="website-gutter pt-6 pb-4" aria-label="Site footer">
            <div className="dark-panel relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">

                {/* ── Top: wordmark + copyright mark ── */}
                <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
                    <h2 className="footer-word font-wordmark text-white text-[clamp(2.75rem,11vw,7rem)] leading-[0.82]">
                        MomStitched
                        <sup className="ml-[0.05em] align-top text-[0.26em] font-normal opacity-70">°</sup>
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
                            For women ready to feel quietly unforgettable in what they wear.
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
                                    aria-label={`MomStitched on ${label}`}
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
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-10">
                        <div>
                            <p className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-white/35">
                                <Phone className="size-3.5" /> Phone
                            </p>
                            <Link href="tel:+91-8569874589" className="mt-2 block text-[0.95rem] text-white/70 transition-colors hover:text-[var(--brand-lime)]">
                                +91 85698 74589
                            </Link>
                        </div>
                        <div>
                            <p className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-white/35">
                                <MapPin className="size-3.5" /> Studio
                            </p>
                            <p className="mt-2 text-[0.95rem] text-white/70">Lucknow, India 226001</p>
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
                    <p>© {new Date().getFullYear()} MomStitched. All rights reserved.</p>
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
