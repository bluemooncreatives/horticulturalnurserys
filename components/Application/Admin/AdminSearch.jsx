'use client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import SearchModel from './SearchModel'

const AdminSearch = () => {
    const [open, setOpen] = useState(false)

    /**
     * The field has always advertised a Ctrl/Cmd+K shortcut, but nothing ever
     * listened for it - the hint was decoration. Register it here so the badge
     * tells the truth.
     */
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                setOpen((prev) => !prev)
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    return (
        <div className="md:w-60 lg:w-75">
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-keyshortcuts="Control+K Meta+K"
                className="flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-muted/40 pe-2 ps-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
                {/* This was a readOnly <input> styled to look like a button, which
                    put a text caret and a real form control in the tab order for
                    something that only opens a dialog. */}
                <Search className="size-4 shrink-0" aria-hidden />
                <span className="flex-1 text-start">Search</span>
                <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-sans text-[0.6875rem] font-medium text-muted-foreground sm:inline-flex">
                    Ctrl K
                </kbd>
            </button>

            <SearchModel open={open} setOpen={setOpen} />
        </div>
    )
}

export default AdminSearch
