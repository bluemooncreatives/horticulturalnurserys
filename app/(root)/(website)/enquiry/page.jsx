'use client'

import ButtonLoading from '@/components/Application/ButtonLoading'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { BrandButton } from '@/components/Application/Website/BrandButton'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { MAX_CART_QTY } from '@/lib/cartConstants'
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { addIntoCart, clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import useHydrated from '@/hooks/useHydrated'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, BadgeCheck, ChevronDown, ClipboardList, Leaf, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, User } from 'lucide-react'
import { z } from 'zod'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'

const breadCrumb = { title: 'Enquiry' }

// Optional contact/location fields - the enquiry model favours low friction, so
// only name/email/phone are required. `company` is a honeypot (bots fill it).
const enquiryFormSchema = zSchema
    .pick({ name: true, email: true, phone: true })
    .extend({
        address: z.string().trim().max(300, 'Address is too long.').optional().or(z.literal('')),
        city: z.string().trim().max(100, 'City is too long.').optional().or(z.literal('')),
        state: z.string().trim().max(100, 'State is too long.').optional().or(z.literal('')),
        pincode: z.string().trim().max(20, 'Pincode is too long.').optional().or(z.literal('')),
        country: z.string().trim().max(100, 'Country is too long.').optional().or(z.literal('')),
        message: z.string().trim().max(2000, 'Note is too long.').optional().or(z.literal('')),
        company: z.string().optional(),
    })

