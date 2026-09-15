/**
 * Status styling for the admin panel.
 *
 * Previously the enquiry status palette was copy-pasted into the dashboard
 * widget, the enquiry detail page and the contacts detail page, each with
 * slightly different Tailwind shades and no shared dark-mode story. Every
 * chip now resolves to the --status-* tokens declared in admin.css, so light
 * and dark stay in step and a colour change happens in exactly one place.
 */

export const ENQUIRY_STATUSES = ['new', 'contacted', 'quoted', 'closed']

const TOKENS = {
    new: 'new',
    contacted: 'contacted',
    quoted: 'quoted',
    closed: 'closed',
}

const tokenFor = (status) => TOKENS[status] || 'neutral'

/** Soft filled chip - the default badge treatment for a status. */
export const statusChipStyle = (status) => {
    const token = tokenFor(status)
    return {
        backgroundColor: `var(--status-${token}-bg)`,
        color: `var(--status-${token}-fg)`,
    }
}

/** Solid fill - used for progress bars and dots where a chip is too heavy. */
export const statusSolidStyle = (status) => ({
    backgroundColor: `var(--status-${tokenFor(status)}-solid)`,
})

/** Border colour matched to a status, for selected/outlined states. */
export const statusRingStyle = (status) => {
    const token = tokenFor(status)
    return {
        backgroundColor: `var(--status-${token}-bg)`,
        color: `var(--status-${token}-fg)`,
        boxShadow: `inset 0 0 0 1px var(--status-${token}-solid)`,
    }
}

/**
 * Accent ramp for stat tiles and quick actions.
 *
 * These read as *chip* colours, never as body text: the label above a tile
 * stays on --foreground/--muted-foreground. Tinting the label with the accent
 * is what made the dark dashboard unreadable - forest green on near-black.
 */
export const ACCENTS = ['1', '2', '3', '4']

export const accentChipStyle = (n) => ({
    backgroundColor: `var(--admin-accent-${n}-soft)`,
    color: `var(--admin-accent-${n})`,
})

export const accentBarStyle = (n) => ({
    backgroundColor: `var(--admin-accent-${n})`,
})
