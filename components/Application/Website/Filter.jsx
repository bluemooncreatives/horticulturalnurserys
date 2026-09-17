'use client'
import { memo, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, ChevronDown, Crown, Sparkles, X } from 'lucide-react'
import { resolveColorStyle } from '@/lib/colorMap'

// Pulsing placeholders shown while a facet's options are still loading -
// reads as "content incoming" rather than the dead "Loading..." text it replaces.
const ChipSkeletons = ({ count = 4 }) => (
    <div className="space-y-1">
        {Array.from({ length: count }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full rounded-[var(--radius-sm)] lg:h-8" />
        ))}
    </div>
)

// A facet option is a plain row: small square indicator, label, count. No
// capsule, no per-item border - the only chrome is the checkbox and a hover
// wash, so a long option reads as a line of text rather than a lozenge.
const rowClass = (active) =>
    `flex min-h-11 w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2 text-left ctl-text transition-colors lg:min-h-9 ${active
        ? 'bg-[var(--secondary)] font-semibold text-[var(--brand-primary)]'
        : 'font-medium text-[var(--brand-primary)]/80 hover:bg-[var(--secondary)]/60'
    }`

// 16px square that fills in when the option is on. Deliberately square, not
// round - a circle would read as a radio (pick one) rather than a checkbox.
const Tick = ({ active }) => (
    <span
        aria-hidden
        className={`flex size-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${active
            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-white)]'
            : 'border-[var(--form-field-border)] bg-[var(--brand-white)]'
        }`}
    >
        {active && <Check className="size-3" strokeWidth={3} />}
    </span>
)

// Count sits right-aligned so the numbers form a column down the panel.
const RowCount = ({ value }) => (
    value === undefined || value === null ? null : (
        <span className="ml-auto shrink-0 text-[0.75rem] font-medium tabular-nums text-muted-foreground">
            {value}
        </span>
    )
)

