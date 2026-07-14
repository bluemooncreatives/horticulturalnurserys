import { redirect } from 'next/navigation'
import { ADMIN_LOGIN } from '@/routes/AdminPanelRoute'

const LoginRedirectPage = () => {
    redirect(ADMIN_LOGIN)
}

export default LoginRedirectPage
