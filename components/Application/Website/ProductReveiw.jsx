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
        <div className="mb-20 rounded-[var(--admin-shell-radius)] border border-border/60 bg-background shadow-sm">
            <div className="border-b border-border/60 px-5 py-4 lg:px-6 lg:py-5">
                <p className="eyebrow flex items-center gap-2">
                    <span aria-hidden className="h-px w-6 bg-current opacity-40" />
                    What Shoppers Say
                </p>
                <h2 className="mt-2 font-neue text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.02em] leading-[1.1] text-[var(--brand-primary)]">
                    Rating &amp; Reviews
                </h2>
            </div>
            <div className="p-5 lg:p-6">
                <div className='flex justify-between flex-wrap items-center'>
                    <div className='md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5'>
                        <div className='md:w-[200px] w-full md:mb-0 mb-5'>
                            <h4 className='text-center text-6xl font-semibold sm:text-7xl md:text-8xl'>{reviewCount?.averageRating ?? '0.0'}</h4>
                            <div className='flex justify-center gap-1 text-[var(--dark-red)]'>
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

                        <div className='md:w-[calc(100%-200px)] flex items-center'>
                            <div className='w-full'>

                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className='flex items-center gap-2 mb-2'>
                                        <div className='flex items-center gap-1 text-[var(--dark-red)]'>
                                            <p className='w-3 text-foreground'>{rating}</p>
                                            <Star className="size-3 fill-[var(--dark-red)] text-[var(--dark-red)]" />
                                        </div>
                                        <Progress value={reviewCount?.percentage?.[rating] || 0} />
                                        <span className='w-6 text-sm text-muted-foreground'>{reviewCount?.rating?.[rating] || 0}</span>
                                    </div>
                                ))}



                            </div>
                        </div>

                    </div>
                </div>

                <div className='mt-10 border-t border-border/60 pt-5'>
                    <h5 className='font-neue text-[clamp(1.1rem,2vw,1.4rem)] font-medium uppercase leading-[1.1] text-[var(--dark-red-2)]'>{data?.pages[0]?.totalReview || 0} Reviews</h5>

                    <div className='mt-10'>
                        {(data?.pages?.[0]?.totalReview ?? 0) === 0 && !isFetching && (
                            <div className='rounded-md border border-dashed border-border/70 bg-muted/20 px-5 py-10 text-center'>
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
                            <ButtonLoading text="Load More" type="button" loading={isFetching} onClick={fetchNextPage} variant="brand" className="h-10 text-[0.8rem] font-semibold uppercase tracking-[0.2em]" />
                        }

                    </div>

                </div>



            </div>
        </div>
    )
}

export default ProductReveiw
