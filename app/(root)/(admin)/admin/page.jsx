import { redirect } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'

// /admin itself has no screen of its own - the panel starts at the dashboard.
// Without this page a bookmarked or hand-typed /admin 404s, and (worse) the
// proxy sends it through login as ?callback=/admin, so a successful login
// lands on that same 404.
const AdminIndexPage = () => {
    redirect(ADMIN_DASHBOARD)
}

export default AdminIndexPage
