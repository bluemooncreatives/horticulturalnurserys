'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { ArrowDown, ArrowUp, Plus, Trash2, Sparkles, GripVertical, Info } from 'lucide-react'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import ButtonLoading from '@/components/Application/ButtonLoading'
import EmptyState from '@/components/Application/Admin/EmptyState'
import { CuratedListSkeleton } from '@/components/Application/Admin/Loaders'
import Select from '@/components/Application/Select'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { ADMIN_FRESHLY_ARRIVED_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'

const MIN_REQUIRED = 9

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_FRESHLY_ARRIVED_SHOW, label: 'Freshly Arrived' },
]

const formatPrice = (price) =>
  typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : '-'

const ShowFreshlyArrived = () => {
  const [items, setItems] = useState([])
  const [available, setAvailable] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const [loadingList, setLoadingList] = useState(true)
  const [adding, setAdding] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [orderDirty, setOrderDirty] = useState(false)

  const availableOptions = useMemo(
    () => available.map((p) => ({ label: p.name, value: p._id })),
    [available]
  )

  const loadItems = async () => {
    try {
      const { data } = await axios.get('/api/freshly-arrived')
      if (!data.success) throw new Error(data.message)
      setItems(data.data || [])
      setOrderDirty(false)
    } catch (error) {
      showToast('error', error.message)
    }
  }

  const loadAvailable = async () => {
    try {
      const { data } = await axios.get('/api/freshly-arrived/available')
      if (!data.success) throw new Error(data.message)
      setAvailable(data.data || [])
    } catch (error) {
      showToast('error', error.message)
    }
  }

  const refresh = async () => {
    setLoadingList(true)
    await Promise.all([loadItems(), loadAvailable()])
    setSelectedIds([])
    setLoadingList(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAdd = async () => {
    if (selectedIds.length === 0) {
      return showToast('error', 'Select at least one product.')
    }
    setAdding(true)
    try {
      const { data } = await axios.post('/api/freshly-arrived', { ids: selectedIds })
      if (!data.success) throw new Error(data.message)
      showToast('success', data.message)
      await refresh()
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (id) => {
    setRemovingId(id)
    try {
      const { data } = await axios.delete('/api/freshly-arrived', { data: { ids: [id] } })
      if (!data.success) throw new Error(data.message)
      showToast('success', data.message)
      await refresh()
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setRemovingId(null)
    }
  }

  const move = (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setOrderDirty(true)
  }

  const handleSaveOrder = async () => {
    setSavingOrder(true)
    try {
      const order = items.map((p) => p._id)
      const { data } = await axios.put('/api/freshly-arrived', { order })
      if (!data.success) throw new Error(data.message)
      showToast('success', data.message)
      setOrderDirty(false)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setSavingOrder(false)
    }
  }

  const belowMinimum = !loadingList && items.length < MIN_REQUIRED

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Freshly Arrived"
        description="Curate the products shown in the storefront Freshly Arrived section."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      {belowMinimum && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 shadow-2xs dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-200">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Info className="size-4" />
          </div>
          <p className="leading-relaxed">
            This section displays <strong className="font-semibold">{MIN_REQUIRED}</strong> products on the storefront. You currently have{' '}
            <strong className="font-semibold">{items.length}</strong> - until you reach {MIN_REQUIRED}, remaining slots are
            filled automatically with your most recent catalogue products.
          </p>
        </div>
      )}

      {/* Add products */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="mb-1 text-sm font-semibold">Add products</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Pick from existing products to feature them as freshly arrived.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-md">
            <Select
              options={availableOptions}
              selected={selectedIds}
              setSelected={setSelectedIds}
              isMulti
              placeholder={
                availableOptions.length ? 'Select products' : 'No products available to add'
              }
            />
          </div>
          <ButtonLoading
            loading={adding}
            onClick={handleAdd}
            type="button"
            text={
              <span className="inline-flex items-center gap-2">
                <Plus className="size-4" /> Add Selected
              </span>
            }
            className="h-9"
          />
        </div>
      </div>

      {/* Current list */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">
              Current freshly arrived{' '}
              <span className="text-muted-foreground font-normal">({items.length})</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Reorder with the arrows; the first {MIN_REQUIRED} appear on the storefront.
            </p>
          </div>
          {orderDirty && (
            <ButtonLoading
              loading={savingOrder}
              onClick={handleSaveOrder}
              type="button"
              text="Save Order"
              className="h-9"
            />
          )}
        </div>

        {loadingList ? (
          <div className="py-2">
            <CuratedListSkeleton rows={4} />
          </div>
        ) : items.length === 0 ? (
          <div className="py-6">
            <EmptyState
              icon={Sparkles}
              title="No products selected yet"
              description="Pick products above to curate the storefront Freshly Arrived showcase."
            />
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((product, index) => {
              const imgSrc = product?.media?.[0]?.secure_url || imgPlaceholder.src
              const onStorefront = index < MIN_REQUIRED
              return (
                <li
                  key={product._id}
                  className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/60 p-2.5 shadow-2xs transition-colors hover:border-primary/30 hover:bg-muted/30 sm:p-3"
                >
                  <GripVertical className="size-4 shrink-0 text-muted-foreground/60" />
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted">
                    <Image src={imgSrc} alt={product.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(product.sellingPrice)}</p>
                  </div>
                  {!onStorefront && (
                    <span className="hidden shrink-0 rounded-full border border-border/70 bg-muted/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
                      Not shown
                    </span>
                  )}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8 cursor-pointer"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8 cursor-pointer"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8 cursor-pointer text-destructive hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      disabled={removingId === product._id}
                      onClick={() => handleRemove(product._id)}
                      aria-label="Remove from freshly arrived"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ShowFreshlyArrived

