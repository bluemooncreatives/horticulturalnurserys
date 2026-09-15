'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import searchData from '@/lib/search'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const options = {
    keys: ['label', 'description', 'keywords'],
    threshold: 0.3,
}

const SearchModel = ({ open, setOpen }) => {
    const [query, setQuery] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const listRef = useRef(null)

    // The index was rebuilt on every render - i.e. on every keystroke - which
    // re-tokenises the whole dataset for nothing.
    const fuse = useMemo(() => new Fuse(searchData, options), [])

    const results = useMemo(() => {
        const trimmed = query.trim()
        // With no query, show the full list rather than an empty panel. The old
        // version rendered nothing at all until you typed.
        if (!trimmed) return searchData
        return fuse.search(trimmed).map((r) => r.item)
    }, [query, fuse])

    // Reset between openings so the dialog never reopens mid-search.
    useEffect(() => {
        if (!open) {
            setQuery('')
        }
        setActiveIndex(0)
    }, [open])

    useEffect(() => {
        setActiveIndex(0)
    }, [query])

    const handleKeyDown = (event) => {
        if (!results.length) return

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex((i) => (i + 1) % results.length)
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((i) => (i - 1 + results.length) % results.length)
        } else if (event.key === 'Enter') {
            event.preventDefault()
            listRef.current?.querySelector('[data-active="true"] a')?.click()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="gap-0 p-0 sm:max-w-lg">
                <DialogHeader className="sr-only">
                    <DialogTitle>Quick Search</DialogTitle>
                    <DialogDescription>
                        Find and navigate to any admin section instantly.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 border-b border-border px-4">
                    <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <Input
                        placeholder="Search admin sections…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        aria-label="Search admin sections"
                        className="h-12 rounded-none border-0 px-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                    />
                </div>

                <ul ref={listRef} className="admin-scroll max-h-80 overflow-y-auto p-2">
                    {results.map((item, index) => (
                        <li key={`${item.url}-${index}`} data-active={index === activeIndex}>
                            <Link
                                href={item.url}
                                onClick={() => setOpen(false)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={cn(
                                    'flex items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors',
                                    index === activeIndex ? 'bg-accent' : 'hover:bg-muted'
                                )}
                            >
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-medium text-foreground">
                                        {item.label}
                                    </span>
                                    <span className="block truncate text-xs text-muted-foreground">
                                        {item.description}
                                    </span>
                                </span>
                                {index === activeIndex && (
                                    <CornerDownLeft
                                        className="size-3.5 shrink-0 text-muted-foreground"
                                        aria-hidden
                                    />
                                )}
                            </Link>
                        </li>
                    ))}

                    {query && results.length === 0 && (
                        // An empty result set is not an error state; it used to be
                        // rendered in destructive red.
                        <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                            No sections match “{query}”.
                        </li>
                    )}
                </ul>

                <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[0.6875rem] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">↑</kbd>
                        <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">↓</kbd>
                        to navigate
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">Enter</kbd>
                        to open
                    </span>
                    <span className="ms-auto flex items-center gap-1">
                        <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans">Esc</kbd>
                        to close
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SearchModel
