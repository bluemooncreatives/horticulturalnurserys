import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

/**
 * Empty state for admin panels and table bodies.
 *
 * The dashboard widgets used to drop a bare 404 illustration into the middle
 * of a card with no caption, which read as a broken image rather than "there
 * is nothing here yet". This gives the state an icon, a title and an optional
 * next action.
 */
const EmptyState = ({
    icon: Icon = Inbox,
    title = 'Nothing here yet',
    description,
    action,
    className,
    compact = false,
}) => {
    return (
        <div
            className={cn(
                'flex w-full flex-col items-center justify-center gap-3 text-center',
                compact ? 'py-8' : 'py-14',
                className
            )}
        >
            <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-5" aria-hidden />
            </span>
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                {description ? (
                    <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {action}
        </div>
    )
}

export default EmptyState
