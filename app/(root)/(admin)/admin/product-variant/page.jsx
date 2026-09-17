'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import EditAction from "@/components/Application/Admin/EditAction"
import PageHeader from "@/components/Application/Admin/PageHeader"
import { Button } from "@/components/ui/button"
import { DT_PRODUCT_VARIANT_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_ADD, ADMIN_PRODUCT_VARIANT_EDIT, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import Link from "next/link"
import { useCallback, useMemo } from "react"
import { Plus } from 'lucide-react'
import useFetch from "@/hooks/useFetch"
import DataTableSelectFilter from "@/components/Application/Admin/data-table/DataTableSelectFilter"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variant' },
]
const ShowProductVariant = () => {

    const columns = useMemo(() => {
        return columnConfig(DT_PRODUCT_VARIANT_COLUMN)
    }, [])

    // Filter options carry ids, not names: the API matches the raw ObjectId,
    // so two categories sharing a name stay distinct.
    const { data: parentData } = useFetch('/api/parent?deleteType=SD&&size=10000')
    const parentOptions = useMemo(
        () => (Array.isArray(parentData?.data) ? parentData.data : [])
            .map((parent) => ({ label: parent.name, value: parent._id })),
        [parentData]
    )

    const { data: categoryData } = useFetch('/api/category?deleteType=SD&&size=10000')
    const categoryOptions = useMemo(
        () => (Array.isArray(categoryData?.data) ? categoryData.data : [])
            .map((category) => ({
                label: category.name,
                value: category._id,
                parentId: category.parentId,
            })),
        [categoryData]
    )

    const toolbarFilters = useCallback(
        (table) => {
            const selectedParent = table.getColumn('parent')?.getFilterValue() ?? null
            // Once a parent is chosen, only its categories are offerable -
            // any other combination can only ever return an empty table.
            const scopedCategories = selectedParent
                ? categoryOptions.filter((option) => option.parentId === selectedParent)
                : categoryOptions

            return (
                <>
                    <DataTableSelectFilter
                        table={table}
                        columnId="parent"
                        options={parentOptions}
                        placeholder="All parents"
                        // A category from the previous parent would survive as a
                        // stale id the narrowed list can no longer label.
                        onValueChange={() => table.getColumn('category')?.setFilterValue(undefined)}
                    />
                    <DataTableSelectFilter
                        table={table}
                        columnId="category"
                        options={scopedCategories}
                        placeholder="All categories"
                    />
                </>
            )
        },
        [parentOptions, categoryOptions]
    )

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction key="edit" href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)} />)
        actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <PageHeader
                title="Show Product Variants"
                description="Keep variant options and stock in sync."
                breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
                actions={
                    <Button asChild size="lg" className="h-9">
                        <Link href={ADMIN_PRODUCT_VARIANT_ADD} className="inline-flex items-center gap-2">
                            <Plus className="size-4" />
                            New Variant
                        </Link>
                    </Button>
                }
            />

            <div>
                <DatatableWrapper
                    queryKey="product-variant-data"
                    fetchUrl="/api/product-variant"
                    initialPageSize={10}
                    columnsConfig={columns}
                    exportEndpoint="/api/product-variant/export"
                    deleteEndpoint="/api/product-variant/delete"
                    deleteType="SD"
                    trashView={`${ADMIN_TRASH}?trashof=product-variant`}
                    createAction={action}
                    toolbarFilters={toolbarFilters}
                />
            </div>
        </div>
    )
}

export default ShowProductVariant
