import Footer from '@/components/Application/Website/Footer'
import Header from '@/components/Application/Website/Header'
import LoaderProvider from '@/components/Application/Website/LoaderProvider'
import { getFooterCategories } from '@/lib/services/categoryService'
import { getHomeParents } from '@/lib/services/parentService'

const Layout = async ({ children }) => {
    const [footerCategories, shopParents] = await Promise.all([
        getFooterCategories(),
        // Same cached Parent lookup the homepage archive uses - the Shop nav
        // dropdown shows every live parent instead of two hardcoded entries.
        getHomeParents(),
    ])

    // `overflow-x-clip`, never `-hidden`: overflow-x:hidden forces overflow-y to
    // compute to `auto`, which turns this wrapper into a scroll container. Every
    // `position: sticky` descendant then resolves against THIS box instead of
    // the viewport - and since it is content-sized and never scrolls, sticky
    // silently does nothing site-wide (it broke the product page's pinned
    // gallery). `clip` contains the same horizontal overflow without creating a
    // scrollport, which is why html/body in design-system.css use it too.
    return (
        <div className='font-neue overflow-x-clip'>
            <LoaderProvider>
                <Header shopParents={shopParents} />
                <main id="main-content" className='relative min-h-screen bg-background'>
                    {children}
                </main>
                <Footer categoryLinks={footerCategories} />
            </LoaderProvider>
        </div>
    )
}

export default Layout
