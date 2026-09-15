import Link from 'next/link'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const TopNav = ({ className, links = [], ...props }) => {
    return (
        <>
            <div className="lg:hidden">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost" aria-label="Open section menu">
                            <Menu className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start" className="w-44">
                        {links.map(({ title, href, isActive, disabled }) => (
                            <DropdownMenuItem key={`${title}-${href}`} asChild>
                                <Link
                                    href={href}
                                    className={cn(
                                        'cursor-pointer',
                                        isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
                                    )}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-disabled={disabled}
                                    tabIndex={disabled ? -1 : undefined}
                                >
                                    {title}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <nav
                className={cn('hidden h-full items-center gap-1 lg:flex', className)}
                {...props}
            >
                {links.map(({ title, href, isActive, disabled }) => (
                    <Link
                        key={`${title}-${href}`}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        aria-disabled={disabled}
                        tabIndex={disabled ? -1 : undefined}
                        className={cn(
                            // The active tab was distinguished only by inheriting
                            // the default text colour - near-invisible next to the
                            // muted ones. It now carries a weight change and an
                            // underline rule.
                            'relative rounded-md px-2.5 py-1.5 text-sm transition-colors after:absolute after:inset-x-2.5 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors',
                            isActive
                                ? 'font-medium text-foreground after:bg-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground after:bg-transparent',
                            disabled && 'pointer-events-none opacity-60'
                        )}
                    >
                        {title}
                    </Link>
                ))}
            </nav>
        </>
    )
}

export default TopNav
