import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { Banknote, CheckCircle, Clock, XCircle, Search, Filter, MoreHorizontal, User, Calendar, Info, Check, X, TrendingUp } from 'lucide-react'

export default function AdminLoans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [search, setSearch] = useState('')
  const [reviewing, setReviewing] = useState(null)
  const [reviewData, setReviewData] = useState({ status: 'approved', note: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    try {
      const res = await api.get('/loans')
      setLoans(res.data.loans || [])
    } finally { setLoading(false) }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put(`/loans/${reviewing.id}/review`, { 
        status: reviewData.status, 
        adminNote: reviewData.note 
      })
      await loadLoans()
      setReviewing(null)
      setReviewData({ status: 'approved', note: '' })
    } finally { setSubmitting(false) }
  }

  const filteredLoans = loans.filter(l => {
    const matchesFilter = filter === 'all' || l.status === filter
    const matchesSearch = l.userFullName?.toLowerCase().includes(search.toLowerCase()) || 
                          l.id.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statusBadge = (s) => (
    <span className={`badge badge-${s === 'approved' ? 'success' : s === 'pending' ? 'warning' : 'error'}`}>
      {s}
    </span>
  )

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>Loan Review Queue</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Evaluate and manage credit applications from users.</p>
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <div style={{ position:'relative' }}>
            <Search size={16} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
            <input 
              className="form-input" placeholder="Search user or ID..." 
              style={{ paddingLeft:'36px', width:'240px', fontSize:'0.85rem' }} 
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ fontSize:'0.85rem' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Fetching loan database...</div>
        ) : filteredLoans.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No loan applications found matching criteria.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Tenure</th>
                <th>Score</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(201,162,39,0.1)', color:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem' }}>
                        {l.userFullName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:600 }}>{l.userFullName}</div>
                        <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)' }}>{l.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize:'0.8rem', opacity:0.6 }}>{l.purpose}</span></td>
                  <td style={{ fontWeight:700 }}>AED {l.amount.toLocaleString()}</td>
                  <td>{l.tenure}m</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <TrendingUp size={14} color={l.creditScore > 700 ? 'var(--success)' : 'var(--warning)'} />
                      <span style={{ fontWeight:600 }}>{l.creditScore}</span>
                    </div>
                  </td>
                  <td>{statusBadge(l.status)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td>
                    {l.status === 'pending' ? (
                      <button className="btn btn-primary btn-sm" onClick={() => setReviewing(l)}>Review</button>
                    ) : (
                      <button className="btn btn-ghost btn-sm" style={{ opacity:0.5 }}><MoreHorizontal size={14} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewing && (
          <div className="modal-overlay">
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }} className="modal-content">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <div>
                  <h4 style={{ margin:0 }}>Review Loan Application</h4>
                  <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>ID: {reviewing.id}</p>
                </div>
                <button onClick={() => setReviewing(null)} className="text-muted"><X size={20} /></button>
              </div>

              <div style={{ background:'rgba(255,255,255,0.03)', padding:'1rem', borderRadius:'12px', marginBottom:'1.5rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>Applicant</div>
                    <div style={{ fontWeight:600 }}>{reviewing.userFullName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>Requested Amount</div>
                    <div style={{ fontWeight:600, color:'var(--gold)' }}>AED {reviewing.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>Purpose</div>
                    <div style={{ fontWeight:600 }}>{reviewing.purpose}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>Credit Score</div>
                    <div style={{ fontWeight:700, color:reviewing.creditScore > 700 ? '#10B981' : '#F59E0B' }}>{reviewing.creditScore}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleReview}>
                <div className="form-group" style={{ marginBottom:'1.5rem' }}>
                  <label className="form-label">Decision</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <button 
                      type="button" 
                      className={`btn ${reviewData.status === 'approved' ? 'btn-success' : 'btn-ghost'}`}
                      onClick={() => setReviewData({...reviewData, status: 'approved'})}
                      style={{ height:'auto', padding:'10px' }}
                    >
                      <Check size={18} /> Approve
                    </button>
                    <button 
                       type="button"
                       className={`btn ${reviewData.status === 'rejected' ? 'btn-danger' : 'btn-ghost'}`}
                       onClick={() => setReviewData({...reviewData, status: 'rejected'})}
                       style={{ height:'auto', padding:'10px' }}
                    >
                      <X size={18} /> Reject
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom:'1.5rem' }}>
                  <label className="form-label">Internal Note & Message to User</label>
                  <textarea 
                    className="form-input" 
                    rows={3} 
                    placeholder="Enter reason for approval or rejection..."
                    value={reviewData.note}
                    onChange={e => setReviewData({...reviewData, note: e.target.value})}
                    style={{ resize:'none', width:'100%' }}
                  />
                </div>

                <div style={{ display:'flex', gap:'1rem' }}>
                   <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={() => setReviewing(null)}>Cancel</button>
                   <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={submitting}>
                     {submitting ? 'Updating...' : 'Submit Decision'}
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