const Filter = ({ filters, showClearLink = true, showTitle = true }) => {
    const searchParams = useSearchParams()

    const [selectedParent, setSelectedParent] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [bestsellerOnly, setBestsellerOnly] = useState(false)
    const [freshlyArrivedOnly, setFreshlyArrivedOnly] = useState(false)

    const categories = filters?.categories ?? null
    const parents = filters?.parents ?? null
    const colors = filters?.colors ?? null
    const sizes = filters?.sizes ?? null

    const categoriesReady = Array.isArray(categories)
    const parentsReady = Array.isArray(parents)
    const colorsReady = Array.isArray(colors)
    const sizesReady = Array.isArray(sizes)

    const urlSearchParams = new URLSearchParams(searchParams.toString())
    const router = useRouter()

    useEffect(() => {
        searchParams.get('parent') ? setSelectedParent(searchParams.get('parent').split(',')) : setSelectedParent([])

        searchParams.get('category') ? setSelectedCategory(searchParams.get('category').split(',')) : setSelectedCategory([])

        searchParams.get('color') ? setSelectedColor(searchParams.get('color').split(',')) : setSelectedColor([])

        setBestsellerOnly(['true', '1', 'yes'].includes((searchParams.get('bestseller') || '').toLowerCase()))

        setFreshlyArrivedOnly(['true', '1', 'yes'].includes((searchParams.get('freshlyArrived') || '').toLowerCase()))

    }, [searchParams])

    const handleParentFilter = (parentSlug) => {
        let newSelectedParent = [...selectedParent]
        if (newSelectedParent.includes(parentSlug)) {
            newSelectedParent = newSelectedParent.filter((slug) => slug !== parentSlug)
        } else {
            newSelectedParent.push(parentSlug)
        }

        setSelectedParent(newSelectedParent)

        newSelectedParent.length > 0 ? urlSearchParams.set('parent', newSelectedParent.join(',')) : urlSearchParams.delete('parent')

        // Switching department invalidates the page cursor, and any category
        // chip already picked may not live under the new parent.
        urlSearchParams.delete('page')

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
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

    const hasFilters = searchParams.size > 0
    // Total count drives the "N Active" badge and the per-section counts below -
    // lets someone scanning the sidebar see what's applied without opening every
    // accordion first.
    const activeFilterCount = selectedParent.length + selectedCategory.length + selectedColor.length
        + (bestsellerOnly ? 1 : 0) + (freshlyArrivedOnly ? 1 : 0)


    return (
        <div className="space-y-6 text-sm font-neue">
            {(showTitle || (hasFilters && showClearLink)) && (
            <div className="flex items-center justify-between gap-3">
                {showTitle && (
                    <h3 className="flex items-center gap-2 font-header text-xl font-semibold tracking-tight text-[var(--brand-primary)]">
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-[0.8rem] font-semibold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </h3>
                )}
                {hasFilters && showClearLink && (
                    <Button type="button" variant="link" className="h-auto w-fit gap-1 p-0 text-[0.8rem] font-semibold uppercase text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]" asChild>
                        <Link href={WEBSITE_SHOP}>
                            <X className="size-3" />
                            Clear All
                        </Link>
                    </Button>
                )}
            </div>
            )}

            <div className="space-y-0.5">
                <button
                    type="button"
                    onClick={handleBestsellerFilter}
                    aria-pressed={bestsellerOnly}
                    className={rowClass(bestsellerOnly)}
                >
                    <Tick active={bestsellerOnly} />
                    <Crown className="size-4 shrink-0 opacity-70" />
                    Bestsellers
                </button>

                <button
                    type="button"
                    onClick={handleFreshlyArrivedFilter}
                    aria-pressed={freshlyArrivedOnly}
                    className={rowClass(freshlyArrivedOnly)}
                >
                    <Tick active={freshlyArrivedOnly} />
                    <Sparkles className="size-4 shrink-0 opacity-70" />
                    Freshly Arrived
                </button>
            </div>

            <Accordion
                type="multiple"
                defaultValue={['parent', 'category', 'color']}
                className="space-y-1"
            >
                {(!parentsReady || parents.length > 0) && (
                    <AccordionItem value="parent" className="border-b border-[var(--border)] py-1">
                        <AccordionTrigger className="group flex min-h-11 w-full items-center justify-between rounded-[var(--radius-2xl)] px-2 py-2.5 text-[1rem] font-semibold text-[var(--brand-primary)] transition-colors hover:bg-[var(--secondary)] hover:no-underline lg:min-h-0 lg:text-[0.9375rem] [&_[data-slot=accordion-trigger-icon]]:hidden">
                            <span className="flex items-center gap-2">
                                By Type
                                {selectedParent.length > 0 && (
                                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 text-[0.8rem] font-semibold text-[var(--brand-primary)]">
                                        {selectedParent.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-4">
                            {!parentsReady ? (
                                <ChipSkeletons count={5} />
                            ) : (
                                <div className="space-y-0.5">
                                    {parents.map((parent) => {
                                        const active = selectedParent.includes(parent.slug)
                                        return (
                                            <button
                                                key={parent._id}
                                                type="button"
                                                onClick={() => handleParentFilter(parent.slug)}
                                                aria-pressed={active}
                                                className={rowClass(active)}
                                            >
                                                <Tick active={active} />
                                                <span className="min-w-0">{parent.name}</span>
                                                <RowCount value={parent.productCount} />
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}

                {(!categoriesReady || categories.length > 0) && (
                    <AccordionItem value="category" className="border-b border-[var(--border)] py-1">
                        <AccordionTrigger className="group flex min-h-11 w-full items-center justify-between rounded-[var(--radius-2xl)] px-2 py-2.5 text-[1rem] font-semibold text-[var(--brand-primary)] transition-colors hover:bg-[var(--secondary)] hover:no-underline lg:min-h-0 lg:text-[0.9375rem] [&_[data-slot=accordion-trigger-icon]]:hidden">
                            <span className="flex items-center gap-2">
                                By Category
                                {selectedCategory.length > 0 && (
                                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 text-[0.8rem] font-semibold text-[var(--brand-primary)]">
                                        {selectedCategory.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-4">
                            {!categoriesReady ? (
                                <ChipSkeletons />
                            ) : (
                                <div className="space-y-0.5">
                                    {categories.map((category) => {
                                        const active = selectedCategory.includes(category.slug)
                                        return (
                                            <button
                                                key={category._id}
                                                type="button"
                                                onClick={() => handleCategoryFilter(category.slug)}
                                                aria-pressed={active}
                                                className={rowClass(active)}
                                            >
                                                <Tick active={active} />
                                                <span className="min-w-0">{category.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}

                {(!colorsReady || colors.length > 0) && (
                    <AccordionItem value="color" className="border-b border-[var(--border)] py-1">
                        <AccordionTrigger className="group flex min-h-11 w-full items-center justify-between rounded-[var(--radius-2xl)] px-2 py-2.5 text-[1rem] font-semibold text-[var(--brand-primary)] transition-colors hover:bg-[var(--secondary)] hover:no-underline lg:min-h-0 lg:text-[0.9375rem] [&_[data-slot=accordion-trigger-icon]]:hidden">
                            <span className="flex items-center gap-2">
                                Color
                                {selectedColor.length > 0 && (
                                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 px-1.5 text-[0.8rem] font-semibold text-[var(--brand-primary)]">
                                        {selectedColor.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-4">
                            {!colorsReady ? (
                                <ChipSkeletons count={6} />
                            ) : (
                            <div className="flex flex-wrap gap-2">
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
                                            className={`relative flex size-11 items-center justify-center rounded-[var(--radius-sm)] border transition lg:size-9 ${active ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]' : 'border-[var(--form-field-border)] hover:border-[var(--brand-primary)]'}`}
                                        >
                                            {swatchStyle ? (
                                                <span
                                                    className="size-7 rounded-[2px] border border-black/15 lg:size-6"
                                                    style={swatchStyle}
                                                    aria-hidden
                                                />
                                            ) : (
                                                <span
                                                    className="size-7 rounded-[2px] border border-black/15 bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_2px,#fff_2px,#fff_4px)] lg:size-6"
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

            </Accordion>

            {/* Loaded, but every facet came back empty - the accordions above are all
                hidden, so say so explicitly rather than leaving a mysteriously bare
                filter panel. */}
            {categoriesReady && colorsReady && sizesReady
                && categories.length === 0 && colors.length === 0 && sizes.length === 0 && (
                <p className="text-[0.8rem] text-muted-foreground">
                    More filters will appear here once products are added to the catalogue.
                </p>
            )}
        </div>
    )
}

export default memo(Filter)
