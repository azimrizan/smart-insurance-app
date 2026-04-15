import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '../store/slices/authSlice'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { label: 'Home',      href: '/' },
    { label: 'Loans',     href: '/#loans' },
    { label: 'BNPL',      href: '/#bnpl' },
    { label: 'Cards',     href: '/#cards' },
    { label: 'About',     href: '/#about' },
  ]

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: '0 2rem',
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(7,15,30,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '10px',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A',
          fontFamily: "'Outfit', sans-serif",
        }}>T</div>
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.2rem',
          background: 'linear-gradient(135deg,#10B981,#34D399)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Smart Finance</span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
        {navLinks.map(l => (
          <a key={l.label} href={l.href} style={{
            fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)',
            transition: 'color 0.2s', cursor: 'pointer',
          }}
          onMouseEnter={e => e.target.style.color = '#10B981'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
          >{l.label}</a>
        ))}
      </div>

      {/* Auth Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isAuthenticated ? (
          <>
            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-ghost btn-sm">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </motion.nav>
  )
}
