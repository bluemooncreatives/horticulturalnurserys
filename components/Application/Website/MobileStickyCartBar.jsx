'use client'

import { useSelector } from 'react-redux'
import useHydrated from '@/hooks/useHydrated'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { WEBSITE_CART, WEBSITE_ENQUIRY } from '@/routes/WebsiteRoute'

/**
 * Shopify-style dynamic mobile fixed sticky bar.
 * Guides customers through each step of the enquiry funnel when products are in cart:
 *  - Storefront/Shop/Product pages (/shop*, /product*, /): points to /cart ("View Enquiry List")
 *  - Cart page (/cart): points to /enquiry ("Proceed to Enquiry")
 *  - Enquiry page (/enquiry): handled by Enquiry's own form-bound submit action
 *  - Empty cart or non-storefront pages: returns null
 */
const MobileStickyCartBar = () => {
    const cart = useSelector((store) => store.cartStore)
    const hydrated = useHydrated()
    const pathname = usePathname()

    // Only render on client when items exist
    if (!hydrated || !cart || cart.count === 0) {
        return null
    }

    // Do not show on /enquiry (which has its own form submit bar), admin pages, or empty cart
    if (!pathname || pathname === '/enquiry' || pathname.startsWith('/admin')) {
        return null
    }

    // Identify storefront shopping funnel pages
    const isCartPage = pathname === '/cart'
    const isShopPage = pathname === '/' || pathname.startsWith('/shop') || pathname.startsWith('/product')

    // Only display on relevant product/shop funnel routes
    if (!isCartPage && !isShopPage) {
        return null
    }

    const totalUnits = cart.products?.reduce((sum, p) => sum + (p.qty || 0), 0) || 0

    // Dynamic configuration depending on funnel step: one-word user-friendly action labels
    const targetHref = isCartPage ? WEBSITE_ENQUIRY : WEBSITE_CART
    const buttonText = isCartPage ? 'Enquire' : 'Cart'
    const subtitle = isCartPage
        ? 'Free quote & availability'
        : 'Price on enquiry'

    return (
        <aside
            aria-label="Enquiry progress"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] pt-2.5 px-4 sm:px-6"
        >
            <div className="mx-auto flex items-center justify-between gap-3 max-w-lg">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap">
                        <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                        <span>{cart.count} {cart.count === 1 ? 'item' : 'items'}</span>
                        <span className="text-muted-foreground font-normal">({totalUnits} {totalUnits === 1 ? 'unit' : 'units'})</span>
                    </div>
                    <p className="text-[0.75rem] font-medium text-muted-foreground whitespace-nowrap">
                        {subtitle}
                    </p>
                </div>

                <Link
                    href={targetHref}
                    className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-md bg-[var(--dark-red)] px-3.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[var(--dark-red-2)] active:scale-95 cursor-pointer flex-shrink-0 whitespace-nowrap"
                >
                    <span>{buttonText}</span>
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>
        </aside>
    )
}

export default MobileStickyCartBar
