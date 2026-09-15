'use client'
import Link from 'next/link'
import useFetch from '@/hooks/useFetch'
import {
    ADMIN_CATEGORY_SHOW,
    ADMIN_PRODUCT_SHOW,
    ADMIN_ENQUIRY_SHOW,
} from '@/routes/AdminPanelRoute'
import { FolderTree, Sprout, ClipboardList, Inbox, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { accentBarStyle, accentChipStyle } from '@/lib/adminStatus'

const CountOverview = () => {
    const { data: countData, loading } = useFetch('/api/dashboard/admin/count')

    /**
     * A zero previous month is "no history", not growth. The old version
     * claimed "Increased from Last Month" on a brand-new install showing 0,
     * which is the state in the screenshots.
     */
    const getTrendInfo = (current, previous) => {
        if (previous === undefined || previous === null) {
            return { direction: 'flat', text: 'No comparison yet' }
        }
        if (current === previous) {
            return { direction: 'flat', text: 'Unchanged from last month' }
        }
        const isIncreased = current > previous
        return {
            direction: isIncreased ? 'up' : 'down',
            text: isIncreased ? 'Increased from last month' : 'Decreased from last month',
        }
    }

    const counts = countData?.data

    const cards = [
        {
            title: 'Total Categories',
            value: counts?.category ?? 0,
            trend: getTrendInfo(counts?.category ?? 0, counts?.categoryPrevious),
            href: ADMIN_CATEGORY_SHOW,
            icon: FolderTree,
            accent: '1',
        },
        {
            title: 'Total Products',
            value: counts?.product ?? 0,
            trend: getTrendInfo(counts?.product ?? 0, counts?.productPrevious),
            href: ADMIN_PRODUCT_SHOW,
            icon: Sprout,
            accent: '2',
        },
        {
            title: 'Total Enquiries',
            value: counts?.enquiry ?? 0,
            trend: getTrendInfo(counts?.enquiry ?? 0, counts?.enquiryPrevious),
            href: ADMIN_ENQUIRY_SHOW,
            icon: ClipboardList,
            accent: '3',
        },
        {
            title: 'New Enquiries',
            value: counts?.newEnquiry ?? 0,
            trend: getTrendInfo(counts?.newEnquiry ?? 0, counts?.newEnquiryPrevious),
            href: ADMIN_ENQUIRY_SHOW,
            icon: Inbox,
            accent: '4',
        },
    ]

    const trendMeta = {
        up: { Icon: TrendingUp, className: 'text-success' },
        down: { Icon: TrendingDown, className: 'text-destructive' },
        flat: { Icon: Minus, className: 'text-muted-foreground' },
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const { Icon: TrendIcon, className: trendClass } = trendMeta[card.trend.direction]

                return (
                    <Link
                        key={card.title}
                        href={card.href}
                        aria-label={`${card.title}: ${card.value}`}
                        className="rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                        <Card interactive className="relative h-full pl-1">
                            {/* The accent lives in a fixed-width rail rather than a
                                border-left that grows on hover - that used to shift
                                the whole card's contents sideways. */}
                            <span
                                aria-hidden
                                className="absolute inset-y-0 left-0 w-1"
                                style={accentBarStyle(card.accent)}
                            />
                            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                                <CardTitle className="pt-1 text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                                <span
                                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg"
                                    style={accentChipStyle(card.accent)}
                                    aria-hidden
                                >
                                    <card.icon className="size-4" />
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {loading ? (
                                    <Skeleton className="h-9 w-16" />
                                ) : (
                                    <div className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                                        {card.value}
                                    </div>
                                )}
                                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <TrendIcon className={`size-3.5 shrink-0 ${trendClass}`} aria-hidden />
                                    <span>{card.trend.text}</span>
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}

export default CountOverview
