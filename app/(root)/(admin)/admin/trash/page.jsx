'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import PageHeader from "@/components/Application/Admin/PageHeader"
import { DT_PARENT_COLUMN, DT_CATEGORY_COLUMN, DT_CONTACT_COLUMN, DT_ENQUIRY_COLUMN, DT_CUSTOMERS_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_VARIANT_COLUMN, DT_REVIEW_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCallback, useMemo } from "react"
import { ChevronRight, Trash2 } from "lucide-react"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_TRASH, label: 'Trash' },
]

const TRASH_CONFIG = {
    parent: {
        title: 'Parent Trash',
        columns: DT_PARENT_COLUMN,
        fetchUrl: '/api/parent',
        exportUrl: '/api/parent/export',
        deleteUrl: '/api/parent/delete'
    },

    category: {
        title: 'Category Trash',
        columns: DT_CATEGORY_COLUMN,
        fetchUrl: '/api/category',
        exportUrl: '/api/category/export',
        deleteUrl: '/api/category/delete'
    },

    product: {
        title: 'Product Trash',
        columns: DT_PRODUCT_COLUMN,
        fetchUrl: '/api/product',
        exportUrl: '/api/product/export',
        deleteUrl: '/api/product/delete'
    },
    "product-variant": {
        title: 'Product Variant Trash',
        columns: DT_PRODUCT_VARIANT_COLUMN,
        fetchUrl: '/api/product-variant',
        exportUrl: '/api/product-variant/export',
        deleteUrl: '/api/product-variant/delete'
    },
    customers: {
        title: 'Customers Trash',
        columns: DT_CUSTOMERS_COLUMN,
        fetchUrl: '/api/customers',
        exportUrl: '/api/customers/export',
        deleteUrl: '/api/customers/delete'
    },
    review: {
        title: 'Review Trash',
        columns: DT_REVIEW_COLUMN,
        fetchUrl: '/api/review',
        exportUrl: '/api/review/export',
        deleteUrl: '/api/review/delete'
    },
    enquiries: {
        title: 'Enquiries Trash',
        columns: DT_ENQUIRY_COLUMN,
        fetchUrl: '/api/enquiry',
        exportUrl: '/api/enquiry/export',
        deleteUrl: '/api/enquiry/delete'
    },



    contacts: {
        title: 'Contact Queries Trash',
        columns: DT_CONTACT_COLUMN,
        fetchUrl: '/api/contact',
        exportUrl: '/api/contact/export',
        deleteUrl: '/api/contact/delete'
    },

}

import { Suspense } from "react"

const TrashContent = () => {

    const searchParams = useSearchParams()
    const trashOf = searchParams.get('trashof')

    const config = TRASH_CONFIG[trashOf]

    // These must run before any early return: hooks after a conditional
    // `return` change the hook order between the empty and selected states,
    // which React rejects outright when you navigate from one to the other.
    const columns = useMemo(
        () => (config ? columnConfig(config.columns, false, false, true) : []),
        [config]
    )

    const action = useCallback(
        (row, deleteType, handleDelete) => [
            <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
        ],
        []
    )

    if (!config) {
        return (
            <div className="flex flex-col gap-4 sm:gap-6">
                <PageHeader
                    title="Recycle Bin"
                    description="Pick a section to review the items deleted from it."
                    breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
                />
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(TRASH_CONFIG).map(([key, section]) => (
                        <li key={key}>
                            <Link
                                href={`${ADMIN_TRASH}?trashof=${key}`}
                                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <Trash2 className="size-4" />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {section.title.replace(' Trash', '')}
                                </span>
                                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <PageHeader
                title={config.title}
                description="Restore items or delete them permanently."
                breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
            />

            <div>
                <DatatableWrapper
                    queryKey={`${trashOf}-data-deleted`}
                    fetchUrl={config.fetchUrl}
                    initialPageSize={10}
                    columnsConfig={columns}
                    exportEndpoint={config.exportUrl}
                    deleteEndpoint={config.deleteUrl}
                    deleteType="PD"
                    createAction={action}
                />
            </div>
        </div>
    )
}

const Trash = () => {
    return (
        <Suspense fallback={null}>
            <TrashContent />
        </Suspense>
    )
}

export default Trash
