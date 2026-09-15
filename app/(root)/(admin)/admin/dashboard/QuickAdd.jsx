import Link from 'next/link'
import { FolderTree, Sprout, ClipboardList, Images, ArrowUpRight } from 'lucide-react'
import {
    ADMIN_CATEGORY_ADD,
    ADMIN_ENQUIRY_SHOW,
    ADMIN_MEDIA_SHOW,
    ADMIN_PRODUCT_ADD,
} from '@/routes/AdminPanelRoute'
import { CardDefaultSm as Card } from '@/components/ui/card'
import { accentChipStyle } from '@/lib/adminStatus'

const QuickAdd = () => {
    const quickLinks = [
        {
            title: 'Add Category',
            href: ADMIN_CATEGORY_ADD,
            icon: FolderTree,
            description: 'Create a new category',
            accent: '1',
        },
        {
            title: 'Add Product',
            href: ADMIN_PRODUCT_ADD,
            icon: Sprout,
            description: 'Add a new product',
            accent: '2',
        },
        {
            title: 'View Enquiries',
            href: ADMIN_ENQUIRY_SHOW,
            icon: ClipboardList,
            description: 'Review customer enquiries',
            accent: '3',
        },
        {
            title: 'Upload Media',
            href: ADMIN_MEDIA_SHOW,
            icon: Images,
            description: 'Manage media assets',
            accent: '4',
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((link) => (
                <Link
                    key={link.title}
                    href={link.href}
                    className="rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <Card className="h-full gap-4">
                        <span
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg"
                            style={accentChipStyle(link.accent)}
                            aria-hidden
                        >
                            <link.icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            {/* The title used to be tinted with the accent colour,
                                which put forest green on a near-black card in dark
                                mode. Labels stay on foreground; the chip carries
                                the colour. */}
                            <div className="truncate text-sm font-medium text-foreground">
                                {link.title}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                                {link.description}
                            </div>
                        </div>
                        <ArrowUpRight
                            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-foreground"
                            aria-hidden
                        />
                    </Card>
                </Link>
            ))}
        </div>
    )
}

export default QuickAdd
