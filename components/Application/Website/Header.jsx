'use client'

import Navbar from '@/components/ui/navbar'
import { WEBSITE_HOME, WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const menu = [
  { title: 'Home', url: WEBSITE_HOME },
  { title: 'Shop', url: WEBSITE_SHOP },
  { title: 'About', url: '/about-us' },
  { title: 'Contact', url: '/contact' },
]

const Header = () => {
  return (
    // Full-width transparent bar that sits directly on the hero (Lumóra style).
    // Navbar owns its own scrolled background so it stays legible over lower
    // sections; this wrapper only handles fixed positioning.
    <header className="fixed inset-x-0 top-0 z-50">
      <Navbar
        logo={{
          url: WEBSITE_HOME,
          title: 'MomStitched',
          alt: 'MomStitched — handcrafted women\'s ethnic wear',
        }}
        menu={menu}
      />
    </header>
  )
}

export default Header
