"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute"

const SCHEMES = {
    "dark-red": { border: "var(--brand-primary)",       fill: "var(--brand-primary-hover)", hoverText: "var(--brand-white)"   },
    black:      { border: "var(--brand-ink)",           fill: "var(--brand-ink-soft)",      hoverText: "var(--brand-white)"   },
    white:      { border: "var(--brand-white)",         fill: "var(--brand-white)",         hoverText: "var(--brand-primary)" },
}

const ShopAllButton = ({
    label = "More Products",
    href = WEBSITE_SHOP,
    colorScheme = "black",
    radius = "full",
    className,
}) => {
    const router = useRouter()

    const { border, fill, hoverText } = SCHEMES[colorScheme] ?? SCHEMES.black
    const radiusClass = radius === "sm" ? "rounded-sm" : radius === "md" ? "rounded-md" : "rounded-full"

    return (
        <button
            type="button"
            onClick={() => router.push(href)}
            className={cn(
                "group relative inline-flex h-12 w-full min-w-0 cursor-pointer select-none items-center justify-center overflow-hidden border px-6 text-[0.78rem] font-semibold uppercase transition-colors duration-200 sm:w-auto sm:min-w-[220px] sm:px-10",
                radiusClass,
                className
            )}
            style={{ borderColor: border, color: border }}
            onMouseEnter={(e) => { e.currentTarget.style.color = hoverText }}
            onMouseLeave={(e) => { e.currentTarget.style.color = border }}
        >
            <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 transition-transform duration-[450ms] ease-out group-hover:scale-x-100"
                style={{ background: fill }}
            />
            <span className="relative z-10">{label}</span>
        </button>
    )
}

export default ShopAllButton
