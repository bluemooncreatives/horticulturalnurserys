/*
 * Cover image resolution for products and product variants.
 *
 * The admin picks a cover explicitly (`coverMedia`, always one of the entries
 * in `media`). Rather than make every storefront consumer aware of that field,
 * read paths run their documents through `withCoverFirst`, which rotates the
 * chosen image to the front of `media`. Everything downstream keeps reading
 * `media[0]` - cards, galleries, cart thumbnails, OG tags - and simply starts
 * getting the right picture.
 *
 * Fallback order: the chosen cover, if it is still among the media (an admin
 * can remove the image that was the cover), then the first image, then nothing.
 * Products saved before this field existed have no `coverMedia` and land on the
 * old behaviour untouched, so no migration is needed.
 */

const idOf = (value) => {
    if (!value) return ''
    if (typeof value === 'string') return value
    // Populated doc, ObjectId, or a lean sub-document.
    return String(value._id ?? value)
}

/**
 * The media entry that should act as the cover, or undefined when there is no
 * media at all. Accepts populated media docs or bare ids.
 */
export const resolveCoverMedia = (doc) => {
    const media = Array.isArray(doc?.media) ? doc.media : []
    if (media.length === 0) return undefined

    const coverId = idOf(doc?.coverMedia)
    if (!coverId) return media[0]

    return media.find((item) => idOf(item) === coverId) || media[0]
}

/**
 * A copy of the document with `media` reordered so the cover sits at index 0.
 * The remaining images keep their relative order. Safe to call on anything -
 * null, a doc with no media, or one whose cover was since deleted.
 */
export const withCoverFirst = (doc) => {
    if (!doc) return doc

    const media = Array.isArray(doc.media) ? doc.media : []
    if (media.length < 2) return doc

    const coverId = idOf(doc.coverMedia)
    if (!coverId) return doc

    const index = media.findIndex((item) => idOf(item) === coverId)
    if (index <= 0) return doc

    return {
        ...doc,
        media: [media[index], ...media.slice(0, index), ...media.slice(index + 1)],
    }
}

/** `withCoverFirst` over a list, skipping nulls. */
export const withCoverFirstAll = (docs) =>
    Array.isArray(docs) ? docs.map(withCoverFirst) : docs
