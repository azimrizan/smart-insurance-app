import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { Users, FileCheck, Banknote, TrendingUp, ArrowRight, Shield, Activity, BarChart3, AlertCircle } from 'lucide-react'

function AdminStatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay }} className="stat-card">
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', fontWeight:600, letterSpacing:'0.05em', marginBottom:'4px' }}>{label}</p>
          <h3 style={{ fontSize:'1.8rem', fontWeight:800, color, fontFamily:"'Outfit',sans-serif" }}>{value}</h3>
          {sub && <p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.3)', marginTop:'4px' }}>{sub}</p>}
        </div>
        <div style={{ width:48, height:48, borderRadius:'12px', background:`${color}15`, border:`1px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', color }}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data.stats)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>Admin Overview</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Real-time platform performance and management metrics.</p>
        </div>
        <div className="badge badge-neutral" style={{ padding: '6px 14px' }}>
          <Activity size={14} style={{ marginRight:'6px' }} /> System Status: Online
        </div>
      </div>

      {loading ? (
        <div style={{ padding:'4rem', textAlign:'center', color:'rgba(255,255,255,0.3)' }}>Generating management report...</div>
      ) : (
        <>
          <div className="grid-4" style={{ marginBottom:'2.5rem' }}>
            <AdminStatCard icon={Users}     label="Total users"     value={stats.totalUsers}         sub="Unique customers" color="#3B82F6" delay={0.1} />
            <AdminStatCard icon={Banknote}  label="Total Disbursed" value={`AED ${stats.totalLoanDisbursed.toLocaleString()}`} sub={`${stats.approvedLoans} loans`} color="#C9A227" delay={0.2} />
            <AdminStatCard icon={TrendingUp} label="Avg Credit Score" value={stats.avgCreditScore}    sub="Platform average" color="#10B981" delay={0.3} />
            <AdminStatCard icon={Shield}    label="Virtual Cards"    value={stats.totalCards}        sub="Active & Frozen"   color="#8B5CF6" delay={0.4} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
            {/* Quick Actions / Critical Queues */}
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }}>
              <div className="glass-card" style={{ padding:'2rem' }}>
                <h4 style={{ marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'8px' }}><AlertCircle size={20} color="var(--warning)" /> Review Required</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  <Link to="/admin/loans" className="admin-queue-item" style={{ 
                    display:'flex', justifyContent:'space-between', alignItems:'center', 
                    padding:'1.2rem', background:'rgba(255,255,255,0.04)', borderRadius:'12px',
                    border:'1px solid rgba(255,255,255,0.06)', transition:'all 0.2s'
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:38, height:38, borderRadius:'10px', background:'rgba(245,158,11,0.1)', color:'var(--warning)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Banknote size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight:700 }}>Loan Applications</div>
                        <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>{stats.pendingLoans} waiting for review</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-muted" />
                  </Link>

                  <Link to="/admin/kyc" className="admin-queue-item" style={{ 
                    display:'flex', justifyContent:'space-between', alignItems:'center', 
                    padding:'1.2rem', background:'rgba(255,255,255,0.04)', borderRadius:'12px',
                    border:'1px solid rgba(255,255,255,0.06)', transition:'all 0.2s'
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:38, height:38, borderRadius:'10px', background:'rgba(59,130,246,0.1)', color:'var(--info)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <FileCheck size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight:700 }}>KYC Verification</div>
                        <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>{stats.pendingKyc} documents pending</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-muted" />
                  </Link>

                  <Link to="/admin/users" className="admin-queue-item" style={{ 
                    display:'flex', justifyContent:'space-between', alignItems:'center', 
                    padding:'1.2rem', background:'rgba(255,255,255,0.04)', borderRadius:'12px',
                    border:'1px solid rgba(255,255,255,0.06)', transition:'all 0.2s'
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:38, height:38, borderRadius:'10px', background:'rgba(201,162,39,0.1)', color:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Users size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight:700 }}>User Management</div>
                        <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>Manage {stats.totalUsers} registered customers</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-muted" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Performance Chart Placeholder */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.6 }}>
              <div className="glass-card" style={{ padding:'2rem', height:'100%', display:'flex', flexDirection:'column' }}>
                <h4 style={{ marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'8px' }}><BarChart3 size={20} /> Disbursement Trends</h4>
                <div style={{ flex:1, display:'flex', alignItems:'flex-end', gap:'10px', padding:'1rem 0' }}>
                  {[40, 60, 45, 90, 75, 55, 100].map((h, i) => (
                    <motion.div 
                      key={i} initial={{ height:0 }} animate={{ height:`${h}%` }} transition={{ delay:0.7 + (i * 0.1) }}
                      style={{ flex:1, background:'var(--gradient-gold)', borderRadius:'6px 6px 2px 2px', opacity:0.6 + (h/200) }} 
                    />
                  ))}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'rgba(255,255,255,0.3)', marginTop:'1rem' }}>
                  <span>OCT</span><span>NOV</span><span>DEC</span><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
