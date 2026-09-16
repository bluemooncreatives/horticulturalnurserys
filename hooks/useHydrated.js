'use client'

import { useEffect, useState } from 'react'

/**
 * False during server rendering and on the first client render, true from the
 * first effect onwards.
 *
 * The cart lives in redux-persist, which can only read localStorage in the
 * browser. On the server the store is always empty, so any markup derived from
 * it (an empty-state branch, an "Added" button, a count badge) differs from what
 * the client produces once the store rehydrates - React then discards the whole
 * subtree and logs a hydration mismatch.
 *
 * Gate cart-derived markup on this so the server render and the first client
 * render agree, and the real state appears on the next paint.
 */
const useHydrated = () => {
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => setHydrated(true), [])
    return hydrated
}

export default useHydrated
