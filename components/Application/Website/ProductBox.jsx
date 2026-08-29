'use client'

import Image from 'next/image'
import { memo, useState } from 'react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import { Check, ChevronLeft, ChevronRight, Crown, Eye, ShoppingBag, Sparkles } from 'lucide-react'
import { addIntoCart } from '@/store/reducer/cartReducer'
import { showToast } from '@/lib/showToast'

const ProductBox = ({ product, priority = false }) => {
    const dispatch = useDispatch()
    const cartProducts = useSelector((store) => store.cartStore.products)

    const variant = product?.defaultVariant
    const isInCart = variant
        ? cartProducts.some((item) => item.productId === product._id && item.variantId === variant._id)
        : false

    const [isAdding, setIsAdding] = useState(false)

    const images = product?.media?.length > 0
        ? product.media
        : [{ secure_url: imgPlaceholder.src, alt: product?.name }]
    const showArrows = images.length > 1
    const [imgIndex, setImgIndex] = useState(0)
    const activeImage = images[imgIndex]

    const slideImage = (e, dir) => {
        e.preventDefault()
        e.stopPropagation()
        setImgIndex((prev) => (prev + dir + images.length) % images.length)
    }

    const handleAddToCart = () => {
        if (!variant) return

        setIsAdding(true)
        dispatch(addIntoCart({
            productId: product._id,
            variantId: variant._id,
            name: product.name,
            url: product.slug,
            size: variant.size,
            color: variant.color,
            mrp: variant.mrp ?? product.mrp,
            sellingPrice: variant.sellingPrice ?? product.sellingPrice,
            media: product?.media?.[0]?.secure_url || imgPlaceholder.src,
            qty: 1,
        }))
        showToast('success', 'Added to your enquiry list.')
        setIsAdding(false)
    }

    return (
        <div className='group relative flex flex-col overflow-hidden rounded-[var(--radius-3xl)] border border-border bg-white transition duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[var(--shadow-card-hover)]'>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--product-card-bg)]">
                {/* Badges - top-left, stacked */}
                <div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-1.5">
                    {product?.isBestseller && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary)] px-2.5 py-1 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white shadow-sm">
                            <Crown className="size-3" />
                            Best Seller
                        </span>
                    )}
                    {product?.isFreshlyArrived && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-lime)] px-2.5 py-1 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--brand-lime-ink)] shadow-sm">
                            <Sparkles className="size-3" />
                            New
                        </span>
                    )}
                </div>

                {/* Quick actions - top-right, always visible circular icon buttons */}
                <div className="absolute right-3 top-3 z-20 flex flex-col items-end gap-2">
                    <Link
                        href={WEBSITE_PRODUCT_DETAILS(product.slug)}
                        aria-label={`View ${product?.name}`}
                        className="flex size-9 items-center justify-center rounded-full border border-border/40 bg-background/90 text-[var(--brand-primary)]/70 shadow-sm backdrop-blur-sm transition duration-200 hover:bg-background hover:text-[var(--brand-primary)]"
                    >
                        <Eye className="size-4" />
                    </Link>

                    {isInCart ? (
                        <Link
                            href={WEBSITE_CART}
                            aria-label="Go to enquiry list"
                            className="flex size-9 items-center justify-center rounded-full border border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-sm transition duration-200 hover:bg-[var(--brand-primary-hover)]"
                        >
                            <Check className="size-4" />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            aria-label={`Add ${product?.name} to enquiry`}
                            disabled={!variant || isAdding}
                            onClick={handleAddToCart}
                            className="flex size-9 items-center justify-center rounded-full border border-border/40 bg-background/90 text-[var(--brand-primary)]/70 shadow-sm backdrop-blur-sm transition duration-200 hover:bg-background hover:text-[var(--brand-primary)] disabled:pointer-events-none disabled:opacity-50"
                        >
                            <ShoppingBag className="size-4" />
                        </button>
                    )}
                </div>

                <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)} className="block h-full w-full">
                    <Image
                        src={activeImage?.secure_url || imgPlaceholder.src}
                        width={600}
                        height={750}
                        alt={activeImage?.alt || product?.name}
                        title={activeImage?.title || product?.name}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        priority={priority}
                        className='h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105'
                    />
                </Link>

                {showArrows && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous image"
                            onClick={(e) => slideImage(e, -1)}
                            className="absolute left-2 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/85 text-[var(--brand-primary)]/70 opacity-100 shadow-sm backdrop-blur-sm transition duration-200 hover:bg-background hover:text-[var(--brand-primary)] sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next image"
                            onClick={(e) => slideImage(e, 1)}
                            className="absolute right-2 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/85 text-[var(--brand-primary)]/70 opacity-100 shadow-sm backdrop-blur-sm transition duration-200 hover:bg-background hover:text-[var(--brand-primary)] sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <ChevronRight className="size-4" />
                        </button>

                        <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1.5 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                            {images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`size-1.5 rounded-full transition-colors ${index === imgIndex ? 'bg-[var(--brand-primary)]' : 'bg-background/70'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Link
                href={WEBSITE_PRODUCT_DETAILS(product.slug)}
                className="flex items-center justify-between gap-2 px-3 py-3 font-neue sm:px-4 sm:py-4"
            >
                <h4 title={product?.name} className="min-w-0 flex-1 truncate text-[15px] font-semibold leading-[1.2] text-[var(--brand-primary)] transition-colors group-hover:text-[var(--brand-primary-hover)] sm:text-base">
                    {product?.name}
                </h4>
                <span className="shrink-0 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-[var(--brand-primary)] sm:text-[0.8rem]">
                    On Enquiry
                </span>
            </Link>
        </div>
    )
}

export default memo(ProductBox)
