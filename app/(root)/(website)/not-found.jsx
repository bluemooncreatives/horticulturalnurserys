import Link from 'next/link'
import {
    WEBSITE_HOME,
    WEBSITE_SHOP_PLANTS,
    WEBSITE_SHOP_POTS,
    WEBSITE_SERVICES,
    WEBSITE_ENQUIRY,
} from '@/routes/WebsiteRoute'

export const metadata = {
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or may have been moved.",
    robots: { index: false, follow: true },
}

const quickLinks = [
    { title: 'Shop Plants', url: WEBSITE_SHOP_PLANTS },
    { title: 'Shop Pots', url: WEBSITE_SHOP_POTS },
    { title: 'Our Services', url: WEBSITE_SERVICES },
    { title: 'Send an Enquiry', url: WEBSITE_ENQUIRY },
]

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
            <p
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center font-header select-none leading-none text-[var(--dark-red)]"
                style={{ fontSize: 'clamp(10rem,28vw,22rem)', opacity: 0.06 }}
            >
                404
            </p>

            <div className="relative z-10 flex flex-col items-center gap-4">
                <h1 className="font-neue text-3xl font-semibold tracking-tight text-[var(--dark-red-2)]">
                    Page not found
                </h1>
                <p className="mx-auto max-w-md text-base leading-relaxed text-[var(--dark-red)]/60">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                    Let&apos;s get you back to something beautiful.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href={WEBSITE_HOME}
                        className="border border-[var(--dark-red)] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[var(--dark-red)] transition-colors hover:bg-[var(--dark-red)] hover:text-white"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href={WEBSITE_SHOP_PLANTS}
                        className="bg-[var(--dark-red)] px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-[var(--dark-red-2)]"
                    >
                        Shop Now
                    </Link>
                </div>

                <nav aria-label="Popular pages" className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.url}
                            href={link.url}
                            className="text-sm font-medium tracking-wide text-[var(--dark-red-2)] underline underline-offset-4 transition-colors hover:text-[var(--dark-red)]"
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}
