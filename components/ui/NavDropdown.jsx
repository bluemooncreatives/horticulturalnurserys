"use client"

import * as React from "react"
import { useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Leaf,
  Package,
  Mountain,
  Scissors,
  Building2,
  Layers,
} from "lucide-react"
import gsap from "gsap"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import RollingLink, { RollingText } from "@/components/ui/RollingLink"

/* ────────────────────────────────────────────────────────────────
   NavMenuBar - desktop centre-nav.
   • All 4 items (Home, Shop, Services, About) share the EXACT
     same GSAP character roll animation + underline wipe.
   • Clicking Shop navigates to /shop.
   • Clicking Services navigates to /services.
   • Hovering Shop or Services opens a sleek, minimal dropdown panel:
     - Global design token: var(--brand-ink-soft) deep-forest fill
     - Clean outline icons + single-line names (never wraps)
     - GSAP staggered entrance on open
     - NO background box behind the trigger on hover/open
   ──────────────────────────────────────────────────────────────── */

const ICON_MAP = {
  "/shop/plants":                    Leaf,
  "/shop/pots":                      Package,
  "/services/landscape-development": Mountain,
  "/services/garden-maintenance":    Scissors,
  "/services/roof-garden":           Building2,
  "/services/vertical-garden":       Layers,
}

// Single dropdown item - clean outline icon + non-wrapping title
function DropdownItem({ item }) {
  const Icon = ICON_MAP[item.url]
  return (
    <Link
      href={item.url}
      className={[
        "group/item flex items-center gap-3 rounded-lg px-3.5 py-2.5",
        "text-[0.875rem] font-medium text-white/75 tracking-[-0.01em]",
        "transition-all duration-150 ease-out",
        "hover:bg-white/[0.08] hover:text-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-lime)]",
      ].join(" ")}
    >
      {Icon && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <Icon
            className="size-[1.05rem] text-white/40 transition-colors duration-150 group-hover/item:text-white/90"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
      )}
      <span className="whitespace-nowrap font-normal">{item.title}</span>
    </Link>
  )
}

// Dropdown menu content with GSAP staggered entrance on mount
function AnimatedDropdownList({ children }) {
  const listRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const links = list.querySelectorAll("a")
    gsap.fromTo(
      links,
      { opacity: 0, x: -6 },
      { opacity: 1, x: 0, stagger: 0.035, duration: 0.22, ease: "power2.out" }
    )
  }, [])

  return (
    <div ref={listRef} className="flex flex-col gap-0.5 p-1.5">
      {children}
    </div>
  )
}

// Menu item with hover dropdown, direct click-through navigation, and identical GSAP RollingText
function NavItemWithDropdown({ item, linkClassName }) {
  const router = useRouter()
  const rollRef = useRef(null)
  const pointerDownPos = useRef({ x: 0, y: 0, time: 0 })

  const navigate = () => {
    if (item.url) {
      router.push(item.url)
    }
  }

  const handlePointerDown = (e) => {
    if (e.button === 0) {
      pointerDownPos.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    }
  }

  const handlePointerUp = (e) => {
    if (e.button === 0 && item.url) {
      const dx = Math.abs(e.clientX - pointerDownPos.current.x)
      const dy = Math.abs(e.clientY - pointerDownPos.current.y)
      const dt = Date.now() - pointerDownPos.current.time
      // Left-click with minimal drag and < 450ms duration -> navigate
      if (dx < 8 && dy < 8 && dt < 450) {
        navigate()
      }
    }
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={[
          // Force zero background, zero padding, zero box shadow
          "!bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent",
          "data-[state=open]:!bg-transparent data-open:!bg-transparent data-popup-open:!bg-transparent",
          "!p-0 !h-auto !shadow-none !rounded-none cursor-pointer",
          linkClassName,
          "[&_svg]:ml-[0.25em] [&_svg]:size-[0.68rem] [&_svg]:opacity-50 [&_svg]:transition-transform [&_svg]:duration-200",
        ].join(" ")}
        onPointerEnter={() => rollRef.current?.play()}
        onPointerLeave={() => rollRef.current?.reverse()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={navigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            navigate()
          }
        }}
      >
        <RollingText ref={rollRef} underline={true}>
          {item.title}
        </RollingText>
      </NavigationMenuTrigger>

      <NavigationMenuContent
        className={[
          "!absolute !left-1/2 !top-[calc(100%+0.65rem)] !-translate-x-1/2",
          "bg-[var(--brand-ink-soft)]",
          "border border-white/10",
          "rounded-xl shadow-2xl shadow-black/50",
          item.children.length <= 2 ? "w-max min-w-[200px]" : "w-max min-w-[280px]",
        ].join(" ")}
      >
        <AnimatedDropdownList>
          {item.children.map((child) => (
            <DropdownItem key={child.url} item={child} />
          ))}
        </AnimatedDropdownList>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export default function NavMenuBar({ menu = [], linkClassName = "" }) {
  return (
    <NavigationMenu viewport={false} className="static">
      <NavigationMenuList className="gap-7 xl:gap-10">
        {menu.map((item, index) => (
          <React.Fragment key={item.title}>
            {item.children?.length ? (
              <NavItemWithDropdown item={item} linkClassName={linkClassName} />
            ) : (
              <NavigationMenuItem>
                <RollingLink href={item.url} className={linkClassName}>
                  {item.title}
                </RollingLink>
              </NavigationMenuItem>
            )}

            {index < menu.length - 1 && (
              <span
                aria-hidden
                className="select-none text-[0.85rem] font-light text-[var(--muted-foreground)]/40"
              >
                +
              </span>
            )}
          </React.Fragment>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
