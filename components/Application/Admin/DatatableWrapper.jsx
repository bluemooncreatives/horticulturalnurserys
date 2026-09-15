'use client'

import Datatable from "./Datatable"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const DatatableWrapper = ({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndpoint,
    deleteEndpoint,
    deleteType,
    trashView,
    createAction
}) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Rendering null until mount collapsed the page to the header and then
    // snapped the whole table in. Hold the table's footprint instead.
    if (!mounted) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <Skeleton className="h-9 w-full xl:max-w-xl" />
                    <Skeleton className="h-9 w-64" />
                </div>
                <Skeleton className="h-[26rem] w-full rounded-xl" />
            </div>
        )
    }

    return (
        <Datatable
            queryKey={queryKey}
            fetchUrl={fetchUrl}
            columnsConfig={columnsConfig}
            initialPageSize={initialPageSize}
            exportEndpoint={exportEndpoint}
            deleteEndpoint={deleteEndpoint}
            deleteType={deleteType}
            trashView={trashView}
            createAction={createAction}
        />
    )
}

export default DatatableWrapper