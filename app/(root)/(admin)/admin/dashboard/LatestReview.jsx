'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Package, Star, MessageSquareQuote } from 'lucide-react'

import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import useFetch from '@/hooks/useFetch'
import { useEffect, useState } from 'react'
import EmptyState from '@/components/Application/Admin/EmptyState'
import { TableRowsSkeleton } from '@/components/Application/Admin/Loaders'

const StarRow = ({ rating = 0 }) => (
    <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`${rating} out of 5 stars`}
    >
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                aria-hidden
                className="size-4"
                style={
                    i < rating
                        ? { color: 'var(--status-rating)', fill: 'var(--status-rating)' }
                        : { color: 'var(--border)', fill: 'var(--border)' }
                }
            />
        ))}
    </div>
)

const LatestReview = () => {
    const [latestReview, setLatestReview] = useState()
    const { data: getLatestReview, loading } = useFetch('/api/dashboard/admin/latest-review')

    useEffect(() => {
        if (getLatestReview && getLatestReview.success) {
            setLatestReview(getLatestReview.data)
        }
    }, [getLatestReview])

    if (!loading && (!latestReview || latestReview.length === 0)) {
        return (
            <EmptyState
                icon={MessageSquareQuote}
                title="No reviews yet"
                description="Reviews shown on the storefront will be listed here."
            />
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="sticky top-0 z-10 bg-card text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Package className="size-3.5" />
                            Product
                        </span>
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-card text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Star className="size-3.5" />
                            Rating
                        </span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRowsSkeleton rows={4} columns={2} />
                ) : (
                    latestReview?.map((review) => (
                        <TableRow key={review._id} className="border-border/60 text-sm">
                            <TableCell className="py-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-8 rounded-md border border-border">
                                        <AvatarImage
                                            src={review?.product?.media?.[0]?.secure_url || imgPlaceholder.src}
                                            alt=""
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-md text-xs">
                                            {review?.product?.name?.slice(0, 2)?.toUpperCase() || '--'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="line-clamp-1 font-medium">
                                        {review?.product?.name || 'Product removed'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="py-3">
                                {/* Always render five stars so rows line up; empty
                                    ones are drawn in the border tone. Previously
                                    only the earned stars rendered, so a 2-star and
                                    a 5-star row looked like different columns. */}
                                <StarRow rating={Number(review.rating) || 0} />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

export default LatestReview
