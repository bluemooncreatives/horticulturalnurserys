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
import {
    ChevronRight,
    Trash2,
    ArrowLeft,
    FolderTree,
    Tag,
    Sprout,
    Layers,
    Users,
    Star,
    ClipboardList,
    Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_TRASH, label: 'Trash' },
]

const TRASH_CONFIG = {
    parent: {
        title: 'Parent Trash',
        description: 'Deleted top-level catalog groups',
        icon: FolderTree,
        columns: DT_PARENT_COLUMN,
        fetchUrl: '/api/parent',
        exportUrl: '/api/parent/export',
        deleteUrl: '/api/parent/delete'
    },
    category: {
        title: 'Category Trash',
        description: 'Deleted plant & supply categories',
        icon: Tag,
        columns: DT_CATEGORY_COLUMN,
        fetchUrl: '/api/category',
        exportUrl: '/api/category/export',
        deleteUrl: '/api/category/delete'
    },
    product: {
        title: 'Product Trash',
        description: 'Deleted catalog products & plants',
        icon: Sprout,
        columns: DT_PRODUCT_COLUMN,
        fetchUrl: '/api/product',
        exportUrl: '/api/product/export',
        deleteUrl: '/api/product/delete'
    },
    "product-variant": {
        title: 'Product Variant Trash',
        description: 'Deleted sizes, colors, and pot variations',
        icon: Layers,
        columns: DT_PRODUCT_VARIANT_COLUMN,
        fetchUrl: '/api/product-variant',
        exportUrl: '/api/product-variant/export',
        deleteUrl: '/api/product-variant/delete'
    },
    customers: {
        title: 'Customers Trash',
        description: 'Deleted customer accounts',
        icon: Users,
        columns: DT_CUSTOMERS_COLUMN,
        fetchUrl: '/api/customers',
        exportUrl: '/api/customers/export',
        deleteUrl: '/api/customers/delete'
    },
    review: {
        title: 'Review Trash',
        description: 'Deleted product reviews & ratings',
        icon: Star,
        columns: DT_REVIEW_COLUMN,
        fetchUrl: '/api/review',
        exportUrl: '/api/review/export',
        deleteUrl: '/api/review/delete'
    },
    enquiries: {
        title: 'Enquiries Trash',
        description: 'Deleted customer leads & product inquiries',
        icon: ClipboardList,
        columns: DT_ENQUIRY_COLUMN,
        fetchUrl: '/api/enquiry',
        exportUrl: '/api/enquiry/export',
        deleteUrl: '/api/enquiry/delete'
    },
    contacts: {
        title: 'Contact Queries Trash',
        description: 'Deleted contact form submissions',
        icon: Mail,
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
                    description="Pick a section to review deleted items, restore them, or delete permanently."
                    breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
                />
                <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(TRASH_CONFIG).map(([key, section]) => {
                        const IconComponent = section.icon || Trash2
                        return (
                            <li key={key}>
                                <Link
                                    href={`${ADMIN_TRASH}?trashof=${key}`}
                                    className="group flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/30 hover:shadow-xs focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <IconComponent className="size-5" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-semibold text-foreground">
                                            {section.title.replace(' Trash', '')}
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {section.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }

    const sectionBreadcrumb = [
        { href: ADMIN_DASHBOARD, label: 'Home' },
        { href: ADMIN_TRASH, label: 'Trash' },
        { href: '', label: config.title },
    ]

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <PageHeader
                title={config.title}
                description="Restore items to the active catalog or delete them permanently."
                breadcrumb={<BreadCrumb breadcrumbData={sectionBreadcrumb} />}
                actions={
                    <Button asChild variant="outline" size="sm" className="h-9">
                        <Link href={ADMIN_TRASH} className="inline-flex items-center gap-1.5">
                            <ArrowLeft className="size-4" />
                            All Categories
                        </Link>
                    </Button>
                }
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
