import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Flat 15px rather than the .cta-text step-up: this is the compact form/cart
// button (h-10), not a marketing pill, so it has no room for the 17px desktop
// size those 44-56px pills take.
const BASE = 'h-10 w-full rounded-[var(--radius-sm)] text-[0.9375rem] font-medium tracking-[-0.01em]'

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
