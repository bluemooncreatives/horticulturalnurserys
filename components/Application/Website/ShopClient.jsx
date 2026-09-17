'use client'
import dynamic from 'next/dynamic'
import Sorting from '@/components/Application/Website/Sorting'

// Filter is never server-rendered (isDesktop starts false; mobile Sheet starts closed)
// so ssr:false defers its Accordion/Checkbox/Slider/radix-ui chunk entirely.
const Filter = dynamic(() => import('@/components/Application/Website/Filter'), { ssr: false })
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ProductBox from '@/components/Application/Website/ProductBox'
import ProductBoxSkeleton from '@/components/Application/Website/ProductBoxSkeleton'
import ShopPagination from '@/components/Application/Website/ShopPagination'
import { BrandButton } from '@/components/Application/Website/BrandButton'
import Link from 'next/link'
import { PackageSearch, RotateCcw, SlidersHorizontal, Store, X } from 'lucide-react'

// Storefront shows a denser 5-row (2-col) grid on phones and a 3×3 grid on
// larger screens. The server pre-renders the first page at the desktop size,
// so any mobile-only size difference is resolved client-side after mount.
const DESKTOP_PAGE_SIZE = 9
const MOBILE_PAGE_SIZE = 12

const ShopClient = ({ initialProducts = [], initialTotal = 0, initialTotalPages = 0, initialFilters, initialSearchParamsString = '', heading = 'All Products' }) => {
    const searchParams = useSearchParams()
    const searchParamString = searchParams.toString()
    const router = useRouter()
    const [sorting, setSorting] = useState('default_sorting')
    const [page, setPage] = useState(0)
    const [isMobileFilter, setIsMobileFilter] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)
    // Mobile (< sm) shows 12 cards/page (6 clean rows of the 2-col grid);
    // everything else keeps the server's 9.
    // Starts false so SSR + first client render match; corrected after mount.
    const [isMobile, setIsMobile] = useState(false)
    const gridTopRef = useRef(null)

    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1025px)')

        const onChange = (event) => {
            setIsDesktop(event.matches)
        }

        setIsDesktop(mediaQuery.matches)
        mediaQuery.addEventListener('change', onChange)

        return () => {
            mediaQuery.removeEventListener('change', onChange)
        }
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 639px)')

        const onChange = (event) => {
            setIsMobile(event.matches)
        }

        setIsMobile(mediaQuery.matches)
        mediaQuery.addEventListener('change', onChange)

        return () => {
            mediaQuery.removeEventListener('change', onChange)
        }
    }, [])

    // Filters, sort, or page size changed → always restart at the first page,
    // otherwise the user could be stranded on a page index that no longer exists
    // (e.g. switching from 9- to 12-per-page shrinks the total page count).
    useEffect(() => {
        setPage(0)
    }, [searchParamString, sorting, pageSize])

    const fetchProduct = useCallback(async (pageParam) => {
        const { data: getProduct } = await axios.get('/api/shop', {
            params: {
                page: pageParam,
                limit: pageSize,
                sort: sorting,
                ...(searchParamString ? Object.fromEntries(new URLSearchParams(searchParamString)) : {}),
            }
        })
        if (!getProduct.success) {
            throw new Error(getProduct.message || 'Failed to load products.')
        }
        return getProduct.data
    }, [sorting, searchParamString, pageSize])

    const isInitialQuery = searchParamString === initialSearchParamsString
        && sorting === 'default_sorting'

    const { error, data, isFetching, isPending, refetch } = useQuery({
        queryKey: ['products', sorting, searchParamString, page, pageSize],
        queryFn: () => fetchProduct(page),
        // Reuse the server-rendered first page so the initial paint needs no
        // refetch - but only when the client wants the same size the server
        // rendered (desktop 9). Mobile (12) fetches its own first page.
        initialData: (page === 0 && isInitialQuery && pageSize === DESKTOP_PAGE_SIZE)
            ? { products: initialProducts, total: initialTotal, totalPages: initialTotalPages, page: 0 }
            : undefined,
        // Keep the current cards visible while the next page (or the mobile
        // page-size swap) loads, so pagination doesn't flash a skeleton.
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    })

    // React Query reports an optimistic `isFetching: true` while server-rendering
    // (it is describing the fetch it *would* start on mount), but the first
    // client render sees the fresh initialData and reports false. Anything drawn
    // from it therefore differs between the two passes - that is what made the
    // pagination emit `disabled` on the server and not on the client, and React
    // bailed out of hydrating the subtree. Treat the list as idle until mounted;
    // from then on `busy` tracks isFetching exactly.
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const busy = mounted && isFetching

    const products = data?.products ?? []
    const total = data?.total ?? 0
    const totalPages = data?.totalPages ?? 0

    // If the result set shrank below the current page (e.g. tighter filter),
    // fall back to the last valid page.
    const pageOutOfRange = !busy && totalPages > 0 && page > totalPages - 1
    useEffect(() => {
        if (pageOutOfRange) {
            setPage(totalPages - 1)
        }
    }, [pageOutOfRange, totalPages])

    // No cached data for this page yet, or we're about to clamp → show skeletons.
    const showSkeleton = isPending || pageOutOfRange
    const showEmptyState = !busy && !error && total === 0
    const resultCount = error ? null : total

    // Applied filters, resolved to display labels. The URL carries slugs
    // (?parent=plants&category=orchids); the panel has the name lists, so this
    // maps one to the other and falls back to the raw value for anything it
    // cannot resolve rather than dropping the chip.
    const FACET_LABELS = { bestseller: 'Bestsellers', freshly: 'Freshly Arrived', q: 'Search' }

    const activeFilters = (() => {
        const params = new URLSearchParams(searchParamString)
        const nameFor = (list, slug) =>
            (list ?? []).find((entry) => entry?.slug === slug)?.name ?? slug
        const out = []
        for (const [key, raw] of params.entries()) {
            for (const value of String(raw).split(',').filter(Boolean)) {
                let label = value
                if (key === 'parent') label = nameFor(initialFilters?.parents, value)
                else if (key === 'category') label = nameFor(initialFilters?.categories, value)
                else if (key === 'color') label = value
                else if (FACET_LABELS[key]) label = key === 'q' ? `"${value}"` : FACET_LABELS[key]
                out.push({ key, value, label })
            }
        }
        return out
    })()

    // Number of distinct facets the shopper has applied - drives the count
    // badge on the mobile Filter trigger and the drawer header.
    const activeFilterCount = activeFilters.length

    // Drop a single value from a possibly multi-value param, then push the
    // rewritten query (or the bare shop URL once nothing is left).
    const removeFilter = (key, value) => {
        const params = new URLSearchParams(searchParamString)
        const remaining = String(params.get(key) ?? '')
            .split(',')
            .filter((entry) => entry && entry !== value)
        if (remaining.length) params.set(key, remaining.join(','))
        else params.delete(key)
        const qs = params.toString()
        router.push(qs ? `${WEBSITE_SHOP}?${qs}` : WEBSITE_SHOP, { scroll: false })
    }

    const handlePageChange = (nextPageIndex) => {
        setPage(nextPageIndex)
        requestAnimationFrame(() => {
            gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
    }

    return (
        <div>
            {/* Page title. Previously an aria-hidden div whose gradient mask cut
                the descenders off mid-letterform on phones and left the page
                with no h1 at all. Now a real heading: full-opacity type, no
                mask, and vertical space that comes from padding rather than a
                fixed pixel height, so it can never clip its own text. */}
            <section className="website-gutter bg-background pt-24 pb-4 sm:pt-28 sm:pb-5 lg:pt-32 lg:pb-6">
                <h1
                    className="font-neue font-semibold uppercase leading-[1.1] tracking-[-0.02em] text-[var(--brand-primary)]"
                    style={{ fontSize: "clamp(2rem, 6.5vw, 4rem)" }}
                >
                    {heading}
                </h1>
            </section>

            <section className='website-gutter bg-background pt-0 pb-20 sm:pb-10 lg:pb-14'>
                <div className="grid w-full gap-6 lg:grid-cols-[290px_1fr] lg:gap-8">
                    {/* The aside shell always renders (CSS-hidden below lg) so the
                        sidebar column is occupied from the server-rendered first
                        paint - if it only mounted after hydration (isDesktop flips
                        in an effect), the product grid would start in the 290px
                        column and jump right when the aside appeared, a large CLS.
                        Filter itself still mounts only on desktop so mobile never
                        downloads its chunk. */}
                    <aside className='hidden w-full lg:block'>
                        <div className='sticky top-24'>
                            {isDesktop && <Filter filters={initialFilters} />}
                        </div>
                    </aside>
                    {!isDesktop && (
                        <Sheet open={isMobileFilter} onOpenChange={setIsMobileFilter}>
                            <SheetContent side='left' className="flex w-[86%] max-w-sm flex-col gap-0 bg-background p-0">
                                {/* Header - matches the hamburger menu's sheet chrome (icon + title
                                    stack, same title scale) so the two slide-out panels read as one
                                    family of components. The strapline is screen-reader-only: it
                                    satisfies Radix's description requirement without spending ~30px
                                    of a phone's panel on copy that tells the user nothing. */}
                                <SheetHeader className="flex-shrink-0 gap-0 border-b border-[var(--border)] px-5 py-3.5 pr-12">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-cream)]/60 text-[var(--brand-primary)]">
                                            <SlidersHorizontal className="size-3.5" strokeWidth={1.75} />
                                        </span>
                                        <SheetTitle className="flex min-w-0 items-center gap-2 font-neue text-[1.125rem] font-semibold leading-tight text-[var(--brand-primary)]">
                                            Filter
                                            {activeFilterCount > 0 && (
                                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-[0.75rem] font-semibold text-[var(--brand-white)]">
                                                    {activeFilterCount}
                                                </span>
                                            )}
                                        </SheetTitle>
                                        <SheetDescription className="sr-only">
                                            Refine the product list by type, category and colour.
                                        </SheetDescription>
                                    </div>
                                </SheetHeader>

                                {/* Applied filters. Without this the only way to see or undo a
                                    selection was to scroll the accordions and hunt for the filled
                                    chip - the panel gave no running summary of its own state. */}
                                {activeFilters.length > 0 && (
                                    <div className="flex-shrink-0 border-b border-[var(--border)] bg-background px-4 py-2.5">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <span className="font-neue text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                                                Applied
                                            </span>
                                            <Link
                                                href={WEBSITE_SHOP}
                                                onClick={() => setIsMobileFilter(false)}
                                                className="-my-2 flex h-11 shrink-0 items-center px-1 font-neue text-[0.75rem] font-semibold text-[var(--brand-primary)] underline underline-offset-2"
                                            >
                                                Clear all
                                            </Link>
                                        </div>
                                        <div className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 no-scrollbar">
                                            {activeFilters.map((f) => (
                                                <button
                                                    key={f.key + '-' + f.value}
                                                    type="button"
                                                    onClick={() => removeFilter(f.key, f.value)}
                                                    aria-label={'Remove filter ' + f.label}
                                                    className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--form-field-border)] bg-[var(--brand-white)] px-3 font-neue text-[0.8rem] font-medium text-[var(--brand-primary)]"
                                                >
                                                    {f.label}
                                                    <X className="size-3.5 shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Scrollable filter body */}
                                <div className="shop-filter-panel min-h-0 flex-1 overflow-y-auto px-4 py-4">
                                    <Filter filters={initialFilters} showClearLink={false} showTitle={false} />
                                </div>

                                {/* Sticky action footer - one dominant full-width action (matches
                                    the hamburger menu's pinned Cart bar) with Clear All demoted to a
                                    small link above it, rather than two equal-weight buttons. */}
                                <div className="flex-shrink-0 border-t border-[var(--border)] bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                                    <BrandButton type="button" onClick={() => setIsMobileFilter(false)} className="h-12 w-full rounded-[var(--radius-sm)] text-[0.9375rem] font-semibold tracking-normal">
                                        {typeof resultCount === 'number'
                                            ? `Show ${resultCount} ${resultCount === 1 ? 'item' : 'items'}`
                                            : 'Show Results'}
                                    </BrandButton>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}

                    <div className='w-full'>
                        <div className="flex flex-col border-b pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-0">
                            <Sorting
                                sorting={sorting}
                                setSorting={setSorting}
                                mobileFilterOpen={isMobileFilter}
                                setMobileFilterOpen={setIsMobileFilter}
                                resultCount={resultCount}
                                activeFilterCount={activeFilterCount}
                            />
                        </div>

                        {/* Scroll anchor - page changes bring this back into view. */}
                        <div ref={gridTopRef} className="scroll-mt-24" />

                        {error ? (
                            <div className="mt-8 flex flex-col items-center rounded-lg border border-border/60 bg-background px-6 py-14 text-center shadow-sm">
                                <h3 className="font-neue text-xl font-semibold text-destructive">Something went wrong</h3>
                                <p className="font-neue mt-2 max-w-sm text-sm text-muted-foreground">
                                    We couldn&apos;t load products right now. Please try again.
                                </p>
                                <div className="mt-6 w-full max-w-xs">
                                    <BrandButton type="button" onClick={() => refetch()}>
                                        <RotateCcw className="mr-2 size-4" />Retry
                                    </BrandButton>
                                </div>
                            </div>
                        ) : showSkeleton ? (
                            <div className='grid grid-cols-2 gap-4 pt-7 md:grid-cols-3 md:gap-5 lg:gap-6'>
                                {Array.from({ length: pageSize }).map((_, index) => (
                                    <ProductBoxSkeleton key={index} />
                                ))}
                            </div>
                        ) : showEmptyState ? (
                            <div className="mt-8 flex flex-col items-center rounded-lg border border-border/60 bg-background px-6 py-14 text-center shadow-sm">
                                <div className="flex size-16 items-center justify-center rounded-full bg-[var(--brand-cream)]/50 text-[var(--brand-primary)]">
                                    <PackageSearch className="size-8" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-neue mt-5 text-xl font-semibold text-[var(--brand-primary)]">No Products Found</h3>
                                <p className="font-neue mt-2 max-w-sm text-sm text-muted-foreground">
                                    {searchParams.size > 0
                                        ? 'No products match your current filters. Try clearing them or browse the full collection.'
                                        : 'There are no products to show right now. Please check back soon.'}
                                </p>
                                <div className="mt-6 w-full max-w-xs">
                                    <BrandButton asChild>
                                        <Link href={WEBSITE_SHOP}>
                                            {searchParams.size > 0 ? (
                                                <><RotateCcw className="mr-2 size-4" />Clear Filters</>
                                            ) : (
                                                <><Store className="mr-2 size-4" />Browse Shop</>
                                            )}
                                        </Link>
                                    </BrandButton>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 gap-4 pt-7 md:grid-cols-3 md:gap-5 lg:gap-6'>
                                {products.map((product, index) => (
                                    <ProductBox key={product._id} product={product} priority={index < 3} />
                                ))}
                            </div>
                        )}

                        {!error && !showEmptyState && (
                            <div className='mt-10 flex flex-col items-center gap-4'>
                                <ShopPagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    disabled={busy}
                                    siblings={isMobile ? 0 : 1}
                                />
                                {total > 0 && (
                                    <p className="font-neue text-[0.8rem] font-semibold uppercase text-muted-foreground">
                                        Page {Math.min(page + 1, totalPages)} of {totalPages} · {total} {total === 1 ? 'item' : 'items'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ShopClient
