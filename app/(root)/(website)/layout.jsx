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

    return (
        <div className='font-neue overflow-x-hidden'>
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
