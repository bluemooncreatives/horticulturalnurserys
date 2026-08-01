'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Suspense, useState, useEffect } from 'react'
import Logo from '@/public/assets/images/logo-horti.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'
import { ADMIN_LOGIN } from '@/routes/AdminPanelRoute'

const AdminRegisterPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [checkingSetup, setCheckingSetup] = useState(true)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const [isTypeConfirmPassword, setIsTypeConfirmPassword] = useState(true)

    // Verify if register is allowed
    useEffect(() => {
        const checkSetupStatus = async () => {
            try {
                const { data } = await axios.get('/api/auth/setup-status')
                if (data.success && data.data.hasAdmin) {
                    // Admin already exists, redirect to login
                    showToast('error', 'Registration closed. An admin already exists.')
                    router.push(ADMIN_LOGIN)
                } else {
                    setCheckingSetup(false)
                }
            } catch (error) {
                showToast('error', 'Error checking setup status.')
                router.push(ADMIN_LOGIN)
            }
        }
        checkSetupStatus()
    }, [router])

    const formSchema = zSchema.pick({
        name: true,
        email: true,
        password: true
    }).extend({
        confirmPassword: z.string().min(1, 'Confirm password is required.')
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const handleRegisterSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: responseData } = await axios.post('/api/auth/register-admin', {
                name: values.name,
                email: values.email,
                password: values.password
            })
            if (!responseData.success) {
                throw new Error(responseData.message)
            }

            showToast('success', responseData.message)
            router.push(ADMIN_LOGIN)
        } catch (error) {
            const apiErrorMsg = error.response?.data?.message || error.message
            showToast('error', apiErrorMsg)
        } finally {
            setLoading(false)
        }
    }

    if (checkingSetup) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground text-sm">Verifying setup status...</p>
            </div>
        )
    }

    return (
        <Card className="w-full max-w-5xl overflow-hidden border-0 bg-transparent py-0 shadow-none ring-0 gap-0">
            <CardContent className="relative flex overflow-hidden rounded-[var(--admin-shell-radius)] bg-card p-0 shadow-xl md:flex-row">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent to-black/60" />
                <div className="relative hidden overflow-hidden bg-[var(--brand-primary)] p-8 text-sidebar-foreground md:block md:w-1/2 md:p-12">
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[64%]"
                        style={{ backgroundImage: "var(--auth-panel-gradient)" }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[56%] bg-[linear-gradient(0deg,rgba(255,255,255,0.18),transparent_74%)] blur-2xl" />
                    <div className="relative z-20 flex h-full flex-col justify-between">
                        <div className='mb-8'>
                            <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='logo' className='max-w-[60px] brightness-0 invert' unoptimized />
                            <p className="mt-6 max-w-sm text-sm text-white/75">
                                Admin access for dashboard, products, orders, and store operations.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <p className="font-header text-5xl leading-none text-white">First Admin Setup</p>
                            <p className="max-w-sm text-[15px] leading-relaxed text-white/70">Create the primary administrator account for your store management system.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 bg-card p-8 text-card-foreground md:w-1/2 md:p-12">
                    <div className='mb-8 flex flex-col items-start'>
                        <h1 className='font-header text-5xl text-foreground'>Register</h1>
                        <p className='mt-2 text-left text-[15px] leading-relaxed text-muted-foreground'>Create the primary admin credentials to get started.</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">Full Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="John Doe" className="form-field" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="admin@example.com" className="form-field" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="text-sm text-foreground">Password</FormLabel>
                                        <FormControl>
                                            <Input type={isTypePassword ? 'password' : 'text'} placeholder="***********" className="form-field !pr-10" {...field} />
                                        </FormControl>
                                        <button className='absolute right-3 top-[32px] cursor-pointer text-muted-foreground hover:text-foreground' type='button' onClick={() => setIsTypePassword(!isTypePassword)}>
                                            {isTypePassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                                        </button>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="text-sm text-foreground">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type={isTypeConfirmPassword ? 'password' : 'text'} placeholder="***********" className="form-field !pr-10" {...field} />
                                        </FormControl>
                                        <button className='absolute right-3 top-[32px] cursor-pointer text-muted-foreground hover:text-foreground' type='button' onClick={() => setIsTypeConfirmPassword(!isTypeConfirmPassword)}>
                                            {isTypeConfirmPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                                        </button>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='pt-2'>
                                <ButtonLoading loading={loading} type="submit" text="Register Admin" variant="brand" className="h-9 w-full rounded-sm text-base font-semibold uppercase cursor-pointer" />
                            </div>

                            <div className='text-center text-sm mt-4'>
                                <Link href={ADMIN_LOGIN} className='font-semibold text-foreground underline underline-offset-4'>Back to login</Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

const AdminRegister = () => {
    return (
        <div className='admin-theme min-h-screen w-full bg-muted p-4 md:p-6'>
            <div className='mx-auto flex min-h-[calc(100vh-2rem)] w-full items-center justify-center md:min-h-[calc(100vh-3rem)]'>
                <Suspense fallback={null}>
                    <AdminRegisterPage />
                </Suspense>
            </div>
        </div>
    )
}

export default AdminRegister
