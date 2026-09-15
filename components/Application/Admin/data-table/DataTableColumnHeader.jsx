'use client'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const DataTableColumnHeader = ({ column, title, className }) => {
    if (!column.getCanSort()) {
        return <div className={cn('px-2 font-semibold', className)}>{title}</div>
    }

    const sorted = column.getIsSorted()

    return (
        <div className={cn('flex items-center', className)}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        // -ms-2 pulls the ghost button's padding back so the label
                        // lines up with the plain (non-sortable) headers and the
                        // cells below it; they used to sit 10px apart.
                        className="-ms-2 h-8 font-semibold text-muted-foreground hover:text-foreground data-[state=open]:bg-accent"
                        aria-label={`Sort by ${title}`}
                    >
                        <span>{title}</span>
                        {sorted === 'desc' ? (
                            <ArrowDown className="size-3.5 text-foreground" />
                        ) : sorted === 'asc' ? (
                            <ArrowUp className="size-3.5 text-foreground" />
                        ) : (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-36">
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                        className="cursor-pointer"
                    >
                        <ArrowUp className="size-3.5 text-muted-foreground/70" />
                        Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                        className="cursor-pointer"
                    >
                        <ArrowDown className="size-3.5 text-muted-foreground/70" />
                        Descending
                    </DropdownMenuItem>
                    {column.getCanHide() && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => column.toggleVisibility(false)}
                                className="cursor-pointer"
                            >
                                <EyeOff className="size-3.5 text-muted-foreground/70" />
                                Hide column
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default DataTableColumnHeader
