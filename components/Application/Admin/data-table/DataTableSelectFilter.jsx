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
    // Shown in the trigger once a value is picked ("Parent: Orchids"), so the
    // chip states which column it filters instead of sitting in the toolbar as
    // an unexplained value.
    label,
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
            setSelected={(value) => column.setFilterValue(value || undefined)}
            isMulti={false}
            placeholder={placeholder}
            prefix={label}
            // A fixed width with no max-width let a long option name push the
            // trigger's chevron outside the button and over the Reset control.
            className={cn('h-9 w-full max-w-full sm:w-[230px]', className)}
        />
    )
}

export default DataTableSelectFilter
