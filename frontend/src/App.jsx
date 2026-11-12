import { BrowserRouter, Route, Routes } from 'react-router'
import { AppProvider } from '@/context/AppContext'
import BrandSheet from '@/pages/BrandSheet'
import AppRoutes from '@/routes'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/brand" element={<BrandSheet />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}