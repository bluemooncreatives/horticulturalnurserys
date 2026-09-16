import {
    Leaf,
    Package,
    Mountain,
    Scissors,
    Building2,
    Layers,
    Flower2,
    Sprout,
    FlaskConical,
    SprayCan,
} from "lucide-react"

// Single source of truth for the nav dropdown icons, shared by the desktop
// hover panel (NavDropdown) and the mobile menu sheet (navbar) so the two can
// never drift apart.

// Static routes, keyed by href.
const URL_ICONS = {
    "/services/landscape-development": Mountain,
    "/services/garden-maintenance": Scissors,
    "/services/roof-garden": Building2,
    "/services/vertical-garden": Layers,
    "/shop": Leaf,
    "/shop/plants": Leaf,
    "/shop/pots": Package,
}

// Shop dropdown entries are Parent records from the DB (routed as
// /shop?parent=<slug>), so they are keyed by slug rather than by href.
const PARENT_ICONS = {
    "plants": Leaf,
    "seasonal-flowering-plants": Flower2,
    "carpet-grass-for-lawn": Sprout,
    "seeds-and-seedlings": Sprout,
    "manure-and-fertilizers": FlaskConical,
    "insecticide": SprayCan,
    "pots-and-planters": Package,
    "roof-garden-materials": Building2,
    "growing-media": Layers,
}

const DEFAULT_PARENT_ICON = Leaf

// Returns the icon component for a dropdown item, or undefined when the item
// is not one that carries an icon.
export const getNavIcon = (item) => {
    if (!item) return undefined
    if (URL_ICONS[item.url]) return URL_ICONS[item.url]
    // Any parent-backed entry gets an icon, mapped or not, so a newly seeded
    // parent never renders an empty icon slot.
    if (item.slug) return PARENT_ICONS[item.slug] ?? DEFAULT_PARENT_ICON
    return undefined
}
