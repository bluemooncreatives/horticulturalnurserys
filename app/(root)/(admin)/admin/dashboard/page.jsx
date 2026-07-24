import CountOverview from './CountOverview'
import QuickAdd from './QuickAdd'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EnquiryStatusOverview from './EnquiryStatusOverview'
import LatestEnquiries from './LatestEnquiries'
import LatestReview from './LatestReview'
import { ADMIN_ENQUIRY_SHOW, ADMIN_REVIEW_SHOW, ADMIN_PRODUCT_ADD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'

const AdminDashboard = () => {
    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's your catalogue & enquiry overview."
                actions={
                    <>
                        <Link href={ADMIN_PRODUCT_ADD}>
                            <Button className="gap-2 h-9" size="lg">
                                <span>+</span>
                                Add Product
                            </Button>
                        </Link>
                        <Link href={ADMIN_MEDIA_SHOW}>
                            <Button variant="outline" className="h-9" size="lg">Upload Media</Button>
                        </Link>
                    </>
                }
            />

            <div className="space-y-4">
                <CountOverview />
                <QuickAdd />

                <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                    <Card className='col-span-1 lg:col-span-4'>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <CardTitle>Latest Enquiries</CardTitle>
                                <Button type='button' variant='ghost' className='text-xs' asChild>
                                    <Link href={ADMIN_ENQUIRY_SHOW}>View All</Link>
                                </Button>
                            </div>
                            <CardDescription>Most recent product enquiries from the catalogue.</CardDescription>
                        </CardHeader>
                        <CardContent className='max-h-[360px] overflow-auto'>
                            <LatestEnquiries />
                        </CardContent>
                    </Card>

                    <Card className='col-span-1 lg:col-span-3'>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <CardTitle>Enquiries by Status</CardTitle>
                                <Button type='button' variant='ghost' className='text-xs' asChild>
                                    <Link href={ADMIN_ENQUIRY_SHOW}>View All</Link>
                                </Button>
                            </div>
                            <CardDescription>Where your leads are in the pipeline.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EnquiryStatusOverview />
                        </CardContent>
                    </Card>
                </div>

                <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                    <Card className='col-span-1 lg:col-span-4'>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <CardTitle>Latest Reviews</CardTitle>
                                <Button type='button' variant='ghost' className='text-xs' asChild>
                                    <Link href={ADMIN_REVIEW_SHOW}>View All</Link>
                                </Button>
                            </div>
                            <CardDescription>Recent product reviews shown on the storefront.</CardDescription>
                        </CardHeader>
                        <CardContent className='max-h-[340px] overflow-auto'>
                            <LatestReview />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
