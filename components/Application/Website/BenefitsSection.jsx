'use client'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import Link from 'next/link'
import { RotateCcw, Truck, Headset, BadgePercent, ArrowUpRight } from 'lucide-react'

import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

gsap.registerPlugin(ScrollTrigger)

const BENEFITS = [
    { num: '01', Icon: RotateCcw, title: '7-Day Returns', description: 'Risk-free shopping with easy, hassle-free returns on every order.' },
    { num: '02', Icon: Truck, title: 'Free Shipping', description: 'No hidden costs — just the price you see at checkout, delivered.' },
    { num: '03', Icon: Headset, title: '24/7 Support', description: 'Our team is always here, ready to help you at any hour of the day.' },
    { num: '04', Icon: BadgePercent, title: 'Member Perks', description: 'Exclusive offers and early access for our most loyal customers.' },
]

const BenefitsSection = () => {
    const sectionRef = useRef(null)
    const headerRef = useRef(null)
    const ruleRef = useRef(null)
    const itemRefs = useRef([])
    const ctaRef = useRef(null)

    useGSAP(() => {
        gsap.fromTo(headerRef.current, { autoAlpha: 0, y: 40 }, {
            autoAlpha: 1, y: 0, duration: 0.9, ease: 'power4.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        })
        gsap.fromTo(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' }, {
            scaleX: 1, duration: 1.2, ease: 'expo.inOut', delay: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        })
        gsap.fromTo(itemRefs.current, { autoAlpha: 0, y: 50 }, {
            autoAlpha: 1, y: 0, duration: 0.95, ease: 'power4.out', stagger: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        })
        gsap.fromTo(ctaRef.current, { autoAlpha: 0, y: 24 }, {
            autoAlpha: 1, y: 0, duration: 0.8, ease: 'power4.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', once: true },
        })
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} className="lumora-shell py-8 lg:py-10">
            <div className="dark-panel relative overflow-hidden p-8 lg:p-14">

                {/* watermark */}
                <div aria-hidden className="pointer-events-none absolute -right-6 -top-10 select-none font-wordmark text-[16rem] leading-none text-white/[0.03] lg:text-[22rem]">
                    ✦
                </div>

                {/* header */}
                <div ref={headerRef} className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="eyebrow flex items-center gap-2 text-white/50">
                            <span aria-hidden className="h-px w-6 bg-current opacity-50" />
                            Our Promise
                        </span>
                        <h2 className="mt-3 max-w-xl text-[clamp(1.7rem,3.6vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
                            Crafted With Care At Every Step
                        </h2>
                    </div>
                    <p className="max-w-xs text-[0.82rem] leading-relaxed text-white/45">
                        Every order is handled with the same devotion we put into the stitch — from cart to doorstep.
                    </p>
                </div>

                {/* divider */}
                <div ref={ruleRef} className="my-10 h-px w-full bg-white/15 lg:my-12" />

                {/* items */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                    {BENEFITS.map((item, i) => (
                        <div
                            key={item.num}
                            ref={(el) => { itemRefs.current[i] = el }}
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
                <div ref={ctaRef} className="mt-12 flex justify-center lg:mt-14">
                    <Link href={WEBSITE_SHOP} className="pill pill-lime group">
                        Shop All Products
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BenefitsSection
