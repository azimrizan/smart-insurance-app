import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { FileCheck, Shield, CheckCircle, Clock, XCircle, Search, Eye, Check, X, User, Mail, Calendar } from 'lucide-react'

export default function AdminKyc() {
  const [kycs, setKycs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [reviewing, setReviewing] = useState(null)
  const [reviewData, setReviewData] = useState({ status: 'approved', note: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadKycs()
  }, [])

  const loadKycs = async () => {
    try {
      const res = await api.get('/admin/kyc-pending')
      setKycs(res.data.kycs || [])
    } finally { setLoading(false) }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put(`/users/${reviewing.userId}/kyc`, { 
        status: reviewData.status, 
        note: reviewData.note 
      })
      await loadKycs()
      setReviewing(null)
      setReviewData({ status: 'approved', note: '' })
    } finally { setSubmitting(false) }
  }

  const filteredKycs = kycs.filter(k => 
    k.userFullName?.toLowerCase().includes(search.toLowerCase()) || 
    k.userEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>KYC Verification</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Review identity documents and verify user profiles.</p>
        </div>
        <div style={{ position:'relative' }}>
          <Search size={16} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
          <input 
            className="form-input" placeholder="Search applicant..." 
            style={{ paddingLeft:'36px', width:'280px', fontSize:'0.85rem' }} 
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading pending verifications...</div>
        ) : filteredKycs.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No pending KYC reviews found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Documents</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredKycs.map(k => (
                <tr key={k.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:36, height:36, borderRadius:'10px', background:'rgba(59,130,246,0.1)', color:'var(--info)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                        {k.userFullName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:600 }}>{k.userFullName}</div>
                        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>{k.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-warning" style={{ gap:'4px' }}><Clock size={12} /> {k.status}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(k.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'4px' }}>
                      {[1,2,3].map(i => <div key={i} style={{ width:24, height:24, borderRadius:'4px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.1)' }} />)}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => setReviewing(k)}>Review Docs</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* KYC Review Modal */}
      <AnimatePresence>
        {reviewing && (
          <div className="modal-overlay">
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }} className="modal-content" style={{ maxWidth:'700px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <div>
                  <h4 style={{ margin:0 }}>KYC Document Review</h4>
                  <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>Applicant: {reviewing.userFullName}</p>
                </div>
                <button onClick={() => setReviewing(null)} className="text-muted"><X size={20} /></button>
              </div>

              {/* Document Previews */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem', marginBottom:'2rem' }}>
                {[
                  { label: 'ID Front', img: reviewing.emiratesIdFront },
                  { label: 'ID Back', img: reviewing.emiratesIdBack },
                  { label: 'Selfie', img: reviewing.selfie },
                ].map((doc, i) => (
                  <div key={i}>
                    <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginBottom:'6px', textTransform:'uppercase', fontWeight:600 }}>{doc.label}</div>
                    <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', aspectRatio:'4/3' }}>
                      <img src={doc.img} alt={doc.label} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <form onSubmit={handleReview}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Verification Decision</label>
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                      <button 
                         type="button"
                         className={`btn ${reviewData.status === 'approved' ? 'btn-success' : 'btn-ghost'}`}
                         onClick={() => setReviewData({...reviewData, status: 'approved'})}
                         style={{ justifyContent:'flex-start' }}
                      >
                        <Check size={18} /> Approve KYC
                      </button>
                      <button 
                         type="button"
                         className={`btn ${reviewData.status === 'rejected' ? 'btn-danger' : 'btn-ghost'}`}
                         onClick={() => setReviewData({...reviewData, status: 'rejected'})}
                         style={{ justifyContent:'flex-start' }}
                      >
                        <X size={18} /> Reject KYC
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes for User</label>
                    <textarea 
                      className="form-input" 
                      rows={5} 
                      placeholder="Feedback or reason for decision..."
                      value={reviewData.note}
                      onChange={e => setReviewData({...reviewData, note: e.target.value})}
                      style={{ resize:'none', width:'100%' }}
                    />
                  </div>
                </div>

                <div style={{ display:'flex', gap:'1rem', marginTop:'2rem' }}>
                   <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={() => setReviewing(null)}>Cancel</button>
                   <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={submitting}>
                     {submitting ? 'Updating Status...' : 'Submit Verification'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
