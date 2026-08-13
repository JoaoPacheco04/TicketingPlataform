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
import CreateSectionPage from './pages/CreateSectionPage.tsx'
import OrganizerHubPage from './pages/OrganizerHubPage.tsx'
import CreateVenuePage from './pages/CreateVenuePage.tsx'
import CreateEventPage from './pages/CreateEventPage.tsx'
import EventDetailPage from './pages/EventDetailPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

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
          <Route path="/organizer" element={<OrganizerHubPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/create-section" element={<CreateSectionPage />} />
          <Route path="/create-venue" element={<CreateVenuePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/checkout/:reservationId" element={<CheckoutPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/events/:eventId/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)