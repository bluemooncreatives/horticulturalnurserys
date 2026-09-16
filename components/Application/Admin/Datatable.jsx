import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Recycle, Trash2, RotateCcw, Trash, Download, MoreHorizontal, SearchX, AlertCircle } from 'lucide-react'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import ButtonLoading from '../ButtonLoading'
import { showToast } from '@/lib/showToast'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import DataTableToolbar from './data-table/DataTableToolbar'
import DataTablePagination from './data-table/DataTablePagination'
import DataTableColumnHeader from './data-table/DataTableColumnHeader'
import EmptyState from './EmptyState'
import { TableRowsSkeleton } from './Loaders'

const Datatable = ({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndpoint,
    deleteEndpoint,
    deleteType,
    trashView,
    createAction,
    // Render-prop so the page can add column-filter controls without this
    // component knowing anything about them. Receives the table instance.
    toolbarFilters,
}) => {

    const [columnFilters, setColumnFilters] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialPageSize,
    })
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState({})
    const [exportLoading, setExportLoading] = useState(false)

    const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint)

    const hasSelection = Object.keys(rowSelection).length > 0
    // Narrowing the result set while on a later page would otherwise leave the
    // table on a page index that no longer exists, showing an empty grid. The
    // global filter already resets to the first page; column filters must too.
    const handleColumnFiltersChange = (updater) => {
        setColumnFilters((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater
            if (JSON.stringify(next) !== JSON.stringify(prev)) {
                setPagination((prevPagination) => ({ ...prevPagination, pageIndex: 0 }))
            }
            return next
        })
    }

    const handleGlobalFilterChange = (value) => {
        setGlobalFilter((prev) => {
            const nextValue = typeof value === 'function' ? value(prev) : value
            if (nextValue !== prev) {
                setPagination((prevPagination) => ({ ...prevPagination, pageIndex: 0 }))
            }
            return nextValue
        })
    }

    const handleDelete = (ids, selectedDeleteType) => {
        let confirmed = false
        if (selectedDeleteType === 'PD') {
            confirmed = confirm('Are you sure you want to delete the data permanently?')
        } else {
            confirmed = confirm('Are you sure you want to move data into trash?')
        }

        if (confirmed) {
            deleteMutation.mutate({ ids, deleteType: selectedDeleteType })
            setRowSelection({})
        }
    }

    const handleExport = async (selectedRows) => {
        setExportLoading(true)
        try {
            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'csv-data',
            })

            let csv

            if (hasSelection) {
                const rowData = selectedRows.map((row) => row.original)
                csv = generateCsv(csvConfig)(rowData)
            } else {
                const { data: response } = await axios.get(exportEndpoint)
                if (!response.success) {
                    throw new Error(response.message)
                }

                csv = generateCsv(csvConfig)(response.data)
            }

            download(csvConfig)(csv)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setExportLoading(false)
        }
    }

    const {
        data: { data = [], meta } = {},
        isError,
        isRefetching,
        isLoading,
    } = useQuery({
        queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
        queryFn: async () => {
            const { data: response } = await axios.get(fetchUrl, {
                params: {
                    start: pagination.pageIndex * pagination.pageSize,
                    size: pagination.pageSize,
                    filters: JSON.stringify(columnFilters ?? []),
                    globalFilter: globalFilter ?? '',
                    sorting: JSON.stringify(sorting ?? []),
                    deleteType,
                },
            })
            return response
        },
        placeholderData: keepPreviousData,
    })

    const mappedColumns = useMemo(() => {
        const selectionColumn = {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        }

        const dataColumns = (columnsConfig || []).map((col) => ({
            accessorKey: col.accessorKey,
            id: col.id || col.accessorKey,
            header: ({ column }) => {
                const title = typeof col.header === 'string' ? col.header : col.accessorKey
                return (
                    <DataTableColumnHeader column={column} title={title} />
                )
            },
            cell: ({ row, getValue }) => {
                if (typeof col.Cell === 'function') {
                    return col.Cell({ renderedCellValue: getValue(), row: { original: row.original } })
                }
                const value = getValue()
                return value ?? '-'
            },
        }))

        const actionsColumn = {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const actionItems = createAction
                    ? createAction({ original: row.original }, deleteType, handleDelete)
                    : []

                return (
                    <div className="flex justify-end">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm" className="cursor-pointer">
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {actionItems}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        }

        return [selectionColumn, ...dataColumns, actionsColumn]
    }, [columnsConfig, createAction, deleteType])

    const table = useReactTable({
        data,
        columns: mappedColumns,
        state: {
            sorting,
            pagination,
            rowSelection,
            globalFilter,
            columnFilters,
            columnVisibility,
        },
        rowCount: meta?.totalRowCount ?? 0,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        enableRowSelection: true,
        getRowId: (originalRow) => originalRow._id,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: handleGlobalFilterChange,
        onColumnFiltersChange: handleColumnFiltersChange,
        getCoreRowModel: getCoreRowModel(),
    })

    const visibleColumnCount = table.getVisibleLeafColumns().length
    const selectedCount = Object.keys(rowSelection).length

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar. The search field and the bulk actions used to share one
                wrapping flex row, so on a laptop the Export button wrapped onto
                its own line and left a ragged gap. They are now two groups that
                collapse independently. */}
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <DataTableToolbar
                    table={table}
                    searchPlaceholder="Search in table..."
                    className="min-w-0 xl:flex-1"
                    filters={typeof toolbarFilters === 'function' ? toolbarFilters(table) : toolbarFilters}
                />

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {deleteType !== 'PD' && trashView && (
                        <Button asChild variant="outline" size="lg">
                            <Link href={trashView}>
                                <Recycle className="size-4" />
                                Recycle Bin
                            </Link>
                        </Button>
                    )}

                    {deleteType === 'SD' && (
                        <Button
                            variant="destructive"
                            size="lg"
                            disabled={!hasSelection}
                            onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
                        >
                            <Trash2 className="size-4" />
                            Delete
                            {hasSelection && <span className="tabular-nums">({selectedCount})</span>}
                        </Button>
                    )}

                    {deleteType === 'PD' && (
                        <>
                            <Button
                                variant="outline"
                                size="lg"
                                disabled={!hasSelection}
                                onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')}
                            >
                                <RotateCcw className="size-4" />
                                Restore
                            </Button>
                            <Button
                                variant="destructive"
                                size="lg"
                                disabled={!hasSelection}
                                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
                            >
                                <Trash className="size-4" />
                                Delete Forever
                            </Button>
                        </>
                    )}

                    <ButtonLoading
                        type="button"
                        variant="outline"
                        text={
                            <>
                                <Download className="size-4" /> Export
                            </>
                        }
                        loading={exportLoading}
                        onClick={() => handleExport(table.getSelectedRowModel().rows)}
                        className="cursor-pointer"
                        size="lg"
                    />
                </div>
            </div>

            {/* Selection summary: there was previously no confirmation of how
                many rows a bulk action was about to hit. */}
            {hasSelection && (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                    <span className="font-medium tabular-nums">{selectedCount} selected</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => setRowSelection({})}
                    >
                        Clear selection
                    </Button>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="admin-scroll overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-border bg-muted/50 hover:bg-muted/50"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-11 px-3 text-xs font-semibold text-muted-foreground"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRowsSkeleton
                                    rows={Math.min(pagination.pageSize, 10)}
                                    columns={visibleColumnCount}
                                />
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        // Cells used to carry bg-background each,
                                        // which fought the card surface behind them
                                        // and drew a seam down every row.
                                        className="border-border/60 data-[state=selected]:bg-primary/5"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-3 py-2.5">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={visibleColumnCount} className="p-0">
                                        {isError ? (
                                            <EmptyState
                                                icon={AlertCircle}
                                                title="Couldn&apos;t load this table"
                                                description="Something went wrong fetching these records. Try reloading the page."
                                            />
                                        ) : (
                                            <EmptyState
                                                icon={SearchX}
                                                title={
                                                    globalFilter ? 'No matching records' : 'Nothing here yet'
                                                }
                                                description={
                                                    globalFilter
                                                        ? `No rows match "${globalFilter}".`
                                                        : 'Records you create will be listed here.'
                                                }
                                                action={
                                                    globalFilter ? (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => table.setGlobalFilter('')}
                                                        >
                                                            Clear search
                                                        </Button>
                                                    ) : null
                                                }
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-3 border-t border-border px-3 py-3">
                    <div className="text-xs text-muted-foreground" aria-live="polite">
                        {isRefetching
                            ? 'Refreshing...'
                            : `${meta?.totalRowCount ?? 0} total ${
                                  (meta?.totalRowCount ?? 0) === 1 ? 'row' : 'rows'
                              }`}
                    </div>
                    <DataTablePagination table={table} />
                </div>
            </div>
        </div>
    )
}

export default Datatable
