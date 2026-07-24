'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import PageHeader from "@/components/Application/Admin/PageHeader"
import { DT_REVIEW_COLUMN, } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_DASHBOARD, ADMIN_REVIEW_ADD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useCallback, useMemo } from "react"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: '', label: 'Review' },
]
const ShowReview = () => {

    const columns = useMemo(() => {
        return columnConfig(DT_REVIEW_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []

        actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <PageHeader
                title="Reviews"
                description="Admin-managed product reviews shown on the storefront."
                breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
                actions={
                    <Link href={ADMIN_REVIEW_ADD}>
                        <Button className="gap-2 h-9" size="lg">
                            <Plus className="size-4" />
                            Add Review
                        </Button>
                    </Link>
                }
            />

            <div className="rounded-md bg-card">
                <DatatableWrapper
                    queryKey="review-data"
                    fetchUrl="/api/review"
                    initialPageSize={10}
                    columnsConfig={columns}
                    exportEndpoint="/api/review/export"
                    deleteEndpoint="/api/review/delete"
                    deleteType="SD"
                    trashView={`${ADMIN_TRASH}?trashof=review`}
                    createAction={action}
                />
            </div>
        </div>
    )
}

export default ShowReview
