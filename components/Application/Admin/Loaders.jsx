import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

/**
 * Loading placeholders for the admin panel.
 *
 * Every panel previously rendered a centred "Loading..." string, which
 * collapses the layout and then snaps it back when data lands. These
 * skeletons hold the same shape as the content they replace.
 */

export const TableRowsSkeleton = ({ rows = 5, columns = 4 }) => (
    <>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-border/60">
                {Array.from({ length: columns }).map((_, cellIndex) => (
                    <TableCell key={cellIndex} className="py-3">
                        <Skeleton
                            className={cn('h-4', cellIndex === 0 ? 'w-32' : 'w-20')}
                        />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </>
)

export const ListSkeleton = ({ rows = 4, className }) => (
    <div className={cn('space-y-3', className)}>
        {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/5" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
        ))}
    </div>
)

export const BarsSkeleton = ({ rows = 4 }) => (
    <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3.5 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
            </div>
        ))}
    </div>
)

export const FormSkeleton = ({ fields = 4 }) => (
    <div className="space-y-5">
        {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-9 w-full rounded-lg" />
            </div>
        ))}
        <Skeleton className="h-9 w-32 rounded-lg" />
    </div>
)

export const CuratedListSkeleton = ({ rows = 4 }) => (
    <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
            <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-2 sm:p-3"
            >
                <Skeleton className="size-4 shrink-0 rounded" />
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <Skeleton className="size-12 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40 max-w-full" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                </div>
            </div>
        ))}
    </div>
)
