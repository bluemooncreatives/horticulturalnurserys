import Footer from '@/components/Application/Website/Footer'
import Header from '@/components/Application/Website/Header'
import LoaderProvider from '@/components/Application/Website/LoaderProvider'
import { getFooterCategories } from '@/lib/services/categoryService'

const Layout = async ({ children }) => {
    const footerCategories = await getFooterCategories()

    return (
        <div className='font-neue overflow-x-hidden'>
            <LoaderProvider>
                <Header />
                <main id="main-content" className='relative min-h-screen bg-background'>
                    {children}
                </main>
                <Footer categoryLinks={footerCategories} />
            </LoaderProvider>
        </div>
    )
}

export default Layout
