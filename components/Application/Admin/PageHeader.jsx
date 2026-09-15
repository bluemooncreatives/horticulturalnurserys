import { cn } from '@/lib/utils'

/**
 * Standard heading block for every admin page.
 *
 * `items-end` used to bottom-align the actions against a two-line title,
 * which pushed the buttons well below the heading whenever a description
 * wrapped. Actions now align to the top of the block and wrap underneath on
 * narrow screens instead of squeezing the title.
 */
const PageHeader = ({ title, description, actions, breadcrumb, className }) => {
    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {breadcrumb}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
                        {title}
                    </h1>
                    {description ? (
                        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
                ) : null}
            </div>
        </div>
    )
}

export default PageHeader
