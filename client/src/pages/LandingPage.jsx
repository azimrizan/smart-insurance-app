import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import Navbar from '../components/Navbar'
import {
  ShieldCheck, Zap, Globe, TrendingUp, CreditCard,
  ShoppingBag, Banknote, Star, ChevronRight, ArrowRight
} from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.15 } } }

function Section({ id, children, style }) {
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section id={id} ref={ref} variants={stagger}
      initial="hidden" animate={inView ? 'show' : 'hidden'}
      className="section" style={style}>
      {children}
    </motion.section>
  )
}

const products = [
  {
    icon: Banknote, title: 'Personal Loans',
    desc: 'Instant approval up to AED 250,000 with competitive rates starting at 4.9% p.a.',
    features: ['Same-day disbursement', 'Flexible tenures 6–60 months', 'No hidden fees'],
    color: '#C9A227', href: '/register',
  },
  {
    icon: ShoppingBag, title: 'Buy Now Pay Later',
    desc: 'Shop at thousands of merchants and split your purchase into easy instalments.',
    features: ['Zero interest for 3 months', 'Instant credit limit', '1000+ partner merchants'],
    color: '#3B82F6', href: '/register',
  },
  {
    icon: CreditCard, title: 'Virtual Credit Card',
    desc: 'Generate a secure Visa virtual card instantly linked to your credit line.',
    features: ['Instant generation', 'Freeze/unfreeze anytime', 'Real-time alerts'],
    color: '#10B981', href: '/register',
  },
]

const stats = [
  { value: '500K+', label: 'Happy Customers' },
  { value: 'AED 2B+', label: 'Loans Disbursed' },
  { value: '4.9★', label: 'App Store Rating' },
  { value: '< 24h', label: 'Approval Time' },
]

const features = [
  { icon: ShieldCheck, title: 'Bank-Grade Security', desc: '256-bit SSL encryption and multi-factor authentication protect every transaction.' },
  { icon: Zap,         title: 'Instant Processing',  desc: 'AI-powered credit scoring delivers decisions in minutes, not days.' },
  { icon: Globe,       title: 'UAE Nationwide',       desc: 'Available across all seven emirates with local compliance and support.' },
  { icon: TrendingUp,  title: 'Smart Credit',         desc: 'Your credit score improves with every on-time repayment.' },
]

