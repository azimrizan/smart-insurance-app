import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { Users, Search, MoreVertical, Shield, UserCheck, UserX, TrendingUp, Mail, Phone, Calendar, Filter } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all, admin, user

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data.users || [])
    } finally { setLoading(false) }
  }

  const handleToggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      await api.put(`/users/${userId}/role`, { role: newRole })
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      alert('Failed to update role')
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || u.role === filter
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>User Management</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>View and manage all registered customers and administrators.</p>
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <div style={{ position:'relative' }}>
            <Search size={16} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
            <input 
              className="form-input" placeholder="Search users..." 
              style={{ paddingLeft:'36px', width:'240px', fontSize:'0.85rem' }} 
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ fontSize:'0.85rem' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Every Role</option>
            <option value="user">Customers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading user directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No users found matching your search.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Role</th>
                <th>Contact</th>
                <th>KYC Status</th>
                <th>Credit Score</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ 
                        width:38, height:38, borderRadius:'50%', 
                        background:'linear-gradient(135deg,#C9A227,#A07A10)',
                        color:'#0B1F3A', display:'flex', alignItems:'center', justifyContent:'center', 
                        fontWeight:700, fontSize:'0.9rem'
                      }}>
                        {u.fullName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:600 }}>{u.fullName}</div>
                        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>UID: {u.id.slice(0,8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize:'0.7rem', fontWeight:800, textTransform:'uppercase',
                      color: u.role === 'admin' ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                      letterSpacing:'0.05em'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                      <div style={{ fontSize:'0.82rem', display:'flex', alignItems:'center', gap:'6px' }}><Mail size={12} className="text-muted"/> {u.email}</div>
                      <div style={{ fontSize:'0.82rem', display:'flex', alignItems:'center', gap:'6px' }}><Phone size={12} className="text-muted"/> {u.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${u.kycStatus === 'approved' ? 'success' : u.kycStatus === 'pending' ? 'warning' : 'error'}`}>
                      {u.kycStatus || 'None'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div className="progress-bar" style={{ width:'60px', height:'4px' }}>
                        <div className="progress-fill" style={{ width:`${(u.creditScore/850)*100}%` }} />
                      </div>
                      <span style={{ fontWeight:700, fontSize:'0.85rem' }}>{u.creditScore || '—'}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.3)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ padding:'6px' }}
                        title={u.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                        onClick={() => handleToggleRole(u.id, u.role)}
                      >
                        <Shield size={16} color={u.role === 'admin' ? 'var(--gold)' : 'rgba(255,255,255,0.3)'} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding:'6px' }}>
                        <MoreVertical size={16} className="text-muted" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
