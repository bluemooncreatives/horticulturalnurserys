'use client'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/** Turns `sellingPrice` / `product_name` into `Selling price`, `Product name`. */
const humanise = (id) =>
    id
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/^./, (c) => c.toUpperCase())

const DataTableViewOptions = ({ table }) => {
    const columns = table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())

    const hiddenCount = columns.filter((column) => !column.getIsVisible()).length

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="shrink-0">
                    <SlidersHorizontal className="size-4" />
                    <span className="max-sm:sr-only">View</span>
                    {hiddenCount > 0 && (
                        <span className="tabular-nums text-muted-foreground">
                            ({hiddenCount} hidden)
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 w-56 overflow-y-auto">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="cursor-pointer truncate"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                        {/* `capitalize` on a raw accessor key produced labels like
                            "Sellingprice"; the words are split out properly now. */}
                        {humanise(column.id)}
                    </DropdownMenuCheckboxItem>
                ))}
                {hiddenCount > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => table.resetColumnVisibility?.()}
                        >
                            Show all columns
                        </Button>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DataTableViewOptions