const testimonials = [
  { name: 'Khalid Al Rashid', role: 'Business Owner, Dubai', text: 'Smart finance made getting a business loan incredibly easy. Approved in under 4 hours!', rating: 5 },
  { name: 'Fatima Hassan',    role: 'Teacher, Abu Dhabi',    text: 'The BNPL feature changed how I shop. No more waiting to buy what I need.', rating: 5 },
  { name: 'Omar Siddiqui',    role: 'Engineer, Sharjah',     text: 'The virtual card is perfect for safe online shopping. Freeze it with one tap.', rating: 5 },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--navy-dark)' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden',
        paddingTop: '72px',
      }}>
        {/* Decorative blobs */}
        {[
          { w: 500, h: 500, x: -150, y: -150, color: 'rgba(201,162,39,0.08)' },
          { w: 400, h: 400, x: '60%', y: '10%', color: 'rgba(59,130,246,0.06)' },
          { w: 300, h: 300, x: '20%', y: '60%', color: 'rgba(16,185,129,0.05)' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: b.w, height: b.h,
            left: b.x, top: b.y, borderRadius: '50%',
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)',
                padding: '6px 16px', borderRadius: '999px', marginBottom: '1.5rem',
                fontSize: '0.82rem', fontWeight: 600, color: '#C9A227', letterSpacing: '0.05em',
              }}>
              <Zap size={12} fill="#C9A227" /> UAE's #1 SMART FINANCE APP
            </motion.div>

            <h1 style={{ lineHeight: 1.1, marginBottom: '1.5rem' }}>
              <span>Smart Finance</span><br />
              <span className="gradient-text">For Modern UAE</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.65)', marginBottom: '2.5rem', maxWidth: '480px', lineHeight: 1.7 }}>
              Get instant loans, shop now pay later, and manage a virtual credit card — all in one premium platform trusted by 500,000+ customers.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg">
                Sign In <ChevronRight size={18} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {['No hidden fees', 'Instant approval', 'Secure & regulated'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>
                  <ShieldCheck size={14} color="#10B981" /> {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="animate-float" style={{ position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(145deg,rgba(201,162,39,0.15),rgba(59,130,246,0.1))',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)',
            }}>
              {/* Mock credit card */}
              <div style={{
                background: 'linear-gradient(135deg,#0B1F3A,#1a3563)',
                border: '1px solid rgba(201,162,39,0.3)',
                borderRadius: '16px', padding: '1.5rem 2rem',
                marginBottom: '1.5rem', position: 'relative', overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,162,39,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', fontWeight: 600 }}>SMART FINANCE</span>
                  <div style={{ display: 'flex', gap: '-6px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(201,162,39,0.8)', marginRight: '-8px' }} />
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(201,162,39,0.5)' }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.85)', marginBottom: '1.2rem' }}>
                  4532 7891 2345 6789
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>CARD HOLDER</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>AHMED AL MANSOURI</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>EXPIRES</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>12/27</div>
                  </div>
                  <div style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '1.2rem', color: '#C9A227', fontFamily: "'Outfit', sans-serif" }}>VISA</div>
                </div>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Credit Score', value: '720', color: '#10B981' },
                  { label: 'BNPL Limit', value: 'AED 30K', color: '#C9A227' },
                  { label: 'Loan Approved', value: 'AED 50K', color: '#3B82F6' },
                  { label: 'Savings Rate', value: '4.5%', color: '#8B5CF6' },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: 'rgba(201,162,39,0.08)', borderTop: '1px solid rgba(201,162,39,0.2)', borderBottom: '1px solid rgba(201,162,39,0.2)', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#C9A227' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <Section id="loans">
        <div className="container">
          <motion.div variants={fadeUp} className="section-header">
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#C9A227', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Products</span>
            <h2 style={{ marginTop: '8px' }}>Financial Solutions Built For You</h2>
            <p>Choose from our suite of premium financial products designed for the modern UAE lifestyle.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem' }}>
            {products.map((p, i) => (
              <motion.div key={p.title} variants={fadeUp} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="glass-card" style={{
                  padding: '2rem', height: '100%', transition: 'transform 0.3s,box-shadow 0.3s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3)` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: '14px',
                    background: `${p.color}20`, border: `1px solid ${p.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: p.color, marginBottom: '1.2rem',
                  }}>
                    <p.icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{p.desc}</p>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                  <Link to={p.href} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginTop: '1.5rem', color: p.color, fontSize: '0.88rem', fontWeight: 600,
                    transition: 'gap 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                    onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                  >Apply Now <ArrowRight size={14} /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section style={{ background: 'rgba(11,31,58,0.5)' }}>
        <div className="container">
          <motion.div variants={fadeUp} className="section-header">
            <h2>Why Choose Smart Finance?</h2>
            <p>We combine cutting-edge technology with deep financial expertise to deliver world-class services.</p>
          </motion.div>
          <div className="grid-4">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '16px',
                  background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#C9A227', margin: '0 auto 1rem',
                }}>
                  <f.icon size={26} />
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section>
        <div className="container">
          <motion.div variants={fadeUp} className="section-header">
            <h2>Trusted by Thousands</h2>
            <p>Real stories from real customers across the UAE.</p>
          </motion.div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp}>
                <div className="glass-card" style={{ padding: '1.8rem', height: '100%' }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} fill="#C9A227" color="#C9A227" />
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.2rem', fontStyle: 'italic' }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#C9A227,#A07A10)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.9rem', color: '#0B1F3A',
                    }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section style={{ background: 'var(--gradient-hero)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div variants={fadeUp}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to Transform Your Finances?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Join 500,000+ smart UAE residents who trust Smart Finance for their financial needs.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#070F1E', borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem 0', textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            © 2024 Smart Finance. All rights reserved. Licensed by UAE Central Bank.
          </div>
        </div>
      </footer>
    </div>
  )
}
