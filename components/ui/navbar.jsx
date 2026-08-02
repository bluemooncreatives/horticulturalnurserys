"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Search as SearchIcon, ShoppingCart, ArrowUpRight } from "lucide-react"
import { useSelector } from "react-redux"
import logoMark from "@/public/assets/images/logo-horti.png"

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
import RollingLink from "@/components/ui/RollingLink"
import CircleReveal from "@/components/ui/CircleReveal"

// `menu` holds only the centred links; the CTA is passed separately because it
// renders as a button on the right of the bar. The slide-out sheet re-joins the
// two so mobile still sees one complete list.
const defaultMenu = [
  { title: "Home", url: "/" },
  { title: "Shop", url: "/shop" },
  { title: "About", url: "/about-us" },
]

const defaultCta = { title: "Contact Us", url: "/contact" }

// Stacked lockup: the trading name is long, so the first word carries the
// display weight and the rest sits under it as a tracked caption. Keeps the
// mark to ~150px wide at nav size instead of overflowing the bar on mobile.
// The caption size is fixed rather than em-relative: this lockup renders at
// 1.25rem in the bar and 1.7rem in the menu sheet, and an em-scaled caption
// falls below legible size at the smaller of the two.
// `flex w-fit` rather than `inline-flex`: as an inline-level box the lockup sat
// in the link's line box, which added ~6px of half-leading above it and none
// below, so the mark read as bottom-heavy however the nav padding was set.
// Block-level removes the strut; `w-fit` keeps it hugging its own width.
const Wordmark = ({ title, subtitle, className = "" }) => (
  <span className={`flex w-fit flex-col leading-none ${className}`}>
    <span className="font-wordmark inline-flex items-start">
      {title}
    </span>
    {subtitle && (
      <span className="mt-[0.25em] text-[0.58rem] font-medium uppercase opacity-60">
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
  cta = defaultCta,
}) {
  const [openSearch, setOpenSearch] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState(false)
  const [openCart, setOpenCart] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const rawCount = useSelector((store) => store.cartStore?.count ?? 0)
  const cartCount = mounted ? rawCount : 0

  const sheetMenu = React.useMemo(
    () => (cta ? [...menu, cta] : menu),
    [menu, cta]
  )

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
        className="website-gutter relative flex w-full items-center py-1.5 sm:py-2"
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <Link
          href={logo.url}
          className="flex shrink-0 items-center gap-2 text-lg text-[var(--brand-primary)] transition-opacity hover:opacity-70 sm:text-xl"
          aria-label={logo.alt}
        >
          <Image
            src={logoMark}
            alt=""
            className="size-7 shrink-0 rounded-full sm:size-8"
            priority
          />
          <Wordmark title={logo.title} subtitle={logo.subtitle} />
        </Link>

        {/* ── Plus-separated links, optically centred in the bar (desktop) ──
            Absolutely positioned rather than flex-centred: the logo lockup and
            the right-hand cluster are different widths, so a flex-centred group
            would sit off-centre relative to the viewport. The wrapper ignores
            pointer events so it never covers the logo or the buttons. */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
          <div className="pointer-events-auto flex items-center gap-7 xl:gap-10">
            {menu.map((item, index) => (
              <React.Fragment key={item.title}>
                <RollingLink
                  href={item.url}
                  className="text-[0.95rem] font-semibold tracking-[0.01em] text-[var(--brand-primary)]"
                >
                  {item.title}
                </RollingLink>
                {index < menu.length - 1 && (
                  <span aria-hidden="true" className="select-none text-[0.85rem] font-light text-[var(--muted-foreground)]/40">
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Right cluster ── */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* Search + cart move out of the hamburger on desktop, since the
              hamburger itself is mobile-only there. */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            aria-label="Search"
            className="hidden size-10 items-center justify-center rounded-full text-[var(--brand-primary)] transition-colors hover:bg-black/[0.05] lg:flex"
          >
            <SearchIcon className="size-[1.15rem]" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={() => setOpenCart(true)}
            aria-label={cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}` : 'Cart'}
            className="relative hidden size-10 items-center justify-center rounded-full text-[var(--brand-primary)] transition-colors hover:bg-black/[0.05] lg:flex"
          >
            <ShoppingCart className="size-[1.15rem]" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-semibold tabular-nums text-white ring-2 ring-[var(--background)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* CTA — takes the slot the hamburger used to occupy on desktop.
              Wrapper owns the desktop-only visibility so it doesn't collide
              with RollingLink's own inline-flex display. */}
          {cta && (
            <span className="ml-1 hidden lg:inline-flex">
              <RollingLink
                href={cta.url}
                underline={false}
                background={<CircleReveal color="var(--brand-lime)" />}
                className="h-8 items-center justify-center overflow-hidden rounded-full bg-[var(--brand-primary)] px-6 text-[0.85rem] font-medium tracking-[0.01em] text-white transition-colors duration-500 hover:text-[var(--brand-primary)]"
              >
                {cta.title}
              </RollingLink>
            </span>
          )}

          {/* ── Hamburger — two-line mark, mobile only (menu incl. search + cart) ── */}
          <button
            type="button"
            onClick={() => setOpenMenu(true)}
            aria-label="Open menu"
            className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-[var(--brand-primary)] transition-colors hover:bg-black/[0.05] lg:hidden"
          >
            <span aria-hidden className="flex flex-col items-center gap-[6px]">
              <span className="block h-[2px] w-[26px] rounded-full bg-current" />
              <span className="block h-[2px] w-[26px] rounded-full bg-current" />
            </span>
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-[var(--brand-primary)] ring-2 ring-[var(--background)]" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Slide-out menu panel ── */}
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetContent
          side="right"
          className="flex w-[88%] max-w-md flex-col gap-0 border-l border-black/[0.06] bg-[var(--background)] p-0"
        >
          <SheetHeader className="flex-shrink-0 border-b border-black/[0.06] px-6 py-6">
            <SheetTitle className="flex items-center gap-2.5 text-[1.7rem] text-[var(--brand-primary)]">
              <Image
                src={logoMark}
                alt=""
                className="size-9 shrink-0 rounded-full"
              />
              <Wordmark title={logo.title} subtitle={logo.subtitle} />
            </SheetTitle>
          </SheetHeader>

          {/* Search — full-width bar (not a squeezed half-column button) so it
              reads like an actual search field, matching the tap-target width
              every other row in this sheet uses. */}
          <div className="flex-shrink-0 border-b border-black/[0.06] px-4 py-4">
            <button
              type="button"
              onClick={() => openFromMenu(() => setOpenSearch(true))}
              className="flex w-full items-center gap-3 rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white px-4 py-3 text-left text-[0.95rem] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand-primary)]/30 hover:bg-[var(--secondary)]"
            >
              <SearchIcon className="size-[1.1rem] shrink-0 text-[var(--brand-primary)]" strokeWidth={1.75} />
              <span className="flex-1 truncate">Search products…</span>
            </button>
          </div>

          {/* Primary navigation — the CTA rejoins the list here, since the
              hamburger is the only entry point at this breakpoint. Sized to a
              standard mobile menu scale (not the desktop display type) so four
              items fit without excess whitespace between rows. */}
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2" aria-label="Menu">
            {sheetMenu.map((item) => (
              <SheetClose asChild key={item.title}>
                <Link
                  href={item.url}
                  className="group flex items-center justify-between rounded-[var(--radius-2xl)] px-4 py-3 text-[1.05rem] font-medium tracking-[-0.01em] text-[var(--brand-primary)] transition-colors hover:bg-[var(--secondary)]"
                >
                  {item.title}
                  <ArrowUpRight className="size-4 -translate-x-1 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* Cart — pinned full-width at the bottom of the sheet, the one
              action worth a persistent, always-in-reach placement here. */}
          <div className="flex-shrink-0 border-t border-black/[0.06] bg-[var(--background)] p-4">
            <button
              type="button"
              onClick={() => openFromMenu(() => setOpenCart(true))}
              className="relative flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[var(--brand-primary)] px-4 py-3.5 text-[1rem] font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
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
        </SheetContent>
      </Sheet>

      {/* Cart drawer + search palette live outside the menu to avoid nesting
          two Radix dialogs; both are driven by the panel buttons above. */}
      <Cart open={openCart} onOpenChange={setOpenCart} hideTrigger />
      <GlobalSearch open={openSearch} setOpen={setOpenSearch} isLoggedIn={false} />
    </div>
  )
}
