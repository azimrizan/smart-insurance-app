import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { login, clearError } from '../../store/slices/authSlice'
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow]   = useState(false)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error } = useSelector(s => s.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(login(form))
    if (login.fulfilled.match(result)) {
      const role = result.payload.user?.role
      toast.success(`Welcome back, ${result.payload.user?.fullName?.split(' ')[0]}!`)
      navigate(role === 'admin' ? '/admin' : '/dashboard')
    }
  }

  const fillDemo = (email, pass) => setForm({ email, password: pass })

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--gradient-hero)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position:'absolute', width:400, height:400, top:-100, right:-100, borderRadius:'50%', background:'radial-gradient(circle,rgba(201,162,39,0.1),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:300, height:300, bottom:-80, left:-80, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.08),transparent 70%)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width:42,height:42,borderRadius:'12px',background:'linear-gradient(135deg,#C9A227,#A07A10)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'1.2rem',color:'#0B1F3A',fontFamily:"'Outfit',sans-serif" }}>T</div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:'1.3rem',background:'linear-gradient(135deg,#C9A227,#E2B83A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>Smart Finance</span>
          </Link>
          <h2 style={{ fontSize:'1.8rem', marginBottom:'0.5rem' }}>Welcome Back</h2>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>Sign in to your account</p>
        </div>


        {/* Card */}
        <div className="glass-card" style={{ padding:'2rem' }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'10px',padding:'10px 14px',marginBottom:'1.2rem',fontSize:'0.85rem',color:'#EF4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:'1.2rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)' }} />
                <input id="login-email" type="email" className="form-input" style={{ paddingLeft:'42px' }}
                  placeholder="your@email.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)' }} />
                <input id="login-password" type={show ? 'text' : 'password'} className="form-input" style={{ paddingLeft:'42px',paddingRight:'42px' }}
                  placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required autoComplete="current-password" />
                <button type="button" onClick={() => setShow(s => !s)}
                  style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.4)',background:'none',border:'none',cursor:'pointer' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%',marginTop:'0.5rem' }}>
              {loading ? <span className="animate-spin" style={{ width:18,height:18,border:'2px solid #0B1F3A',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block' }} /> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign:'center',marginTop:'1.5rem',fontSize:'0.88rem',color:'rgba(255,255,255,0.45)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#C9A227',fontWeight:600 }}>Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
