'use client'
import { ShoppingBag, ShoppingCart, ShoppingCartIcon, Minus, Plus, Trash2 } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { removeFromCart, increaseQuantity, decreaseQuantity } from "@/store/reducer/cartReducer"
import { MAX_CART_QTY } from "@/lib/cartConstants"
import Link from "next/link"
import { WEBSITE_CART, WEBSITE_ENQUIRY, WEBSITE_SHOP } from "@/routes/WebsiteRoute"
import { BrandButton, BrandOutlineButton } from "@/components/Application/Website/BrandButton"
import { useEffect, useState } from "react"
import { showToast } from "@/lib/showToast"

const Cart = ({ open: openProp, onOpenChange, hideTrigger = false }) => {
    const [openState, setOpenState] = useState(false)
    // Controlled when the parent passes open/onOpenChange (e.g. driven from the
    // navbar menu panel); otherwise falls back to its own internal state.
    const open = openProp !== undefined ? openProp : openState
    const setOpen = onOpenChange ?? setOpenState
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const cart = useSelector(store => store.cartStore)
    const dispatch = useDispatch()
    const cartCount = mounted ? cart.count : 0
    const totalUnits = mounted ? (cart.products?.reduce((sum, p) => sum + (p.qty || 0), 0) || 0) : 0

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* ── Trigger ── (hidden when the navbar drives the drawer directly) */}
            {!hideTrigger && (
                <SheetTrigger aria-label="Open cart" className="relative flex items-center justify-center rounded-md px-1.5 py-1.5 transition hover:bg-muted/40 sm:px-2.5 sm:py-2">
                    <ShoppingCart className="h-4 w-4 text-foreground sm:h-5 sm:w-5" strokeWidth={1.75} />
                    {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--dark-red)] px-1 text-[0.8rem] font-semibold text-white tabular-nums sm:-right-2 sm:-top-2 sm:h-5 sm:min-w-5">
                            {cartCount}
                        </span>
                    )}
                </SheetTrigger>
            )}

            {/* ── Drawer ── */}
            <SheetContent className="data-[side=right]:w-[88vw] gap-0 border-l border-border/40 bg-background p-0 shadow-2xl sm:data-[side=right]:w-full sm:data-[side=right]:max-w-[440px]">

                {/* Header */}
                <SheetHeader className="flex-shrink-0 border-b border-border/50 px-5 py-3.5 sm:px-6 sm:py-5">
                    <div className="flex items-center justify-between pr-8">
                        <SheetTitle className="font-neue text-[1.125rem] font-semibold leading-tight text-[var(--brand-primary)] sm:text-xl sm:text-foreground">
                            My Enquiry
                        </SheetTitle>
                        {cartCount > 0 && (
                            <span className="rounded-[var(--radius-sm)] bg-[var(--brand-cream)]/60 px-2.5 py-0.5 text-xs font-semibold uppercase text-[var(--brand-primary)] sm:bg-muted/60 sm:text-muted-foreground">
                                {cartCount} {cartCount === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                    <SheetDescription className="sr-only">Your selected items</SheetDescription>
                </SheetHeader>

                {/* Scrollable product list */}
                <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5">
                    {cart.count === 0 ? (
                        <div className="flex flex-col items-center rounded-lg border border-border/60 bg-background px-6 py-12 text-center shadow-sm sm:py-14">
                            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--brand-cream)]/50 text-[var(--brand-primary)]">
                                <ShoppingCartIcon className="size-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-header mt-5 text-2xl leading-none text-[var(--brand-primary)] sm:font-neue sm:text-xl sm:font-semibold sm:leading-normal sm:tracking-normal sm:text-foreground">
                                Your enquiry list is empty
                            </h3>
                            <p className="font-neue mt-2.5 max-w-[220px] text-sm text-muted-foreground">
                                Add plants and supplies you're interested in, then send us an enquiry.
                            </p>
                            <div className="mt-6 w-full">
                                <BrandButton asChild onClick={() => setOpen(false)}>
                                    <Link href={WEBSITE_SHOP}>
                                        <ShoppingBag className="mr-2 size-4" />
                                        Shop Now
                                    </Link>
                                </BrandButton>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.products?.map(product => (
                                <div
                                    key={product.variantId}
                                    className="group relative flex items-stretch gap-3 rounded-xs border border-border/40 bg-background p-3 transition-all duration-200 hover:border-border/70 hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)]"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-[76px] w-[64px] sm:h-[84px] sm:w-[76px] flex-shrink-0 overflow-hidden rounded-xs border border-border/30">
                                        <Image
                                            src={product?.media || imgPlaceholder.src}
                                            fill
                                            sizes="76px"
                                            alt={product.name}
                                            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.06]"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="line-clamp-2 font-neue text-[0.8rem] font-semibold leading-snug text-foreground">
                                                {product.name}
                                            </h4>
                                            <button
                                                type="button"
                                                aria-label="Remove item"
                                                onClick={() => {
                                                    dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))
                                                    showToast('success', 'Removed from your enquiry list.')
                                                }}
                                                className="cursor-pointer text-muted-foreground/40 transition-colors hover:text-[var(--dark-red)]"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                        {(product.size || product.color) && (
                                            <span className="w-fit rounded-[var(--radius-sm)] bg-muted/60 px-2 py-0.5 text-[0.8rem] font-medium uppercase text-muted-foreground">
                                                {[product.size, product.color].filter(Boolean).join(' / ')}
                                            </span>
                                        )}
                                        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 pt-1">
                                            {/* Quantity stepper: gainable (+) and deducible (-) */}
                                            <div className="inline-flex h-7 items-center rounded-[var(--radius-sm)] border border-border/70 bg-background shadow-xs">
                                                <button
                                                    type="button"
                                                    aria-label={product.qty <= 1 ? "Remove from enquiry list" : "Decrease quantity"}
                                                    onClick={() => {
                                                        if (product.qty <= 1) {
                                                            dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))
                                                            showToast('success', 'Removed from your enquiry list.')
                                                        } else {
                                                            dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))
                                                        }
                                                    }}
                                                    className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-foreground/70 transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                                                >
                                                    {product.qty <= 1 ? <Trash2 className="size-3 text-[var(--dark-red)]" /> : <Minus className="size-3" />}
                                                </button>
                                                <span className="w-7 select-none text-center font-neue text-xs font-semibold tabular-nums text-foreground">
                                                    {product.qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-label="Increase quantity"
                                                    disabled={product.qty >= MAX_CART_QTY}
                                                    onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}
                                                    className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-foreground/70 transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                            <span className="font-neue text-[0.75rem] font-medium uppercase text-muted-foreground whitespace-nowrap">
                                                Price on enquiry
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-border/50 bg-background px-5 pb-8 pt-4 sm:px-6 sm:pb-6 sm:pt-5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
                    {cart.count > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="font-neue text-[0.8rem] sm:text-[0.875rem] text-muted-foreground">Items in list</span>
                                <span className="font-neue text-[0.8rem] sm:text-[0.875rem] font-semibold text-foreground tabular-nums">{cartCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-neue text-[0.8rem] sm:text-[0.875rem] text-muted-foreground">Total quantity</span>
                                <span className="font-neue text-[0.8rem] sm:text-[0.875rem] font-semibold text-foreground tabular-nums">{totalUnits}</span>
                            </div>
                        </div>
                    )}

                    <p className="mt-2.5 rounded-lg bg-muted/40 px-3 py-2 text-center text-[0.8rem] font-medium text-muted-foreground">
                        No payment now - submit the list and our team will share pricing.
                    </p>

                    {/* Action buttons (Stacked on mobile so neither button truncates or gets blocked by floating widgets) */}
                    <div className="mt-3.5 flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-2.5">
                        <BrandButton
                            type="button"
                            asChild
                            className="h-12 w-full text-[0.9375rem] font-semibold sm:order-2"
                            onClick={() => setOpen(false)}
                        >
                            {cart.count ? (
                                <Link href={WEBSITE_ENQUIRY}>Submit Enquiry</Link>
                            ) : (
                                <span onClick={(e) => { e.preventDefault(); showToast('error', 'Your enquiry list is empty!') }}>
                                    Submit Enquiry
                                </span>
                            )}
                        </BrandButton>
                        <BrandOutlineButton
                            type="button"
                            asChild
                            className="h-12 w-full text-[0.9375rem] font-semibold sm:order-1"
                            onClick={() => setOpen(false)}
                        >
                            <Link href={WEBSITE_CART}>View List</Link>
                        </BrandOutlineButton>
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default Cart
