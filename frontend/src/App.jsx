import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppProvider } from '@/context/AppContext'
import BrandSheet from '@/pages/BrandSheet'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BrandSheet />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}