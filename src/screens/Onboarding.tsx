import { useState } from 'react'
import type { UserProfile } from '../types'

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Goldman Sachs']
const ROLES = ['L3 SWE', 'L4 SWE', 'L5 SWE', 'L6 SWE', 'Staff SWE', 'Senior SWE', 'Principal SWE', 'SDE-2', 'SDE-3', 'Vice President']
const PRESETS: { company: string; role: string; label: string; emoji: string }[] = [
  { company: 'Google', role: 'L5 SWE', label: 'Google L5', emoji: 'G' },
  { company: 'Meta', role: 'L5 SWE', label: 'Meta E5', emoji: 'M' },
  { company: 'Amazon', role: 'SDE-2', label: 'Amazon SDE-2', emoji: 'A' },
  { company: 'Microsoft', role: 'Senior SWE', label: 'MSFT Senior', emoji: '⊞' },
  { company: 'Goldman Sachs', role: 'Vice President', label: 'GS VP', emoji: 'G' },
]

interface Props {
  onComplete: (profile: UserProfile) => void
}

export default function Onboarding({ onComplete }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('Google')
  const [role, setRole] = useState('L5 SWE')
  const [step, setStep] = useState<'intro' | 'form'>('intro')

  const applyPreset = (p: typeof PRESETS[0]) => {
    setCompany(p.company)
    setRole(p.role)
  }

  const submit = () => {
    if (!name.trim()) return
    onComplete({ id: `profile-${Date.now()}`, name: name.trim(), email: email.trim(), company, role, targetCompany: company, targetRole: role, joinedDate: new Date().toISOString(), isGuest: false })
  }

  const guestMode = () => {
    onComplete({ id: 'guest', name: 'Guest', email: '', company: 'Google', role: 'L5 SWE', targetCompany: 'Google', targetRole: 'L5 SWE', joinedDate: new Date().toISOString(), isGuest: true })
  }

  return (
    <div
      className="bg-mesh onboarding-screen screen-safe-top"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 24,
        minHeight: 0,
      }}
    >
      {step === 'intro' ? (
        <div className="screen-enter" style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ marginBottom: 28 }}>
            <div
              className="font-display glow-text"
              style={{
                fontSize: 11,
                letterSpacing: '0.3em',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              ◈ Technical Interview Platform ◈
            </div>
            <h1
              className="font-display glow-text"
              style={{
                fontSize: 32,
                fontWeight: 900,
                margin: 0,
                lineHeight: 1.15,
                color: 'var(--txt)',
              }}
            >
              PUZZLE
              <br />
              <span style={{ color: 'var(--accent)' }}>MASTER</span>
            </h1>
            <div
              className="font-display"
              style={{
                fontSize: 11,
                letterSpacing: '0.25em',
                color: 'var(--txt-m)',
                marginTop: 8,
                textTransform: 'uppercase',
              }}
            >
              Interview Edition
            </div>
          </div>

          {/* Floating badge */}
          <div
            className="glass glow-accent-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 40,
              marginBottom: 32,
              animation: 'float 3.5s ease-in-out infinite',
            }}
          >
            <span style={{ color: 'var(--star)' }}>★</span>
            <span style={{ fontSize: 13, color: 'var(--txt-m)' }}>25 curated interview puzzles</span>
            <span style={{ color: 'var(--star)' }}>★</span>
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 36 }}>
            {['Logical', 'Math', 'Arrangement', 'Spatial', '3 Tiers', 'AI Hints'].map(f => (
              <span
                key={f}
                className="glass"
                style={{
                  padding: '5px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  color: 'var(--txt-m)',
                }}
              >
                {f}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            className="btn-primary"
            onClick={() => setStep('form')}
            style={{ width: '100%', padding: '16px', fontSize: 14, marginBottom: 12 }}
          >
            ▶ START YOUR JOURNEY
          </button>
          <button
            className="btn-ghost"
            onClick={guestMode}
            style={{ width: '100%', padding: '14px', fontSize: 13 }}
          >
            ⚡ Instant Guest Mode
          </button>
        </div>
      ) : (
        <div className="screen-enter" style={{ width: '100%', maxWidth: 400 }}>
          <button
            onClick={() => setStep('intro')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--txt-m)',
              cursor: 'pointer',
              fontSize: 13,
              padding: '0 0 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Back
          </button>

          <h2
            className="font-display"
            style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', margin: '0 0 6px' }}
          >
            Create Profile
          </h2>
          <p style={{ fontSize: 13, color: 'var(--txt-m)', margin: '0 0 24px' }}>
            Personalized prep for your target role.
          </p>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt-m)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Full Name *
              </label>
              <input
                className="input-glass"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Chen"
                style={{ display: 'block', width: '100%', padding: '12px 14px', marginTop: 6, fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt-m)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                className="input-glass"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com"
                type="email"
                style={{ display: 'block', width: '100%', padding: '12px 14px', marginTop: 6, fontSize: 14 }}
              />
            </div>

            {/* Presets */}
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt-m)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Quick Presets
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className="glass"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      color: company === p.company ? 'var(--accent)' : 'var(--txt-m)',
                      border: `1px solid ${company === p.company ? 'var(--glass-bs)' : 'var(--glass-b)'}`,
                      cursor: 'pointer',
                      background: company === p.company ? 'var(--accent-dim)' : undefined,
                      transition: 'all 0.15s',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: 'var(--txt-m)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Target Company
              </label>
              <select
                className="input-glass"
                value={company}
                onChange={e => setCompany(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '12px 14px', marginTop: 6, fontSize: 14, cursor: 'pointer' }}
              >
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, color: 'var(--txt-m)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Target Role
              </label>
              <select
                className="input-glass"
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '12px 14px', marginTop: 6, fontSize: 14, cursor: 'pointer' }}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={submit}
            disabled={!name.trim()}
            style={{ width: '100%', padding: '16px', fontSize: 14, marginTop: 24 }}
          >
            ▶ BEGIN TRAINING
          </button>

          <button
            className="btn-ghost"
            onClick={guestMode}
            style={{ width: '100%', padding: '12px', fontSize: 13, marginTop: 10 }}
          >
            ⚡ Skip — Guest Mode
          </button>
        </div>
      )}
    </div>
  )
}
