import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { ShoppingBag, CreditCard, Calendar, ArrowRight, ShieldCheck, Info } from 'lucide-react'

export default function BnplPage() {
  const [data, setData] = useState({ limit: 0, used: 0, available: 0, transactions: [] })
  const [loading, setLoading] = useState(true)
  const [repaying, setRepaying] = useState(null)

  useEffect(() => {
    loadBnpl()
  }, [])

  const loadBnpl = async () => {
    try {
      const res = await api.get('/bnpl/my')
      setData(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleRepay = async (purchaseId, amount) => {
    setRepaying(purchaseId)
    try {
      await api.post('/bnpl/repay', { purchaseId, amount })
      await loadBnpl()
    } catch (err) {
      console.error('Repayment failed', err)
    } finally {
      setRepaying(null)
    }
  }

  const usedPercentage = Math.min(100, (data.used / (data.limit || 1)) * 100)

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>Buy Now Pay Later</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Interest-free shopping. Split your purchases into easy instalments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Credit Limit Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card" style={{ padding: '2rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, borderRadius: '50%', background: 'rgba(59,130,246,0.05)' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Available Credit</span>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '5px', color: 'var(--success)' }}>
                  AED {data.available.toLocaleString()}
                </h3>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                <ShieldCheck size={24} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span className="text-muted">Used: AED {data.used.toLocaleString()}</span>
                <span className="text-muted">Total Limit: AED {data.limit.toLocaleString()}</span>
              </div>
              <div className="progress-bar" style={{ height: '10px' }}>
                <div className="progress-fill" style={{ width: `${usedPercentage}%`, background: 'var(--gradient-gold)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Active Purchases</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{data.transactions.filter(t => t.status === 'active').length}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Next Repayment</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  AED {data.transactions.filter(t => t.status === 'active').reduce((acc, curr) => acc + curr.installmentAmount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card" style={{ padding: '2rem', height: '100%' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>Why use BNPL?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { icon: ShoppingBag, title: 'Shop Now', desc: 'Use your credit limit at any partner merchant instantly.' },
                { icon: Calendar, title: 'Zero Interest', desc: 'Pay in 3 or 6 equal instalments with 0% interest fees.' },
                { icon: CreditCard, title: 'Easy Repay', desc: 'Automated repayments from your linked bank account.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(201,162,39,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={16} color="var(--gold)" />
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>Your BNPL limit increases as you shop and repay on time.</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BNPL Purchases */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '2.5rem' }}>
        <h4 style={{ marginBottom: '1.2rem' }}>Purchase History</h4>
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading BNPL data...</div>
          ) : data.transactions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <ShoppingBag size={40} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '1rem' }} />
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>No purchases yet. Start shopping to use BNPL!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Instalments</th>
                  <th>Per Month</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.merchant}</td>
                    <td>AED {t.amount.toLocaleString()}</td>
                    <td>{t.installments} Months</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 600 }}>AED {t.installmentAmount.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${t.status === 'active' ? 'warning' : 'success'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>
                      {t.status === 'active' && (
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{ padding: '6px 12px' }}
                          disabled={repaying === t.id}
                          onClick={() => handleRepay(t.id, t.installmentAmount)}
                        >
                          {repaying === t.id ? '...' : `Pay AED ${t.installmentAmount}`}
                        </button>
                      )}
                    </td>
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
