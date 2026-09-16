'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { Check, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import { addIntoCart } from '@/store/reducer/cartReducer'
import { showToast } from '@/lib/showToast'
import { Button } from '@/components/ui/button'
import styles from './BestsellersSection.module.css'

const BestsellersSectionClient = ({ products = [] }) => {
    const trackRef = useRef(null)

    const dispatch = useDispatch()
    const cartProducts = useSelector((store) => store.cartStore.products)

    const isInCart = (product) => {
        const variant = product?.defaultVariant
        return variant
            ? cartProducts.some((item) => item.productId === product._id && item.variantId === variant._id)
            : false
    }

    const handleAddToCart = (e, product) => {
        e.preventDefault()
        e.stopPropagation()

        const variant = product?.defaultVariant
        if (!variant) return

        dispatch(addIntoCart({
            productId: product._id,
            variantId: variant._id,
            name: product.name,
            url: product.slug,
            size: variant.size || '',
            color: variant.color,
            mrp: variant.mrp ?? product.mrp,
            sellingPrice: variant.sellingPrice ?? product.sellingPrice,
            media: product?.media?.[0]?.secure_url || imgPlaceholder.src,
            qty: 1,
        }))
        showToast('success', 'Added to your enquiry list.')
    }

    const scroll = (dir) => {
        if (!trackRef.current) return
        const amount = trackRef.current.clientWidth * 0.75
        trackRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
    }

    if (!products.length) return null

    const items = products

    return (
        <section className={styles.section}>
            <div className={styles.inner}>

                {/* ── Left: heading + arrows ── */}
                <div className={styles.sidebar}>
                    <div>
                        <h2 className={styles.heading}>Bestsellers</h2>
                    </div>
                    <div className={styles.navControls}>
                        <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Scroll left">
                            <ChevronLeft size={18} strokeWidth={1.8} />
                        </button>
                        <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Scroll right">
                            <ChevronRight size={18} strokeWidth={1.8} />
                        </button>
                    </div>
                </div>

                {/* ── Right: scrollable product cards ── */}
                <div ref={trackRef} className={styles.track}>
                    {items.map((product, i) => {
                        const href   = product ? WEBSITE_PRODUCT_DETAILS(product.slug) : '#'
                        const imgSrc = product?.media?.[0]?.secure_url || imgPlaceholder
                        const imgAlt = product?.media?.[0]?.alt || product?.name || 'Product'

                        return (
                            <div key={i} className={styles.card}>

                                <div className={styles.imgContainer}>
                                    <Link href={href} className={styles.imgLink} aria-label={product?.name || 'View product'}>
                                        <div className={styles.imgWrapper}>
                                            <Image
                                                src={imgSrc}
                                                alt={imgAlt}
                                                fill
                                                className="object-cover"
                                                sizes="260px"
                                                priority={i === 0}
                                            />
                                        </div>
                                    </Link>

                                    <div className={styles.cardButtons}>
                                        {product && isInCart(product) ? (
                                            <Button
                                                asChild
                                                variant="brand"
                                                size="pill"
                                                className="h-8 min-w-0 flex-1 gap-1 rounded-lg px-2.5 text-[0.64rem] uppercase tracking-wide sm:h-9 sm:gap-1.5 sm:px-4 sm:text-[0.72rem]"
                                            >
                                                <Link href={WEBSITE_CART} aria-label="Go to cart">
                                                    <Check size={15} strokeWidth={2} />
                                                    Added to Cart
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="brand"
                                                size="pill"
                                                className="h-8 min-w-0 flex-1 gap-1 rounded-lg px-2.5 text-[0.64rem] uppercase tracking-wide sm:h-9 sm:gap-1.5 sm:px-4 sm:text-[0.72rem]"
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={!product?.defaultVariant}
                                                aria-label="Add to enquiry list"
                                            >
                                                <ShoppingCart size={15} strokeWidth={1.8} />
                                                Add to Cart
                                            </Button>
                                        )}

                                        <Button
                                            asChild
                                            variant="brand-outline"
                                            size="icon"
                                            className="size-8 shrink-0 rounded-lg bg-white sm:size-9"
                                        >
                                            <Link
                                                href={href}
                                                aria-label={product ? `View ${product.name}` : 'View product'}
                                            >
                                                <Eye size={16} strokeWidth={1.8} className="sm:size-4.25" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <p className={styles.productName}>
                                        {product?.name || 'Product Name'}
                                    </p>
                                </div>

                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}

export default BestsellersSectionClient
