'use client'
import Image from 'next/image'
import Link from 'next/link'
import logoWhite from '@/public/assets/images/logo-horti.png'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'

const TeamSwitcher = ({ teams = [] }) => {
    const activeTeam = teams[0]

    if (!activeTeam) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {/* The brand block was a dead SidebarMenuButton with hover
                    suppressed. It is the natural "home" affordance, so it links
                    to the dashboard. The logo tile also had `aspect-square` with
                    no size, so it collapsed to whatever the image happened to be
                    and mis-aligned the two text lines beside it. */}
                <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent">
                    <Link href={ADMIN_DASHBOARD}>
                        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sidebar-accent">
                            <Image
                                src={logoWhite}
                                alt=""
                                width={36}
                                height={36}
                                className="size-7 object-contain"
                                priority
                            />
                        </div>
                        <div className="grid flex-1 text-start leading-tight">
                            <span className="truncate text-sm font-semibold">{activeTeam.name}</span>
                            <span className="truncate text-xs text-sidebar-foreground/70">
                                {activeTeam.plan}
                            </span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default TeamSwitcher
