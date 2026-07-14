"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search as SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Cart from "@/components/Application/Website/Cart"
import GlobalSearch from "@/components/Application/Website/GlobalSearch"

const defaultMenu = [
  { title: "Shop", url: "/shop" },
  { title: "About Us", url: "/about-us" },
  { title: "Contact", url: "/contact" },
]

export default function Navbar({
  logo = {
    url: "/",
    alt: "MomStitched logo",
    title: "MomStitched",
  },
  menu = defaultMenu,
}) {
  const [openSearch, setOpenSearch] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpenSearch((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <section className="py-4">
      <div className="w-full px-4 lg:px-10">
        <nav className="hidden grid-cols-[1fr_auto_1fr] items-center lg:grid" aria-label="Main navigation">
          <div className="flex items-center gap-8">
            {menu.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="text-base font-semibold text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-primary-hover)]"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <Link
            href={logo.url}
            className="font-header text-3xl leading-none tracking-wide text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-primary-hover)]"
            aria-label={logo.alt}
          >
            {logo.title}
          </Link>

          <div className="flex items-center justify-end gap-3 lg:gap-5">
            <button
              type="button"
              onClick={() => setOpenSearch(true)}
              className="text-stone-600 transition-colors hover:text-[var(--brand-primary-hover)]"
              aria-label="Open search"
              title="Search (Ctrl K)"
            >
              <SearchIcon className="h-6 w-6" strokeWidth={1.75} />
            </button>

            <div>
              <Cart />
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-between lg:hidden" role="navigation" aria-label="Mobile navigation">
          <Link
            href={logo.url}
            className="font-header text-2xl leading-none tracking-wide text-[var(--brand-primary)]"
            aria-label={logo.alt}
          >
            {logo.title}
          </Link>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenSearch(true)}
              className="size-8 text-stone-700 hover:text-[var(--brand-primary-hover)]"
              aria-label="Open search"
            >
              <SearchIcon className="size-4" strokeWidth={1.75} />
            </Button>

            <div>
              <Cart />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-stone-700 hover:text-[var(--brand-primary-hover)]"
                  aria-label="Open menu"
                >
                  <Menu className="size-4" strokeWidth={1.75} />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-[85%] max-w-sm gap-0 border-l border-black/[0.08] bg-background p-0 sm:max-w-sm">
                <SheetHeader className="flex-shrink-0 border-b border-black/[0.08] px-5 py-5">
                  <SheetTitle className="font-header text-2xl leading-none tracking-wide text-[var(--brand-primary)]">
                    {logo.title}
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3" aria-label="Mobile menu">
                  {menu.map((item) => (
                    <SheetClose asChild key={item.title}>
                      <Link
                        href={item.url}
                        className="rounded-md px-3 py-3.5 font-neue text-base font-semibold text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-cream)]/50 hover:text-[var(--brand-primary-hover)] active:bg-[var(--brand-cream)]/70"
                      >
                        {item.title}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <GlobalSearch open={openSearch} setOpen={setOpenSearch} isLoggedIn={false} />
    </section>
  )
}
