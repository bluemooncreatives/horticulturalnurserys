'use client'
import Link from 'next/link'
import { ChevronsUpDown, PackagePlus, ClipboardList } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { useSelector } from 'react-redux'
import LogoutButton from '@/components/Application/Admin/LogoutButton'
import { ADMIN_ENQUIRY_SHOW, ADMIN_PRODUCT_ADD } from '@/routes/AdminPanelRoute'

const NavUser = () => {
    const { isMobile } = useSidebar()
    const auth = useSelector((store) => store.authStore.auth)
    const name = auth?.name || 'Admin User'
    const email = auth?.email || 'admin@mail.com'
    const avatarSrc = auth?.avatar || ''

    return (
        <SidebarMenu>
            <SidebarMenuItem className="border-t border-sidebar-border pt-2">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={avatarSrc} alt={name} />
                                <AvatarFallback className="rounded-lg">
                                    {name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid min-w-0 flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-semibold">{name}</span>
                                {/* min-w-0 + truncate on the wrapper: long admin
                                    emails used to push the chevron off the edge
                                    of the sidebar instead of ellipsising. */}
                                <span className="truncate text-xs text-sidebar-foreground/70">
                                    {email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ms-auto size-4 shrink-0 opacity-70" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={avatarSrc} alt={name} />
                                    <AvatarFallback className="rounded-lg">
                                        {name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-start text-sm leading-tight">
                                    <span className="truncate font-semibold">{name}</span>
                                    <span className="truncate text-xs">{email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={ADMIN_PRODUCT_ADD}>
                                    <PackagePlus />
                                    New Product
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={ADMIN_ENQUIRY_SHOW}>
                                    <ClipboardList />
                                    Enquiries
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <LogoutButton />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default NavUser
