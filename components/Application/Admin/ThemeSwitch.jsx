'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'

const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // next-themes only knows the resolved theme on the client; reading it
    // during SSR produced a hydration mismatch on the icon.
    useEffect(() => setMounted(true), [])

    return (
        <DropdownMenu modal={false}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            aria-label="Change theme"
                        >
                            <Sun className="size-4 dark:hidden" />
                            <Moon className="hidden size-4 dark:block" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Theme</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-36">
                {/* The old menu was three plain items with no indication of which
                    one was in effect. A radio group marks the current choice. */}
                <DropdownMenuRadioGroup
                    value={mounted ? theme : undefined}
                    onValueChange={setTheme}
                >
                    <DropdownMenuRadioItem value="light" className="cursor-pointer">
                        <Sun className="size-3.5 text-muted-foreground" />
                        Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                        <Moon className="size-3.5 text-muted-foreground" />
                        Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system" className="cursor-pointer">
                        <Monitor className="size-3.5 text-muted-foreground" />
                        System
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch
