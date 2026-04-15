import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { verifyOtp } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function OtpPage() {
  const [otp, setOtp] = useState(['','','','','',''])
  const inputs = useRef([])
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error, pendingEmail } = useSelector(s => s.auth)

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) inputs.current[i+1]?.focus()
  }
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i-1]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) return toast.error('Enter all 6 digits')
    const result = await dispatch(verifyOtp({ email: pendingEmail, otp: code }))
    if (verifyOtp.fulfilled.match(result)) {
      toast.success('Email verified! Welcome to Smart Finance.')
      navigate('/dashboard')
    }
  }

  return (
    <div style={{ minHeight:'100vh',background:'var(--gradient-hero)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem' }}>
      <motion.div initial={{ opacity:0,y:40 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }} style={{ width:'100%',maxWidth:'420px' }}>
        <div style={{ textAlign:'center',marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem',marginBottom:'1rem' }}>📬</div>
          <h2 style={{ marginBottom:'0.5rem' }}>Verify Your Email</h2>
          <p style={{ color:'rgba(255,255,255,0.5)',fontSize:'0.9rem',lineHeight:1.6 }}>
            Enter the 6-digit code sent to<br />
            <strong style={{ color:'#C9A227' }}>{pendingEmail || 'your email'}</strong>
          </p>
        </div>

        <div className="glass-card" style={{ padding:'2rem' }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'10px',padding:'10px 14px',marginBottom:'1.2rem',fontSize:'0.85rem',color:'#EF4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex',gap:'10px',justifyContent:'center',marginBottom:'2rem' }}>
              {otp.map((digit, i) => (
                <input key={i} ref={el => inputs.current[i] = el}
                  id={`otp-${i}`}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit} onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  style={{
                    width:48, height:56, textAlign:'center',
                    fontSize:'1.4rem', fontWeight:700,
                    background:'rgba(255,255,255,0.05)',
                    border: digit ? '2px solid #C9A227' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius:'12px', color:'#F8FAFC',
                    outline:'none', transition:'border-color 0.2s',
                    fontFamily:"'Outfit',sans-serif",
                  }}
                />
              ))}
            </div>

            <button id="otp-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%' }}>
              {loading ? <span className="animate-spin" style={{ width:18,height:18,border:'2px solid #0B1F3A',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block' }} /> : 'Verify & Continue →'}
            </button>
          </form>

          <div style={{ textAlign:'center',marginTop:'1.5rem',fontSize:'0.85rem',color:'rgba(255,255,255,0.4)' }}>
            Didn't receive the code? <button style={{ color:'#C9A227',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontSize:'0.85rem' }}>Resend</button>
          </div>
          <div style={{ textAlign:'center',marginTop:'0.75rem' }}>
            <Link to="/register" style={{ fontSize:'0.85rem',color:'rgba(255,255,255,0.4)' }}>← Back to Registration</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
