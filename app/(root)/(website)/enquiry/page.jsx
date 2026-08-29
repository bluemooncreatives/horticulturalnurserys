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
import { BadgeCheck, ClipboardList, Leaf, Minus, Plus, ShieldCheck, Trash2, User } from 'lucide-react'
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

    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null) // { ticketId } after a successful submit

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
                                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your enquiry reference</p>
                                <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-[var(--dark-red)]">{result.ticketId}</p>
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

    // ── Empty state ──────────────────────────────────────────────────
    if (cart.count === 0) {
        return (
            <div>
                <WebsiteBreadcrumb props={breadCrumb} />
                <section className="website-gutter py-20 lg:py-28">
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

            <section className="website-gutter py-10 lg:py-14">
                <div className="mx-auto grid w-full items-start gap-8 lg:grid-cols-[1fr_minmax(360px,420px)] lg:gap-10">

                    {/* LEFT: details form */}
                    <div className="min-w-0">
                        <Form {...form}>
                            <form id="enquiry-form" onSubmit={form.handleSubmit(submitEnquiry)}>

                                {/* Honeypot - visually hidden, ignored by humans */}
                                <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                                    <input tabIndex={-1} autoComplete="off" {...form.register('company')} />
                                </div>

                                <div className="mb-5 flex items-center gap-2">
                                    <User className="size-[18px] text-[var(--dark-red)]" strokeWidth={1.75} />
                                    <h2 className="font-neue text-base font-semibold uppercase tracking-[0.06em]">Your Contact Details</h2>
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

                                <div className="mb-5 mt-10 flex items-center gap-2">
                                    <Leaf className="size-[18px] text-[var(--dark-red)]" strokeWidth={1.75} />
                                    <h2 className="font-neue text-base font-semibold uppercase tracking-[0.06em]">Delivery Location <span className="ml-1 text-[0.8rem] font-medium normal-case tracking-normal text-muted-foreground">(optional)</span></h2>
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
                            </form>
                        </Form>
                    </div>

                    {/* RIGHT: enquiry list */}
                    <aside className="w-full">
                        <div className="space-y-4 lg:sticky lg:top-6">
                            <div className="overflow-hidden rounded-md border border-border/60 bg-background shadow-sm">
                                <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                                    <h2 className="font-neue text-lg font-semibold uppercase tracking-[0.04em]">Your Enquiry</h2>
                                    <span className="rounded-full bg-muted/60 px-2.5 py-0.5 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        {cart.count} {cart.count === 1 ? 'item' : 'items'}
                                    </span>
                                </div>

                                <div className="thin-scrollbar max-h-[360px] divide-y divide-border/50 overflow-y-auto px-5">
                                    {cart.products?.map((product) => (
                                        <div key={product.variantId} className="flex gap-3 py-4">
                                            <Link href={WEBSITE_PRODUCT_DETAILS(product.url)} className="relative h-[84px] w-[64px] flex-shrink-0 overflow-hidden rounded-md border border-border/40">
                                                <Image src={product.media || imgPlaceholder.src} fill sizes="64px" alt={product.name} className="object-cover object-center" />
                                            </Link>
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="line-clamp-2 font-neue text-[13px] font-semibold leading-snug text-foreground">
                                                        <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                                                    </h4>
                                                    <button type="button" aria-label="Remove item" onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))} className="flex-shrink-0 cursor-pointer text-muted-foreground/50 transition-colors hover:text-[var(--dark-red)]">
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                                {(product.size || product.color) && (
                                                    <span className="mt-1 w-fit rounded-full bg-muted/60 px-2 py-0.5 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                                                        {[product.size, product.color].filter(Boolean).join(' / ')}
                                                    </span>
                                                )}
                                                <div className="mt-auto flex items-center justify-between pt-2.5">
                                                    <div className="flex items-center rounded-full border border-border/60">
                                                        <Button type="button" variant="ghost" size="icon-xs" className="rounded-full disabled:opacity-40" disabled={product.qty <= 1} onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))} aria-label="Decrease quantity">
                                                            <Minus className="size-3" />
                                                        </Button>
                                                        <span className="w-9 text-center text-[0.8rem] font-semibold tabular-nums">{product.qty}</span>
                                                        <Button type="button" variant="ghost" size="icon-xs" className="rounded-full" disabled={product.qty >= MAX_CART_QTY} onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))} aria-label="Increase quantity">
                                                            <Plus className="size-3" />
                                                        </Button>
                                                    </div>
                                                    <span className="text-[0.8rem] font-medium uppercase tracking-[0.06em] text-muted-foreground">Price on enquiry</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
                                    <p className="flex items-start gap-2 text-[0.8rem] leading-relaxed text-muted-foreground">
                                        <ShieldCheck className="mt-0.5 size-4 flex-shrink-0 text-[var(--dark-red)]" />
                                        No payment is taken now. Submit your enquiry and our team will contact you with availability and a quote.
                                    </p>
                                </div>

                                <div className="border-t border-border/60 px-5 py-5">
                                    <ButtonLoading
                                        form="enquiry-form"
                                        type="submit"
                                        text="Submit Enquiry"
                                        loading={submitting}
                                        className="h-12 w-full rounded-sm bg-[var(--dark-red)] text-base font-semibold uppercase tracking-[0.04em] hover:bg-[var(--dark-red-2)] cursor-pointer"
                                    />
                                    <Link href={WEBSITE_CART} className="mt-3 flex items-center justify-center gap-1.5 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                                        ← Edit enquiry list
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    )
}

export default Enquiry
