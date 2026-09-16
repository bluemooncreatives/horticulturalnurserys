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
            return lastPage.nextPage
        }
    })



    return (
        <div className="mb-12 rounded-[var(--admin-shell-radius)] border border-border/60 bg-background shadow-sm lg:mb-20">
            <div className="border-b border-border/60 px-4 py-4 sm:px-5 lg:px-6 lg:py-5">
                <p className="eyebrow flex items-center gap-2">
                    <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                    What Shoppers Say
                </p>
                <h2 className="mt-2 font-neue text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.02em] leading-[1.1] text-[var(--brand-primary)]">
                    Rating &amp; Reviews
                </h2>
            </div>
            <div className="p-4 sm:p-5 lg:p-6">
                {/* Score and the per-star breakdown sit side by side from the
                    smallest screen up - stacking them pushed the review list a
                    full extra screen down on a phone. */}
                <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8 lg:w-1/2 lg:gap-10'>
                    <div className='w-full shrink-0 sm:w-[150px] md:w-[180px]'>
                        <h4 className='text-center text-5xl font-semibold sm:text-6xl md:text-7xl'>{reviewCount?.averageRating ?? '0.0'}</h4>
                        <div className='mt-1 flex justify-center gap-1 text-[var(--dark-red)]'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`size-4 ${index < Math.round(Number(reviewCount?.averageRating || 0)) ? 'fill-[var(--dark-red)] text-[var(--dark-red)]' : 'text-foreground/25'}`}
                                    />
                                ))}
                            </div>

                        <p className='text-center mt-3 text-sm text-muted-foreground'>
                            ({reviewCount?.totalReview || 0} Rating &amp; Reviews)
                        </p>
                    </div>

                    {/* min-w-0 so the bars shrink inside the flex row instead of
                        widening it past the card on narrow screens. */}
                    <div className='min-w-0 flex-1'>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className='mb-2 flex items-center gap-2'>
                                <div className='flex shrink-0 items-center gap-1 text-[var(--dark-red)]'>
                                    <p className='w-3 text-foreground'>{rating}</p>
                                    <Star className="size-3 fill-[var(--dark-red)] text-[var(--dark-red)]" />
                                </div>
                                <Progress className='min-w-0 flex-1' value={reviewCount?.percentage?.[rating] || 0} />
                                <span className='w-6 shrink-0 text-right text-sm text-muted-foreground'>{reviewCount?.rating?.[rating] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='mt-8 border-t border-border/60 pt-5 lg:mt-10'>
                    <h5 className='font-neue text-[clamp(1.1rem,2vw,1.4rem)] font-medium uppercase leading-[1.1] text-[var(--dark-red-2)]'>{data?.pages[0]?.totalReview || 0} Reviews</h5>

                    <div className='mt-6 lg:mt-10'>
                        {(data?.pages?.[0]?.totalReview ?? 0) === 0 && !isFetching && (
                            <div className='rounded-md border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center sm:px-5 sm:py-10'>
                                <Star className='mx-auto mb-3 size-7 text-foreground/25' />
                                <p className='font-semibold text-foreground'>No reviews yet</p>
                                <p className='mt-1 text-sm text-muted-foreground'>Be the first to share your thoughts on this product.</p>
                            </div>
                        )}

                        {data && data.pages.map(page => (
                            page.reviews.map(review => (
                                <div className='mb-5' key={review._id}>
                                    <ReviewList review={review} />
                                </div>
                            ))
                        ))}

                        {hasNextPage &&
                            <ButtonLoading text="Load More" type="button" loading={isFetching} onClick={fetchNextPage} variant="brand" className="h-10 text-[0.8rem] font-semibold uppercase" />
                        }

                    </div>

                </div>



            </div>
        </div>
    )
}

export default ProductReveiw
