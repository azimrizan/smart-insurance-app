import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { register, setPendingEmail } from '../../store/slices/authSlice'
import { User, Mail, Phone, Lock, DollarSign, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName:'',email:'',phone:'',password:'',monthlyIncome:'' })
  const [show, setShow]   = useState(false)
  const [step, setStep]   = useState(1)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error } = useSelector(s => s.auth)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(register(form))
    if (register.fulfilled.match(result)) {
      dispatch(setPendingEmail(form.email))
      toast.success('Account created! Check your OTP.')
      if (result.payload.otpHint) toast(`Demo OTP: ${result.payload.otpHint}`, { icon: '🔑', duration: 8000 })
      navigate('/verify')
    }
  }

  return (
    <div style={{ minHeight:'100vh',background:'var(--gradient-hero)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',width:400,height:400,top:-100,left:-100,borderRadius:'50%',background:'radial-gradient(circle,rgba(201,162,39,0.08),transparent 70%)',pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0,y:40 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }} style={{ width:'100%',maxWidth:'480px' }}>
        <div style={{ textAlign:'center',marginBottom:'2rem' }}>
          <Link to="/" style={{ display:'inline-flex',alignItems:'center',gap:'10px',marginBottom:'1.5rem' }}>
            <div style={{ width:42,height:42,borderRadius:'12px',background:'linear-gradient(135deg,#C9A227,#A07A10)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'1.2rem',color:'#0B1F3A',fontFamily:"'Outfit',sans-serif" }}>T</div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:'1.3rem',background:'linear-gradient(135deg,#C9A227,#E2B83A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>Smart Finance</span>
          </Link>
          <h2 style={{ fontSize:'1.8rem',marginBottom:'0.5rem' }}>Create Account</h2>
          <p style={{ color:'rgba(255,255,255,0.5)',fontSize:'0.9rem' }}>Join 500,000+ UAE customers</p>
        </div>

        <div className="glass-card" style={{ padding:'2rem' }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'10px',padding:'10px 14px',marginBottom:'1.2rem',fontSize:'0.85rem',color:'#EF4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:'1.1rem' }}>
            {[
              { id:'reg-name',    label:'Full Name',       key:'fullName',      icon:User,        type:'text',     placeholder:'Ahmed Al Mansouri' },
              { id:'reg-email',   label:'Email Address',   key:'email',         icon:Mail,        type:'email',    placeholder:'your@email.com' },
              { id:'reg-phone',   label:'Phone Number',    key:'phone',         icon:Phone,       type:'tel',      placeholder:'+971 50 000 0000' },
              { id:'reg-income',  label:'Monthly Income (AED)', key:'monthlyIncome', icon:DollarSign, type:'number', placeholder:'15000' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <div style={{ position:'relative' }}>
                  <f.icon size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)' }} />
                  <input id={f.id} type={f.type} className="form-input" style={{ paddingLeft:'42px' }}
                    placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)} required />
                </div>
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)' }} />
                <input id="reg-password" type={show ? 'text' : 'password'} className="form-input" style={{ paddingLeft:'42px',paddingRight:'42px' }}
                  placeholder="Min 8 characters" value={form.password}
                  onChange={e => set('password', e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShow(s => !s)}
                  style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.4)',background:'none',border:'none',cursor:'pointer' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button id="reg-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%',marginTop:'0.5rem' }}>
              {loading ? <span className="animate-spin" style={{ width:18,height:18,border:'2px solid #0B1F3A',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block' }} /> : 'Create Account →'}
            </button>
          </form>

          <div style={{ textAlign:'center',marginTop:'1.5rem',fontSize:'0.88rem',color:'rgba(255,255,255,0.45)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#C9A227',fontWeight:600 }}>Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
