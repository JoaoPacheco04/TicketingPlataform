import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import CheckInPage from './pages/CheckInPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import MyReservationsPage from './pages/MyReservationsPage.tsx'
import CheckoutPage from './pages/CheckoutPage.tsx'
import EventDetailPage from './pages/EventDetailPage.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster richColors position="top-right" duration={2000} />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkin" element={<CheckInPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/checkout/:reservationId" element={<CheckoutPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/events/:eventId/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)