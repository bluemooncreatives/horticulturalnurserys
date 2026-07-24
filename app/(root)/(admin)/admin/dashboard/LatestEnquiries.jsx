'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import useFetch from "@/hooks/useFetch"
import Image from "next/image"
import Link from "next/link"
import notFound from '@/public/assets/images/not-found.png'
import { useEffect, useState } from "react"
import { Hash, User, Package } from "lucide-react"
import { ADMIN_ENQUIRY_DETAILS } from "@/routes/AdminPanelRoute"

const statusClass = (status) => ({
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    quoted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300')

const LatestEnquiries = () => {
    const [latest, setLatest] = useState()
    const { data, loading } = useFetch('/api/dashboard/admin/latest-enquiry')

    useEffect(() => {
        if (data && data.success) {
            setLatest(data.data)
        }
    }, [data])

    if (loading) return <div className="h-full w-full flex justify-center items-center">Loading...</div>

    if (!latest || latest.length === 0) return (
        <div className="h-full w-full flex justify-center items-center">
            <Image src={notFound.src} width={notFound.width} height={notFound.height} alt="not found" className="w-20" />
        </div>
    )

    return (
        <Table>
            <TableHeader>
                <TableRow className="group/row">
                    <TableHead className="bg-background text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2"><Hash className="h-3.5 w-3.5" /> Enquiry Id</span>
                    </TableHead>
                    <TableHead className="bg-background text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> Name</span>
                    </TableHead>
                    <TableHead className="bg-background text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2"><Package className="h-3.5 w-3.5" /> Items</span>
                    </TableHead>
                    <TableHead className="bg-background text-xs font-semibold text-muted-foreground">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {latest?.map((enquiry) => (
                    <TableRow key={enquiry._id} className="group/row text-sm">
                        <TableCell className="bg-background py-3 font-medium">
                            <Link href={ADMIN_ENQUIRY_DETAILS(enquiry._id)} className="hover:underline">
                                {enquiry.ticketId || enquiry._id}
                            </Link>
                        </TableCell>
                        <TableCell className="bg-background py-3 text-muted-foreground">{enquiry.name}</TableCell>
                        <TableCell className="bg-background py-3 text-muted-foreground">{enquiry.products?.length || 0}</TableCell>
                        <TableCell className="bg-background py-3">
                            <Badge className={`${statusClass(enquiry.status)} capitalize`}>{enquiry.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestEnquiries
