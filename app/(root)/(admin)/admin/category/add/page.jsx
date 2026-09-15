'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import PageHeader from '@/components/Application/Admin/PageHeader'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import slugify from 'slugify'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
  { href: '', label: 'Add Category' },
]

const AddCategory = () => {
  const [loading, setLoading] = useState(false)
  const [parentOption, setParentOption] = useState([])
  const { data: getParent } = useFetch('/api/parent?deleteType=SD&&size=10000')

  useEffect(() => {
    if (getParent && getParent.success) {
      const options = getParent.data.map((parent) => ({ label: parent.name, value: parent._id }))
      setParentOption(options)
    }
  }, [getParent])

  const formSchema = zSchema.pick({
    name: true, slug: true, parent: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      parent: "",
    },
  })

  useEffect(() => {
    const name = form.getValues('name')
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/category/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      form.reset()
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
        title="Add Category"
        description="Create a new product category for your catalog."
        breadcrumb={<BreadCrumb breadcrumbData={breadcrumbData} />}
      />

      <div className="rounded-xl border border-border bg-card shadow-xs p-5 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-5">
              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent</FormLabel>
                    <FormControl>
                      <Select
                        options={parentOption}
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
            <div className="mb-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-5">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <ButtonLoading loading={loading} type="submit" text="Add Category" className="h-9 cursor-pointer" size="lg" />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddCategory
