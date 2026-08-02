import { Skeleton } from '@/components/ui/skeleton'

// Mirrors the ProductBox layout so the grid doesn't shift when real cards load.
const ProductBoxSkeleton = () => {
    return (
        <div className="flex flex-col overflow-hidden rounded-[var(--radius-3xl)] border border-border/60 bg-background">
            <div className="relative aspect-[4/5] w-full">
                <Skeleton className="h-full w-full rounded-none" />
                <Skeleton className="absolute right-3 top-3 size-9 rounded-full" />
                <Skeleton className="absolute right-3 top-14 size-9 rounded-full" />
            </div>

            <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-16 shrink-0" />
            </div>
        </div>
    )
}

export default ProductBoxSkeleton
