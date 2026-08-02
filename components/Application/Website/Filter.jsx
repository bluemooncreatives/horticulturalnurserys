'use client'
import { memo, useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, Crown, Sparkles, X } from 'lucide-react'
import { resolveColorStyle } from '@/lib/colorMap'

// Pulsing pill placeholders shown while a facet's options are still loading —
// reads as "content incoming" rather than the dead "Loading..." text it replaces.
const ChipSkeletons = ({ count = 4 }) => (
    <div className="flex flex-wrap gap-2">
        {Array.from({ length: count }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-full" />
        ))}
    </div>
)

// Quick-pick price bands shown as pills above the slider — jump straight to a
// common range instead of dragging both handles.
const PRICE_QUICK_PICKS = [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000+', min: 2000, max: 3000 },
]

// Shared pill-chip look for the Category / Size facets — filled brand-green
// when selected, outlined neutral otherwise.
const chipClass = (active) =>
    `inline-flex items-center rounded-full border px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.02em] transition ${active
        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
        : 'border-border/70 bg-background text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]'
    }`

const Filter = ({ filters, showClearLink = true, showTitle = true }) => {
    const searchParams = useSearchParams()

    const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 3000 })
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedSize, setSelectedSize] = useState([])
    const [bestsellerOnly, setBestsellerOnly] = useState(false)
    const [freshlyArrivedOnly, setFreshlyArrivedOnly] = useState(false)

    const categories = filters?.categories ?? null
    const colors = filters?.colors ?? null
    const sizes = filters?.sizes ?? null

    const categoriesReady = Array.isArray(categories)
    const colorsReady = Array.isArray(colors)
    const sizesReady = Array.isArray(sizes)

    const urlSearchParams = new URLSearchParams(searchParams.toString())
    const router = useRouter()

    useEffect(() => {
        searchParams.get('category') ? setSelectedCategory(searchParams.get('category').split(',')) : setSelectedCategory([])

        searchParams.get('color') ? setSelectedColor(searchParams.get('color').split(',')) : setSelectedColor([])

        searchParams.get('size') ? setSelectedSize(searchParams.get('size').split(',')) : setSelectedSize([])

        setBestsellerOnly(['true', '1', 'yes'].includes((searchParams.get('bestseller') || '').toLowerCase()))

        setFreshlyArrivedOnly(['true', '1', 'yes'].includes((searchParams.get('freshlyArrived') || '').toLowerCase()))

        const minPrice = parseInt(searchParams.get('minPrice'))
        const maxPrice = parseInt(searchParams.get('maxPrice'))
        const normalizedMin = Number.isFinite(minPrice) ? Math.max(0, Math.min(minPrice, 3000)) : 0
        const normalizedMax = Number.isFinite(maxPrice) ? Math.max(normalizedMin, Math.min(maxPrice, 3000)) : 3000

        setPriceFilter({
            minPrice: normalizedMin,
            maxPrice: normalizedMax,
        })

    }, [searchParams])



    const handlePriceChange = (value) => {
        setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
    }



    const handleCategoryFilter = (categorySlug) => {
        let newSelectedCategory = [...selectedCategory]
        if (newSelectedCategory.includes(categorySlug)) {
            newSelectedCategory = newSelectedCategory.filter(cat => cat !== categorySlug)
        } else {
            newSelectedCategory.push(categorySlug)
        }

        setSelectedCategory(newSelectedCategory)

        newSelectedCategory.length > 0 ? urlSearchParams.set('category', newSelectedCategory.join(',')) : urlSearchParams.delete('category')

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)

    }

    const handleColorFilter = (color) => {
        let newSelectedColor = [...selectedColor]
        if (newSelectedColor.includes(color)) {
            newSelectedColor = newSelectedColor.filter(cat => cat !== color)
        } else {
            newSelectedColor.push(color)
        }

        setSelectedColor(newSelectedColor)

        newSelectedColor.length > 0 ? urlSearchParams.set('color', newSelectedColor.join(',')) : urlSearchParams.delete('color')

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)

    }

    const handleSizeFilter = (size) => {
        let newSelectedSize = [...selectedSize]
        if (newSelectedSize.includes(size)) {
            newSelectedSize = newSelectedSize.filter(cat => cat !== size)
        } else {
            newSelectedSize.push(size)
        }

        setSelectedSize(newSelectedSize)

        newSelectedSize.length > 0 ? urlSearchParams.set('size', newSelectedSize.join(',')) : urlSearchParams.delete('size')

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)

    }

    const handleBestsellerFilter = () => {
        const next = !bestsellerOnly
        setBestsellerOnly(next)

        if (next) {
            urlSearchParams.set('bestseller', 'true')
        } else {
            urlSearchParams.delete('bestseller')
        }
        // Reset pagination so toggling the filter doesn't land on an out-of-range page.
        urlSearchParams.delete('page')

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handleFreshlyArrivedFilter = () => {
        const next = !freshlyArrivedOnly
        setFreshlyArrivedOnly(next)

        if (next) {
            urlSearchParams.set('freshlyArrived', 'true')
        } else {
            urlSearchParams.delete('freshlyArrived')
        }
        // Reset pagination so toggling the filter doesn't land on an out-of-range page.
        urlSearchParams.delete('page')

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handlePriceFilter = () => {
        urlSearchParams.set('minPrice', priceFilter.minPrice)
        urlSearchParams.set('maxPrice', priceFilter.maxPrice)
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    // Quick-pick pills set both the slider state and the URL in one click.
    const handlePriceQuickPick = (min, max) => {
        setPriceFilter({ minPrice: min, maxPrice: max })
        urlSearchParams.set('minPrice', min)
        urlSearchParams.set('maxPrice', max)
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const hasFilters = searchParams.size > 0
    const priceIsDefault = priceFilter.minPrice === 0 && priceFilter.maxPrice === 3000
    // Total count drives the "N Active" badge and the per-section counts below —
    // lets someone scanning the sidebar see what's applied without opening every
    // accordion first.
    const activeFilterCount = selectedCategory.length + selectedColor.length + selectedSize.length
        + (bestsellerOnly ? 1 : 0) + (freshlyArrivedOnly ? 1 : 0) + (priceIsDefault ? 0 : 1)


    return (
        <div className="space-y-6 text-sm font-neue">
            <div className="flex items-center justify-between gap-3">
                {showTitle && (
                    <h3 className="flex items-center gap-2 font-header text-xl font-semibold tracking-tight text-[var(--brand-primary)]">
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-[11px] font-semibold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </h3>
                )}
                {hasFilters && showClearLink && (
                    <Button type="button" variant="link" className="h-auto w-fit gap-1 p-0 text-[11px] font-semibold uppercase text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]" asChild>
                        <Link href={WEBSITE_SHOP}>
                            <X className="size-3" />
                            Clear All
                        </Link>
                    </Button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleBestsellerFilter}
                    aria-pressed={bestsellerOnly}
                    className={chipClass(bestsellerOnly) + ' gap-1.5'}
                >
                    <Crown className="size-3.5" />
                    Bestsellers
                </button>

                <button
                    type="button"
                    onClick={handleFreshlyArrivedFilter}
                    aria-pressed={freshlyArrivedOnly}
                    className={chipClass(freshlyArrivedOnly) + ' gap-1.5'}
                >
                    <Sparkles className="size-3.5" />
                    Freshly Arrived
                </button>
            </div>

            <Accordion
                type="multiple"
                defaultValue={['category', 'price', 'color', 'size']}
                className="space-y-1"
            >
                {(!categoriesReady || categories.length > 0) && (
                    <AccordionItem value="category" className="border-b border-border/60 py-1">
                        <AccordionTrigger className="group flex w-full items-center justify-between py-2 text-[15px] font-semibold text-[var(--brand-primary)] hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                            <span className="flex items-center gap-2">
                                By Category
                                {selectedCategory.length > 0 && (
                                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 text-[11px] font-semibold text-[var(--brand-primary)]">
                                        {selectedCategory.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            {!categoriesReady ? (
                                <ChipSkeletons />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category._id}
                                            type="button"
                                            onClick={() => handleCategoryFilter(category.slug)}
                                            aria-pressed={selectedCategory.includes(category.slug)}
                                            className={chipClass(selectedCategory.includes(category.slug))}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}

                <AccordionItem value="price" className="border-b border-border/60 py-1">
                    <AccordionTrigger className="group flex w-full items-center justify-between py-2 text-[15px] font-semibold text-foreground hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                        <span className="flex items-center gap-2">
                            Price Range
                            {!priceIsDefault && (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 text-[11px] font-semibold text-[var(--brand-primary)]">
                                    1
                                </span>
                            )}
                        </span>
                        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 px-[2px] pb-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-semibold text-[var(--brand-primary)]">
                                {priceFilter.minPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                                {' – '}
                                {priceFilter.maxPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                            </p>
                            {!priceIsDefault && (
                                <button
                                    type="button"
                                    onClick={() => handlePriceQuickPick(0, 3000)}
                                    className="text-[11px] font-semibold uppercase transition hover:text-[var(--brand-primary)]"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                        <Slider
                            className="mt-0"
                            value={[priceFilter.minPrice, priceFilter.maxPrice]}
                            max={3000}
                            step={1}
                            onValueChange={handlePriceChange}
                            onValueCommit={handlePriceFilter}
                        />
                        <div>
                            <p className="mb-2 text-[15px] font-semibold text-[var(--brand-primary)]">Quick Picks</p>
                            <div className="flex flex-wrap gap-2">
                                {PRICE_QUICK_PICKS.map((pick) => {
                                    const active = priceFilter.minPrice === pick.min && priceFilter.maxPrice === pick.max
                                    return (
                                        <button
                                            key={pick.label}
                                            type="button"
                                            onClick={() => handlePriceQuickPick(pick.min, pick.max)}
                                            className={chipClass(active)}
                                        >
                                            {pick.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {(!colorsReady || colors.length > 0) && (
                    <AccordionItem value="color" className="border-b border-border/60 py-1">
                        <AccordionTrigger className="group flex w-full items-center justify-between py-2 text-[15px] font-semibold text-[var(--brand-primary)] hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                            <span className="flex items-center gap-2">
                                Color
                                {selectedColor.length > 0 && (
                                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 text-[11px] font-semibold text-[var(--brand-primary)]">
                                        {selectedColor.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            {!colorsReady ? (
                                <ChipSkeletons count={6} />
                            ) : (
                            <div className="flex flex-wrap gap-3">
                                {colors.map((colorItem, index) => {
                                    // Colors arrive as { name, hex }. Older cached payloads may still
                                    // be plain strings, so accept both shapes defensively.
                                    const colorName = typeof colorItem === 'string' ? colorItem : colorItem?.name
                                    const colorHex = typeof colorItem === 'string' ? '' : colorItem?.hex
                                    if (!colorName) return null
                                    const active = selectedColor.includes(colorName)
                                    // Admin hex wins, then the curated dictionary / CSS name.
                                    // null => render a neutral "no swatch" placeholder.
                                    const swatchStyle = resolveColorStyle(colorName, colorHex)
                                    return (
                                        <button
                                            key={`${colorName}-${index}`}
                                            type="button"
                                            onClick={() => handleColorFilter(colorName)}
                                            aria-pressed={active}
                                            title={colorName}
                                            className={`flex size-9 items-center justify-center rounded-full border-2 transition ${active ? 'border-[var(--brand-primary)]' : 'border-transparent hover:border-border'}`}
                                        >
                                            {swatchStyle ? (
                                                <span
                                                    className="size-7 rounded-full border border-black/15"
                                                    style={swatchStyle}
                                                    aria-hidden
                                                />
                                            ) : (
                                                <span
                                                    className="size-7 rounded-full border border-black/15 bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_2px,#fff_2px,#fff_4px)]"
                                                    aria-hidden
                                                />
                                            )}
                                            <span className="sr-only">{colorName}</span>
                                        </button>
                                    )
                                })}
                            </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}

                {(!sizesReady || sizes.length > 0) && (
                    <AccordionItem value="size" className="border-b border-border/60 py-1">
                        <AccordionTrigger className="group flex w-full items-center justify-between py-2 text-[15px] font-semibold text-[var(--brand-primary)] hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                            <span className="flex items-center gap-2">
                                Size
                                {selectedSize.length > 0 && (
                                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 text-[11px] font-semibold text-[var(--brand-primary)]">
                                        {selectedSize.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            {!sizesReady ? (
                                <ChipSkeletons count={5} />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size, index) => (
                                        <button
                                            key={`${size}-${index}`}
                                            type="button"
                                            onClick={() => handleSizeFilter(size)}
                                            aria-pressed={selectedSize.includes(size)}
                                            className={chipClass(selectedSize.includes(size))}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

            {/* Loaded, but every facet came back empty — the accordions above are all
                hidden, so say so explicitly rather than leaving a mysteriously bare
                panel under Price Range. */}
            {categoriesReady && colorsReady && sizesReady
                && categories.length === 0 && colors.length === 0 && sizes.length === 0 && (
                <p className="text-[12px] text-muted-foreground">
                    More filters will appear here once products are added to the catalogue.
                </p>
            )}
        </div>
    )
}

export default memo(Filter)
