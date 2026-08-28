export const WEBSITE_HOME = "/"
// Kept as aliases so any lingering "login/register" link lands on the sole
// authenticated surface - the admin panel. There is no customer auth.
export const WEBSITE_LOGIN = "/admin/login"
export const WEBSITE_REGISTER = "/admin/login"

export const WEBSITE_SHOP = "/shop"
// Shop sub-category pages
export const WEBSITE_SHOP_PLANTS = "/shop/plants"
export const WEBSITE_SHOP_POTS   = "/shop/pots"

export const WEBSITE_PRODUCT_DETAILS = (slug) => slug ? `/product/${slug}` : '/product'

// The "cart" is an enquiry list in this catalogue-only site: customers collect
// products and submit an enquiry rather than buying. WEBSITE_CART is the list
// page; WEBSITE_ENQUIRY is the submit form (what used to be checkout).
export const WEBSITE_CART = "/cart"
export const WEBSITE_ENQUIRY = "/enquiry"

// ── Services pages ──────────────────────────────────────────────────────────
export const WEBSITE_SERVICES                = "/services"
export const WEBSITE_SERVICES_LANDSCAPE      = "/services/landscape-development"
export const WEBSITE_SERVICES_MAINTENANCE    = "/services/garden-maintenance"
export const WEBSITE_SERVICES_ROOF_GARDEN    = "/services/roof-garden"
export const WEBSITE_SERVICES_VERTICAL_GARDEN = "/services/vertical-garden"
