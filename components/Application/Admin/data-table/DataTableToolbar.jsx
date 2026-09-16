'use client'
import { RotateCcw, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DataTableViewOptions from './DataTableViewOptions'
import { cn } from '@/lib/utils'

const DataTableToolbar = ({
    table,
    searchPlaceholder = 'Filter...',
    searchKey,
    className,
    // Optional column-filter controls (e.g. a parent dropdown), rendered
    // between the search field and the View menu.
    filters,
}) => {
    const globalFilter = table.getState().globalFilter ?? ''
    const columnFilter = searchKey
        ? (table.getColumn(searchKey)?.getFilterValue() ?? '')
        : ''
    const value = searchKey ? columnFilter : globalFilter
    const isFiltered = table.getState().columnFilters?.length > 0 || Boolean(globalFilter)

    const setValue = (next) => {
        if (searchKey) {
            table.getColumn(searchKey)?.setFilterValue(next)
        } else {
            table.setGlobalFilter(next)
        }
    }

    const reset = () => {
        table.resetColumnFilters?.()
        table.setGlobalFilter?.('')
    }

    return (
        // The row used to be a single non-wrapping line, so a search field, a
        // filter dropdown, Reset and View together pushed past the container on
        // narrow viewports. It wraps now, and the search field holds a fixed
        // width instead of flexing - as a flex-1 child it resized every time a
        // filter chip grew or the Reset button appeared.
        <div className={cn('flex w-full flex-wrap items-center gap-2', className)}>
            <div className="relative w-full sm:w-72 sm:flex-none">
                {/* The search box was a bare Input with no affordance and the
                    Reset control appeared as a separate button beside it. The
                    clear affordance now lives inside the field. */}
                <Search
                    className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
                <Input
                    placeholder={searchPlaceholder}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    aria-label={searchPlaceholder}
                    className="h-9 ps-9 pe-9"
                />
                {value ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setValue('')}
                        aria-label="Clear search"
                        className="absolute end-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-3.5" />
                    </Button>
                ) : null}
            </div>

            {filters ? <div className="flex min-w-0 shrink-0 items-center gap-2">{filters}</div> : null}

            {/* Reset was a bare ghost label with no icon, which read as loose
                text wedged between two bordered controls. It now matches the
                View button's weight and collapses to an icon on small screens. */}
            {isFiltered && (
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={reset}
                    aria-label="Reset filters"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="size-4" />
                    <span className="max-sm:sr-only">Reset</span>
                </Button>
            )}

            <DataTableViewOptions table={table} />
        </div>
    )
}

export default DataTableToolbar
