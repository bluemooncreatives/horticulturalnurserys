import CountOverview from './CountOverview'
import QuickAdd from './QuickAdd'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ImagePlus, ArrowRight } from 'lucide-react'
import EnquiryStatusOverview from './EnquiryStatusOverview'
import LatestEnquiries from './LatestEnquiries'
import LatestReview from './LatestReview'
import {
    ADMIN_ENQUIRY_SHOW,
    ADMIN_REVIEW_SHOW,
    ADMIN_PRODUCT_ADD,
    ADMIN_MEDIA_SHOW,
} from '@/routes/AdminPanelRoute'

const ViewAllLink = ({ href, label }) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-me-1.5 text-muted-foreground hover:text-foreground"
        asChild
    >
        <Link href={href}>
            {label}
            <ArrowRight className="size-3.5" />
        </Link>
    </Button>
)

const AdminDashboard = () => {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's your catalogue & enquiry overview."
                actions={
                    <>
                        <Button asChild size="lg">
                            <Link href={ADMIN_PRODUCT_ADD}>
                                <Plus className="size-4" />
                                Add Product
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={ADMIN_MEDIA_SHOW}>
                                <ImagePlus className="size-4" />
                                Upload Media
                            </Link>
                        </Button>
                    </>
                }
            />

            <CountOverview />
            <QuickAdd />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle>Latest Enquiries</CardTitle>
                            <ViewAllLink href={ADMIN_ENQUIRY_SHOW} label="View all" />
                        </div>
                        <CardDescription>
                            Most recent product enquiries from the catalogue.
                        </CardDescription>
                    </CardHeader>
                    {/* min-h keeps the panel from collapsing while loading and
                        stops the empty state from sitting in a 20px-tall box. */}
                    <CardContent className="admin-scroll max-h-90 min-h-55 overflow-auto">
                        <LatestEnquiries />
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle>Enquiries by Status</CardTitle>
                            <ViewAllLink href={ADMIN_ENQUIRY_SHOW} label="View all" />
                        </div>
                        <CardDescription>Where your leads are in the pipeline.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-55">
                        <EnquiryStatusOverview />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle>Latest Reviews</CardTitle>
                            <ViewAllLink href={ADMIN_REVIEW_SHOW} label="View all" />
                        </div>
                        <CardDescription>
                            Recent product reviews shown on the storefront.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="admin-scroll max-h-85 min-h-50 overflow-auto">
                        <LatestReview />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard
