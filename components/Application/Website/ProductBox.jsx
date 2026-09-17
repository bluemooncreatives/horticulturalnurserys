'use client'

import Image from 'next/image'
import { memo, useState } from 'react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import { Check, ChevronLeft, ChevronRight, Crown, Eye, Minus, Plus, ShoppingCart, Sparkles, Trash2 } from 'lucide-react'
import { addIntoCart, decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'
import { MAX_CART_QTY } from '@/lib/cartConstants'
import { showToast } from '@/lib/showToast'
import { Button } from '@/components/ui/button'
import useHydrated from '@/hooks/useHydrated'

/*
 * Storefront product card.
 *
 * Matches the homepage Bestsellers card: a bare 4:5 image with the name
 * underneath (no white card chrome), and the actions revealed on the image
 * itself - a filled "Add to Cart" pill plus an outlined view button. When added,
 * transforms into an interactive counter stepper beside "Added".
 */
const ProductBox = ({ product, priority = false }) => {
    const dispatch = useDispatch()
    const cartProducts = useSelector((store) => store.cartStore.products)
    // The cart is browser-only, so the server always renders "add". Gate the
    // swap to "Added" on hydration or the button markup differs between the two
    // renders and React throws away the card.
    const hydrated = useHydrated()

    const variant = product?.defaultVariant
    const cartItem = hydrated && variant
        ? cartProducts.find((item) => item.productId === product._id && item.variantId === variant._id)
        : null
    const isInCart = Boolean(cartItem)
    const cartQty = cartItem?.qty || 1

    const images = product?.media?.length > 0
        ? product.media
        : [{ secure_url: imgPlaceholder.src, alt: product?.name }]
    const showArrows = images.length > 1
    const [imgIndex, setImgIndex] = useState(0)
    const activeImage = images[imgIndex]

    const href = WEBSITE_PRODUCT_DETAILS(product.slug)

    const slideImage = (e, dir) => {
        e.preventDefault()
        e.stopPropagation()
        setImgIndex((prev) => (prev + dir + images.length) % images.length)
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
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

    const handleCartInc = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!variant || cartQty >= MAX_CART_QTY) return
        dispatch(increaseQuantity({ productId: product._id, variantId: variant._id }))
    }

    const handleCartDec = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!variant) return
        if (cartQty <= 1) {
            dispatch(removeFromCart({ productId: product._id, variantId: variant._id }))
            showToast('success', 'Removed from your enquiry list.')
            return
        }
        dispatch(decreaseQuantity({ productId: product._id, variantId: variant._id }))
    }

    // Rendered twice - overlaid on the image at sm+, in flow beneath it on
    // mobile - so they are defined once here.
    const ActionControls = ({ isMobile = false }) => {
        const btnHeight = isMobile ? 'h-8' : 'h-9'
        const iconSize = isMobile ? 'size-8' : 'size-9'
        const textSize = 'text-[0.75rem]'

        if (isInCart) {
            return (
                <div className={`flex w-full items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                    {/* Stepper beside Added */}
                    <div
                        className={`inline-grid grid-cols-3 ${btnHeight} ${isMobile ? 'min-w-0 flex-1' : 'w-24 shrink-0'} items-center rounded-lg border border-border/70 bg-background/95 shadow-xs backdrop-blur-xs`}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                    >
                        <button
                            type="button"
                            aria-label={cartQty <= 1 ? 'Remove from enquiry list' : 'Decrease quantity'}
                            onClick={handleCartDec}
                            className="flex h-full w-full items-center justify-center text-foreground/70 transition hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                            {cartQty <= 1 ? <Trash2 className="size-3 sm:size-3.5 text-[var(--dark-red)]" /> : <Minus className="size-3 sm:size-3.5" />}
                        </button>
                        <span className="flex h-full w-full select-none items-center justify-center text-center font-neue text-[0.75rem] sm:text-xs font-bold leading-none tabular-nums text-foreground">
                            {cartQty}
                        </span>
                        <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={cartQty >= MAX_CART_QTY}
                            onClick={handleCartInc}
                            className="flex h-full w-full items-center justify-center text-foreground/70 transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            <Plus className="size-3 sm:size-3.5" />
                        </button>
                    </div>

                    {/* Added button */}
                    <Button
                        asChild
                        variant="brand"
                        size={isMobile ? 'icon' : 'pill'}
                        className={
                            isMobile
                                ? `${iconSize} shrink-0 rounded-lg p-0`
                                : `${btnHeight} min-w-0 flex-1 gap-1 rounded-lg px-2 ${textSize} uppercase tracking-wide`
                        }
                    >
                        <Link href={WEBSITE_CART} aria-label="Go to enquiry list" title="View Enquiry List" onClick={(e) => e.stopPropagation()}>
                            <Check size={14} strokeWidth={2.2} />
                            {!isMobile && <span className="truncate">Added</span>}
                        </Link>
                    </Button>

                    {/* View details */}
                    <Button asChild variant="brand-outline" size="icon" className={`${iconSize} shrink-0 rounded-lg bg-white`}>
                        <Link href={href} aria-label={`View ${product?.name}`} title="View Details" onClick={(e) => e.stopPropagation()}>
                            <Eye size={isMobile ? 14 : 16} strokeWidth={1.8} />
                        </Link>
                    </Button>
                </div>
            )
        }

        return (
            <div className={`flex w-full items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                <Button
                    type="button"
                    variant="brand"
                    size="pill"
                    className={`${btnHeight} min-w-0 flex-1 gap-1.5 rounded-lg ${isMobile ? 'px-2.5' : 'px-4'} text-[0.75rem] uppercase tracking-wide`}
                    onClick={handleAddToCart}
                    disabled={!variant}
                    aria-label={`Add ${product?.name} to enquiry list`}
                >
                    <ShoppingCart size={isMobile ? 13 : 15} strokeWidth={1.8} />
                    <span>{isMobile ? 'Add' : 'Add to Cart'}</span>
                </Button>

                <Button asChild variant="brand-outline" size="icon" className={`${iconSize} shrink-0 rounded-lg bg-white`}>
                    <Link href={href} aria-label={`View ${product?.name}`} onClick={(e) => e.stopPropagation()}>
                        <Eye size={isMobile ? 14 : 16} strokeWidth={1.8} />
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="group relative flex flex-col">

            <div className="relative w-full">
                <Link href={href} aria-label={`View ${product?.name}`} className="block">
                    <div className="relative aspect-4/5 w-full overflow-hidden rounded-[var(--radius-3xl)] bg-[var(--product-card-bg)]">
                        <Image
                            src={activeImage?.secure_url || imgPlaceholder.src}
                            alt={activeImage?.alt || product?.name}
                            title={activeImage?.title || product?.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            priority={priority}
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.07]"
                        />
                    </div>
                </Link>

                {/* Badges - top-left, stacked */}
                <div className="absolute left-2.5 top-2.5 z-20 flex flex-col items-start gap-1.5">
                    {product?.isBestseller && (
                        <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--brand-primary)] px-2 py-0.5 text-[0.75rem] font-semibold uppercase text-white shadow-sm sm:px-2.5 sm:py-1">
                            <Crown className="size-2.5 sm:size-3" />
                            Best Seller
                        </span>
                    )}
                    {product?.isFreshlyArrived && (
                        <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--brand-lime)] px-2 py-0.5 text-[0.75rem] font-semibold uppercase text-[var(--brand-lime-ink)] shadow-sm sm:px-2.5 sm:py-1">
                            <Sparkles className="size-2.5 sm:size-3" />
                            New
                        </span>
                    )}
                </div>

                {showArrows && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous image"
                            onClick={(e) => slideImage(e, -1)}
                            className="absolute left-2 top-1/2 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/85 text-[var(--brand-primary)]/70 shadow-sm backdrop-blur-sm transition duration-200 hover:bg-background hover:text-[var(--brand-primary)] sm:size-8 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <ChevronLeft className="size-3.5 sm:size-4" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next image"
                            onClick={(e) => slideImage(e, 1)}
                            className="absolute right-2 top-1/2 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/85 text-[var(--brand-primary)]/70 shadow-sm backdrop-blur-sm transition duration-200 hover:bg-background hover:text-[var(--brand-primary)] sm:size-8 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <ChevronRight className="size-3.5 sm:size-4" />
                        </button>

                        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1.5">
                            {images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`size-1.5 rounded-full transition-colors ${index === imgIndex ? 'bg-[var(--brand-primary)]' : 'bg-background/70'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Desktop: actions overlaid on the image, revealed on hover.
                    Below sm they move out of the image entirely - see the
                    in-flow row under it. */}
                <div
                    className={`absolute inset-x-2.5 z-20 hidden items-center opacity-0 transition-[opacity,transform] duration-200 translate-y-1.5 group-hover:translate-y-0 group-hover:opacity-100 sm:flex ${showArrows ? 'bottom-7' : 'bottom-2.5'}`}
                >
                    <ActionControls isMobile={false} />
                </div>
            </div>

            {/* Mobile: actions sit under the image and above the name, where
                they never cover the product. */}
            <div className="mt-2 flex items-center sm:hidden">
                <ActionControls isMobile={true} />
            </div>

            <Link href={href} className="block pt-2.5 font-neue">
                <p
                    title={product?.name}
                    className="line-clamp-2 text-[clamp(0.92rem,1.05vw,1.05rem)] font-medium leading-[1.35] text-[var(--brand-ink-soft)] transition-colors group-hover:text-[var(--brand-primary)]"
                >
                    {product?.name}
                </p>
            </Link>
        </div>
    )
}

export default memo(ProductBox)
