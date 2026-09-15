'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import useFetch from '@/hooks/useFetch'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Hash, User, Package, ClipboardList } from 'lucide-react'
import { ADMIN_ENQUIRY_DETAILS } from '@/routes/AdminPanelRoute'
import { statusChipStyle } from '@/lib/adminStatus'
import EmptyState from '@/components/Application/Admin/EmptyState'
import { TableRowsSkeleton } from '@/components/Application/Admin/Loaders'

const LatestEnquiries = () => {
    const [latest, setLatest] = useState()
    const { data, loading } = useFetch('/api/dashboard/admin/latest-enquiry')

    useEffect(() => {
        if (data && data.success) {
            setLatest(data.data)
        }
    }, [data])

    if (!loading && (!latest || latest.length === 0)) {
        return (
            <EmptyState
                icon={ClipboardList}
                title="No enquiries yet"
                description="Product enquiries from the storefront will appear here."
            />
        )
    }

    return (
        <Table>
            <TableHeader>
                {/* The header sat on bg-background inside a bg-card panel, which
                    drew a visible seam across the top of the table. It now
                    inherits the card surface and sticks while the list scrolls. */}
                <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="sticky top-0 z-10 bg-card text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Hash className="size-3.5" /> Enquiry Id
                        </span>
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-card text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <User className="size-3.5" /> Name
                        </span>
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-card text-right text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center justify-end gap-2">
                            <Package className="size-3.5" /> Items
                        </span>
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-card text-xs font-semibold text-muted-foreground">
                        Status
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRowsSkeleton rows={5} columns={4} />
                ) : (
                    latest?.map((enquiry) => (
                        <TableRow key={enquiry._id} className="border-border/60 text-sm">
                            <TableCell className="py-3 font-medium">
                                <Link
                                    href={ADMIN_ENQUIRY_DETAILS(enquiry._id)}
                                    className="rounded-sm font-mono text-xs hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                >
                                    {enquiry.ticketId || enquiry._id}
                                </Link>
                            </TableCell>
                            <TableCell className="max-w-[12rem] truncate py-3 text-muted-foreground">
                                {enquiry.name}
                            </TableCell>
                            <TableCell className="py-3 text-right tabular-nums text-muted-foreground">
                                {enquiry.products?.length || 0}
                            </TableCell>
                            <TableCell className="py-3">
                                <Badge
                                    variant="status"
                                    style={statusChipStyle(enquiry.status)}
                                    className="capitalize"
                                >
                                    {enquiry.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

export default LatestEnquiries
