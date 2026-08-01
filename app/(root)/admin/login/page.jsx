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
import OTPVerification from '@/components/Application/OTPVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter, useSearchParams } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'

const AdminLoginPage = () => {
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const [otpEmail, setOtpEmail] = useState()
    const [hasAdmin, setHasAdmin] = useState(true)

    useEffect(() => {
        const checkSetupStatus = async () => {
            try {
                const { data } = await axios.get('/api/auth/setup-status')
                if (data.success) {
                    setHasAdmin(data.data.hasAdmin)
                }
            } catch (error) {
                console.error('Error checking setup status:', error)
            }
        }
        checkSetupStatus()
    }, [])

    const formSchema = zSchema.pick({
        email: true
    }).extend({
        password: z.string().min(3, 'Password field is required.')
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLoginSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: loginResponse } = await axios.post('/api/auth/login', values)
            if (!loginResponse.success) {
                throw new Error(loginResponse.message)
            }

            setOtpEmail(values.email)
            form.reset()
            showToast('success', loginResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values)
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }

            setOtpEmail('')
            showToast('success', otpResponse.message)
            dispatch(login(otpResponse.data))

            if (searchParams.has('callback')) {
                router.push(searchParams.get('callback'))
            } else {
                router.push(ADMIN_DASHBOARD)
            }
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setOtpVerificationLoading(false)
        }
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
                            <p className="font-header text-5xl leading-none text-white">Admin Login</p>
                            <p className="max-w-sm text-[15px] leading-relaxed text-white/70">Sign in with your admin credentials and complete OTP verification.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 bg-card p-8 text-card-foreground md:w-1/2 md:p-12">
                    {!otpEmail ? (
                        <>
                            <div className='mb-8 flex flex-col items-start'>
                                <h1 className='font-header text-5xl text-foreground'>Sign In</h1>
                                <p className='mt-2 text-left text-[15px] leading-relaxed text-muted-foreground'>Use your admin email and password to continue.</p>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleLoginSubmit)} className='space-y-5'>
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

                                    <div className='pt-1'>
                                        <ButtonLoading loading={loading} type="submit" text="Login" variant="brand" className="h-9 w-full rounded-sm text-base font-semibold uppercase cursor-pointer" />
                                    </div>

                                    {!hasAdmin && (
                                        <div className='mt-4 rounded-md bg-amber-500/10 p-3 text-center border border-amber-500/20'>
                                            <p className='text-sm text-amber-500 font-medium mb-1'>No admin account detected</p>
                                            <Link href='/admin/register' className='text-xs font-semibold underline text-foreground hover:text-[var(--brand-primary)]'>
                                                Register First Admin Account
                                            </Link>
                                        </div>
                                    )}
                                </form>
                            </Form>
                        </>
                    ) : (
                        <OTPVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const AdminLogin = () => {
    return (
        <div className='admin-theme min-h-screen w-full bg-muted p-4 md:p-6'>
            <div className='mx-auto flex min-h-[calc(100vh-2rem)] w-full items-center justify-center md:min-h-[calc(100vh-3rem)]'>
                <Suspense fallback={null}>
                    <AdminLoginPage />
                </Suspense>
            </div>
        </div>
    )
}

export default AdminLogin
