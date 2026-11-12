import { Route, Routes } from 'react-router'
import CustomerShell from '@/layouts/CustomerShell'
import CustomerCare from '@/pages/customer/CustomerCare'
import Home from '@/pages/customer/Home'
import NotFound from '@/pages/customer/NotFound'
import Packages from '@/pages/customer/Packages'
import Payment from '@/pages/customer/Payment'
import PaymentStatus from '@/pages/customer/PaymentStatus'
import Reconnect from '@/pages/customer/Reconnect'
import Voucher from '@/pages/customer/Voucher'

export default function AppRoutes() {
  return (
    <Routes>
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