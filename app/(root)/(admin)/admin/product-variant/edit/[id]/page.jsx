'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/AdminPanelRoute'
import {
  Form,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect, useState, useMemo } from 'react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import MediaPicker from '@/components/Application/Admin/MediaPicker'
import ColorHexPicker from '@/components/Application/Admin/ColorHexPicker'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
  { href: '', label: 'Edit Product Variant' },
]

const EditProductVariant = ({ params }) => {
  const { id } = use(params)

  const [loading, setLoading] = useState(false)
  const [productOption, setProductOption] = useState([])
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&&size=10000')
  // Size options come from the sizes already stored on live variants, so the
  // picker reflects the real catalogue instead of a fixed apparel scale. Free
  // text is still allowed (creatable), which is how a new size enters the list.
  const { data: sizeData } = useFetch('/api/product-variant/sizes')
  const sizeOptions = useMemo(
    () => (Array.isArray(sizeData?.data) ? sizeData.data : []).map((s) => ({ label: s, value: s })),
    [sizeData]
  )
  const { data: getVariant } = useFetch(`/api/product-variant/get/${id}`)

  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])
  // Which of the selected images leads on the storefront. '' means "none
  // chosen yet", which resolves to the first image (see lib/coverMedia.js).
  const [coverMediaId, setCoverMediaId] = useState('')


  useEffect(() => {
    if (getProduct && getProduct.success) {
      const options = getProduct.data.map((product) => ({ label: product.name, value: product._id }))
      setProductOption(options)
    }
  }, [getProduct])

  const formSchema = zSchema.pick({
    _id: true,
    product: true,
    sku: true,
    color: true,
    colorHex: true,
    size: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      product: '',
      sku: '',
      color: '',
      colorHex: '',
      size: '',
    },
  })

  useEffect(() => {
    if (getVariant && getVariant.success) {
      const variant = getVariant.data
      form.reset({
        _id: variant._id,
        product: variant.product,
        sku: variant.sku,
        color: variant.color,
        colorHex: variant.colorHex || '',
        size: variant.size || '',
      })

      if (variant.media) {
        const media = variant.media.map((item) => ({ _id: item._id, url: item.secure_url }))
        setSelectedMedia(media)
      }

      if (variant.coverMedia) {
        setCoverMediaId(String(variant.coverMedia))
      }
    }
  }, [getVariant])


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedMedia.length <= 0) {
        return showToast('error', 'Please select media.')
      }

      values.media = selectedMedia.map((media) => media._id)
      // '' when the admin never picked one - the server then falls back to the
      // first image, keeping add-form behaviour identical to before.
      values.coverMedia = coverMediaId || ''

      const { data: response } = await axios.put('/api/product-variant/update', values)
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
        title="Edit Product Variant"
        description="Update variant details, pricing, and media."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={productOption}
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

              <div>
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SKU <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Color <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="colorHex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Swatch Color</FormLabel>
                      <FormControl>
                        <ColorHexPicker
                          value={field.value}
                          onChange={field.onChange}
                          colorName={form.watch('color')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Size <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={sizeOptions}
                          selected={field.value}
                          setSelected={(value) => field.onChange(value ?? '')}
                          isMulti={false}
                          creatable
                          placeholder="No size"
                          createLabel={(value) => `Use "${value}"`}
                        />
                      </FormControl>
                      <FormDescription>
                        Sizes already in the catalogue are listed. Type to add a new one, or
                        leave empty for products that have no size.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>



            </div>

            <MediaPicker
              label="Variant Images"
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

export default EditProductVariant
