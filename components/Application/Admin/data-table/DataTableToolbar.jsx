'use client'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DataTableViewOptions from './DataTableViewOptions'
import { cn } from '@/lib/utils'

const DataTableToolbar = ({
    table,
    searchPlaceholder = 'Filter...',
    searchKey,
    className,
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
        <div className={cn('flex w-full items-center gap-2', className)}>
            <div className="relative flex-1">
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

            {isFiltered && (
                <Button variant="ghost" size="lg" onClick={reset} className="shrink-0">
                    Reset
                </Button>
            )}

            <DataTableViewOptions table={table} />
        </div>
    )
}

export default DataTableToolbar
