'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import styles from './CategoryArchiveSection.module.css'

/**
 * Circular Carousel Archive Section.
 * Renders circular parent category items in a smooth, responsive carousel.
 *
 * Props:
 *   title    - section heading (e.g. "Categories")
 *   writeup  - primary intro paragraph
 *   subtitle - secondary guidance line
 *   items    - [{ id, href, name, previewImage, alt, productCount }]
 */
const ArchiveSectionClient = ({ title, writeup, subtitle, items = [] }) => {
    const scrollContainerRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollStartLeft, setScrollStartLeft] = useState(0)
    const dragDistanceRef = useRef(0)
    const [activeIndex, setActiveIndex] = useState(0)

    const updateScrollState = useCallback(() => {
        const el = scrollContainerRef.current
        if (!el) return

        const maxScroll = el.scrollWidth - el.clientWidth
        setCanScrollLeft(el.scrollLeft > 8)
        setCanScrollRight(el.scrollLeft < maxScroll - 8)

        // Approximate active dot index
        if (maxScroll > 0) {
            const progress = el.scrollLeft / maxScroll
            const totalDots = Math.min(items.length, 6)
            setActiveIndex(Math.min(Math.round(progress * (totalDots - 1)), totalDots - 1))
        }
    }, [items.length])

    useEffect(() => {
        const el = scrollContainerRef.current
        if (!el) return

        updateScrollState()
        const handleResize = () => updateScrollState()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [updateScrollState, items])

    const scrollByAmount = (direction) => {
        const el = scrollContainerRef.current
        if (!el) return
        // Scroll roughly 2.5 items or 60% container width
        const scrollOffset = Math.max(el.clientWidth * 0.6, 260) * direction
        el.scrollBy({ left: scrollOffset, behavior: 'smooth' })
    }

    // Mouse drag-to-scroll handlers
    const handleMouseDown = (e) => {
        const el = scrollContainerRef.current
        if (!el) return
        setIsMouseDown(true)
        setStartX(e.pageX - el.offsetLeft)
        setScrollStartLeft(el.scrollLeft)
        dragDistanceRef.current = 0
    }

    const handleMouseMove = (e) => {
        if (!isMouseDown) return
        const el = scrollContainerRef.current
        if (!el) return
        e.preventDefault()
        const currentX = e.pageX - el.offsetLeft
        const walk = currentX - startX
        dragDistanceRef.current = Math.abs(walk)
        el.scrollLeft = scrollStartLeft - walk
    }

    const handleMouseUpOrLeave = () => {
        setIsMouseDown(false)
    }

    const totalDots = Math.min(items.length, 6)

    return (
        <section className={styles.section} aria-label={title || 'Categories'}>
            <div className={styles.archivePage}>
                {(title || writeup || subtitle) && (
                    <div className={styles.copyBlock}>
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {writeup && <p className={styles.writeup}>{writeup}</p>}
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                )}

                <div className={styles.carouselOuter}>
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={() => scrollByAmount(-1)}
                        disabled={!canScrollLeft}
                        aria-label="Scroll previous categories"
                        className={`${styles.carouselNavBtn} ${styles.prevBtn}`}
                    >
                        <ChevronLeft className="size-5 sm:size-6" />
                    </button>

                    {/* Left & Right edge gradient fades */}
                    <div
                        className={`${styles.edgeGradient} ${styles.edgeLeft} ${
                            canScrollLeft ? styles.edgeVisible : ''
                        }`}
                        aria-hidden="true"
                    />
                    <div
                        className={`${styles.edgeGradient} ${styles.edgeRight} ${
                            canScrollRight ? styles.edgeVisible : ''
                        }`}
                        aria-hidden="true"
                    />

                    {/* Scrollable Track */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={updateScrollState}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUpOrLeave}
                        onMouseLeave={handleMouseUpOrLeave}
                        className={`${styles.carouselTrack} ${
                            isMouseDown ? styles.trackDragging : ''
                        }`}
                        role="region"
                        aria-label="Parent categories carousel"
                        tabIndex={0}
                    >
                        {items.map((item, idx) => (
                            <div key={item.id || idx} className={styles.carouselSlide}>
                                <Link
                                    href={item.href}
                                    draggable={false}
                                    onClick={(e) => {
                                        // If user dragged more than 6px, prevent accidental navigation
                                        if (dragDistanceRef.current > 6) {
                                            e.preventDefault()
                                        }
                                    }}
                                    className={styles.item}
                                >
                                    <span className={styles.itemCircle}>
                                        <span className={styles.itemImageWrap}>
                                            <Image
                                                src={item.previewImage || imgPlaceholder.src}
                                                alt={item.alt || item.name}
                                                fill
                                                sizes="(max-width: 640px) 110px, 140px"
                                                className={styles.itemImage}
                                                priority={idx < 5}
                                            />
                                        </span>
                                    </span>
                                    <span className={styles.itemName} title={item.name}>
                                        {item.name}
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        type="button"
                        onClick={() => scrollByAmount(1)}
                        disabled={!canScrollRight}
                        aria-label="Scroll next categories"
                        className={`${styles.carouselNavBtn} ${styles.nextBtn}`}
                    >
                        <ChevronRight className="size-5 sm:size-6" />
                    </button>
                </div>

                {/* Subtle Pagination Indicators */}
                {totalDots > 1 && (
                    <div className={styles.indicatorsWrap} aria-hidden="true">
                        {Array.from({ length: totalDots }).map((_, i) => (
                            <span
                                key={i}
                                className={`${styles.indicatorDot} ${
                                    i === activeIndex ? styles.indicatorActive : ''
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default ArchiveSectionClient
