import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { Banknote, Calculator, History, CheckCircle, Clock, XCircle, Info, ChevronRight } from 'lucide-react'

export default function LoanPage() {
  const { user } = useSelector(s => s.auth)
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Form State
  const [formData, setFormData] = useState({
    amount: 10000,
    tenure: 12,
    purpose: 'Personal Expenses'
  })

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    try {
      const res = await api.get('/loans/my')
      setLoans(res.data.loans || [])
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await api.post('/loans/apply', formData)
      setMessage({ type: 'success', text: 'Loan application submitted successfully!' })
      setLoans([res.data.application, ...loans])
      // Reset form
      setFormData({ amount: 10000, tenure: 12, purpose: 'Personal Expenses' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit application' })
    } finally {
      setSubmitting(false)
    }
  }

  // EMI Calculation Logic (matching backend)
  const annualRate = 5.5
  const calculateEMI = (p, m) => {
    const r = annualRate / 12 / 100
    if (r === 0) return Math.round(p / m)
    const emi = (p * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1)
    return Math.round(emi)
  }

  const currentEMI = calculateEMI(formData.amount, formData.tenure)
  const totalRepayment = currentEMI * formData.tenure

  const statusIcon = (s) => s === 'approved' ? <CheckCircle size={14} color="var(--success)" /> : s === 'pending' ? <Clock size={14} color="var(--warning)" /> : <XCircle size={14} color="var(--error)" />
  const statusBadge = (s) => <span className={`badge badge-${s === 'approved' ? 'success' : s === 'pending' ? 'warning' : 'error'}`}>{s}</span>

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>Personal Loans</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Fast, flexible financing solutions at your fingertips.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        {/* Loan Application Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                <Banknote size={20} />
              </div>
              <h4 style={{ margin: 0 }}>New Application</h4>
            </div>

            {user?.kycStatus !== 'approved' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <Info size={40} style={{ color: 'var(--warning)', marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
                  Verification required. Complete your KYC to unlock personal loans.
                </p>
                <button className="btn btn-primary btn-sm">Complete KYC Now</button>
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Loan Amount (AED)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '100%' }}
                      min="5000"
                      max="250000"
                      step="1000"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                      required
                    />
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                      Limit: AED 250,000
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="250000"
                    step="1000"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    style={{ marginTop: '10px', accentColor: 'var(--gold)', cursor: 'pointer' }}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tenure (Months)</label>
                    <select
                      className="form-select"
                      value={formData.tenure}
                      onChange={e => setFormData({ ...formData, tenure: Number(e.target.value) })}
                    >
                      {[6, 12, 18, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} Months</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Purpose of Loan</label>
                    <select
                      className="form-select"
                      value={formData.purpose}
                      onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                    >
                      <option>Personal Expenses</option>
                      <option>Home Renovation</option>
                      <option>Education</option>
                      <option>Medical</option>
                      <option>Debt Consolidation</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {message.text && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                  }}>
                    {message.text}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', marginTop: '0.5rem' }}>
                  {submitting ? 'Processing...' : 'Apply for Loan'}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Loan Summary & Calculator Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(201,162,39,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem', color: 'var(--gold)' }}>
              <Calculator size={18} />
              <h5 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem' }}>Summary</h5>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted" style={{ fontSize: '0.88rem' }}>Monthly EMI</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gold)' }}>AED {currentEMI.toLocaleString()}</span>
              </div>
              <div className="divider" style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Interest Rate</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{annualRate}% Fixed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Total Principal</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>AED {formData.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Total Repayment</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>AED {totalRepayment.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              *This calculation is an estimate. Final approval and rates depend on your credit score and financial documents.
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h5 style={{ margin: '0 0 1rem', fontSize: '0.9rem' }}>Eligibility Check</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'KYC Status', ok: user?.kycStatus === 'approved' },
                { label: 'Min. Income (AED 5,000)', ok: (user?.monthlyIncome || 0) >= 5000 },
                { label: 'Credit Score (> 600)', ok: (user?.creditScore || 0) > 600 },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  {item.ok ? <CheckCircle size={14} color="var(--success)" /> : <Clock size={14} color="var(--warning)" />}
                  <span style={{ color: item.ok ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* History Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
          <History size={18} />
          <h4 style={{ margin: 0 }}>Application History</h4>
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading applications...</div>
          ) : loans.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No loan applications found.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Purpose</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>EMI</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{l.id.slice(0, 8)}...</td>
                    <td style={{ fontWeight: 600 }}>{l.purpose}</td>
                    <td>AED {l.amount.toLocaleString()}</td>
                    <td>{l.tenure}m</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 600 }}>AED {l.monthlyEMI.toLocaleString()}</td>
                    <td>{statusBadge(l.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                    <td><ChevronRight size={16} className="text-muted" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
