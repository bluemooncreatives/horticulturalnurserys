'use client'
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

/**
 * Table pagination.
 *
 * The previous version rendered the "Page X of Y" label twice and hid one copy
 * per breakpoint, mixed @container and viewport breakpoints in the same row,
 * and reversed the rows-per-page control on small screens. This is a single
 * row that wraps: page size on the left, page controls on the right, with the
 * numbered buttons dropping out below `sm` where they never fit anyway.
 */
const DataTablePagination = ({ table, className }) => {
    const currentPage = table.getState().pagination.pageIndex + 1
    const totalPages = Math.max(table.getPageCount(), 1)
    const pageNumbers = getPageNumbers(currentPage, totalPages)

    return (
        <nav
            aria-label="Pagination"
            className={cn(
                'flex flex-col-reverse items-center justify-between gap-3 sm:flex-row',
                className
            )}
        >
            <div className="flex items-center gap-2">
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => table.setPageSize(Number(value))}
                >
                    <SelectTrigger className="h-8 w-18" aria-label="Rows per page">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Rows per page</p>
            </div>

            <div className="flex items-center gap-3">
                <p className="text-sm font-medium tabular-nums whitespace-nowrap">
                    Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className="size-8 p-0 max-sm:hidden"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="size-4" />
                    </Button>

                    <div className="hidden items-center gap-1 sm:flex">
                        {pageNumbers.map((pageNumber, index) =>
                            pageNumber === '...' ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-1 text-sm text-muted-foreground"
                                    aria-hidden
                                >
                                    …
                                </span>
                            ) : (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                                    className="h-8 min-w-8 px-2 tabular-nums"
                                    onClick={() => table.setPageIndex(pageNumber - 1)}
                                >
                                    <span className="sr-only">Go to page {pageNumber}</span>
                                    {pageNumber}
                                </Button>
                            )
                        )}
                    </div>

                    <Button
                        variant="outline"
                        className="size-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8 p-0 max-sm:hidden"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="size-4" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default DataTablePagination
