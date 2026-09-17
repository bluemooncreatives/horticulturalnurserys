'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_ADD } from '@/routes/AdminPanelRoute'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Button } from '@/components/ui/button'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import slugify from 'slugify'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/LazyEditor'
import MediaPicker from '@/components/Application/Admin/MediaPicker'
import { useRouter } from 'next/navigation'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Products' },
  { href: '', label: 'Add Product' },
]

const AddProduct = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [createdProductId, setCreatedProductId] = useState('')
  const [categoryOption, setCategoryOption] = useState([])
  const { data: getCategory } = useFetch('/api/category?deleteType=SD&&size=10000')

  // media modal states  
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])
  // Which of the selected images leads on the storefront. '' means "none
  // chosen yet", which resolves to the first image (see lib/coverMedia.js).
  const [coverMediaId, setCoverMediaId] = useState('')


  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data
      const options = data.map((cat) => ({ label: cat.name, value: cat._id }))
      setCategoryOption(options)
    }
  }, [getCategory])



  const formSchema = zSchema.pick({
    name: true,
    parentSku: true,
    slug: true,
    category: true,
    description: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentSku: "",
      slug: "",
      category: "",
      description: "",
    },
  })

  useEffect(() => {
    const name = form.getValues('name')
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')])


  const editor = (event, editor) => {
    const data = editor.getData()
    form.setValue('description', data)
  }

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedMedia.length <= 0) {
        return showToast('error', 'Please select media.')
      }

      const mediaIds = selectedMedia.map(media => media._id)
      values.media = mediaIds
      // '' when the admin never picked one - the server then falls back to the
      // first image, keeping add-form behaviour identical to before.
      values.coverMedia = coverMediaId || ''

      const { data: response } = await axios.post('/api/product/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      const productId = response?.data?._id
      setCreatedProductId(productId || '')

      form.reset()
      setSelectedMedia([])
      setCoverMediaId('')
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVariant = async () => {
    if (!createdProductId) {
      await form.trigger()
      showToast('error', 'Create the product first, then add variants.')
      return
    }

    router.push(`${ADMIN_PRODUCT_VARIANT_ADD}?productId=${createdProductId}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Add Product"
        description="Create a new product and attach media."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name<span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter product name (e.g. Fiddle Leaf Fig)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Slug <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="parentSku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Parent SKU <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter parent SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={categoryOption}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5 md:col-span-2">
                <FormLabel className="mb-2">
                  Description <span className="text-destructive" aria-hidden>*</span>
                </FormLabel>
                <Editor onChange={editor} />
                <FormMessage></FormMessage>
              </div>
            </div>

            <MediaPicker
              label="Product Images"
              selectedMedia={selectedMedia}
              setSelectedMedia={setSelectedMedia}
              coverMediaId={coverMediaId}
              setCoverMediaId={setCoverMediaId}
              emptyStateHint="Select high quality product photos"
            />

            <p className="mt-5 text-sm text-muted-foreground">
              To show your product on the website, you need to add at least one variant after creating the product.
            </p>

            <div className="mb-3 mt-4 flex flex-wrap items-center gap-3">
              <ButtonLoading loading={loading} type="submit" text="Add Product" className="h-9 cursor-pointer" size="lg" />
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleAddVariant}
                disabled={!createdProductId || loading}
                className="h-9 cursor-pointer"
              >
                Add Variant
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddProduct
