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
import { Suspense, useEffect, useState, useMemo } from 'react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import MediaPicker from '@/components/Application/Admin/MediaPicker'
import ColorHexPicker from '@/components/Application/Admin/ColorHexPicker'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
  { href: '', label: 'Add Product Variants' },
]

const AddProduct = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId') || ''
  const [loading, setLoading] = useState(false)
  const [productOption, setProductOption] = useState([])
  const [parentSku, setParentSku] = useState('')
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&&size=10000')
  // Size options come from the sizes already stored on live variants, so the
  // picker reflects the real catalogue instead of a fixed apparel scale. Free
  // text is still allowed (creatable), which is how a new size enters the list.
  const { data: sizeData } = useFetch('/api/product-variant/sizes')
  const sizeOptions = useMemo(
    () => (Array.isArray(sizeData?.data) ? sizeData.data : []).map((s) => ({ label: s, value: s })),
    [sizeData]
  )

  // media modal states  
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])
  // Which of the selected images leads on the storefront. '' means "none
  // chosen yet", which resolves to the first image (see lib/coverMedia.js).
  const [coverMediaId, setCoverMediaId] = useState('')


  const formSchema = zSchema.pick({
    product: true,
    sku: true,
    color: true,
    colorHex: true,
    size: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      sku: "",
      color: "",
      colorHex: "",
      size: "",
    },
  })

  const selectedProductId = form.watch('product')

  useEffect(() => {
    if (!selectedProductId) {
      if (productId) {
        router.replace(pathname, { scroll: false })
      }
      return
    }

    if (selectedProductId !== productId) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('productId', selectedProductId)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [selectedProductId, productId, searchParams, router, pathname])

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data
      const options = data.map((product) => ({ label: product.name, value: product._id }))
      setProductOption(options)

      if (productId && options.some((item) => item.value === productId)) {
        form.setValue('product', productId)
      }
    }
  }, [getProduct, productId, form])

  useEffect(() => {
    const fetchSelectedProduct = async () => {
      if (!selectedProductId) {
        setParentSku('')
        form.setValue('sku', '')
        return
      }

      try {
        const { data: response } = await axios.get(`/api/product/get/${selectedProductId}`)
        if (!response.success) {
          throw new Error(response.message)
        }

        const selectedParentSku = (response.data?.parentSku || '').trim()
        setParentSku(selectedParentSku)
        form.setValue('sku', selectedParentSku ? `${selectedParentSku}-` : '')
        form.clearErrors('sku')
      } catch (error) {
        setParentSku('')
        form.setValue('sku', '')
        showToast('error', error.message)
      }
    }

    fetchSelectedProduct()
  }, [selectedProductId, form])






  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedMedia.length <= 0) {
        return showToast('error', 'Please select media.')
      }

      const sku = (values.sku || '').trim()
      const skuPrefix = parentSku ? `${parentSku}-` : ''

      if (!parentSku) {
        form.setError('product', { type: 'manual', message: 'Please select a valid product.' })
        return
      }

      if (!sku) {
        form.setError('sku', { type: 'manual', message: 'SKU is required.' })
        return
      }

      if (!sku.startsWith(skuPrefix)) {
        form.setError('sku', { type: 'manual', message: 'SKU must start with parent SKU.' })
        return
      }

      if (sku === parentSku) {
        form.setError('sku', { type: 'manual', message: 'SKU cannot be same as parent SKU.' })
        return
      }

      if (sku === skuPrefix || !sku.slice(skuPrefix.length).trim()) {
        form.setError('sku', { type: 'manual', message: 'Please add a suffix to SKU.' })
        return
      }

      const mediaIds = selectedMedia.map(media => media._id)
      values.media = mediaIds
      // '' when the admin never picked one - the server then falls back to the
      // first image, keeping add-form behaviour identical to before.
      values.coverMedia = coverMediaId || ''
      values.sku = sku

      const { data: response } = await axios.post('/api/product-variant/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      form.reset()
      setParentSku('')
      setSelectedMedia([])
      setCoverMediaId('')
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
        title="Add Product Variant"
        description="Create variant options for a product."
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
                        SKU<span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex h-10 items-stretch overflow-hidden rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow] has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/50">
                          {parentSku && (
                            <span className="flex h-full shrink-0 items-center whitespace-nowrap border-r px-3 text-sm text-muted-foreground">
                              {`${parentSku}-`}
                            </span>
                          )}
                          <Input
                            type="text"
                            placeholder={parentSku ? 'Enter SKU suffix' : 'Enter sku'}
                            value={parentSku && field.value?.startsWith(`${parentSku}-`) ? field.value.slice(`${parentSku}-`.length) : (field.value || '')}
                            onChange={(event) => {
                              const value = event.target.value

                              if (!parentSku) {
                                field.onChange(value)
                                return
                              }

                              field.onChange(`${parentSku}-${value}`)
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            disabled={!parentSku}
                            className="h-full border-0 shadow-none focus-visible:ring-0"
                          />
                        </div>
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
              <ButtonLoading loading={loading} type="submit" text="Add Product Variant" className="h-9 cursor-pointer" size="lg" />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

const AddProductPage = () => {
  return (
    <Suspense fallback={null}>
      <AddProduct />
    </Suspense>
  )
}

export default AddProductPage
