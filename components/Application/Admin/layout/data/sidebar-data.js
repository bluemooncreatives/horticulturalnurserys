import { adminNavGroups } from '@/lib/adminSidebarMenu'
import { Command, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

const HDCMark = ({ className }) => (
    <span className={cn('text-[10px] font-bold tracking-tight', className)}>HDC</span>
)

const teams = [
    {
        name: 'Horticultural DC',
        logo: HDCMark,
        plan: 'Admin Panel',
    },
    {
        name: 'Nursery Operations',
        logo: Crown,
        plan: 'Farm & Stock',
    },
    {
        name: 'Sale Counter',
        logo: Command,
        plan: 'Alipore',
    },
]

const mapNavItem = (item) => {
    const mapped = {
        title: item.title,
        url: item.url,
        icon: item.icon,
        badge: item.badge,
    }

    if (item.submenu && item.submenu.length > 0) {
        mapped.items = item.submenu.map((sub) => ({
            title: sub.title,
            url: sub.url,
            icon: sub.icon,
            badge: sub.badge,
        }))
    }

    return mapped
}

const navGroups = adminNavGroups.map((group) => ({
    title: group.title,
    items: group.items.map(mapNavItem),
}))

export const sidebarData = {
    teams,
    navGroups,
}
