"use client"

import * as React from "react"
import Link from "next/link"
import { Search as SearchIcon, ShoppingCart, ArrowUpRight } from "lucide-react"
import { useSelector } from "react-redux"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Cart from "@/components/Application/Website/Cart"
import GlobalSearch from "@/components/Application/Website/GlobalSearch"

const defaultMenu = [
  { title: "Home", url: "/" },
  { title: "Shop", url: "/shop" },
  { title: "About", url: "/about-us" },
  { title: "Contact", url: "/contact" },
]

// Stacked lockup: the trading name is long, so the first word carries the
// display weight and the rest sits under it as a tracked caption. Keeps the
// mark to ~150px wide at nav size instead of overflowing the bar on mobile.
// The caption size is fixed rather than em-relative: this lockup renders at
// 1.25rem in the bar and 1.7rem in the menu sheet, and an em-scaled caption
// falls below legible size at the smaller of the two.
const Wordmark = ({ title, subtitle, className = "" }) => (
  <span className={`inline-flex flex-col leading-none ${className}`}>
    <span className="font-wordmark inline-flex items-start">
      {title}
      <sup className="ml-[0.12em] mt-[0.15em] text-[0.42em] font-normal leading-none opacity-70">°</sup>
    </span>
    {subtitle && (
      <span className="mt-[0.35em] text-[0.58rem] font-medium uppercase tracking-[0.2em] opacity-60">
        {subtitle}
      </span>
    )}
  </span>
)

export default function Navbar({
  logo = {
    url: "/",
    alt: "Horticultural Development Centre logo",
    title: "Horticultural",
    subtitle: "Development Centre",
  },
  menu = defaultMenu,
}) {
  const [openSearch, setOpenSearch] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState(false)
  const [openCart, setOpenCart] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const rawCount = useSelector((store) => store.cartStore?.count ?? 0)
  const cartCount = mounted ? rawCount : 0

  React.useEffect(() => setMounted(true), [])

  // Transparent at the top of the page; picks up a faint blurred surface once
  // the user scrolls, so links stay readable over the sections below the hero.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Cmd/Ctrl+K opens the global search palette.
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

  // Radix scroll-lock/focus can race if two dialogs toggle in the same tick,
  // so let the menu finish closing before opening the cart/search overlay.
  const openFromMenu = (open) => {
    setOpenMenu(false)
    setTimeout(open, 80)
  }

  return (
    <div
      className={cn(
        "w-full transition-colors duration-300",
        scrolled
          ? "border-b border-black/[0.06] bg-[var(--background)]/85 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--background)]/70"
          : "border-b border-transparent"
      )}
    >
      <nav
        className="website-gutter flex w-full items-center py-1.5 sm:py-2"
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <Link
          href={logo.url}
          className="shrink-0 text-lg text-[var(--brand-primary)] transition-opacity hover:opacity-70 sm:text-xl"
          aria-label={logo.alt}
        >
          <Wordmark title={logo.title} subtitle={logo.subtitle} />
        </Link>

        {/* ── Equally-distributed plus-separated links (desktop) ── */}
        <div className="hidden flex-1 items-center justify-between px-8 lg:flex xl:px-14">
          {menu.map((item, index) => (
            <React.Fragment key={item.title}>
              <Link
                href={item.url}
                className="text-[0.85rem] font-normal tracking-[0.01em] text-[var(--brand-primary)] transition-opacity hover:opacity-55"
              >
                {item.title}
              </Link>
              {index < menu.length - 1 && (
                <span aria-hidden="true" className="select-none text-[0.85rem] font-light text-[var(--muted-foreground)]/40">
                  +
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Hamburger — two-line mark (opens the full menu, incl. search + cart) ── */}
        <button
          type="button"
          onClick={() => setOpenMenu(true)}
          aria-label="Open menu"
          className="relative ml-auto flex size-10 shrink-0 items-center justify-center rounded-full text-[var(--brand-primary)] transition-colors hover:bg-black/[0.05] lg:ml-0"
        >
          <span aria-hidden className="flex flex-col items-center gap-[6px]">
            <span className="block h-[2px] w-[26px] rounded-full bg-current" />
            <span className="block h-[2px] w-[26px] rounded-full bg-current" />
          </span>
          {cartCount > 0 && (
            <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-[var(--brand-primary)] ring-2 ring-[var(--background)]" />
          )}
        </button>
      </nav>

      {/* ── Slide-out menu panel ── */}
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetContent
          side="right"
          className="flex w-[88%] max-w-md flex-col gap-0 border-l border-black/[0.06] bg-[var(--background)] p-0"
        >
          <SheetHeader className="flex-shrink-0 border-b border-black/[0.06] px-6 py-6">
            <SheetTitle className="text-[1.7rem] text-[var(--brand-primary)]">
              <Wordmark title={logo.title} subtitle={logo.subtitle} />
            </SheetTitle>
          </SheetHeader>

          {/* Search + Cart — relocated here per the reference's single-menu model */}
          <div className="grid flex-shrink-0 grid-cols-2 gap-2.5 border-b border-black/[0.06] px-4 py-4">
            <button
              type="button"
              onClick={() => openFromMenu(() => setOpenSearch(true))}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white px-4 py-3 text-[0.9rem] font-medium text-[var(--brand-primary)] transition-colors hover:bg-[var(--secondary)]"
            >
              <SearchIcon className="size-[1.05rem]" strokeWidth={1.75} />
              Search
            </button>
            <button
              type="button"
              onClick={() => openFromMenu(() => setOpenCart(true))}
              className="relative flex items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[var(--brand-primary)] px-4 py-3 text-[0.9rem] font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              <ShoppingCart className="size-[1.05rem]" strokeWidth={1.75} />
              Cart
              {cartCount > 0 && (
                <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-lime)] px-1 text-[10px] font-semibold tabular-nums text-[var(--brand-lime-ink)]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Primary navigation */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4" aria-label="Menu">
            {menu.map((item) => (
              <SheetClose asChild key={item.title}>
                <Link
                  href={item.url}
                  className="group flex items-center justify-between rounded-[var(--radius-2xl)] px-4 py-3.5 text-[1.6rem] font-medium tracking-[-0.02em] text-[var(--brand-primary)] transition-colors hover:bg-[var(--secondary)]"
                >
                  {item.title}
                  <ArrowUpRight className="size-5 -translate-x-1 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Cart drawer + search palette live outside the menu to avoid nesting
          two Radix dialogs; both are driven by the panel buttons above. */}
      <Cart open={openCart} onOpenChange={setOpenCart} hideTrigger />
      <GlobalSearch open={openSearch} setOpen={setOpenSearch} isLoggedIn={false} />
    </div>
  )
}
