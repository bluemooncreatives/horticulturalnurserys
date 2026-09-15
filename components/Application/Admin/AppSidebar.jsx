'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './layout/data/sidebar-data'
import TeamSwitcher from './layout/TeamSwitcher'
import NavGroup from './layout/NavGroup'
import NavUser from './layout/NavUser'

const AppSidebar = () => {
    return (
        <Sidebar variant="inset" collapsible="icon" className="z-50">
            <SidebarHeader className="border-b border-sidebar-border pb-2">
                <TeamSwitcher teams={sidebarData.teams} />
            </SidebarHeader>
            <SidebarContent>
                {sidebarData.navGroups.map((group, index) => (
                    <NavGroup key={group.title || index} {...group} />
                ))}
            </SidebarContent>
            {/* SidebarFooter ships with no padding, so the account row used to sit
                flush against the bottom edge of the rail. */}
            <SidebarFooter className="p-2">
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar
