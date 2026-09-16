'use client'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import ButtonLoading from '../ButtonLoading'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import ReviewList from './ReviewList'
import useFetch from '@/hooks/useFetch'

// Reviews are admin-managed and read-only on the storefront (there are no
// customer accounts). This component only displays the rating summary and the
// list of reviews; there is no submission form.
const ProductReveiw = ({ productId }) => {
    const [reviewCount, setReviewCount] = useState()

    const { data: reviewDetails } = useFetch(`/api/review/details?productId=${productId}`)

    useEffect(() => {
        if (reviewDetails && reviewDetails.success) {
            const reviewCountData = reviewDetails.data
            setReviewCount(reviewCountData)
        }
    }, [reviewDetails])

    const fetchReview = async (pageParam) => {
        const { data: getReviewData } = await axios.get(`/api/review/get?productId=${productId}&page=${pageParam}`)
        if (!getReviewData.success) {
            return
        }

        return getReviewData.data
    }


    const { error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['product-review', productId],
        queryFn: async ({ pageParam }) => await fetchReview(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            // fetchReview resolves undefined when the API reports failure, so
            // this must not assume a page object came back.
            return lastPage?.nextPage
        }
    })

    const totalReview = reviewCount?.totalReview ?? null
    const averageRating = reviewCount?.averageRating ?? '0.0'
    const roundedRating = Math.round(Number(averageRating) || 0)
    const hasLoadedList = Boolean(data)
    const isEmpty = hasLoadedList && (data?.pages?.[0]?.totalReview ?? 0) === 0

    return (
        <div className="mb-12 rounded-[var(--admin-shell-radius)] border border-border/60 bg-background shadow-sm lg:mb-20">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-border/60 px-4 py-4 sm:px-5 lg:px-6 lg:py-5">
                <div>
                    <p className="eyebrow flex items-center gap-2">
                        <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                        What Shoppers Say
                    </p>
                    <h2 className="mt-1.5 font-neue text-[clamp(1.2rem,2vw,1.6rem)] font-medium tracking-[-0.02em] leading-[1.1] text-[var(--brand-primary)]">
                        Rating &amp; Reviews
                    </h2>
                </div>
                {totalReview !== null && (
                    <p className="text-sm text-muted-foreground">
                        {totalReview} {totalReview === 1 ? 'review' : 'reviews'}
                    </p>
                )}
            </div>

            {/* The summary sits in a fixed rail beside the list instead of above
                it. Stacked, the score block and the five bars pushed the first
                review most of a screen down while the right half of the row sat
                empty - the rail is both shorter and actually uses the width. */}
            <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-8 lg:p-6">
                <div className="lg:border-r lg:border-border/60 lg:pr-8">
                    <div className="flex items-center gap-4">
                        <p className="font-neue text-[2.75rem] font-semibold leading-none tabular-nums text-foreground">
                            {averageRating}
                        </p>
                        <div className="min-w-0">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`size-4 ${index < roundedRating ? 'fill-[var(--dark-red)] text-[var(--dark-red)]' : 'text-foreground/25'}`}
                                    />
                                ))}
                            </div>
                            <p className="mt-1.5 text-xs text-muted-foreground">
                                {totalReview ?? 0} rating{totalReview === 1 ? '' : 's'} &amp; reviews
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-2.5">
                                <span className="w-2.5 text-right text-xs tabular-nums text-muted-foreground">{rating}</span>
                                <Star aria-hidden className="size-3 shrink-0 fill-[var(--dark-red)] text-[var(--dark-red)]" />
                                {/* The primitive hard-codes bg-primary on its indicator,
                                    so the brand tint has to be applied to the child. */}
                                <Progress
                                    className="h-1.5 min-w-0 flex-1 [&>*]:bg-[var(--dark-red)]"
                                    value={reviewCount?.percentage?.[rating] || 0}
                                    aria-label={`${rating} star reviews`}
                                />
                                <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                                    {reviewCount?.rating?.[rating] || 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="min-w-0">
                    {error && (
                        <p className="rounded-md border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
                            Reviews could not be loaded right now.
                        </p>
                    )}

                    {!error && !hasLoadedList && (
                        <div className="space-y-3" aria-hidden>
                            {[0, 1].map(index => (
                                <div key={index} className="h-24 animate-pulse rounded-md border border-border/60 bg-muted/20" />
                            ))}
                        </div>
                    )}

                    {!error && isEmpty && (
                        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center">
                            <Star className="mb-2 size-6 text-foreground/25" />
                            <p className="text-sm font-semibold text-foreground">No reviews yet</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Be the first to share your thoughts on this product.
                            </p>
                        </div>
                    )}

                    {!error && hasLoadedList && !isEmpty && (
                        <div className="space-y-3">
                            {data?.pages?.map(page => (
                                page?.reviews?.map(review => (
                                    <ReviewList key={review._id} review={review} />
                                ))
                            ))}
                        </div>
                    )}

                    {hasNextPage && (
                        <div className="mt-4">
                            <ButtonLoading
                                text="Load More"
                                type="button"
                                loading={isFetching}
                                onClick={fetchNextPage}
                                variant="brand"
                                className="h-10 text-[0.8rem] font-semibold uppercase"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductReveiw
