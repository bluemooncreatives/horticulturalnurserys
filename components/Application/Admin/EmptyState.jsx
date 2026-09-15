import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

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
                compact ? 'py-6 px-4' : 'py-12 px-6',
                className
            )}
        >
            <div className="flex size-12 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-muted-foreground shadow-xs">
                <Icon className="size-6 stroke-[1.75]" aria-hidden />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
                {description ? (
                    <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">{description}</p>
                ) : null}
            </div>
            {action ? <div className="mt-1">{action}</div> : null}
        </div>
    )
}

export default EmptyState
