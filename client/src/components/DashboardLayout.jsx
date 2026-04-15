import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { logout } from '../store/slices/authSlice'
import {
  LayoutDashboard, CreditCard, ShoppingBag, BellRing,
  User, LogOut, Shield, Banknote, Users, FileCheck
} from 'lucide-react'

const UserNav = [
  { label: 'Overview',      href: '/dashboard',               icon: LayoutDashboard },
  { label: 'Loans',         href: '/dashboard/loans',         icon: Banknote },
  { label: 'BNPL',          href: '/dashboard/bnpl',          icon: ShoppingBag },
  { label: 'Virtual Card',  href: '/dashboard/card',          icon: CreditCard },
  { label: 'Notifications', href: '/dashboard/notifications', icon: BellRing },
  { label: 'Profile',       href: '/dashboard/profile',       icon: User },
]

const AdminNav = [
  { label: 'Dashboard',  href: '/admin',        icon: Shield },
  { label: 'Loan Review',href: '/admin/loans',  icon: Banknote },
  { label: 'Users',      href: '/admin/users',  icon: Users },
  { label: 'KYC Review', href: '/admin/kyc',    icon: FileCheck },
]

export default function DashboardLayout({ children }) {
  const { user } = useSelector(s => s.auth)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const isAdmin   = user?.role === 'admin'
  const navItems  = isAdmin ? AdminNav : UserNav

  const handleLogout = () => { dispatch(logout()); navigate('/') }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg,#C9A227,#A07A10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1rem', color: '#0B1F3A',
            fontFamily: "'Outfit',sans-serif",
          }}>T</div>
          <span style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '1.1rem',
            background: 'linear-gradient(135deg,#C9A227,#E2B83A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Smart Finance</span>
          {isAdmin && <span style={{
            fontSize: '0.65rem', background: 'rgba(201,162,39,0.2)', color: '#C9A227',
            padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(201,162,39,0.3)',
            fontWeight: 600,
          }}>ADMIN</span>}
        </div>

        {/* User Info */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '14px', marginBottom: '1.5rem',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg,#C9A227,#A07A10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1rem', color: '#0B1F3A', marginBottom: '8px',
          }}>{user?.fullName?.[0] || 'U'}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.fullName || 'User'}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{user?.email}</div>
          {user?.creditScore > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Credit Score</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C9A227' }}>{user.creditScore}</span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ label, href, icon: Icon }) => (
            <NavLink key={href} to={href} end={href === '/dashboard' || href === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px',
                fontSize: '0.88rem', fontWeight: 500,
                color: isActive ? '#C9A227' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(201,162,39,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(201,162,39,0.2)' : '1px solid transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '11px 14px', borderRadius: '10px',
          fontSize: '0.88rem', fontWeight: 500,
          color: 'rgba(239,68,68,0.7)', background: 'transparent',
          border: '1px solid rgba(239,68,68,0.15)',
          transition: 'all 0.2s', cursor: 'pointer', marginTop: '1rem', width: '100%',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {children}
        </motion.div>
      </main>
    </div>
  )
}
