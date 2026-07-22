'use client'

import { useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import './FeaturedProduct.css'
import ShopAllButton from '@/components/Application/Website/ShopAllButton'

gsap.registerPlugin(ScrollTrigger)

const sizePattern = ['lg', 'sm', 'lg', 'sm', 'lg', 'lg', 'lg', 'lg', 'sm']

const FeaturedProductClient = ({ products = [] }) => {
    const containerRef = useRef(null)

    useGSAP(() => {
        if (!products.length || !containerRef.current) return

        const cols = containerRef.current.querySelectorAll('.fp-col')
        const hoverHandlers = []

        // Reveal animation starts when section scrolls into view
        gsap.fromTo(cols, {
            y: 120,
            opacity: 0,
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        }, {
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.12,
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 75%',
                once: true,
            },
        })

        // Hover effects: image scale + title slide
        cols.forEach((col) => {
            const img = col.querySelector('img')
            if (!img) return

            const onEnter = () => {
                gsap.to(img, { scale: 1.25, duration: 2, ease: 'power4.out' })
            }

            const onLeave = () => {
                gsap.to(img, { scale: 1, duration: 2, ease: 'power4.out' })
            }

            col.addEventListener('mouseenter', onEnter)
            col.addEventListener('mouseleave', onLeave)
            hoverHandlers.push({ col, onEnter, onLeave })
        })

        return () => {
            hoverHandlers.forEach(({ col, onEnter, onLeave }) => {
                col.removeEventListener('mouseenter', onEnter)
                col.removeEventListener('mouseleave', onLeave)
            })
        }
    }, { scope: containerRef, dependencies: [products.length] })

    // Build rows of 3 products
    const renderProductRows = useCallback(() => {
        const rows = []
        for (let i = 0; i < products.length; i += 3) {
            const rowProducts = products.slice(i, i + 3)
            rows.push(
                <div className="fp-row" key={i}>
                    {rowProducts.map((product, index) => {
                        const size = sizePattern[(i + index) % sizePattern.length]
                        return (
                            <div className={`fp-col ${size}`} key={product._id}>
                                <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)} aria-label={`View ${product?.name}`}>
                                    <Image
                                        src={product?.media?.[0]?.secure_url || imgPlaceholder.src}
                                        fill
                                        alt={product?.name || 'Product'}
                                        className="object-cover object-center"
                                        sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                                    />
                                    <span className="fp-tag">Featured</span>
                                    <span className="fp-arrow">
                                        <ArrowUpRight size={18} strokeWidth={2} />
                                    </span>
                                    <div className="fp-project-title">
                                        <h3>{product?.name}</h3>
                                        <span>₹{product?.sellingPrice?.toLocaleString('en-IN')}</span>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return rows
    }, [products])

    if (!products.length) {
        return (
            <section className="fp-section bg-background">
                <div className="fp-container">
                    <div className="text-center py-12 text-gray-400">
                        No featured products available
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="fp-section bg-background" ref={containerRef}>
            <div className="fp-container">
                <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="eyebrow flex items-center gap-2">
                            <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                            Selected Stock
                        </span>
                        <h2 className="mt-3 text-[clamp(1.7rem,4.2vw,3rem)] font-medium tracking-[-0.02em] text-[var(--brand-primary)]">
                            In Season Right Now
                        </h2>
                    </div>
                    <p className="max-w-xs text-[0.85rem] leading-relaxed text-[var(--muted-foreground)]">
                        What is ready at the farm and moving fastest off the Alipore counter.
                    </p>
                </div>
                {renderProductRows()}
                <div className="fp-actions">
                    <ShopAllButton colorScheme="dark-red" radius="full" />
                </div>
            </div>
        </section>
    )
}

export default FeaturedProductClient
