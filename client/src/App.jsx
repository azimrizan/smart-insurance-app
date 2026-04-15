import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchMe } from './store/slices/authSlice'

import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/auth/LoginPage'
import RegisterPage   from './pages/auth/RegisterPage'
import OtpPage        from './pages/auth/OtpPage'
import UserDashboard  from './pages/dashboard/UserDashboard'
import LoanPage       from './pages/dashboard/LoanPage'
import BnplPage       from './pages/dashboard/BnplPage'
import VirtualCardPage from './pages/dashboard/VirtualCardPage'
import NotificationsPage from './pages/dashboard/NotificationsPage'
import ProfilePage    from './pages/dashboard/ProfilePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLoans     from './pages/admin/AdminLoans'
import AdminUsers     from './pages/admin/AdminUsers'
import AdminKyc       from './pages/admin/AdminKyc'

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMe())
  }, [isAuthenticated, dispatch])

  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify"   element={<OtpPage />} />

      <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      <Route path="/dashboard/loans" element={<PrivateRoute><LoanPage /></PrivateRoute>} />
      <Route path="/dashboard/bnpl"  element={<PrivateRoute><BnplPage /></PrivateRoute>} />
      <Route path="/dashboard/card"  element={<PrivateRoute><VirtualCardPage /></PrivateRoute>} />
      <Route path="/dashboard/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
      <Route path="/dashboard/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      <Route path="/admin"       element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/loans" element={<PrivateRoute adminOnly><AdminLoans /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/kyc"   element={<PrivateRoute adminOnly><AdminKyc /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
