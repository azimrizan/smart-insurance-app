import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { fetchMe } from '../../store/slices/authSlice'
import { User, Shield, Camera, FileText, CheckCircle, Clock, AlertCircle, Save, Smartphone, Briefcase, Mail } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const [kyc, setKyc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [submittingKyc, setSubmittingKyc] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    monthlyIncome: user?.monthlyIncome || 0,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users/kyc')
        setKyc(res.data.kyc)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setMessage({ type: '', text: '' })
    try {
      await api.put('/users/me', formData)
      dispatch(fetchMe())
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setUpdating(false)
    }
  }

  const handleKycSubmit = async () => {
    setSubmittingKyc(true)
    try {
      await api.post('/users/kyc', {
        emiratesIdFront: 'https://placehold.co/600x400/0B1F3A/C9A227?text=ID+Front',
        emiratesIdBack: 'https://placehold.co/600x400/0B1F3A/C9A227?text=ID+Back',
        selfie: 'https://placehold.co/400x400/0B1F3A/C9A227?text=Selfie',
      })
      const res = await api.get('/users/kyc')
      setKyc(res.data.kyc)
      dispatch(fetchMe())
    } catch (err) {
      alert(err.response?.data?.message || 'KYC submission failed')
    } finally {
      setSubmittingKyc(false)
    }
  }

  const kycStatusBadge = (s) => (
    <span className={`badge badge-${s === 'approved' ? 'success' : s === 'pending' ? 'warning' : 'error'}`} style={{ marginLeft: '10px' }}>
      {s || 'Not Started'}
    </span>
  )

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>Your Profile</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Manage your personal information and verification status.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: 90, height: 90, borderRadius: '50%',
                background: 'linear-gradient(135deg,#C9A227,#A07A10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '2.5rem', color: '#0B1F3A', margin: '0 auto 1.2rem',
                border: '4px solid rgba(255,255,255,0.05)',
                fontFamily: "'Outfit',sans-serif"
              }}>
                {user?.fullName?.[0]}
              </div>
              <h4 style={{ marginBottom: '4px' }}>{user?.fullName}</h4>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Mail size={14} /> {user?.email}
              </div>
              <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center' }}>
                <Shield size={16} color="var(--gold)" />
                <span style={{ fontSize: '0.8rem', marginLeft: '6px', color: 'rgba(255,255,255,0.7)' }}>Account Verification:</span>
                {kycStatusBadge(user?.kycStatus)}
              </div>
            </div>

            <div className="divider" style={{ margin: '2rem 0' }} />

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(255,255,255,0.3)' }} />
                  <input 
                    className="form-input" style={{ paddingLeft: '42px', width: '100%' }}
                    value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(255,255,255,0.3)' }} />
                  <input 
                    className="form-input" style={{ paddingLeft: '42px', width: '100%' }}
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Income (AED)</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(255,255,255,0.3)' }} />
                  <input 
                    type="number" className="form-input" style={{ paddingLeft: '42px', width: '100%' }}
                    value={formData.monthlyIncome} onChange={e => setFormData({...formData, monthlyIncome: e.target.value})}
                  />
                </div>
              </div>

              {message.text && (
                <div style={{ 
                  padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', 
                  background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                  border: `1px solid ${message.type==='success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                }}>
                  {message.text}
                </div>
              )}

              <button className="btn btn-primary" type="submit" disabled={updating} style={{ width: '100%', marginTop: '0.5rem' }}>
                <Save size={18} /> {updating ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* KYC Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
                  <Shield size={20} />
                </div>
                <h4 style={{ margin: 0 }}>KYC Compliance</h4>
              </div>
              {kyc ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  {kyc.status === 'approved' ? <CheckCircle size={16} color="var(--success)" /> : <Clock size={16} color="var(--warning)" />}
                  <span style={{ fontWeight: 600 }}>{kyc.status.toUpperCase()}</span>
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>NOT SUBMITTED</span>
              )}
            </div>

            {!kyc ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <AlertCircle size={48} style={{ color: 'var(--warning)', opacity: 0.3, marginBottom: '1.5rem' }} />
                <h3>Verify Your Identity</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '440px', margin: '1rem auto 2.5rem', lineHeight: 1.7 }}>
                  To unlock high-limit loans, BNPL, and premium virtual cards, we need to verify your identity. This is a one-time process mandated by UAE Central Bank regulations.
                </p>

                <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
                  {[
                    { icon: Camera, label: 'Emirates ID Front', sub: 'Clear photo required' },
                    { icon: Camera, label: 'Emirates ID Back', sub: 'Clear photo required' },
                    { icon: Camera, label: 'Live Selfie', sub: 'Faces only' },
                    { icon: FileText, label: 'Utility Bill', sub: 'Proof of address' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '14px', textAlign: 'left' }}>
                      <item.icon size={20} className="text-muted" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{item.sub}</div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary btn-lg" onClick={handleKycSubmit} disabled={submittingKyc}>
                  {submittingKyc ? 'Submitting Documents...' : 'Start Verification Process'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ 
                  background: kyc.status === 'approved' ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)', 
                  border: `1px solid ${kyc.status === 'approved' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ marginTop: '3px' }}>
                      {kyc.status === 'approved' ? <CheckCircle size={22} color="var(--success)" /> : <Clock size={22} color="var(--warning)" />}
                    </div>
                    <div>
                      <h5 style={{ marginBottom: '6px' }}>
                        {kyc.status === 'approved' ? 'Verification Complete' : 'Application Under Review'}
                      </h5>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                        {kyc.status === 'approved' 
                          ? 'Your identity has been verified. You now have full access to all Smart Finance premium features.'
                          : 'Our compliance team is currently reviewing your documents. This usually takes 12-24 hours.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <h5 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Submitted Documents</h5>
                <div className="grid-3" style={{ gap: '1rem' }}>
                   {[
                     { label: 'ID Front', img: kyc.emiratesIdFront },
                     { label: 'ID Back', img: kyc.emiratesIdBack },
                     { label: 'Selfie', img: kyc.selfie },
                   ].map((d, i) => (
                     <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', border: '1px solid rgba(255,255,255,0.1)' }}>
                       <img src={d.img} alt={d.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(7,15,30,0.8)', fontSize: '0.6rem', textAlign: 'center' }}>
                         {d.label}
                       </div>
                     </div>
                   ))}
                </div>

                {kyc.adminNote && (
                  <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--gold)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '4px', textTransform: 'uppercase' }}>Message from Compliance</div>
                    <div style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>"{kyc.adminNote}"</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
