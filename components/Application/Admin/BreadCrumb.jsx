import { Fragment } from 'react'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

/**
 * Breadcrumb trail above a page title.
 *
 * Two fixes over the previous version:
 *  - it wrapped each crumb in a <div> inside the <ol>, which is invalid list
 *    markup and broke the flex gap between crumb and separator;
 *  - it carried its own `mb-5`, which stacked on top of the PageHeader gap and
 *    left an uneven gutter under the trail on every page.
 * Links are also real <Link>s now, so crumbs navigate client-side instead of
 * triggering a full document load.
 */
const BreadCrumb = ({ breadcrumbData = [] }) => {
    if (!breadcrumbData.length) return null

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbData.map((data, index) => {
                    const isLast = index === breadcrumbData.length - 1

                    return (
                        <Fragment key={`${data.label}-${index}`}>
                            <BreadcrumbItem>
                                {isLast || !data.href ? (
                                    <BreadcrumbPage className="font-medium">
                                        {data.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={data.href}
                                            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                        >
                                            {data.label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb
