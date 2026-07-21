import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const BASE = 'h-10 w-full rounded-full text-sm font-medium tracking-[-0.01em]'

export const BrandButton = ({ className, ...props }) => (
    <Button
        variant="brand"
        className={cn(BASE, className)}
        {...props}
    />
)

export const BrandOutlineButton = ({ className, ...props }) => (
    <Button
        variant="brand-outline"
        className={cn(BASE, className)}
        {...props}
    />
)
