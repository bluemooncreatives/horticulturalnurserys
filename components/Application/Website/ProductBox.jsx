'use client'

import Image from 'next/image'
import { memo, useState } from 'react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import { Check, ChevronLeft, ChevronRight, Crown, Eye, ShoppingCart, Sparkles } from 'lucide-react'
import { addIntoCart } from '@/store/reducer/cartReducer'
import { showToast } from '@/lib/showToast'
import { Button } from '@/components/ui/button'

/*
 * Storefront product card.
 *
 * Matches the homepage Bestsellers card: a bare 4:5 image with the name
 * underneath (no white card chrome), and the actions revealed on the image
 * itself - a filled "Add to Cart" pill plus an outlined view button. They sit
 * hidden until hover on pointer devices and stay visible on touch, where
 * there is no hover to reveal them.
 *
 * Keeps two things Bestsellers does not need: the bestseller/new badges, and
 * the multi-image arrows for products with more than one photo.
 */
const ProductBox = ({ product, priority = false }) => {
    const dispatch = useDispatch()
    const cartProducts = useSelector((store) => store.cartStore.products)

    const variant = product?.defaultVariant
    const isInCart = variant
        ? cartProducts.some((item) => item.productId === product._id && item.variantId === variant._id)
        : false

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

    // Rendered twice - overlaid on the image at sm+, in flow beneath it on
    // mobile - so they are defined once here.
    const CartButton = ({ className, label }) => (
        isInCart ? (
            <Button asChild variant="brand" size="pill" className={className}>
                <Link href={WEBSITE_CART} aria-label="Go to enquiry list">
                    <Check size={15} strokeWidth={2} />
                    {label && 'Added'}
                </Link>
            </Button>
        ) : (
            <Button
                type="button"
                variant="brand"
                size="pill"
                className={className}
                onClick={handleAddToCart}
                disabled={!variant}
                aria-label={`Add ${product?.name} to enquiry list`}
            >
                <ShoppingCart size={15} strokeWidth={1.8} />
                {label}
            </Button>
        )
    )

    const ViewButton = ({ className }) => (
        <Button asChild variant="brand-outline" size="icon" className={className}>
            <Link href={href} aria-label={`View ${product?.name}`}>
                <Eye size={16} strokeWidth={1.8} />
            </Link>
        </Button>
    )

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
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-[0.7rem]">
                            <Crown className="size-2.5 sm:size-3" />
                            Best Seller
                        </span>
                    )}
                    {product?.isFreshlyArrived && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-lime)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase text-[var(--brand-lime-ink)] shadow-sm sm:px-2.5 sm:py-1 sm:text-[0.7rem]">
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
                    className={`absolute inset-x-2.5 z-20 hidden items-center gap-2 opacity-0 transition-[opacity,transform] duration-200 translate-y-1.5 group-hover:translate-y-0 group-hover:opacity-100 sm:flex ${showArrows ? 'bottom-7' : 'bottom-2.5'}`}
                >
                    <CartButton className="h-9 min-w-0 flex-1 gap-1.5 rounded-lg px-4 text-[0.72rem] uppercase tracking-wide" label="Add to Cart" />
                    <ViewButton className="size-9 shrink-0 rounded-lg bg-white" />
                </div>
            </div>

            {/* Mobile: actions sit under the image and above the name, where
                they never cover the product. */}
            <div className="mt-2 flex items-center gap-2 sm:hidden">
                <CartButton className="h-9 min-w-0 flex-1 gap-1.5 rounded-lg px-3 text-[0.64rem] uppercase tracking-wide" label="Add" />
                <ViewButton className="size-9 shrink-0 rounded-lg bg-white" />
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
