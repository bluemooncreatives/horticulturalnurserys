'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect, useState } from 'react'
import slugify from 'slugify'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/LazyEditor'
import MediaPicker from '@/components/Application/Admin/MediaPicker'
import { decodeHTMLDeep } from '@/lib/utils'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Products' },
  { href: '', label: 'Edit Product' },
]

const EditProduct = ({ params }) => {

  const { id } = use(params)

  const [loading, setLoading] = useState(false)
  const [categoryOption, setCategoryOption] = useState([])
  const { data: getCategory } = useFetch('/api/category?deleteType=SD&&size=10000')
  const { data: getProduct, error: getProductError } = useFetch(`/api/product/get/${id}`)

  // The editor can only be seeded once, at mount, so it must not be rendered
  // until the fetched description is actually in hand. `null` means "still
  // unknown"; `''` is a product that legitimately has no description yet.
  const [editorInitialData, setEditorInitialData] = useState(null)



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
    _id: true,
    name: true,
    slug: true,
    parentSku: true,
    category: true,
    description: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
      parentSku: "",
      category: "",
      description: "",
    },
  })


  useEffect(() => {
    if (getProduct && getProduct.success) {
      const product = getProduct.data
      // Hold the form value as real markup, matching what the editor emits, so
      // saving without touching the editor cannot re-encode an encoded string.
      const description = decodeHTMLDeep(product?.description)
      form.reset({
        _id: product?._id,
        name: product?.name,
        slug: product?.slug,
        // `?? ''` keeps the input controlled: a product saved before parentSku
        // existed has no value, and `undefined` would make React drop the field
        // back to uncontrolled and warn.
        parentSku: product?.parentSku ?? '',
        category: product?.category,
        description,
      })
      setEditorInitialData(description)

      if (product.media) {
        const media = product.media.map((media) => ({ _id: media._id, url: media.secure_url }))
        setSelectedMedia(media)
      }

      if (product.coverMedia) {
        setCoverMediaId(String(product.coverMedia))
      }

    }
  }, [getProduct])

  // Without this the editor would never mount on a failed fetch, leaving the
  // admin with a label and nothing to type into.
  useEffect(() => {
    if (getProductError) {
      setEditorInitialData('')
    }
  }, [getProductError])

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

      const { data: response } = await axios.put('/api/product/update', values)
      if (!response.success) {
        throw new Error(response.message)
      }


      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Edit Product"
        description="Update details, pricing, and media."
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
                        <Input type="text" placeholder="Enter category name" {...field} />
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
                {editorInitialData === null ? (
                  <div className="min-h-[300px] animate-pulse rounded-md border border-border/60 bg-muted/20" />
                ) : (
                  <Editor onChange={editor} initialData={editorInitialData} />
                )}
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

            <div className="mb-3 mt-5">
              <ButtonLoading loading={loading} type="submit" text="Save Changes" className="h-9 cursor-pointer" size="lg" />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditProduct
