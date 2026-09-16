'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    Minus,
    Plus,
    RefreshCw,
    ShieldCheck,
    Star,
    StarHalf,
    Truck,
} from 'lucide-react'
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute"
import Image from "next/image"
import Link, { useLinkStatus } from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import cloudinaryLoader from '@/lib/cloudinaryLoader'
import ButtonLoading from "@/components/Application/ButtonLoading"
import { useDispatch, useSelector } from "react-redux"
import { addIntoCart, increaseQuantity, decreaseQuantity, removeFromCart } from "@/store/reducer/cartReducer"
import { showToast } from "@/lib/showToast"
import { Button } from "@/components/ui/button"
import ProductBox from "@/components/Application/Website/ProductBox"
import LazyHydrate from "@/components/Application/LazyHydrate"

// Split the heavy client-only islands out of the page's hydration chunk.
// ProductReveiw drags in react-hook-form, zod, tanstack-query and axios but
// renders nothing until its own client fetches resolve, so there is no SSR
// markup to lose.
const ProductReveiw = dynamic(() => import("@/components/Application/Website/ProductReveiw"), { ssr: false })
import { cn, decodeHTMLDeep, htmlToText, NO_SIZE_PARAM, normalizeColor } from "@/lib/utils"
import { resolveColorStyle } from "@/lib/colorMap"
import { MAX_CART_QTY } from "@/lib/cartConstants"

const MAX_QTY = MAX_CART_QTY

// Non-blocking pending indicator for variant <Link>s. Rendered as a child of a
// Link, it reads that link's navigation status and overlays a small spinner on
// just the clicked swatch/size while the new variant loads - so the rest of the
// page stays interactive instead of being hidden behind a fullscreen loader.
const NavSpinner = () => {
    const { pending } = useLinkStatus()
    if (!pending) return null
    return (
        <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/70 backdrop-blur-[1px]">
            <Loader2 className="size-4 animate-spin text-[var(--dark-red)]" />
        </span>
    )
}

// Renders 5 stars reflecting a real average (full / half / empty) instead of
// a hard-coded 5-star row, so an unrated product shows empty stars.
const RatingStars = ({ value = 0, size = 'size-4' }) => (
    <div className="flex items-center gap-0.5 text-[var(--dark-red)]">
        {Array.from({ length: 5 }).map((_, i) => {
            const position = i + 1
            if (value >= position) {
                return <Star key={i} className={cn(size, 'fill-[var(--dark-red)] text-[var(--dark-red)]')} />
            }
            if (value >= position - 0.5) {
                return <StarHalf key={i} className={cn(size, 'fill-[var(--dark-red)] text-[var(--dark-red)]')} />
            }
            return <Star key={i} className={cn(size, 'text-foreground/25')} />
        })}
    </div>
)

