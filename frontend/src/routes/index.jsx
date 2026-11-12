import { Navigate, Route, Routes } from 'react-router'
import CustomerShell from '@/layouts/CustomerShell'
import AdminShell from '@/layouts/AdminShell'
import AdminRouteGuard from '@/components/admin/AdminRouteGuard'
import { AdminAuthProvider } from '@/hooks/useAuth'
import Login from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import CustomerCare from '@/pages/customer/CustomerCare'
import Home from '@/pages/customer/Home'
import NotFound from '@/pages/customer/NotFound'
import Packages from '@/pages/customer/Packages'
import Payment from '@/pages/customer/Payment'
import PaymentStatus from '@/pages/customer/PaymentStatus'
import Reconnect from '@/pages/customer/Reconnect'
import Voucher from '@/pages/customer/Voucher'

function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<AdminRouteGuard />}>
          <Route element={<AdminShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path=":section" element={<AdminPageComingSoon />} />
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}

function AdminPageComingSoon() {
  return (
    <section className="admin-coming-soon">
      <p className="admin-eyebrow">ADMINISTRATION</p>
      <h1>This page is coming soon</h1>
      <p>Admin tools are being added in stages. Choose another section to continue.</p>
    </section>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="admin/*" element={<AdminRoutes />} />
      <Route element={<CustomerShell />}>
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="payment" element={<Payment />} />
        <Route path="payment/status" element={<PaymentStatus />} />
        <Route path="reconnect" element={<Reconnect />} />
        <Route path="voucher" element={<Voucher />} />
        <Route path="customer-care" element={<CustomerCare />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}