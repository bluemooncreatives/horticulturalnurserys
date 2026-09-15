'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/AdminPanelRoute'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { computeDiscountPercentage, validatePricing } from '@/lib/pricing'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Suspense, useEffect, useState } from 'react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import MediaModal from '@/components/Application/Admin/MediaModal'
import ColorHexPicker from '@/components/Application/Admin/ColorHexPicker'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { sizes } from '@/lib/utils'
import { ImageIcon, Plus, X } from 'lucide-react'
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

  // media modal states  
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const handleRemoveMedia = (id, e) => {
    e?.stopPropagation?.()
    setSelectedMedia(prev => prev.filter(m => m._id !== id))
  }

  const formSchema = zSchema.pick({
    product: true,
    sku: true,
    color: true,
    colorHex: true,
    size: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      sku: "",
      color: "",
      colorHex: "",
      size: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
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



  // Discount is always derived from MRP & Selling Price (single source of truth
  // in lib/pricing). Recompute on every change so 0% (SP == MRP) and later edits
  // are reflected instead of leaving a stale value behind.
  useEffect(() => {
    form.setValue('discountPercentage', computeDiscountPercentage(form.getValues('mrp'), form.getValues('sellingPrice')))
  }, [form.watch('mrp'), form.watch('sellingPrice')])



  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedMedia.length <= 0) {
        return showToast('error', 'Please select media.')
      }

      const pricing = validatePricing(values.mrp, values.sellingPrice)
      if (!pricing.ok) {
        form.setError(pricing.field, { type: 'manual', message: pricing.message })
        return showToast('error', pricing.message)
      }
      values.discountPercentage = pricing.discountPercentage

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
      values.sku = sku

      const { data: response } = await axios.post('/api/product-variant/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      form.reset()
      setParentSku('')
      setSelectedMedia([])
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
                        Size <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={sizes}
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
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        MRP <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter MRP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selling Price <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter Selling Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Discount Percentage <span className="text-destructive" aria-hidden>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" readOnly placeholder="Enter Discount Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">
                  Variant Images <span className="text-destructive" aria-hidden>*</span>
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
                        alt="Variant media"
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
                    <p className="text-xs text-muted-foreground mt-0.5">Select high quality variant photos</p>
                  </div>
                </div>
              )}
            </div>

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
