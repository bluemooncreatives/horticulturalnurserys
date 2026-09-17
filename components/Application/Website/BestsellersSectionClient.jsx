'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { Check, ShoppingCart, Eye, ChevronLeft, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import { addIntoCart, decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'
import { MAX_CART_QTY } from '@/lib/cartConstants'
import { showToast } from '@/lib/showToast'
import { Button } from '@/components/ui/button'
import useHydrated from '@/hooks/useHydrated'
import styles from './BestsellersSection.module.css'

const BestsellersSectionClient = ({ products = [] }) => {
    const trackRef = useRef(null)

    const dispatch = useDispatch()
    const cartProducts = useSelector((store) => store.cartStore.products)
    // See ProductBox - the in-cart swap must wait for rehydration.
    const hydrated = useHydrated()

    const isInCart = (product) => {
        const variant = product?.defaultVariant
        return hydrated && variant
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
            media: product?.media?.[0]?.secure_url || imgPlaceholder.src,
            qty: 1,
        }))
        showToast('success', 'Added to your enquiry list.')
    }

    const handleCartInc = (e, product) => {
        e.preventDefault()
        e.stopPropagation()
        const variant = product?.defaultVariant
        if (!variant) return
        const cartItem = cartProducts.find((item) => item.productId === product._id && item.variantId === variant._id)
        if (!cartItem || (cartItem.qty || 1) >= MAX_CART_QTY) return
        dispatch(increaseQuantity({ productId: product._id, variantId: variant._id }))
    }

    const handleCartDec = (e, product) => {
        e.preventDefault()
        e.stopPropagation()
        const variant = product?.defaultVariant
        if (!variant) return
        const cartItem = cartProducts.find((item) => item.productId === product._id && item.variantId === variant._id)
        if (!cartItem) return
        if ((cartItem.qty || 1) <= 1) {
            dispatch(removeFromCart({ productId: product._id, variantId: variant._id }))
            showToast('success', 'Removed from your enquiry list.')
            return
        }
        dispatch(decreaseQuantity({ productId: product._id, variantId: variant._id }))
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
                        const cartItem = hydrated && product?.defaultVariant
                            ? cartProducts.find((item) => item.productId === product._id && item.variantId === product.defaultVariant._id)
                            : null
                        const cartQty = cartItem?.qty || 1

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
                                            <>
                                                <div
                                                    className="inline-flex h-8 shrink-0 items-center justify-between rounded-lg border border-border/70 bg-background/95 px-1 shadow-xs backdrop-blur-xs sm:h-9"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                                                >
                                                    <button
                                                        type="button"
                                                        aria-label={cartQty <= 1 ? 'Remove from enquiry list' : 'Decrease quantity'}
                                                        onClick={(e) => handleCartDec(e, product)}
                                                        className="flex size-6 items-center justify-center rounded-md text-foreground/70 transition hover:bg-muted hover:text-foreground sm:size-7 cursor-pointer"
                                                    >
                                                        {cartQty <= 1 ? <Trash2 className="size-3 text-[var(--dark-red)]" /> : <Minus className="size-3" />}
                                                    </button>
                                                    <span className="min-w-5 select-none px-1 text-center font-neue text-[11px] font-bold tabular-nums text-foreground sm:text-xs">
                                                        {cartQty}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label="Increase quantity"
                                                        disabled={cartQty >= MAX_CART_QTY}
                                                        onClick={(e) => handleCartInc(e, product)}
                                                        className="flex size-6 items-center justify-center rounded-md text-foreground/70 transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:size-7 cursor-pointer"
                                                    >
                                                        <Plus className="size-3" />
                                                    </button>
                                                </div>

                                                <Button
                                                    asChild
                                                    variant="brand"
                                                    size="pill"
                                                    className="h-8 min-w-0 flex-1 gap-1 rounded-lg px-2 text-[0.64rem] uppercase tracking-wide sm:h-9 sm:gap-1.5 sm:px-3 sm:text-[0.7rem]"
                                                >
                                                    <Link href={WEBSITE_CART} aria-label="Go to cart" onClick={(e) => e.stopPropagation()}>
                                                        <Check size={14} strokeWidth={2.2} />
                                                        <span className="truncate">Added</span>
                                                    </Link>
                                                </Button>
                                            </>
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
