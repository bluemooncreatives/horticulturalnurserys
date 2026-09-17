'use client'

import Image from 'next/image'
import { ImageIcon, Plus, Star, X } from 'lucide-react'
import { useState } from 'react'
import { FormLabel } from '@/components/ui/form'
import MediaModal from '@/components/Application/Admin/MediaModal'

/*
 * Image picker shared by the product and product-variant forms (add + edit).
 *
 * Beyond browsing the media library it owns the cover choice: the admin clicks
 * "Set as cover" on any tile and that image becomes the one the storefront
 * leads with - cards, the gallery, the enquiry-list thumbnail. The value is
 * persisted as `coverMedia` and the read layer rotates it to media[0], so the
 * badge here is a faithful preview of what shoppers see.
 *
 * `coverMediaId` is uncontrolled-friendly: when it is empty, or names an image
 * that is no longer selected, the first tile carries the badge, matching the
 * server-side fallback in lib/coverMedia.js.
 */
const MediaPicker = ({
    label,
    selectedMedia,
    setSelectedMedia,
    coverMediaId,
    setCoverMediaId,
    emptyStateHint = 'Select high quality product photos',
}) => {
    const [open, setOpen] = useState(false)

    const hasCover = selectedMedia.some((media) => media._id === coverMediaId)
    // Mirrors resolveCoverMedia() on the server: the chosen cover if it is still
    // selected, otherwise the first image.
    const effectiveCoverId = hasCover ? coverMediaId : selectedMedia[0]?._id

    const handleRemoveMedia = (id, e) => {
        e?.stopPropagation?.()
        setSelectedMedia((prev) => prev.filter((media) => media._id !== id))
        // Dropping the cover image hands the role back to whatever ends up
        // first, rather than leaving a dangling id for the server to discard.
        if (id === coverMediaId) setCoverMediaId('')
    }

    const handleSetCover = (id, e) => {
        e?.preventDefault?.()
        e?.stopPropagation?.()
        setCoverMediaId(id)
    }

    return (
        <div className="md:col-span-2 space-y-3 pt-2">
            <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">
                    {label} <span className="text-destructive" aria-hidden>*</span>
                </FormLabel>
                <span className="text-xs text-muted-foreground tabular-nums">
                    {selectedMedia.length} image{selectedMedia.length === 1 ? '' : 's'} selected
                </span>
            </div>

            <MediaModal
                open={open}
                setOpen={setOpen}
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
                isMultiple={true}
            />

            {selectedMedia.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {selectedMedia.map((media) => {
                            const isCover = media._id === effectiveCoverId
                            return (
                                <div
                                    key={media._id}
                                    className={`group relative aspect-square overflow-hidden rounded-lg border bg-muted/20 transition-all hover:shadow-xs ${isCover ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <Image
                                        src={media.url}
                                        alt="Product media"
                                        fill
                                        className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />

                                    {isCover && (
                                        <span className="absolute left-1.5 top-1.5 z-10 flex items-center gap-1 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-xs">
                                            <Star className="size-2.5 fill-current" />
                                            Cover
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveMedia(media._id, e)}
                                        className="absolute right-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 cursor-pointer"
                                        aria-label="Remove image"
                                    >
                                        <X className="size-3.5" />
                                    </button>

                                    {!isCover && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleSetCover(media._id, e)}
                                            className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-1 bg-black/70 py-1.5 text-[10px] font-semibold text-white opacity-0 transition-opacity hover:bg-primary group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                                        >
                                            <Star className="size-2.5" />
                                            Set as cover
                                        </button>
                                    )}
                                </div>
                            )
                        })}

                        <div
                            onClick={() => setOpen(true)}
                            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-muted/20 text-center transition-colors hover:border-primary hover:bg-primary/5"
                        >
                            <Plus className="size-5 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Add More</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        The cover is the image shown first on product cards, search results and the gallery.
                        Hover any image and choose <span className="font-medium text-foreground">Set as cover</span> to change it.
                    </p>
                </>
            ) : (
                <div
                    onClick={() => setOpen(true)}
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center transition-all hover:border-primary hover:bg-primary/5"
                >
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <ImageIcon className="size-5" />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-foreground">Click to browse media library</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{emptyStateHint}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MediaPicker
