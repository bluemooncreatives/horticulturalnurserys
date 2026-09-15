'use client'

import useFetch from '@/hooks/useFetch'
import { useEffect, useState } from 'react'
import { PieChart } from 'lucide-react'
import { statusSolidStyle } from '@/lib/adminStatus'
import EmptyState from '@/components/Application/Admin/EmptyState'
import { BarsSkeleton } from '@/components/Application/Admin/Loaders'

const EnquiryStatusOverview = () => {
    const [breakdown, setBreakdown] = useState({ data: [], total: 0 })
    const { data, loading } = useFetch('/api/dashboard/admin/enquiry-status')

    useEffect(() => {
        if (data && data.success) {
            setBreakdown(data.data)
        }
    }, [data])

    if (loading) return <BarsSkeleton rows={4} />

    const { data: rows = [], total = 0 } = breakdown

    if (!total) {
        return (
            <EmptyState
                icon={PieChart}
                title="No enquiries yet"
                description="Once leads come in you'll see how they're distributed across the pipeline."
            />
        )
    }

    return (
        <div className="space-y-4">
            {rows.map(({ status, count }) => {
                const pct = total ? Math.round((count / total) * 100) : 0
                return (
                    <div key={status}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 font-medium capitalize">
                                <span
                                    aria-hidden
                                    className="size-2 shrink-0 rounded-full"
                                    style={statusSolidStyle(status)}
                                />
                                {status}
                            </span>
                            <span className="tabular-nums text-muted-foreground">
                                {count} · {pct}%
                            </span>
                        </div>
                        {/* role/aria so the bar is not a purely visual figure */}
                        <div
                            className="h-2 w-full overflow-hidden rounded-full bg-muted"
                            role="meter"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${status}: ${count} of ${total} enquiries`}
                        >
                            <div
                                className="h-full rounded-full transition-[width] duration-500 ease-out"
                                style={{ width: `${pct}%`, ...statusSolidStyle(status) }}
                            />
                        </div>
                    </div>
                )
            })}
            <p className="border-t border-border pt-3 text-xs text-muted-foreground">
                Total enquiries:{' '}
                <span className="font-semibold tabular-nums text-foreground">{total}</span>
            </p>
        </div>
    )
}

export default EnquiryStatusOverview
