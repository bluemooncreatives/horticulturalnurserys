'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ThemeSwitch from './ThemeSwitch'
import UserDropdown from './UserDropdown'
import AdminSearch from './AdminSearch'
import AdminMobileSearch from './AdminMobileSearch'
import Header from './layout/Header'
import TopNav from './layout/TopNav'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Trash2 } from 'lucide-react'
import {
    ADMIN_DASHBOARD,
    ADMIN_PRODUCT_SHOW,
    ADMIN_ENQUIRY_SHOW,
    ADMIN_MEDIA_SHOW,
    ADMIN_TRASH,
} from '@/routes/AdminPanelRoute'

/**
 * The third tab used to read "Settings" but pointed at /admin/trash, and the
 * gear button beside the theme switch was inert - no href, no handler. The
 * tabs now name where they actually go, and the icon button is the recycle
 * bin it was standing in for.
 */
const topNav = [
    { title: 'Overview', href: ADMIN_DASHBOARD },
    { title: 'Products', href: ADMIN_PRODUCT_SHOW },
    { title: 'Enquiries', href: ADMIN_ENQUIRY_SHOW },
    { title: 'Media', href: ADMIN_MEDIA_SHOW },
]

const Topbar = () => {
    const pathname = usePathname()
    const links = topNav.map((link) => ({
        ...link,
        isActive: pathname === link.href || pathname.startsWith(`${link.href}/`),
        disabled: link.disabled ?? false,
    }))

    return (
        <Header
            fixed
            className="border-b border-border bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70"
        >
            <TopNav links={links} />
            <div className="ms-auto flex items-center gap-1 sm:gap-1.5">
                <div className="hidden md:block">
                    <AdminSearch />
                </div>
                <AdminMobileSearch />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={ADMIN_TRASH} aria-label="Recycle bin">
                                <Trash2 className="size-4" />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Recycle bin</TooltipContent>
                </Tooltip>
                <ThemeSwitch />
                <Separator orientation="vertical" className="mx-1 h-5" />
                <UserDropdown />
            </div>
        </Header>
    )
}

export default Topbar
