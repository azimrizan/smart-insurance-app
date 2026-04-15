import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { Bell, Check, Trash2, Clock, Info, CheckCircle, AlertTriangle, XCircle, MailOpen } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications/my')
      setNotifications(res.data.notifications || [])
      setUnreadCount(res.data.unread || 0)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all read', err)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} color="var(--success)" />
      case 'warning': return <AlertTriangle size={18} color="var(--warning)" />
      case 'error':   return <XCircle size={18} color="var(--error)" />
      default:        return <Info size={18} color="var(--info)" />
    }
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>Notifications</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Stay updated with your account activity and announcements.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handleMarkAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '5rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', margin: '0 auto 1.5rem' }}>
            <Bell size={40} />
          </div>
          <h4 style={{ color: 'rgba(255,255,255,0.4)' }}>No Notifications Yet</h4>
          <p style={{ color: 'rgba(255,255,255,0.25)', maxWidth: '300px', margin: '0 auto' }}>
            We'll let you know when something important happens.
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card"
                style={{ 
                  padding: '1.2rem 1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(201,162,39,0.05)',
                  border: n.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(201,162,39,0.2)',
                  opacity: n.read ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.05)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{n.title}</div>
                    <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{n.message}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                      <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {!n.read && (
                    <button 
                      onClick={() => handleMarkAsRead(n.id)}
                      className="btn-ghost" 
                      style={{ padding: '8px', borderRadius: '8px', color: 'var(--gold)' }}
                      title="Mark as read"
                    >
                      <MailOpen size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  )
}
