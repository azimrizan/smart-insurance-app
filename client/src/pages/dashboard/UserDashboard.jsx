import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { TrendingUp, CreditCard, ShoppingBag, Banknote, Bell, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay }} className="stat-card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', fontWeight:500, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
          <h3 style={{ fontSize:'1.6rem', fontWeight:800, color, fontFamily:"'Outfit',sans-serif" }}>{value}</h3>
          {sub && <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>{sub}</p>}
        </div>
        <div style={{ width:44, height:44, borderRadius:'12px', background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', color }}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  )
}

export default function UserDashboard() {
  const { user } = useSelector(s => s.auth)
  const [loans, setLoans]   = useState([])
  const [cards, setCards]   = useState([])
  const [bnpl,  setBnpl]    = useState(null)
  const [notifCount, setNotifCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [lRes, cRes, bRes, nRes] = await Promise.all([
          api.get('/loans/my'), api.get('/cards/my'),
          api.get('/bnpl/my'), api.get('/notifications/my'),
        ])
        setLoans(lRes.data.loans || [])
        setCards(cRes.data.cards || [])
        setBnpl(bRes.data)
        setNotifCount(nRes.data.unread || 0)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const activeCard  = cards.find(c => c.status === 'active')
  const activeLoans = loans.filter(l => l.status === 'approved')
  const pendingLoans = loans.filter(l => l.status === 'pending')

  const statusIcon  = (s) => s === 'approved' ? <CheckCircle size={13} color="#10B981" /> : s === 'pending' ? <Clock size={13} color="#F59E0B" /> : <XCircle size={13} color="#EF4444" />
  const statusColor = (s) => s === 'approved' ? 'success' : s === 'pending' ? 'warning' : 'error'

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
          <h2 style={{ fontFamily:"'Outfit',sans-serif" }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span className="gradient-text">{user?.fullName?.split(' ')[0]} 👋</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.45)', marginTop:'4px', fontSize:'0.9rem' }}>
            Here's your financial overview for today.
          </p>
        </motion.div>
      </div>

      {/* KYC Banner */}
      {user?.kycStatus !== 'approved' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'14px', padding:'1rem 1.5rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'1.2rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight:600, fontSize:'0.9rem' }}>KYC Verification Required</div>
              <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.5)' }}>Complete KYC to unlock loans, BNPL and virtual cards.</div>
            </div>
          </div>
          <Link to="/dashboard/profile" className="btn btn-sm" style={{ background:'rgba(245,158,11,0.15)', color:'#F59E0B', border:'1px solid rgba(245,158,11,0.3)' }}>
            Complete KYC <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom:'2rem' }}>
        <StatCard icon={TrendingUp}  label="Credit Score"   value={user?.creditScore || '—'} sub="Updated today" color="#C9A227" delay={0.05} />
        <StatCard icon={Banknote}    label="Active Loans"   value={activeLoans.length}        sub={`${pendingLoans.length} pending`} color="#3B82F6" delay={0.1} />
        <StatCard icon={ShoppingBag} label="BNPL Available" value={bnpl ? `AED ${(bnpl.available||0).toLocaleString()}` : '—'} sub={`Limit: AED ${(bnpl?.limit||0).toLocaleString()}`} color="#10B981" delay={0.15} />
        <StatCard icon={Bell}        label="Notifications"  value={notifCount}                sub="Unread" color="#8B5CF6" delay={0.2} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* Virtual Card Preview */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h4>Virtual Card</h4>
            <Link to="/dashboard/card" style={{ fontSize:'0.8rem', color:'#C9A227', display:'flex', alignItems:'center', gap:'4px' }}>View <ArrowRight size={12} /></Link>
          </div>
          {activeCard ? (
            <div style={{
              background:'linear-gradient(135deg,#0B1F3A,#1a3563)', border:'1px solid rgba(201,162,39,0.3)',
              borderRadius:'16px', padding:'1.5rem', position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(201,162,39,0.08)' }} />
              <div style={{ position:'absolute', bottom:-30, left:-30, width:120, height:120, borderRadius:'50%', background:'rgba(59,130,246,0.05)' }} />
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '4px' }}>SMART FINANCE</div>
                <span className={`badge badge-${activeCard.status === 'active' ? 'success' : 'warning'}`}>{activeCard.status}</span>
              </div>
              <div style={{ fontFamily:'monospace', fontSize:'1rem', letterSpacing:'0.12em', color:'rgba(255,255,255,0.8)', marginBottom:'1.2rem' }}>
                {activeCard.cardNumber}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.35)', marginBottom:'2px' }}>CARD HOLDER</div>
                  <div style={{ fontSize:'0.78rem', fontWeight:600 }}>{activeCard.cardHolder}</div>
                </div>
                <div style={{ fontStyle:'italic', fontWeight:700, fontSize:'1.1rem', color:'#C9A227' }}>VISA</div>
              </div>
              <div style={{ marginTop:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', marginBottom:'6px' }}>
                  <span>Used: AED {activeCard.used?.toLocaleString()}</span>
                  <span>Limit: AED {activeCard.limit?.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${Math.min(100, ((activeCard.used||0)/(activeCard.limit||1))*100)}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding:'2rem', textAlign:'center' }}>
              <CreditCard size={32} style={{ color:'rgba(255,255,255,0.2)', margin:'0 auto 1rem' }} />
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.88rem', marginBottom:'1rem' }}>No virtual card yet</p>
              <Link to="/dashboard/card" className="btn btn-primary btn-sm">Generate Card</Link>
            </div>
          )}
        </motion.div>

        {/* Recent Loans */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h4>Loan Applications</h4>
            <Link to="/dashboard/loans" style={{ fontSize:'0.8rem', color:'#C9A227', display:'flex', alignItems:'center', gap:'4px' }}>View All <ArrowRight size={12} /></Link>
          </div>
          {loans.length ? (
            <div className="glass-card" style={{ overflow:'hidden' }}>
              {loans.slice(0,4).map((l, i) => (
                <div key={l.id} style={{ padding:'14px 16px', borderBottom: i < loans.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'0.88rem', fontWeight:600 }}>{l.purpose}</div>
                    <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', marginTop:'2px' }}>AED {l.amount?.toLocaleString()} · {l.tenure}m</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    {statusIcon(l.status)}
                    <span className={`badge badge-${statusColor(l.status)}`}>{l.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding:'2rem', textAlign:'center' }}>
              <Banknote size={32} style={{ color:'rgba(255,255,255,0.2)', margin:'0 auto 1rem' }} />
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.88rem', marginBottom:'1rem' }}>No loan applications yet</p>
              <Link to="/dashboard/loans" className="btn btn-primary btn-sm">Apply Now</Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* BNPL Section */}
      {bnpl && bnpl.limit > 0 && (
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }} style={{ marginTop:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h4>BNPL Overview</h4>
            <Link to="/dashboard/bnpl" style={{ fontSize:'0.8rem', color:'#C9A227', display:'flex', alignItems:'center', gap:'4px' }}>Manage <ArrowRight size={12} /></Link>
          </div>
          <div className="glass-card" style={{ padding:'1.5rem', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', alignItems:'center' }}>
            {[
              { label:'Total Limit',  value:`AED ${bnpl.limit?.toLocaleString()}`,     color:'#C9A227' },
              { label:'Used',         value:`AED ${bnpl.used?.toLocaleString()}`,       color:'#EF4444' },
              { label:'Available',    value:`AED ${bnpl.available?.toLocaleString()}`,  color:'#10B981' },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</div>
                <div style={{ fontSize:'1.3rem', fontWeight:800, color:s.color, fontFamily:"'Outfit',sans-serif" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
