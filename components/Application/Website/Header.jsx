'use client'

import Navbar from '@/components/ui/navbar'
import {
  WEBSITE_HOME,
  WEBSITE_SHOP,
  WEBSITE_SHOP_PLANTS,
  WEBSITE_SHOP_POTS,
  WEBSITE_SERVICES,
  WEBSITE_SERVICES_LANDSCAPE,
  WEBSITE_SERVICES_MAINTENANCE,
  WEBSITE_SERVICES_ROOF_GARDEN,
  WEBSITE_SERVICES_VERTICAL_GARDEN,
} from '@/routes/WebsiteRoute'

// Static fallback so the Shop dropdown still renders something if the Parent
// lookup ever comes back empty (DB hiccup, no parents seeded yet).
const FALLBACK_SHOP_CHILDREN = [
  { title: 'Plants', url: WEBSITE_SHOP_PLANTS },
  { title: 'Pots',   url: WEBSITE_SHOP_POTS },
]

const pluralize = (count) => `${count} product${count === 1 ? '' : 's'}`

// Every live Parent (Plants, Pots & Planters, Manure & Fertilizers, Seeds &
// Seedlings, ...) becomes a Shop dropdown entry, routed to /shop?parent=<slug>
// - the same query param `getShopProducts` already filters on end-to-end.
const buildShopChildren = (shopParents) => {
  if (!shopParents?.length) return FALLBACK_SHOP_CHILDREN
  return shopParents.map((parent) => ({
    title: parent.name,
    url: parent.href,
    slug: parent.slug,
    desc: parent.productCount > 0 ? pluralize(parent.productCount) : undefined,
  }))
}

const cta = { title: 'Contact', url: '/contact' }

const Header = ({ shopParents = [] }) => {
  // Centred links only - Contact renders as the right-hand button (and rejoins
  // this list inside the mobile menu sheet).
  // Items with a `children` array render as hover dropdowns on desktop and
  // as collapsible accordions on mobile.
  const menu = [
    { title: 'Home', url: WEBSITE_HOME },
    {
      title: 'Shop',
      url: WEBSITE_SHOP,
      children: buildShopChildren(shopParents),
    },
    {
      title: 'Services',
      url: WEBSITE_SERVICES,
      children: [
        { title: 'Landscape Development',   url: WEBSITE_SERVICES_LANDSCAPE },
        { title: 'Garden Maintenance',      url: WEBSITE_SERVICES_MAINTENANCE },
        { title: 'Roof Garden Design',      url: WEBSITE_SERVICES_ROOF_GARDEN },
        { title: 'Vertical Garden Systems', url: WEBSITE_SERVICES_VERTICAL_GARDEN },
      ],
    },
    { title: 'About', url: '/about-us' },
  ]

  return (
    // Full-width transparent bar that sits directly on the hero (Lumóra style).
    // Navbar owns its own scrolled background so it stays legible over lower
    // sections; this wrapper only handles fixed positioning.
    <header className="fixed inset-x-0 top-0 z-50">
      <Navbar
        logo={{
          url: WEBSITE_HOME,
          title: 'Horticultural',
          subtitle: 'Development Centre',
          alt: 'Horticultural Development Centre - landscaping and plant nursery, Kolkata',
        }}
        menu={menu}
        cta={cta}
      />
    </header>
  )
}

export default Header
