'use client'

import Select from '@/components/Application/Select'
import { cn } from '@/lib/utils'

/**
 * Toolbar dropdown that drives a single column's filter value.
 *
 * The datatable runs in `manualFiltering` mode, so nothing is filtered in the
 * browser - the chosen value is handed to the server as
 * `filters=[{ id, value }]` and the API decides how to match it. That means the
 * option `value` should be whatever the API wants to match on (an id, not a
 * display name), so the filter stays exact instead of a fuzzy name regex.
 */
const DataTableSelectFilter = ({
    table,
    columnId,
    options = [],
    placeholder = 'All',
    // Fired after the column filter is updated, for filters that depend on
    // each other (picking a parent clears a now-unrelated category).
    onValueChange,
    className,
}) => {
    const column = table.getColumn(columnId)
    if (!column) return null

    const selected = column.getFilterValue() ?? null

    return (
        <Select
            options={options}
            selected={selected}
            // undefined (not '') drops the entry from columnFilters entirely, so
            // the request omits it and the toolbar's Reset control disappears
            // once nothing is filtered.
            setSelected={(value) => {
                column.setFilterValue(value || undefined)
                onValueChange?.(value || undefined)
            }}
            isMulti={false}
            placeholder={placeholder}
            // Sized to its content: a fixed 190px width clipped longer parent
            // names and pushed the chevron out of the button, over Reset.
            className={cn('h-9 w-full sm:w-auto sm:min-w-[11rem] sm:max-w-[20rem]', className)}
        />
    )
}

export default DataTableSelectFilter
