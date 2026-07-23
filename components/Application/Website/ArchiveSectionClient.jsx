'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './CategoryArchiveSection.module.css'

// Generic "archive" list used by both the homepage Categories section and the
// Shop-by-Colour section. The markup / CSS behaviour is identical; only the
// heading copy, column labels and row data differ.
//
// Props:
//   title     — section heading
//   writeup   — intro paragraph
//   columns   — { name, meta, secondary } header labels
//   items     — [{ id, href, name, metaLabel, secondaryLabel, previewImage }]
const ArchiveSectionClient = ({ title, writeup, columns, items = [] }) => {
    const [previewSrc, setPreviewSrc] = useState(null)
    const rowRefs = useRef([])

    const showPreview = (src) => { if (src) setPreviewSrc(src) }
    const hidePreview = () => setPreviewSrc(null)

    // Touch / no-hover devices have no mouseenter — reveal the preview as
    // each row scrolls through the viewport's center band instead, mirroring
    // the desktop hover behaviour.
    useEffect(() => {
        if (typeof window === 'undefined') return
        if (!window.matchMedia('(hover: none), (pointer: coarse)').matches) return

        const rows = rowRefs.current.filter(Boolean)
        if (!rows.length) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    const index = rows.indexOf(entry.target)
                    const previewImage = items[index]?.previewImage
                    if (previewImage) setPreviewSrc(previewImage)
                })
            },
            { threshold: 0.5 }
        )

        rows.forEach((row) => observer.observe(row))
        return () => observer.disconnect()
    }, [items])

    return (
        <section className={styles.section}>
            <div className={styles.archivePage}>
                <div className={styles.archive}>
                    {(title || writeup) && (
                        <div className={styles.copyBlock}>
                            <span className="eyebrow mb-3 flex items-center gap-2">
                                <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                                Browse the Archive
                            </span>
                            {title && <h2 className={styles.title}>{title}</h2>}
                            {writeup && <p className={styles.writeup}>{writeup}</p>}
                        </div>
                    )}

                    <div className={styles.header}>
                        <div className={styles.headerName}>
                            <div className={styles.revealer}>
                                <p className={styles.headerText}>{columns.name}</p>
                            </div>
                        </div>
                        <div className={styles.headerDesigner}>
                            <div className={styles.revealer}>
                                <p className={styles.headerText}>{columns.meta}</p>
                            </div>
                        </div>
                        <div className={styles.headerYear}>
                            <div className={styles.revealer}>
                                <p className={styles.headerText}>{columns.secondary}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.archiveItems} onMouseLeave={hidePreview}>
                        {items.map((item, i) => (
                            <Link
                                href={item.href}
                                className={styles.item}
                                key={item.id}
                                ref={(el) => { rowRefs.current[i] = el }}
                                onMouseEnter={() => showPreview(item.previewImage)}
                                onFocus={() => showPreview(item.previewImage)}
                            >
                                <div className={styles.itemName}>
                                    <div className={styles.revealer}>
                                        <p className={styles.itemText}>{item.name}</p>
                                    </div>
                                </div>
                                <div className={styles.itemDesigner}>
                                    <div className={styles.revealer}>
                                        <p className={styles.metaText}>{item.metaLabel}</p>
                                    </div>
                                </div>
                                <div className={styles.itemYear}>
                                    <div className={styles.revealer}>
                                        <p className={styles.yearText}>{item.secondaryLabel}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>


                </div>
                <div className={styles.emptyCol}></div>
            </div>
            <div className={styles.preview} aria-hidden="true">
                <img
                    src={previewSrc || undefined}
                    alt=""
                    className={`${styles.previewImage} ${previewSrc ? styles.previewVisible : ''}`}
                />
            </div>
        </section>
    )
}

export default ArchiveSectionClient
