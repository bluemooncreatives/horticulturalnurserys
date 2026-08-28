'use client'

import Image from 'next/image'
import Link from 'next/link'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import styles from './CategoryArchiveSection.module.css'

// Generic circular-avatar archive grid used by the homepage Categories
// section (and any future archive with the same shape: an id/href/name/image).
//
// Props:
//   title    — section heading
//   writeup  — intro paragraph
//   items    — [{ id, href, name, previewImage, alt }]
const ArchiveSectionClient = ({ title, writeup, items = [] }) => {
    return (
        <section className={styles.section}>
            <div className={styles.archivePage}>
                {(title || writeup) && (
                    <div className={styles.copyBlock}>
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {writeup && <p className={styles.writeup}>{writeup}</p>}
                    </div>
                )}

                <div className={styles.archiveItems}>
                    {items.map((item) => (
                        <Link href={item.href} className={styles.item} key={item.id}>
                            <span className={styles.itemCircle}>
                                <span className={styles.itemImageWrap}>
                                    <Image
                                        src={item.previewImage || imgPlaceholder.src}
                                        alt={item.alt || item.name}
                                        fill
                                        sizes="120px"
                                        className={styles.itemImage}
                                    />
                                </span>
                            </span>
                            <span className={styles.itemName}>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ArchiveSectionClient
