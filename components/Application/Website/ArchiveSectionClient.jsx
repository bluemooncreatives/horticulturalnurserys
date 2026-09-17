'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import styles from './CategoryArchiveSection.module.css'
import LimeArrowButton from '@/components/Application/Website/LimeArrowButton'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { WHOLESALE_WHATSAPP_URL } from '@/lib/companyInfo'

/**
 * Circular Infinite Auto-Scrolling Carousel Archive Section.
 * Renders circular parent category badges in a smooth, continuous Left-to-Right marquee.
 *
 * Props:
 *   title    - section heading (e.g. "Categories")
 *   writeup  - primary intro paragraph ("Plants, pots, manure and garden implements, grouped the way a gardener actually shops.")
 *   subtitle - secondary guidance line ("Not sure what suits your light or space? Our counter staff will help you narrow it down.")
 *   items    - [{ id, href, name, previewImage, alt, productCount, slug }]
 */
const ArchiveSectionClient = ({ title, writeup, subtitle, items = [] }) => {
    if (!items || items.length === 0) return null

    // Ensure there are enough items for a seamless 50% loop across wide/4K displays
    const baseItems = items.length < 12
        ? [...items, ...items, ...(items.length < 6 ? items : [])]
        : items

    // Duplicate baseItems into two identical halves for pure 0% -> -50% (or -50% -> 0%) seamless translation
    const trackItems = [...baseItems, ...baseItems]

    return (
        <section className={styles.section} aria-label={title || 'Categories'}>
            {/* ── Centralized Header Copy Block with Ample Padding ── */}
            {(title || writeup || subtitle) && (
                <div className={styles.copyContainer}>
                    <div className={styles.copyBlock}>
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {writeup && <p className={styles.writeup}>{writeup}</p>}
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                </div>
            )}

            {/* ── Infinite Auto-Scrolling Marquee Wrapper (Left to Right) ── */}
            <div className={styles.marqueeWrapper}>
                {/* Soft Edge Fade Gradients */}
                <div className={`${styles.edgeGradient} ${styles.edgeLeft}`} aria-hidden="true" />
                <div className={`${styles.edgeGradient} ${styles.edgeRight}`} aria-hidden="true" />

                {/* Continuously Moving Track */}
                <div className={styles.marqueeTrack}>
                    {trackItems.map((item, index) => {
                        const itemKey = `${item.id || item.slug || 'cat'}-${index}`
                        return (
                            <div key={itemKey} className={styles.slideItem}>
                                <Link
                                    href={item.href}
                                    className={styles.itemLink}
                                    title={item.name}
                                >
                                    <span className={styles.itemCircle}>
                                        <span className={styles.itemImageWrap}>
                                            <Image
                                                src={item.previewImage || imgPlaceholder.src}
                                                alt={item.alt || item.name}
                                                fill
                                                sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px"
                                                className={styles.itemImage}
                                                priority={index < 8}
                                            />
                                        </span>
                                    </span>
                                    <span className={styles.itemName}>
                                        {item.name}
                                    </span>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Section CTA ──
                The marquee routes to one category at a time; these two give the
                visitor who does not see their category an onward move - the full
                catalogue, or a person to ask. Without them this section had no
                action of its own at all. */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 px-(--website-gutter) sm:mt-10 sm:flex-row sm:gap-4">
                <LimeArrowButton href={WEBSITE_SHOP}>Shop all categories</LimeArrowButton>
                <a
                    href={WHOLESALE_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--brand-primary)]/25 px-5 cta-text font-medium text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)] hover:bg-[var(--secondary)] sm:h-14 sm:px-7"
                >
                    <MessageCircle className="size-4" strokeWidth={1.8} />
                    Ask our counter staff
                </a>
            </div>
        </section>
    )
}

export default ArchiveSectionClient

