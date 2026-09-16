'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import EditAction from "@/components/Application/Admin/EditAction"
import PageHeader from "@/components/Application/Admin/PageHeader"
import { Button } from "@/components/ui/button"
import { DT_CATEGORY_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import Link from "next/link"
import { useCallback, useMemo } from "react"
import { Plus } from 'lucide-react'
import useFetch from "@/hooks/useFetch"
import DataTableSelectFilter from "@/components/Application/Admin/data-table/DataTableSelectFilter"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
]
const ShowCategory = () => {

    const columns = useMemo(() => {
        return columnConfig(DT_CATEGORY_COLUMN)
    }, [])

    // Parents for the toolbar filter. Options carry the parent _id, not its
    // name: the API matches the raw `parent` ObjectId, so two parents sharing a
    // name stay distinct and "Pots" cannot half-match "Pots & Planters".
    const { data: parentData } = useFetch('/api/parent?deleteType=SD&&size=10000')
    const parentOptions = useMemo(
        () => (Array.isArray(parentData?.data) ? parentData.data : [])
            .map((parent) => ({ label: parent.name, value: parent._id })),
        [parentData]
    )

    const toolbarFilters = useCallback(
        (table) => (
            <DataTableSelectFilter
                table={table}
                columnId="parent"
                options={parentOptions}
                placeholder="All parents"
            />
        ),
        [parentOptions]
    )

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key="edit" href={ADMIN_CATEGORY_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <PageHeader
                title="Show Category"
                description="Manage your product categories and hierarchy."
                breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
                actions={
                    <Button asChild size="lg" className="h-9">
                        <Link href={ADMIN_CATEGORY_ADD} className="inline-flex items-center gap-2">
                            <Plus className="size-4" />
                            New Category
                        </Link>
                    </Button>
                }
            />

            <div>
                <DatatableWrapper
                    queryKey="category-data"
                    fetchUrl="/api/category"
                    initialPageSize={10}
                    columnsConfig={columns}
                    exportEndpoint="/api/category/export"
                    deleteEndpoint="/api/category/delete"
                    deleteType="SD"
                    trashView={`${ADMIN_TRASH}?trashof=category`}
                    createAction={action}
                    toolbarFilters={toolbarFilters}
                />
            </div>
        </div>
    )
}

export default ShowCategory
