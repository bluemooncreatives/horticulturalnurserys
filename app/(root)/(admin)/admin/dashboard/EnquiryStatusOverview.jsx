'use client'

import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"

const BAR = {
    new: 'bg-blue-500',
    contacted: 'bg-amber-500',
    quoted: 'bg-purple-500',
    closed: 'bg-emerald-500',
}

const EnquiryStatusOverview = () => {
    const [breakdown, setBreakdown] = useState({ data: [], total: 0 })
    const { data, loading } = useFetch('/api/dashboard/admin/enquiry-status')

    useEffect(() => {
        if (data && data.success) {
            setBreakdown(data.data)
        }
    }, [data])

    if (loading) return <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading…</div>

    const { data: rows = [], total = 0 } = breakdown

    if (!total) {
        return <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No enquiries yet.</div>
    }

    return (
        <div className="space-y-4">
            {rows.map(({ status, count }) => {
                const pct = total ? Math.round((count / total) * 100) : 0
                return (
                    <div key={status}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="capitalize font-medium">{status}</span>
                            <span className="text-muted-foreground tabular-nums">{count} · {pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className={`h-full rounded-full ${BAR[status] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                )
            })}
            <p className="pt-2 text-xs text-muted-foreground">Total enquiries: <span className="font-semibold text-foreground tabular-nums">{total}</span></p>
        </div>
    )
}

export default EnquiryStatusOverview