const ProductDetails = ({ product, variant, colors, colorEntries, sizes, variantOptions, reviewCount, ratingAvg, relatedProducts = [] }) => {
    const dispatch = useDispatch()
    const cartStore = useSelector(store => store.cartStore)

    const media = variant?.media?.length ? variant.media : []
    // Always render at least one slide so the carousel markup stays uniform
    // when a variant has no media of its own.
    const slides = media.length ? media : [{ secure_url: imgPlaceholder.src, alt: product?.name }]
    const [activeIndex, setActiveIndex] = useState(0)
    const [qty, setQty] = useState(1)
    const trackRef = useRef(null)
    // Color swatch resolution uses CSS.supports (browser-only). Gate the
    // resolved fill behind a mount flag to avoid an SSR/client hydration
    // mismatch for CSS-named colors. The same flag gates the cart-state UI so
    // the server-rendered "Add to Cart" matches the first client paint (the
    // persisted cart only rehydrates after mount).
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    // Reset gallery + quantity whenever the resolved variant changes (e.g. the
    // shopper switched color/size and the server returned a new variant).
    // The track is snapped back with 'auto' - a smooth scroll here would animate
    // across the new variant's images, which reads as a glitch.
    useEffect(() => {
        setActiveIndex(0)
        setQty(1)
        trackRef.current?.scrollTo({ left: 0, behavior: 'auto' })
    }, [variant?._id])

    // The live cart line for the *currently selected* variant (or null). Derived
    // straight from the store so add / increase / decrease / remove anywhere -
    // including the cart page - is always reflected here without local state to
    // keep in sync. Keyed by variantId, so switching color/size re-evaluates.
    const cartLine = useMemo(
        () => cartStore.products.find(
            (p) => p.productId === product._id && p.variantId === variant?._id
        ) || null,
        [cartStore.products, product._id, variant?._id]
    )
    const inCart = mounted && Boolean(cartLine)
    const cartQty = cartLine?.qty || 0

    // ── Gallery carousel ──────────────────────────────────────────────────
    // A native CSS scroll-snap track rather than a drag library: touch gets real
    // momentum, rubber-banding and snapping for free, and the arrows, dots and
    // thumbnails all drive the same scrollTo. It never advances on its own -
    // the shopper is always the one moving it.
    const goTo = (index, behavior = 'smooth') => {
        const track = trackRef.current
        if (!track) return
        const clamped = Math.max(0, Math.min(index, slides.length - 1))
        track.scrollTo({ left: clamped * track.clientWidth, behavior })
    }

    // Arrows step without wrapping - at either end the button is disabled, so a
    // wrap would contradict the scroll position the track can actually reach.
    const slideImage = (dir) => goTo(activeIndex + dir)

    // The scroll position is the single source of truth for which slide is
    // active, so a flick, an arrow and a thumbnail click can never disagree.
    // rAF-throttled because scroll fires far more often than the index changes.
    const scrollFrame = useRef(0)
    const onTrackScroll = () => {
        if (scrollFrame.current) return
        scrollFrame.current = requestAnimationFrame(() => {
            scrollFrame.current = 0
            const track = trackRef.current
            if (!track?.clientWidth) return
            const index = Math.round(track.scrollLeft / track.clientWidth)
            setActiveIndex((prev) => (prev === index ? prev : index))
        })
    }
    useEffect(() => () => cancelAnimationFrame(scrollFrame.current), [])

    // Pre-add quantity selector (how many to add). Capped at the shared max.
    const handleQty = (actionType) => {
        setQty((prev) => {
            if (actionType === 'inc') return Math.min(prev + 1, MAX_QTY)
            return Math.max(prev - 1, 1)
        })
    }

    const cartKey = { productId: product._id, variantId: variant?._id }

    const handleAddToCart = () => {
        if (!variant?._id) return
        dispatch(addIntoCart({
            productId: product._id,
            variantId: variant._id,
            name: product.name,
            url: product.slug,
            size: variant.size || '',
            color: variant.color,
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
            media: media[0]?.secure_url || imgPlaceholder.src,
            qty: qty,
        }))
        showToast('success', qty > 1 ? `${qty} added to your enquiry list.` : 'Added to your enquiry list.')
    }

    // In-cart stepper: + / − adjust the cart line live. Dropping below 1 removes
    // the line entirely (the buy box reverts to "Add to Cart"), matching the
    // quick-commerce stepper pattern shoppers expect.
    const handleCartInc = () => {
        if (cartQty >= MAX_QTY) return
        dispatch(increaseQuantity(cartKey))
    }
    const handleCartDec = () => {
        if (cartQty <= 1) {
            dispatch(removeFromCart(cartKey))
            showToast('success', 'Removed from your enquiry list.')
            return
        }
        dispatch(decreaseQuantity(cartKey))
    }

    // ── Variant availability matrix ───────────────────────────────────────
    const optionSet = useMemo(
        () => new Set((variantOptions || []).map((o) => `${o.color}|${o.size || ''}`)),
        [variantOptions]
    )
    const isCombo = (color, size) => optionSet.has(`${normalizeColor(color)}|${size || ''}`)

    // A product may mix sized and sizeless variants (a plant sold loose and in
    // a 6-inch pot). `sizes` from the server holds only the real sizes, so the
    // sizeless variant would have no pill to select and the row would render
    // with nothing highlighted. Give it an explicit "One size" option, keyed by
    // '' - the same key the availability matrix uses.
    const NO_SIZE = ''
    const hasUnsized = useMemo(
        () => (variantOptions || []).some((o) => !o.size),
        [variantOptions]
    )
    // Only offered when at least one real size exists. If nothing has a size,
    // the whole size row stays hidden rather than showing a lone "One size".
    const sizeChoices = useMemo(
        () => (sizes?.length && hasUnsized ? [NO_SIZE, ...sizes] : (sizes || [])),
        [sizes, hasUnsized]
    )

    // Only a product holding BOTH sizeless and sized variants needs to say
    // "the sizeless one" in the URL. Everywhere else an absent size param is
    // already unambiguous, so links stay clean.
    const isMixed = hasUnsized && (sizes?.length || 0) > 0
    const sizeParam = (size) => (size || (isMixed ? NO_SIZE_PARAM : ''))

    // When switching color, keep the current size if that combo exists,
    // otherwise land on the first available size for the new color - so a
    // color click never dead-ends on a non-existent combination.
    const sizeForColor = (color) => {
        const c = normalizeColor(color)
        const forColor = (variantOptions || []).filter((o) => o.color === c)
        // Unknown colour - nothing better to offer than the current size.
        if (!forColor.length) return variant.size || NO_SIZE
        // Keep the current size when that combination exists.
        if (forColor.some((o) => o.size === (variant.size || NO_SIZE))) return variant.size || NO_SIZE
        // Otherwise take that colour's first variant. `?? NO_SIZE` rather than
        // `|| variant.size`: a sizeless variant is a real answer, and the old
        // `||` treated its '' as "not found" and carried the previous size over,
        // building a link to a combination that does not exist.
        return forColor[0].size ?? NO_SIZE
    }

    // Size is optional, so a sizeless product must not emit a dangling
    // `&size=` - it would show up in shared links and the canonical URL for
    // no reason. Only colour is ever guaranteed to be present.
    const variantHref = (color, size) => {
        const params = new URLSearchParams()
        if (color) params.set('color', color)
        if (size) params.set('size', size)
        const query = params.toString()
        return query ? `${WEBSITE_PRODUCT_DETAILS(product.slug)}?${query}` : WEBSITE_PRODUCT_DETAILS(product.slug)
    }

    const shortDescription = htmlToText(product?.description)
    const swatches = colorEntries?.length ? colorEntries : (colors || []).map((name) => ({ name, hex: '' }))

    const scrollToReviews = () => {
        if (typeof document !== 'undefined') {
            document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <section className="website-gutter bg-[linear-gradient(180deg,rgba(11,11,11,0.03),transparent_18%)] pb-8 pt-20 lg:pb-12 lg:pt-24">
            <div className="w-full font-neue">

                <div className="mb-6 lg:mb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={WEBSITE_SHOP}>Shop</BreadcrumbLink>
                            </BreadcrumbItem>
                            {product?.category?.name && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`${WEBSITE_SHOP}?category=${encodeURIComponent(product.category.slug)}`}>
                                            {product.category.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="max-w-[50vw] truncate sm:max-w-none">{product?.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 xl:gap-16">

                    {/* ── GALLERY ─────────────────────────────────────────── */}
                    <div className="min-w-0 lg:sticky lg:top-6">
                        <div className="flex flex-col-reverse gap-3 xl:flex-row xl:gap-4">
                            <div className="-mx-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:gap-3 sm:px-0 xl:max-h-[620px] xl:w-[84px] xl:flex-col xl:overflow-y-auto xl:pb-0 no-scrollbar">
                                {media.length > 0 ? media.map((thumb, index) => (
                                    <button
                                        type="button"
                                        key={thumb._id || index}
                                        onClick={() => goTo(index)}
                                        aria-current={index === activeIndex}
                                        aria-label={`View image ${index + 1}`}
                                        className={cn(
                                            'relative aspect-[4/5] w-[64px] shrink-0 snap-start overflow-hidden rounded-[var(--radius-sm)] border bg-[var(--product-card-bg)] transition sm:w-[72px] xl:w-full',
                                            index === activeIndex
                                                ? 'border-[var(--dark-red)] ring-1 ring-[var(--dark-red)]/30'
                                                : 'border-border/60 hover:border-foreground/40'
                                        )}
                                    >
                                        <Image
                                            src={thumb?.secure_url || imgPlaceholder.src}
                                            alt={thumb?.alt || `${product?.name} thumbnail ${index + 1}`}
                                            fill
                                            sizes="84px"
                                            loader={cloudinaryLoader}
                                            className="object-cover object-center"
                                        />
                                    </button>
                                )) : null}
                            </div>

                            <div
                                className="group relative flex-1"
                                role="group"
                                aria-roledescription="carousel"
                                aria-label={`${product?.name} images`}
                            >
                                {/* The snap track. overscroll-x-contain stops a swipe past
                                    the last image from turning into a browser back-gesture. */}
                                <div
                                    ref={trackRef}
                                    onScroll={onTrackScroll}
                                    className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[var(--radius-lg)] border border-border/60 bg-[var(--product-card-bg)] no-scrollbar"
                                >
                                    {slides.map((item, index) => (
                                        <div
                                            key={item._id || index}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`Image ${index + 1} of ${slides.length}`}
                                            className="relative aspect-[5/6] w-full shrink-0 snap-center snap-always sm:aspect-[4/5]"
                                        >
                                            {/* fetchPriority must be passed explicitly - in Next 15
                                                `priority` alone emits the preload but not
                                                fetchpriority="high", so the LCP request still queued
                                                behind fonts/JS on throttled connections. Only the
                                                first slide gets it - the rest must not compete with
                                                the LCP image for bandwidth. */}
                                            <Image
                                                src={item?.secure_url || imgPlaceholder.src}
                                                alt={item?.alt || `${product?.name} image ${index + 1}`}
                                                fill
                                                {...(index === 0 ? { priority: true, fetchPriority: 'high' } : {})}
                                                loader={cloudinaryLoader}
                                                sizes="(max-width: 1024px) 100vw, 55vw"
                                                className="object-cover object-center"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {slides.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                aria-label="Previous image"
                                                onClick={() => slideImage(-1)}
                                                disabled={activeIndex === 0}
                                                className="absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/85 text-foreground/70 shadow-sm backdrop-blur-sm transition hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-0 sm:left-3 sm:size-9 sm:opacity-0 sm:group-hover:opacity-100"
                                            >
                                                <ChevronLeft className="size-3.5 sm:size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Next image"
                                                onClick={() => slideImage(1)}
                                                disabled={activeIndex === slides.length - 1}
                                                className="absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/40 bg-background/85 text-foreground/70 shadow-sm backdrop-blur-sm transition hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-0 sm:right-3 sm:size-9 sm:opacity-0 sm:group-hover:opacity-100"
                                            >
                                                <ChevronRight className="size-3.5 sm:size-4" />
                                            </button>
                                            {/* Dots sit on the photo itself, so they need their own
                                                backing - bare dots disappeared against a busy image. */}
                                            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
                                              <div className="pointer-events-none flex items-center gap-1.5 rounded-full bg-background/75 px-2 py-1 shadow-sm backdrop-blur-sm">
                                                {slides.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => goTo(index)}
                                                        aria-label={`Go to image ${index + 1}`}
                                                        className={cn(
                                                            'pointer-events-auto size-1.5 rounded-full transition-colors',
                                                            index === activeIndex ? 'bg-[var(--dark-red)]' : 'bg-foreground/30'
                                                        )}
                                                    />
                                                ))}
                                              </div>
                                            </div>
                                        </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── INFO PANEL ──────────────────────────────────────── */}
                    <div className="flex min-w-0 flex-col">
                        {product?.category?.name ? (
                            <Link
                                href={`${WEBSITE_SHOP}?category=${encodeURIComponent(product.category.slug)}`}
                                className="w-fit max-w-full break-words text-[0.8rem] font-semibold uppercase text-[var(--dark-red)] transition-colors hover:text-[var(--dark-red-2)]"
                            >
                                {product.category.name}
                            </Link>
                        ) : (
                            <p className="text-[0.8rem] font-semibold uppercase text-[var(--dark-red)]">From Our Nursery</p>
                        )}

                        <h1 className="font-header mt-2 break-words text-[1.6rem] leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2rem] sm:leading-[1.1] lg:text-[2.25rem]">
                            {product?.name}
                        </h1>

                        <button
                            type="button"
                            onClick={scrollToReviews}
                            className="mt-3 flex w-fit items-center gap-2 text-left"
                        >
                            <RatingStars value={ratingAvg} />
                            <span className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                                {ratingAvg > 0 ? `${ratingAvg} · ` : ''}{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
                            </span>
                        </button>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="rounded-md bg-[var(--brand-cream)] px-3 py-1.5 text-[13px] font-semibold uppercase text-[var(--dark-red)]">
                                Price on enquiry
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">Add to your enquiry list and our team will share availability &amp; pricing.</p>

                        {shortDescription && (
                            <p className="mt-5 line-clamp-3 break-words text-sm leading-relaxed text-[var(--text-body)]">
                                {shortDescription}
                            </p>
                        )}

                        <div className="my-6 h-px w-full bg-border/60" />

                        {/* Color */}
                        {swatches.length > 0 && (
                            <div className="mb-6">
                                <p className="mb-3 text-[0.8rem] font-semibold uppercase text-muted-foreground">
                                    Color: <span className="text-foreground">{variant?.color}</span>
                                </p>
                                <div className="flex flex-wrap gap-2.5">
                                    {swatches.map(({ name, hex }) => {
                                        const isSelected = normalizeColor(name) === normalizeColor(variant?.color)
                                        const style = mounted ? resolveColorStyle(name, hex) : null
                                        return (
                                            <Link
                                                key={name}
                                                href={variantHref(name, sizeParam(sizeForColor(name)))}
                                                title={name}
                                                aria-label={`Color ${name}`}
                                                aria-pressed={isSelected}
                                                className={cn(
                                                    'relative flex size-11 items-center justify-center rounded-full border transition sm:size-9',
                                                    isSelected
                                                        ? 'border-[var(--dark-red)] ring-2 ring-[var(--dark-red)]/25 ring-offset-2 ring-offset-background'
                                                        : 'border-border/70 hover:border-foreground/50'
                                                )}
                                            >
                                                <span
                                                    className="size-8 rounded-full border border-black/10 sm:size-7"
                                                    style={style || undefined}
                                                >
                                                    {!style && (
                                                        <span className="flex h-full w-full items-center justify-center text-[0.8rem] font-semibold uppercase text-foreground/60">
                                                            {name?.slice(0, 2)}
                                                        </span>
                                                    )}
                                                </span>
                                                {!isSelected && <NavSpinner />}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {sizeChoices.length > 0 && (
                            <div className="mb-6">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-[0.8rem] font-semibold uppercase text-muted-foreground">
                                        Size: <span className="text-foreground">{variant?.size || 'One size'}</span>
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizeChoices.map((size) => {
                                        const label = size || 'One size'
                                        const isSelected = (size || NO_SIZE) === (variant?.size || NO_SIZE)
                                        const available = isCombo(variant?.color, size)
                                        if (!available && !isSelected) {
                                            return (
                                                <span
                                                    key={size || '__none__'}
                                                    title={`${label} - unavailable in ${variant?.color}`}
                                                    className="relative inline-flex min-h-[44px] min-w-[52px] cursor-not-allowed select-none items-center justify-center rounded-[var(--radius-sm)] border border-border/50 px-3.5 text-center text-sm text-foreground/30 sm:min-h-[40px]"
                                                >
                                                    <span className="line-through">{label}</span>
                                                </span>
                                            )
                                        }
                                        return (
                                            <Link
                                                key={size || '__none__'}
                                                href={variantHref(variant.color, sizeParam(size))}
                                                aria-pressed={isSelected}
                                                className={cn(
                                                    'relative inline-flex min-h-[44px] min-w-[52px] items-center justify-center rounded-[var(--radius-sm)] border px-3.5 text-center text-sm font-medium transition sm:min-h-[40px]',
                                                    isSelected
                                                        ? 'border-[var(--dark-red)] bg-[var(--dark-red)] text-white'
                                                        : 'border-border/70 hover:border-foreground/50 hover:bg-muted/40'
                                                )}
                                            >
                                                {label}
                                                {!isSelected && <NavSpinner />}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity + Add to cart */}
                        {!variant?._id ? (
                            <Button
                                type="button"
                                variant="brand"
                                disabled
                                className="h-12 w-full whitespace-nowrap rounded-[var(--radius-sm)] px-2 text-[0.72rem] font-semibold uppercase sm:px-4 sm:text-[0.8rem]"
                            >
                                Unavailable
                            </Button>
                        ) : !inCart ? (
                            /* ── Not in cart: pick a quantity, then add ──────────── */
                            <div className="flex flex-row items-stretch gap-2.5 sm:gap-3">
                                <div className="inline-flex h-12 shrink-0 items-center rounded-[var(--radius-sm)] border border-border/70">
                                    <button
                                        type="button"
                                        aria-label="Decrease quantity"
                                        disabled={qty <= 1}
                                        className="flex h-full w-10 items-center justify-center text-foreground/80 sm:w-11 transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                        onClick={() => handleQty('desc')}
                                    >
                                        <Minus className="size-4" />
                                    </button>
                                    <span className="w-8 select-none text-center text-sm font-semibold tabular-nums sm:w-10">{qty}</span>
                                    <button
                                        type="button"
                                        aria-label="Increase quantity"
                                        disabled={qty >= MAX_QTY}
                                        className="flex h-full w-10 items-center justify-center text-foreground/80 sm:w-11 transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                        onClick={() => handleQty('inc')}
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <ButtonLoading
                                        type="button"
                                        text="Add To Enquiry"
                                        variant="brand"
                                        className="h-12 w-full whitespace-nowrap rounded-[var(--radius-sm)] px-2 text-[0.72rem] font-semibold uppercase sm:px-4 sm:text-[0.8rem]"
                                        onClick={handleAddToCart}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* ── In cart: live stepper bound to the cart line ────── */
                            <div className="flex flex-row items-stretch gap-2.5 sm:gap-3">
                                <div className="inline-flex h-12 shrink-0 items-center rounded-[var(--radius-sm)] border border-[var(--dark-red)]/40 bg-[var(--brand-cream)]/30">
                                    <button
                                        type="button"
                                        aria-label={cartQty <= 1 ? 'Remove from cart' : 'Decrease quantity'}
                                        className="flex h-full w-10 items-center justify-center text-[var(--dark-red)] sm:w-11 transition hover:text-[var(--dark-red-2)]"
                                        onClick={handleCartDec}
                                    >
                                        <Minus className="size-4" />
                                    </button>
                                    <span className="w-8 select-none text-center text-sm font-semibold tabular-nums text-[var(--dark-red)] sm:w-10">{cartQty}</span>
                                    <button
                                        type="button"
                                        aria-label="Increase quantity"
                                        disabled={cartQty >= MAX_QTY}
                                        className="flex h-full w-10 items-center justify-center text-[var(--dark-red)] sm:w-11 transition hover:text-[var(--dark-red-2)] disabled:cursor-not-allowed disabled:opacity-40"
                                        onClick={handleCartInc}
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <Button
                                        variant="brand"
                                        className="h-12 w-full whitespace-nowrap rounded-[var(--radius-sm)] px-2 text-[0.72rem] font-semibold uppercase sm:px-4 sm:text-[0.8rem]"
                                        type="button"
                                        asChild
                                    >
                                        <Link href={WEBSITE_CART}>Go To Enquiry</Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {inCart ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                                {cartQty} in your enquiry list{cartQty >= MAX_QTY ? ` · max ${MAX_QTY} per item` : ' · use − / + to adjust'}
                            </p>
                        ) : qty >= MAX_QTY ? (
                            <p className="mt-2 text-xs text-muted-foreground">Maximum {MAX_QTY} units per item.</p>
                        ) : null}

                        {/* Trust badges */}
                        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-3">
                            {[
                                { icon: ShieldCheck, title: 'Quality Assured', sub: 'Nursery-grade stock' },
                                { icon: RefreshCw, title: 'Quick Response', sub: 'We reply to every enquiry' },
                                { icon: Truck, title: 'Pan-India Supply', sub: 'Delivery arranged on request' },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div key={title} className="flex min-w-0 items-center gap-3 rounded-[var(--radius-sm)] border border-border/50 bg-muted/20 px-3 py-2.5">
                                    <Icon className="size-5 shrink-0 text-[var(--dark-red)]" strokeWidth={1.75} />
                                    <div className="min-w-0 leading-tight">
                                        <p className="text-[0.8rem] font-semibold text-foreground">{title}</p>
                                        <p className="text-[0.8rem] text-muted-foreground">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* ── Full-width Product Details ───────────────────────── */}
                <section className="mt-10 lg:mt-14">
                    <div className="mb-6 lg:mb-8">
                        <p className="text-[0.85rem] font-semibold uppercase text-[var(--dark-red)]/60 sm:text-[1rem]">
                            The Details
                        </p>
                        <h2 className="mt-1.5 font-neue text-[clamp(1.35rem,6vw,2.6rem)] font-medium uppercase leading-[1.15] text-[var(--dark-red-2)]">
                            Product Details
                        </h2>
                    </div>
                    <div
                        className="w-full overflow-hidden break-words font-neue text-[0.9rem] font-normal leading-[1.8] text-[var(--text-body)] sm:text-[0.95rem] sm:leading-[1.85] [&_a]:break-all [&_a]:text-[var(--dark-red)] [&_a]:underline [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[var(--radius-sm)] [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_pre]:overflow-x-auto [&_strong]:font-semibold [&_strong]:text-foreground [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{ __html: decodeHTMLDeep(product?.description) }}
                    />
                </section>

                {/* ── Full-width How Enquiries Work ────────────────────── */}
                <section className="mt-10 lg:mt-14">
                    <div className="mb-6 lg:mb-8">
                        <p className="text-[0.85rem] font-semibold uppercase text-[var(--dark-red)]/60 sm:text-[1rem]">
                            Good To Know
                        </p>
                        <h2 className="mt-1.5 font-neue text-[clamp(1.35rem,6vw,2.6rem)] font-medium uppercase leading-[1.15] text-[var(--dark-red-2)]">
                            How Enquiries Work
                        </h2>
                    </div>
                    <dl className="w-full divide-y divide-border/50">
                        {[
                            { label: 'Step 1', text: 'Add the plants and supplies you need to your enquiry list - no account required.' },
                            { label: 'Step 2', text: 'Submit the enquiry with your contact details and the quantities you want.' },
                            { label: 'Step 3', text: 'Our team gets back to you with availability and pricing for your requirement.' },
                            { label: 'Step 4', text: 'We arrange delivery or nursery pickup once the details are confirmed.' },
                        ].map(({ label, text }) => (
                            <div key={label} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:gap-6">
                                <dt className="shrink-0 pt-0.5 text-[0.8rem] font-semibold uppercase text-foreground/45 sm:w-24">
                                    {label}
                                </dt>
                                <dd className="font-neue text-[0.9rem] leading-[1.8] text-[var(--text-body)] sm:text-[0.95rem] sm:leading-[1.85]">
                                    {text}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>



                <div id="reviews" className="mt-10 scroll-mt-20 lg:mt-14 lg:scroll-mt-24">
                    <LazyHydrate>
                        <ProductReveiw productId={product._id} />
                    </LazyHydrate>
                </div>

                {/* ── You May Also Like ────────────────────────────────── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-10 lg:mt-16">
                        <div className="mb-6 lg:mb-10">
                            <p className="text-[0.85rem] font-semibold uppercase text-[var(--dark-red)]/60 sm:text-[1rem]">
                                Curated For You
                            </p>
                            <h2 className="mt-1.5 font-neue text-[clamp(1.35rem,6vw,2.6rem)] font-medium uppercase leading-[1.15] text-[var(--dark-red-2)]">
                                You May Also Like
                            </h2>
                        </div>

                        <LazyHydrate>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                                {relatedProducts.map((item) => (
                                    <ProductBox key={item._id} product={item} />
                                ))}
                            </div>
                        </LazyHydrate>
                    </section>
                )}
            </div>
        </section>
    )
}

export default ProductDetails
