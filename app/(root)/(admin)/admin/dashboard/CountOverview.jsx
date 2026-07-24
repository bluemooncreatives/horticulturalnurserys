'use client'
import Link from 'next/link'
import useFetch from '@/hooks/useFetch';
import { ADMIN_CATEGORY_SHOW, ADMIN_PRODUCT_SHOW, ADMIN_ENQUIRY_SHOW } from '@/routes/AdminPanelRoute';
import { FolderTree, Shirt, ClipboardList, Inbox, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const CountOverview = () => {

    const { data: countData } = useFetch('/api/dashboard/admin/count')

    const getTrendInfo = (current, previous) => {
        if (!previous || previous === 0) {
            return { isIncreased: true, text: 'Increased from Last Month' }
        }
        const isIncreased = current > previous
        return {
            isIncreased,
            text: isIncreased ? 'Increased from Last Month' : 'Decreased from Last Month'
        }
    }

    const categoryTrend = getTrendInfo(countData?.data?.category || 0, countData?.data?.categoryPrevious)
    const productTrend = getTrendInfo(countData?.data?.product || 0, countData?.data?.productPrevious)
    const enquiryTrend = getTrendInfo(countData?.data?.enquiry || 0, countData?.data?.enquiryPrevious)
    const newEnquiryTrend = getTrendInfo(countData?.data?.newEnquiry || 0, countData?.data?.newEnquiryPrevious)

    const cards = [
        {
            title: 'Total Categories',
            value: countData?.data?.category || 0,
            trend: categoryTrend,
            href: ADMIN_CATEGORY_SHOW,
            icon: FolderTree,
            chartVar: '--chart-1'
        },
        {
            title: 'Total Products',
            value: countData?.data?.product || 0,
            trend: productTrend,
            href: ADMIN_PRODUCT_SHOW,
            icon: Shirt,
            chartVar: '--chart-2'
        },
        {
            title: 'Total Enquiries',
            value: countData?.data?.enquiry || 0,
            trend: enquiryTrend,
            href: ADMIN_ENQUIRY_SHOW,
            icon: ClipboardList,
            chartVar: '--chart-3'
        },
        {
            title: 'New Enquiries',
            value: countData?.data?.newEnquiry || 0,
            trend: newEnquiryTrend,
            href: ADMIN_ENQUIRY_SHOW,
            icon: Inbox,
            chartVar: '--chart-4'
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Link key={card.title} href={card.href} aria-label={`${card.title}: ${card.value}`}>
                        <Card className={`border-l-4 hover:border-l-8`} style={{ borderLeftColor: `var(${card.chartVar})` }}> 
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className={`text-sm font-medium`} style={{ color: `var(${card.chartVar})` }}>{card.title}</CardTitle>
                                            </div>
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `var(${card.chartVar})`, color: 'white' }} aria-hidden>
                                                <card.icon className="h-4 w-4" />
                                            </span>
                                        </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{card.value}</div>
                                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {card.trend.isIncreased ? (
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <TrendingUp className="h-3 w-3" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                                <TrendingDown className="h-3 w-3" />
                                            </span>
                                        )}
                                    <span className="ml-1">{card.trend.text}</span>
                                </p>
                            </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

export default CountOverview
