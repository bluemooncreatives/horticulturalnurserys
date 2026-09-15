import { cn } from '@/lib/utils'

const Main = ({ fixed = false, fluid = false, className, ...props }) => {
    return (
        <main
            data-layout={fixed ? 'fixed' : 'auto'}
            className={cn(
                // 24px side padding on a 360px phone leaves very little room for
                // tables and stat tiles; step the gutter up with the viewport.
                'px-4 pt-5 pb-10 sm:px-6 sm:pt-6',
                fixed && 'flex grow flex-col overflow-hidden',
                !fluid && '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl',
                className
            )}
            {...props}
        />
    )
}

export default Main
