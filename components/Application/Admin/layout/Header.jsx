'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const Header = ({ className, fixed = false, children, ...props }) => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            const offset = document.body.scrollTop || document.documentElement.scrollTop
            // Track a boolean rather than the raw pixel offset: the old version
            // set state on every scroll frame, re-rendering the whole header
            // (and its search field) dozens of times per gesture.
            setScrolled(offset > 8)
        }

        onScroll()
        document.addEventListener('scroll', onScroll, { passive: true })
        return () => document.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            data-scrolled={scrolled}
            className={cn(
                'z-40 h-14 shrink-0',
                fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    'relative flex h-full items-center gap-2 px-3 transition-shadow duration-200 sm:gap-3 sm:px-4',
                    scrolled && fixed && 'shadow-sm'
                )}
            >
                <SidebarTrigger
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                />
                <Separator orientation="vertical" className="h-5" />
                {children}
            </div>
        </header>
    )
}

export default Header
