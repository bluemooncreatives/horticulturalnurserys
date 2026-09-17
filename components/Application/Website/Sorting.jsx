import { memo } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sortings } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'

const Sorting = ({ sorting, setSorting, mobileFilterOpen, setMobileFilterOpen, resultCount, activeFilterCount = 0 }) => {
    return (
        <div className='flex flex-wrap items-center gap-2.5 font-neue sm:py-3 lg:justify-end'>
            {/* Filter trigger - mobile/tablet only. Matches the sort dropdown's
                exact style (height, border, radius, brand text) so the two sit
                on one row as a consistent pair; hidden on desktop where the
                filter lives in the sticky sidebar. */}
            <Button
                type="button"
                aria-label={activeFilterCount > 0 ? `Filter, ${activeFilterCount} active` : 'Filter products'}
                aria-expanded={!!mobileFilterOpen}
                className="h-11 shrink-0 rounded-md border-[var(--form-field-border)] bg-background px-3.5 text-[0.9375rem] font-semibold text-[var(--brand-primary)] hover:border-[var(--form-field-border-hover)] hover:text-[var(--brand-primary)] lg:hidden"
                variant="outline"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
                <SlidersHorizontal className='size-4' />
                Filter
                {activeFilterCount > 0 && (
                    <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-primary)] px-1.5 text-[0.75rem] font-semibold leading-none text-[var(--brand-white)]">
                        {activeFilterCount}
                    </span>
                )}
            </Button>

            <Select value={sorting} onValueChange={(value) => setSorting(value)}>
                <SelectTrigger aria-label="Sort products" className="h-11 flex-1 rounded-md border-[var(--form-field-border)] bg-background text-[0.9375rem] font-semibold text-[var(--brand-primary)] data-[size=default]:h-11 hover:border-[var(--form-field-border-hover)] md:w-[230px] md:flex-none">
                    <SelectValue placeholder="Default Sorting" />
                </SelectTrigger>
                <SelectContent
                    position="popper"
                    className="rounded-md border-[var(--form-field-border)] font-neue w-[var(--radix-select-trigger-width)]"
                >
                    {sortings.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-[0.9375rem] font-semibold text-[var(--brand-primary)]">{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {typeof resultCount === 'number' && (
                <span className="w-full text-[0.8rem] font-medium text-muted-foreground sm:text-sm lg:w-auto">
                    {resultCount > 0 ? `Showing ${resultCount} items` : 'Showing 0 items'}
                </span>
            )}
        </div>
    )
}

export default memo(Sorting)
