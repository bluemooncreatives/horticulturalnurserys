'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { ADMIN_DASHBOARD, ADMIN_REVIEW_SHOW } from '@/routes/AdminPanelRoute'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_REVIEW_SHOW, label: 'Reviews' },
  { href: '', label: 'Add Review' },
]

const StarRatingField = ({ value = 0, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        className="transition-transform hover:scale-110"
      >
        <Star className={`size-7 ${star <= Number(value || 0) ? 'fill-amber-500 text-amber-500' : 'text-amber-400'}`} />
      </button>
    ))}
  </div>
)

const AddReview = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [productOption, setProductOption] = useState([])
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&&size=10000')

  const formSchema = zSchema.pick({
    product: true,
    authorName: true,
    rating: true,
    title: true,
    review: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      authorName: '',
      rating: 0,
      title: '',
      review: '',
    },
  })

  useEffect(() => {
    if (getProduct && getProduct.success) {
      setProductOption(getProduct.data.map((product) => ({ label: product.name, value: product._id })))
    }
  }, [getProduct])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/review/create', values)
      if (!response.success) throw new Error(response.message)
      showToast('success', response.message)
      router.push(ADMIN_REVIEW_SHOW)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Add Review"
        description="Add an admin-managed review that appears on the storefront."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div className="rounded-md bg-card p-6 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="product" render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <Select
                    options={productOption}
                    selected={field.value}
                    setSelected={field.onChange}
                    isMulti={false}
                    placeholder="Select a product"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="authorName" render={({ field }) => (
              <FormItem>
                <FormLabel>Reviewer name</FormLabel>
                <FormControl><Input placeholder="e.g. Ananya S." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="rating" render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl><StarRatingField value={field.value} onChange={field.onChange} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="Sum up the review" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="review" render={({ field }) => (
              <FormItem>
                <FormLabel>Review</FormLabel>
                <FormControl><Textarea placeholder="Write the review…" className="min-h-28" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <ButtonLoading loading={loading} type="submit" text="Add Review" />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddReview
