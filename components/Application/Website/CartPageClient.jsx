'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WEBSITE_ENQUIRY, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'
import { MAX_CART_QTY } from '@/lib/cartConstants'
import { Skeleton } from '@/components/ui/skeleton'
import useHydrated from '@/hooks/useHydrated'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { showToast } from '@/lib/showToast'

const breadCrumb = { title: 'Enquiry' }

const CartPageClient = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const cart = useSelector((store) => store.cartStore)
    // The cart only exists in the browser (redux-persist), so until it has
    // rehydrated this component must render something that does not depend on
    // it - see useHydrated.
    const hydrated = useHydrated()

    const isEmpty = cart.count === 0

    return (
        <div>
            <WebsiteBreadcrumb props={breadCrumb} />

            <section className="website-gutter pt-6 pb-20 sm:py-10 lg:py-14 bg-background">
                <div className="grid w-full gap-6 lg:grid-cols-[290px_1fr] lg:gap-8">
                    {!hydrated ? (
                        /* Placeholder rather than the empty state: the server
                           cannot know the cart is empty, and flashing "your
                           list is empty" before the items appear reads as a
                           bug to the shopper. */
                        <div className="lg:col-span-2 space-y-4" aria-hidden>
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                    ) : isEmpty ? (
                        <div className="lg:col-span-2">
                            <Card className="mx-auto w-full max-w-2xl border-border/60 shadow-sm">
                                <CardHeader className="border-b border-border/60">
                                    <CardTitle className="text-xl font-semibold uppercase">Your enquiry list is empty</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-muted-foreground">
                                    <p>You haven&apos;t added any products yet.</p>
                                    <p>Browse the catalogue and add the plants &amp; supplies you need to send us an enquiry.</p>
                                </CardContent>
                                <CardFooter className="flex justify-start">
                                    <Button type="button" asChild variant="brand" className="h-12 rounded-[var(--radius-sm)] px-8 text-[0.9375rem] font-semibold">
                                        <Link href={WEBSITE_SHOP}>Browse Catalogue</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ) : (
                        <>
                            {/* Mobile: Order 2 (below items). Desktop: Order 1 (sidebar on left). */}
                            <aside className="w-full order-2 lg:order-1">
                                <div className="lg:sticky lg:top-24">
                                    <Card className="border-border/60 shadow-xs">
                                        <CardHeader className="border-b border-border/60 pb-3">
                                            <CardTitle className="text-base font-semibold uppercase tracking-wide">Enquiry Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 pt-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Products</span>
                                                <span className="font-medium tabular-nums">{cart.count}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Total quantity</span>
                                                <span className="font-medium tabular-nums">
                                                    {cart.products.reduce((sum, p) => sum + (p.qty || 0), 0)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                No payment is taken here. Submit your enquiry and our team will get back to you with availability and pricing.
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex flex-col gap-2.5 pt-2">
                                            <Button type="button" onClick={() => router.push(WEBSITE_ENQUIRY)} variant="brand" className="h-12 w-full rounded-[var(--radius-sm)] text-[0.9375rem] font-semibold cursor-pointer">
                                                Submit Enquiry
                                            </Button>
                                            <Button type="button" variant="link" asChild className="h-11 p-0 text-[0.875rem] font-semibold text-foreground">
                                                <Link href={WEBSITE_SHOP}>Continue Browsing</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </aside>

                            {/* Mobile: Order 1 (at top). Desktop: Order 2 (main content on right). */}
                            <div className="w-full order-1 lg:order-2">
                                <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-xs">
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-3 md:hidden">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Items ({cart.count})
                                        </span>
                                        <span className="text-[0.75rem] text-muted-foreground">
                                            {cart.products.reduce((sum, p) => sum + (p.qty || 0), 0)} total units
                                        </span>
                                    </div>

                                    {/* Mobile Card-Based List */}
                                    <div className="divide-y divide-border/60 md:hidden">
                                        {cart.products.map((product) => (
                                            <div
                                                key={product.variantId}
                                                className="flex items-start gap-3.5 p-3.5 transition-colors hover:bg-muted/10 sm:p-4"
                                            >
                                                {/* Thumbnail */}
                                                <Link
                                                    href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/20"
                                                >
                                                    <Image
                                                        src={product.media || imgPlaceholder.src}
                                                        alt={product.name}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover object-center"
                                                    />
                                                </Link>

                                                {/* Content Column */}
                                                <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
                                                    {/* Title & Delete */}
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                                                                <Link
                                                                    href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                                                    className="transition-colors hover:text-[var(--brand-primary)]"
                                                                >
                                                                    {product.name}
                                                                </Link>
                                                            </h4>
                                                            <button
                                                                type="button"
                                                                aria-label="Remove item"
                                                                onClick={() => {
                                                                    dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))
                                                                    showToast('success', 'Removed from your enquiry list.')
                                                                }}
                                                                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        </div>

                                                        {/* Variant badge */}
                                                        {(product.color || product.size) && (
                                                            <div className="mt-1">
                                                                <span className="inline-block rounded-[var(--radius-sm)] bg-muted/70 px-2.5 py-0.5 text-[0.75rem] font-medium uppercase tracking-wide text-muted-foreground">
                                                                    {[product.color, product.size].filter(Boolean).join(' / ')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Bottom Row: Stepper + Price */}
                                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-0.5">
                                                        {/* Pill Stepper */}
                                                        <div className="inline-flex h-8 items-center rounded-[var(--radius-sm)] border border-border/70 bg-background shadow-2xs">
                                                            <button
                                                                type="button"
                                                                aria-label="Decrease quantity"
                                                                disabled={product.qty <= 1}
                                                                onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))}
                                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-35"
                                                            >
                                                                <Minus className="size-3.5" />
                                                            </button>
                                                            <span className="w-8 text-center text-xs font-semibold tabular-nums text-foreground">
                                                                {product.qty}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                aria-label="Increase quantity"
                                                                disabled={product.qty >= MAX_CART_QTY}
                                                                onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}
                                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-35"
                                                            >
                                                                <Plus className="size-3.5" />
                                                            </button>
                                                        </div>

                                                        {/* Price on enquiry */}
                                                        <span className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--dark-red)]">
                                                            Price on enquiry
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden md:block">
                                        <Table>
                                            <TableHeader className="bg-muted/40">
                                                <TableRow>
                                                    <TableHead className="px-4">Product</TableHead>
                                                    <TableHead className="px-4 text-center">Quantity</TableHead>
                                                    <TableHead className="px-4 text-center">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cart.products.map((product) => (
                                                    <TableRow key={product.variantId} className="border-b">
                                                        <TableCell className="px-4 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <Link
                                                                    href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                                                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border/60"
                                                                >
                                                                    <Image
                                                                        src={product.media || imgPlaceholder.src}
                                                                        fill
                                                                        sizes="64px"
                                                                        alt={product.name}
                                                                        className="object-cover"
                                                                    />
                                                                </Link>
                                                                <div>
                                                                    <h4 className="line-clamp-1 text-base font-semibold">
                                                                        <Link
                                                                            href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                                                            className="transition-colors hover:text-[var(--brand-primary)]"
                                                                        >
                                                                            {product.name}
                                                                        </Link>
                                                                    </h4>
                                                                    {(product.color || product.size) && (
                                                                        <p className="text-xs uppercase text-muted-foreground">
                                                                            {[product.color, product.size].filter(Boolean).join(' / ')}
                                                                        </p>
                                                                    )}
                                                                    <p className="mt-1 text-[0.8rem] font-medium uppercase text-[var(--dark-red)]">
                                                                        Price on enquiry
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-4">
                                                            <div className="flex justify-center">
                                                                <div className="inline-flex h-9 items-center rounded-[var(--radius-sm)] border border-border/70 bg-background shadow-2xs">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon-sm"
                                                                        className="h-8 w-8 rounded-[var(--radius-sm)] cursor-pointer"
                                                                        disabled={product.qty <= 1}
                                                                        onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))}
                                                                    >
                                                                        <Minus className="size-4" />
                                                                    </Button>
                                                                    <span className="w-10 text-center text-sm font-semibold tabular-nums">
                                                                        {product.qty}
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon-sm"
                                                                        className="h-8 w-8 rounded-[var(--radius-sm)] cursor-pointer"
                                                                        disabled={product.qty >= MAX_CART_QTY}
                                                                        onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}
                                                                    >
                                                                        <Plus className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-4 text-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="cursor-pointer text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                                                                onClick={() => {
                                                                    dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))
                                                                    showToast('success', 'Removed from your enquiry list.')
                                                                }}
                                                            >
                                                                <Trash2 className="size-5" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}

export default CartPageClient
