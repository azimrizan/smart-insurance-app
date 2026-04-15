import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { CreditCard, Shield, Lock, Unlock, Eye, EyeOff, RefreshCcw, History, ArrowDownLeft, ArrowUpRight, Plus, ExternalLink } from 'lucide-react'

export default function VirtualCardPage() {
  const [cards, setCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [fullCard, setFullCard] = useState(null)
  const [toggling, setToggling] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const res = await api.get('/cards/my')
      setCards(res.data.cards || [])
      if (res.data.cards?.length > 0 && !selectedCard) {
        setSelectedCard(res.data.cards[0])
        loadTransactions(res.data.cards[0].id)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async (cardId) => {
    try {
      const res = await api.get(`/cards/${cardId}/transactions`)
      setTransactions(res.data.transactions || [])
    } catch (err) {
      console.error('Failed to load transactions', err)
    }
  }

  const handleToggleFreeze = async () => {
    if (!selectedCard || toggling) return
    setToggling(true)
    try {
      const res = await api.put(`/cards/${selectedCard.id}/toggle`)
      const updated = res.data.card
      setCards(cards.map(c => c.id === updated.id ? { ...c, status: updated.status } : c))
      setSelectedCard({ ...selectedCard, status: updated.status })
    } finally {
      setToggling(false)
    }
  }

  const handleViewDetails = async () => {
    if (showDetails) {
      setShowDetails(false)
      return
    }
    if (fullCard?.id === selectedCard.id) {
      setShowDetails(true)
      return
    }
    try {
      const res = await api.get(`/cards/${selectedCard.id}/details`)
      setFullCard(res.data.card)
      setShowDetails(true)
    } catch (err) {
      console.error('Failed to fetch card details', err)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await api.post('/cards/generate')
      const newCard = res.data.card
      setCards([newCard, ...cards])
      setSelectedCard(newCard)
      setTransactions([])
    } catch (err) {
      alert(err.response?.data?.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>Virtual Credit Cards</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Secure, instant cards for all your online spending.</p>
        </div>
        {!loading && cards.length === 0 && (
          <button className="btn btn-primary btn-sm" onClick={handleGenerate} disabled={generating}>
            <Plus size={16} /> {generating ? 'Generating...' : 'New Virtual Card'}
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading your cards...</div>
      ) : cards.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', margin: '0 auto 1.5rem' }}>
            <CreditCard size={40} />
          </div>
          <h3>No Virtual Card Found</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '400px', margin: '1rem auto 2rem' }}>
            Generate your first virtual Visa card instantly and start shopping securely across UAE and globally.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Processing Application...' : 'Apply for Virtual Card'}
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.2fr) 0.8fr', gap: '2.5rem' }}>
          {/* Card Visual & Controls */}
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div 
                className={`animate-float`}
                style={{
                  background: 'linear-gradient(135deg, #0B1F3A, #1a3563)',
                  border: '1px solid rgba(201,162,39,0.3)',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  aspectRatio: '1.58/1',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  opacity: selectedCard.status === 'frozen' ? 0.6 : 1,
                  filter: selectedCard.status === 'frozen' ? 'grayscale(0.5)' : 'none',
                  transition: 'all 0.4s ease'
                }}
              >
                {/* Decorative chips */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(201,162,39,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(59,130,246,0.06)' }} />
                
                {/* Card Brand */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '4px' }}>SMART FINANCE</div>
                    <div className="badge badge-info" style={{ fontSize: '0.6rem' }}>PREMIUM VIRTUAL</div>
                  </div>
                  <div style={{ display: 'flex', gap: '-6px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,162,39,0.8)', marginRight: '-10px' }} />
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,162,39,0.5)' }} />
                  </div>
                </div>

                {/* Card Number */}
                <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1, cursor: 'pointer' }} onClick={handleViewDetails}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: '1.6rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.95)' }}>
                      {showDetails && fullCard ? fullCard.cardNumber : selectedCard.cardNumber}
                    </div>
                    {showDetails ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                  </div>
                </div>

                {/* Card Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase' }}>Card Holder</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em' }}>{selectedCard.cardHolder}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase' }}>Expires</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{selectedCard.expiryDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase' }}>CVV</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{showDetails && fullCard ? fullCard.cvv : '***'}</div>
                    </div>
                  </div>
                  <div style={{ fontStyle: 'italic', fontWeight: 800, fontSize: '1.4rem', color: '#C9A227', fontFamily: "'Outfit', sans-serif" }}>VISA</div>
                </div>

                {/* Frozen Overlay */}
                <AnimatePresence>
                  {selectedCard.status === 'frozen' && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', inset: 0, background: 'rgba(7,15,30,0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <Lock size={40} style={{ color: 'var(--warning)', marginBottom: '10px' }} />
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Frozen</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="grid-3" style={{ marginTop: '2rem' }}>
              <button className={`btn btn-ghost`} style={{ padding: '1rem', height: 'auto', flexDirection: 'column', gap: '8px' }} onClick={handleViewDetails}>
                <div style={{ color: 'var(--gold)' }}>{showDetails ? <EyeOff size={20} /> : <Eye size={20} />}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{showDetails ? 'Hide Details' : 'View Details'}</span>
              </button>
              <button 
                className={`btn btn-ghost`} 
                style={{ padding: '1rem', height: 'auto', flexDirection: 'column', gap: '8px', color: selectedCard.status === 'active' ? 'var(--warning)' : 'var(--success)' }} 
                onClick={handleToggleFreeze}
                disabled={toggling}
              >
                <div style={{ transition: 'all 0.3s' }}>{selectedCard.status === 'active' ? <Lock size={20} /> : <Unlock size={20} />}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{toggling ? '...' : selectedCard.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}</span>
              </button>
              <button className={`btn btn-ghost`} style={{ padding: '1rem', height: 'auto', flexDirection: 'column', gap: '8px' }}>
                <div style={{ color: 'var(--info)' }}><RefreshCcw size={20} /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Replace Card</span>
              </button>
            </div>

            <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <Shield size={18} color="var(--success)" />
                <h5 style={{ margin: 0 }}>Smart Limits</h5>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                  <span className="text-muted">Used: AED {selectedCard.used.toLocaleString()}</span>
                  <span className="text-muted">Limit: AED {selectedCard.limit.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(selectedCard.used / selectedCard.limit) * 100}%` }} />
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Your virtual card is linked to your credit profile. Transaction limits reset every billing cycle.
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} />
                <h4 style={{ margin: 0 }}>Recent Transactions</h4>
              </div>
              <button style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Report <ExternalLink size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>No transactions recorded for this card.</p>
                </div>
              ) : (
                transactions.map((t, i) => (
                  <motion.div 
                    key={t.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: '10px', 
                        background: t.type === 'debit' ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: t.type === 'debit' ? 'white' : 'var(--success)'
                      }}>
                        {t.type === 'debit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{t.merchant}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{t.category} · {new Date(t.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: t.type === 'debit' ? 'white' : 'var(--success)' }}>
                        {t.type === 'debit' ? '-' : '+'} AED {t.amount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{t.status}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {transactions.length > 0 && (
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: '1rem', fontSize: '0.8rem' }}>
                Load More History
              </button>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