const Enquiry = () => {
    const dispatch = useDispatch()
    const cart = useSelector((store) => store.cartStore)
    const hydrated = useHydrated()

    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null) // { ticketId } after a successful submit
    const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

    const totalUnits = cart.products?.reduce((sum, p) => sum + (p.qty || 0), 0) || 0

    // Re-verify the persisted enquiry list against live products so stale lines
    // (deleted product/variant) are dropped and display data (name/size/media)
    // is refreshed before the customer submits.
    const { data: verified } = useFetch('/api/cart-verification', 'POST', { data: cart.products })

    useEffect(() => {
        if (verified?.success) {
            dispatch(clearCart())
            verified.data.forEach((item) => dispatch(addIntoCart(item)))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verified])

    const form = useForm({
        resolver: zodResolver(enquiryFormSchema),
        defaultValues: {
            name: '', email: '', phone: '',
            address: '', city: '', state: '', pincode: '', country: '',
            message: '', company: '',
        },
    })

    const onFormError = (errors) => {
        const firstErrorKey = Object.keys(errors)[0]
        if (firstErrorKey) {
            const el = document.querySelector(`[name="${firstErrorKey}"]`)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.focus?.()
            }
            showToast('error', 'Please fill in all required contact details.')
        }
    }

    const submitEnquiry = async (values) => {
        if (cart.count === 0) {
            showToast('error', 'Your enquiry list is empty.')
            return
        }

        setSubmitting(true)
        try {
            const products = cart.products.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                qty: item.qty,
            }))

            const { data: response } = await axios.post('/api/enquiry', { ...values, products })
            if (!response.success) {
                throw new Error(response.message)
            }

            dispatch(clearCart())
            form.reset()
            setResult({ ticketId: response?.data?.ticketId || null })
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setSubmitting(false)
        }
    }

    // ── Success screen ───────────────────────────────────────────────
    if (result) {
        return (
            <div>
                <WebsiteBreadcrumb props={breadCrumb} />
                <section className="website-gutter py-16 lg:py-24">
                    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-border/60 bg-background px-8 py-14 text-center shadow-sm">
                        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                            <BadgeCheck className="size-9" strokeWidth={1.5} />
                        </div>
                        <h1 className="font-neue mt-6 text-2xl font-semibold">Enquiry submitted</h1>
                        <p className="font-neue mt-2 max-w-sm text-sm text-muted-foreground">
                            Thank you! We&apos;ve received your enquiry and our team will get back to you shortly with availability and pricing. A confirmation has been emailed to you.
                        </p>
                        {result.ticketId && (
                            <div className="mt-6 w-full rounded-xl border border-border/60 bg-muted/30 px-6 py-4">
                                <p className="text-[0.8rem] font-semibold uppercase text-muted-foreground">Your enquiry reference</p>
                                <p className="mt-1 font-mono text-lg font-semibold text-[var(--dark-red)]">{result.ticketId}</p>
                            </div>
                        )}
                        <div className="mt-8 w-full max-w-[240px]">
                            <BrandButton asChild>
                                <Link href={WEBSITE_SHOP}>Continue Browsing</Link>
                            </BrandButton>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    // ── Pre-hydration ────────────────────────────────────────────────
    // cart.count is 0 on the server for everyone, so branching on it before
    // redux-persist has rehydrated renders the empty state into the HTML and
    // then contradicts it on the client. Hold a neutral placeholder instead.
    if (!hydrated) {
        return (
            <div>
                <WebsiteBreadcrumb props={breadCrumb} />
                <section className="website-gutter pt-6 pb-20 sm:py-10 lg:py-14">
                    <div className="mx-auto max-w-md space-y-4" aria-hidden>
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                </section>
            </div>
        )
    }

    // ── Empty state ──────────────────────────────────────────────────
    if (cart.count === 0) {
        return (
            <div>
                <WebsiteBreadcrumb props={breadCrumb} />
                <section className="website-gutter pt-6 pb-20 sm:py-10 lg:py-14">
                    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border/60 bg-background px-8 py-14 text-center shadow-sm">
                        <div className="flex size-16 items-center justify-center rounded-full bg-[var(--brand-cream)]/60 text-[var(--dark-red)]">
                            <ClipboardList className="size-8" strokeWidth={1.5} />
                        </div>
                        <h4 className="font-neue mt-5 text-2xl font-semibold">Your enquiry list is empty</h4>
                        <p className="font-neue mt-2 max-w-[280px] text-sm text-muted-foreground">
                            Add the plants and supplies you&apos;re interested in, then come back to send us your enquiry.
                        </p>
                        <div className="mt-6 w-full max-w-[220px]">
                            <BrandButton asChild>
                                <Link href={WEBSITE_SHOP}>Browse Catalogue</Link>
                            </BrandButton>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    // ── Enquiry form ─────────────────────────────────────────────────
    return (
        <div>
            <WebsiteBreadcrumb props={breadCrumb} />

            <section className="website-gutter pt-6 pb-20 sm:py-10 lg:py-14">
                <div className="mx-auto flex flex-col items-start gap-6 lg:grid lg:grid-cols-[1fr_minmax(360px,420px)] lg:gap-10">

                    {/* MOBILE FIRST: Enquiry summary block at the top on mobile, sticky sidebar on desktop */}
                    <aside className="w-full order-1 lg:order-2">
                        <div className="space-y-4 lg:sticky lg:top-24">
                            <div className="overflow-hidden rounded-md border border-border/60 bg-background shadow-sm">
                                
                                {/* Summary Header (Clickable on mobile to expand/collapse) */}
                                <div
                                    onClick={() => setMobileSummaryOpen((prev) => !prev)}
                                    className="flex items-center justify-between border-b border-border/60 px-5 py-4 cursor-pointer select-none lg:cursor-default"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            setMobileSummaryOpen((prev) => !prev)
                                        }
                                    }}
                                    aria-expanded={mobileSummaryOpen}
                                    aria-label="Toggle enquiry items summary"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-[var(--brand-cream)] text-[var(--dark-red)] lg:hidden">
                                            <ShoppingBag className="size-3.5" />
                                        </div>
                                        <div>
                                            <h2 className="font-neue text-base sm:text-lg font-semibold uppercase tracking-tight">Your Enquiry</h2>
                                            <p className="text-[0.75rem] text-muted-foreground lg:hidden">
                                                {totalUnits} {totalUnits === 1 ? 'unit' : 'units'} • Price on enquiry
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-muted/70 px-2.5 py-0.5 text-[0.8rem] font-medium uppercase text-muted-foreground">
                                            {cart.count} {cart.count === 1 ? 'item' : 'items'}
                                        </span>
                                        {/* Mobile toggle arrow */}
                                        <div className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted lg:hidden">
                                            <ChevronDown className={`size-4 transition-transform duration-200 ${mobileSummaryOpen ? 'rotate-180 text-foreground' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Compact Preview Strip (Mobile only, shown when collapsed) */}
                                {!mobileSummaryOpen && (
                                    <div
                                        onClick={() => setMobileSummaryOpen(true)}
                                        className="flex items-center justify-between bg-muted/15 px-4 py-2.5 cursor-pointer transition-colors hover:bg-muted/30 lg:hidden"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
                                                {cart.products?.slice(0, 3).map((product, idx) => (
                                                    <div key={product.variantId || idx} className="relative size-7 rounded-full border-2 border-background overflow-hidden bg-muted">
                                                        <Image src={product.media || imgPlaceholder.src} fill sizes="28px" alt={product.name} className="object-cover object-center" />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate font-neue">
                                                {cart.products?.length === 1
                                                    ? cart.products[0].name
                                                    : `${cart.count} plants selected`}
                                            </p>
                                        </div>
                                        <span className="text-[0.75rem] font-semibold text-[var(--dark-red)] flex-shrink-0">
                                            View details
                                        </span>
                                    </div>
                                )}

                                {/* Full Item List (Always visible on desktop; toggleable on mobile) */}
                                <div className={`${mobileSummaryOpen ? 'block' : 'hidden lg:block'}`}>
                                    <div className="thin-scrollbar max-h-[360px] divide-y divide-border/50 overflow-y-auto px-5">
                                        {cart.products?.map((product) => (
                                            <div key={product.variantId} className="flex gap-3 py-4">
                                                <Link href={WEBSITE_PRODUCT_DETAILS(product.url)} className="relative h-[84px] w-[64px] flex-shrink-0 overflow-hidden rounded-md border border-border/40">
                                                    <Image src={product.media || imgPlaceholder.src} fill sizes="64px" alt={product.name} className="object-cover object-center" />
                                                </Link>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="line-clamp-2 font-neue text-[0.8rem] font-semibold leading-snug text-foreground">
                                                            <Link href={WEBSITE_PRODUCT_DETAILS(product.url)} className="hover:text-[var(--dark-red)] transition-colors">{product.name}</Link>
                                                        </h4>
                                                        <button
                                                            type="button"
                                                            aria-label="Remove item"
                                                            onClick={() => {
                                                                dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))
                                                                showToast('success', 'Removed from enquiry list')
                                                            }}
                                                            className="flex-shrink-0 cursor-pointer p-1 text-muted-foreground/50 transition-colors hover:text-[var(--dark-red)]"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                    {(product.size || product.color) && (
                                                        <span className="mt-1 w-fit rounded-full bg-muted/60 px-2 py-0.5 text-[0.75rem] font-medium uppercase text-muted-foreground">
                                                            {[product.size, product.color].filter(Boolean).join(' / ')}
                                                        </span>
                                                    )}
                                                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 pt-2">
                                                        <div className="flex items-center rounded-full border border-border/60 bg-background shadow-xs">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-xs"
                                                                className="rounded-full disabled:opacity-40 cursor-pointer"
                                                                disabled={product.qty <= 1}
                                                                onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))}
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <Minus className="size-3" />
                                                            </Button>
                                                            <span className="w-8 text-center text-[0.8rem] font-semibold tabular-nums">{product.qty}</span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-xs"
                                                                className="rounded-full cursor-pointer"
                                                                disabled={product.qty >= MAX_CART_QTY}
                                                                onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}
                                                                aria-label="Increase quantity"
                                                            >
                                                                <Plus className="size-3" />
                                                            </Button>
                                                        </div>
                                                        <span className="text-[0.75rem] font-medium uppercase text-muted-foreground whitespace-nowrap">Price on enquiry</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Trust & payment note */}
                                    <div className="border-t border-border/60 bg-muted/20 px-5 py-3.5">
                                        <p className="flex items-start gap-2 text-[0.8rem] leading-relaxed text-muted-foreground">
                                            <ShieldCheck className="mt-0.5 size-4 flex-shrink-0 text-[var(--dark-red)]" />
                                            No payment is taken now. Submit your enquiry and our team will contact you with availability and a quote.
                                        </p>
                                    </div>

                                    {/* Desktop Submit Box (Hidden on mobile to keep submit button located next to form) */}
                                    <div className="hidden border-t border-border/60 px-5 py-5 lg:block">
                                        <ButtonLoading
                                            form="enquiry-form"
                                            type="submit"
                                            text="Submit Enquiry"
                                            loading={submitting}
                                            className="h-12 w-full rounded-sm bg-[var(--dark-red)] text-base font-semibold uppercase hover:bg-[var(--dark-red-2)] cursor-pointer"
                                        />
                                        <Link href={WEBSITE_CART} className="mt-3 flex items-center justify-center gap-1.5 text-[0.8rem] font-medium uppercase text-muted-foreground transition-colors hover:text-foreground">
                                            ← Edit enquiry list
                                        </Link>
                                    </div>

                                    {/* Mobile expanded actions */}
                                    <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 lg:hidden">
                                        <Link href={WEBSITE_CART} className="text-[0.8rem] font-medium uppercase text-muted-foreground transition-colors hover:text-foreground">
                                            ← Edit list
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setMobileSummaryOpen(false)}
                                            className="text-[0.8rem] font-medium text-[var(--dark-red)] hover:underline"
                                        >
                                            Hide details ▴
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* FORM: details form (rendered second on mobile, first on desktop) */}
                    <div className="w-full min-w-0 order-2 lg:order-1">
                        <Form {...form}>
                            <form id="enquiry-form" onSubmit={form.handleSubmit(submitEnquiry, onFormError)}>

                                {/* Honeypot - visually hidden, ignored by humans */}
                                <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                                    <input tabIndex={-1} autoComplete="off" {...form.register('company')} />
                                </div>

                                <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <User className="size-[18px] text-[var(--dark-red)]" strokeWidth={1.75} />
                                        <h2 className="font-neue text-base font-semibold uppercase tracking-tight">Your Contact Details</h2>
                                    </div>
                                    <span className="text-[0.75rem] font-medium uppercase text-muted-foreground tracking-wider">Required</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input placeholder="Full name*" className="form-field" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input type="email" placeholder="Email*" className="form-field" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormControl>
                                                <PhoneInput placeholder="Phone number*" className="form-field" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="mb-4 mt-8 lg:mt-10 flex items-center justify-between border-b border-border/40 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <Leaf className="size-[18px] text-[var(--dark-red)]" strokeWidth={1.75} />
                                        <h2 className="font-neue text-base font-semibold uppercase tracking-tight">Delivery Location</h2>
                                    </div>
                                    <span className="text-[0.75rem] font-medium uppercase text-muted-foreground tracking-wider">Optional</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormControl><Textarea autoComplete="street-address" placeholder="Address (optional)" className="form-field form-field-area" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="city" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input autoComplete="address-level2" placeholder="City (optional)" className="form-field" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="pincode" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input inputMode="numeric" autoComplete="postal-code" placeholder="Pincode (optional)" className="form-field" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="state" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input autoComplete="address-level1" placeholder="State (optional)" className="form-field" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="country" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input autoComplete="country-name" placeholder="Country (optional)" className="form-field" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="message" render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormControl><Textarea placeholder="Add a note (optional) - timeline, quantities, special requirements, etc." className="form-field form-field-area" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                {/* Mobile In-Flow Submit Area (Directly below fields on mobile) */}
                                <div className="mt-6 space-y-2.5 lg:hidden">
                                    <ButtonLoading
                                        form="enquiry-form"
                                        type="submit"
                                        text="Submit Enquiry"
                                        loading={submitting}
                                        className="h-12 w-full rounded-sm bg-[var(--dark-red)] text-base font-semibold uppercase hover:bg-[var(--dark-red-2)] cursor-pointer shadow-sm"
                                    />
                                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                                        <ShieldCheck className="size-3.5 text-[var(--dark-red)]" />
                                        No payment required • We&apos;ll confirm availability &amp; quote promptly
                                    </p>
                                </div>

                            </form>
                        </Form>
                    </div>

                </div>
            </section>

            {/* Mobile Sticky Bottom CTA Bar */}
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] pt-2.5 px-4 sm:px-6">
                <div className="mx-auto flex items-center justify-between gap-3 max-w-lg">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap">
                            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                            <span>{cart.count} {cart.count === 1 ? 'item' : 'items'}</span>
                            <span className="text-muted-foreground font-normal">({totalUnits} {totalUnits === 1 ? 'unit' : 'units'})</span>
                        </div>
                        <p className="text-[0.75rem] font-medium text-muted-foreground whitespace-nowrap">
                            No payment required &bull; Free quote
                        </p>
                    </div>

                    <ButtonLoading
                        form="enquiry-form"
                        type="submit"
                        size="sm"
                        text={
                            <span className="inline-flex items-center gap-1.5">
                                <span>Submit</span>
                                <ArrowRight className="size-3.5" />
                            </span>
                        }
                        loading={submitting}
                        className="h-8 sm:h-9 items-center justify-center gap-1.5 rounded-md bg-[var(--dark-red)] px-3.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[var(--dark-red-2)] active:scale-95 cursor-pointer flex-shrink-0 whitespace-nowrap"
                    />
                </div>
            </div>
        </div>
    )
}

export default Enquiry
