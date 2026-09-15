import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import ModalMediaBlock from './ModalMediaBlock'
import { showToast } from '@/lib/showToast'
import ButtonLoading from '../ButtonLoading'
import EmptyState from './EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) => {

    const [previouslySelected, setPreviouslySelected] = useState([])

    const fetchMedia = async (page) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&&limit=18&&deleteType=SD`)
        return response
    }

    const { isPending, isError, error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length
            return lastPage.hasMore ? nextPage : undefined
        }
    })


    const handleClear = () => {
        setSelectedMedia([])
        setPreviouslySelected([])
        showToast('success', 'Media selection cleared.')
    }
    const handleClose = () => {
        setSelectedMedia(previouslySelected)
        setOpen(false)
    }
    const handleSelect = () => {
        if (selectedMedia.length <= 0) {
            return showToast('error', 'Please select a media.')
        }

        setPreviouslySelected(selectedMedia)
        setOpen(false)
    }

    const selectedCount = selectedMedia?.length || 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* The panel used to be a fixed h-[90vh] box with a 32px header, a
                40px footer and a body sized `calc(100% - 80px)` - numbers that
                never added up, so the footer buttons overflowed their strip. It
                is a flex column now: header and footer take their natural
                height, the grid takes the rest. */}
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="flex h-[min(90vh,52rem)] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
            >
                <DialogHeader className="shrink-0 space-y-0 border-b border-border px-5 py-3 text-start">
                    <DialogTitle>Media Selection</DialogTitle>
                    <DialogDescription>
                        {isMultiple
                            ? 'Pick one or more images from your library.'
                            : 'Pick an image from your library.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="admin-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    {isPending ? (
                        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Skeleton key={i} className="h-[100px] w-full rounded-lg md:h-[150px]" />
                            ))}
                        </div>
                    ) : isError ? (
                        <EmptyState
                            icon={AlertCircle}
                            title="Couldn&apos;t load your media"
                            description={error.message}
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
                                {data?.pages?.map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page?.mediaData?.map((media) => (
                                            <ModalMediaBlock
                                                key={media._id}
                                                media={media}
                                                selectedMedia={selectedMedia}
                                                setSelectedMedia={setSelectedMedia}
                                                isMultiple={isMultiple}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>

                            {hasNextPage ? (
                                <div className="flex justify-center py-5">
                                    <ButtonLoading
                                        type="button"
                                        variant="outline"
                                        onClick={() => fetchNextPage()}
                                        loading={isFetching}
                                        text="Load More"
                                        size="lg"
                                    />
                                </div>
                            ) : (
                                <p className="py-5 text-center text-xs text-muted-foreground">
                                    Nothing more to load.
                                </p>
                            )}
                        </>
                    )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="destructive"
                            size="lg"
                            disabled={selectedCount === 0}
                            onClick={handleClear}
                        >
                            Clear All
                        </Button>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {selectedCount} selected
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="lg" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="button" size="lg" onClick={handleSelect}>
                            Select
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MediaModal