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
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ImageIcon, Plus, X } from 'lucide-react'
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

  const handleRemoveMedia = (id, e) => {
    e?.stopPropagation?.()
    setSelectedMedia(prev => prev.filter(m => m._id !== id))
  }

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

      const { data: response } = await axios.post('/api/product/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      const productId = response?.data?._id
      setCreatedProductId(productId || '')

      form.reset()
      setSelectedMedia([])
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

            <div className="md:col-span-2 space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">
                  Product Images <span className="text-destructive" aria-hidden>*</span>
                </FormLabel>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {selectedMedia.length} image{selectedMedia.length === 1 ? '' : 's'} selected
                </span>
              </div>

              <MediaModal
                open={open}
                setOpen={setOpen}
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
                isMultiple={true}
              />

              {selectedMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {selectedMedia.map((media, idx) => (
                    <div
                      key={media._id}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/20 transition-all hover:border-primary/50 hover:shadow-xs"
                    >
                      <Image
                        src={media.url}
                        alt="Product media"
                        fill
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {idx === 0 && (
                        <span className="absolute left-1.5 top-1.5 z-10 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-xs">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveMedia(media._id, e)}
                        className="absolute right-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}

                  <div
                    onClick={() => setOpen(true)}
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-muted/20 text-center transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <Plus className="size-5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Add More</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setOpen(true)}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center transition-all hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Click to browse media library</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Select high quality product photos</p>
                  </div>
                </div>
              )}
            </div>

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
