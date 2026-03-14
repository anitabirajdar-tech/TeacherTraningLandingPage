import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'shraddha2024'

// ── Lead source options ──────────────────────────────────────────────
const SOURCES = ['Website Form', 'WhatsApp', 'Referral', 'Instagram', 'Facebook', 'YouTube', 'Google Ads', 'Word of Mouth', 'Other']

const STATUSES = ['new', 'contacted', 'interested', 'enrolled', 'not_interested']
const STATUS_LABELS = {
  new:            '🆕 New',
  contacted:      '📞 Contacted',
  interested:     '⭐ Interested',
  enrolled:       '✅ Enrolled',
  not_interested: '❌ Not Interested',
}
const STATUS_COLORS = {
  new:            '#3b82f6',
  contacted:      '#f59e0b',
  interested:     '#8b5cf6',
  enrolled:       '#10b981',
  not_interested: '#ef4444',
}
const PROGRAM_LABELS = {
  abacus:    'Abacus',
  vedic:     'Vedic Math',
  both:      'Both',
  franchise: 'Franchise',
}

const EMPTY_FORM = { name: '', phone: '', email: '', city: '', program: 'abacus', source_name: '', assigned_to: '', notes: '' }

function fmtDate(d) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
}

function fuStatus(dateStr) {
  if (!dateStr) return null
  const todayMs = new Date(new Date().toDateString()).getTime()
  const dMs     = new Date(dateStr + 'T00:00:00').getTime()
  if (dMs < todayMs) return 'overdue'
  if (dMs === todayMs) return 'today'
  return 'future'
}

export default function Dashboard() {
  const [authed,         setAuthed]         = useState(() => sessionStorage.getItem('crm_auth') === 'yes')
  const [passInput,      setPassInput]      = useState('')
  const [passError,      setPassError]      = useState('')
  const [leads,          setLeads]          = useState([])
  const [loading,        setLoading]        = useState(false)
  const [filterStatus,   setFilterStatus]   = useState('')
  const [filterProgram,  setFilterProgram]  = useState('')
  const [filterSearch,   setFilterSearch]   = useState('')
  const [filterAssigned, setFilterAssigned] = useState('')
  const [newAlert,       setNewAlert]       = useState(null)
  const [saving,         setSaving]         = useState(null)

  // Add lead modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm,      setAddForm]      = useState(EMPTY_FORM)
  const [addSaving,    setAddSaving]    = useState(false)
  const [addError,     setAddError]     = useState('')

  // Inline edit states
  const [editNotes,   setEditNotes]   = useState({})  // id → string
  const [editSource,  setEditSource]  = useState({})  // id → string
  const [editFuNotes,  setEditFuNotes]  = useState({})  // id → string
  const [expandedFu,   setExpandedFu]   = useState({})  // id → bool
  const [editAssigned, setEditAssigned] = useState({})  // id → string

  /* ── fetch ── */
  const fetchLeads = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (filterStatus)   q = q.eq('status',      filterStatus)
    if (filterProgram)  q = q.eq('program',      filterProgram)
    if (filterAssigned) q = q.ilike('assigned_to', `%${filterAssigned}%`)
    const { data, error } = await q
    if (!error) setLeads(data || [])
    setLoading(false)
  }, [filterStatus, filterProgram, filterAssigned])

  useEffect(() => { if (authed) fetchLeads() }, [authed, fetchLeads])

  /* ── realtime ── */
  useEffect(() => {
    if (!authed) return
    const ch = supabase
      .channel('leads_rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, ({ new: row }) => {
        setLeads(prev => [row, ...prev])
        setNewAlert(row.name)
        setTimeout(() => setNewAlert(null), 6000)
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [authed])

  /* ── login ── */
  const handleLogin = (e) => {
    e.preventDefault()
    if (passInput === ADMIN_PASS) {
      sessionStorage.setItem('crm_auth', 'yes')
      setAuthed(true)
    } else {
      setPassError('Wrong password. Try again.')
    }
  }

  /* ── universal patch helper ── */
  const patchLead = async (id, fields) => {
    setSaving(id)
    await supabase.from('leads').update(fields).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...fields } : l))
    setSaving(null)
  }

  const updateStatus    = (id, status)           => patchLead(id, { status })
  const updateFu1Date   = (id, follow_up_date)   => patchLead(id, { follow_up_date: follow_up_date || null })
  const updateFu2Date   = (id, follow_up_2_date) => patchLead(id, { follow_up_2_date: follow_up_2_date || null })

  const saveNotes = async (id) => {
    await patchLead(id, { notes: editNotes[id] })
    setEditNotes(prev => { const n = { ...prev }; delete n[id]; return n })
  }
  const saveSource = async (id) => {
    await patchLead(id, { source_name: editSource[id] })
    setEditSource(prev => { const n = { ...prev }; delete n[id]; return n })
  }
  const saveFuNotes = async (id) => {
    await patchLead(id, { follow_up_notes: editFuNotes[id] })
    setEditFuNotes(prev => { const n = { ...prev }; delete n[id]; return n })
  }
  const saveAssigned = async (id) => {
    await patchLead(id, { assigned_to: editAssigned[id] || null })
    setEditAssigned(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  /* ── add new lead ── */
  const handleAddLead = async (e) => {
    e.preventDefault()
    if (!addForm.name.trim() || !addForm.phone.trim() || !addForm.city.trim()) {
      setAddError('Name, Phone and City are required.')
      return
    }
    setAddSaving(true)
    setAddError('')
    const { error } = await supabase.from('leads').insert([{
      name:        addForm.name.trim(),
      phone:       addForm.phone.trim(),
      email:       addForm.email.trim() || null,
      city:        addForm.city.trim(),
      program:     addForm.program,
      source_name: addForm.source_name || null,
      source:      addForm.source_name || 'Manual Entry',
      assigned_to: addForm.assigned_to.trim() || null,
      notes:       addForm.notes.trim() || null,
      status:      'new',
    }])
    setAddSaving(false)
    if (error) {
      setAddError('Failed to add lead. Please try again.')
    } else {
      setShowAddModal(false)
      setAddForm(EMPTY_FORM)
      fetchLeads()
    }
  }

  /* ── export CSV ── */
  const exportCSV = () => {
    const hdr = ['No', 'Date', 'Name', 'Phone', 'Email', 'City', 'Program', 'Source', 'Assigned To', 'Status', 'Notes', 'FU-1 Date', 'FU-1 Call Notes', 'FU-2 Date']
    const rows = filteredLeads.map((l, i) => [
      filteredLeads.length - i,
      new Date(l.created_at).toLocaleString('en-IN'),
      l.name, l.phone, l.email || '', l.city,
      l.program,
      l.source_name || l.source || '',
      l.assigned_to || '',
      l.status,
      (l.notes           || '').replace(/,/g, ';'),
      l.follow_up_date   || '',
      (l.follow_up_notes || '').replace(/,/g, ';'),
      l.follow_up_2_date || '',
    ])
    const blob = new Blob([[hdr, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  /* ── WhatsApp ── */
  const waLink = (phone, name, program) => {
    const clean = phone.replace(/\D/g, '')
    const num   = clean.startsWith('91') ? clean : `91${clean}`
    const msg   = `Hi ${name}! 🙏 This is Team Shraddha Institute. We received your enquiry for *${PROGRAM_LABELS[program] || program}* Teacher Training. Can we connect now?`
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
  }

  /* ── filtering ── */
  const filteredLeads = leads.filter(l => {
    if (!filterSearch) return true
    const s = filterSearch.toLowerCase()
    return (
      l.name.toLowerCase().includes(s) ||
      l.phone.includes(s) ||
      (l.city         || '').toLowerCase().includes(s) ||
      (l.email        || '').toLowerCase().includes(s) ||
      (l.source_name  || l.source || '').toLowerCase().includes(s) ||
      (l.assigned_to  || '').toLowerCase().includes(s)
    )
  })

  /* ── today's / overdue follow-ups ── */
  const todayStr = new Date().toISOString().split('T')[0]
  const dueTodayOrOverdue = leads.filter(l =>
    (l.follow_up_date   && l.follow_up_date   <= todayStr) ||
    (l.follow_up_2_date && l.follow_up_2_date <= todayStr)
  )

  /* ── stats ── */
  const todayCount = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length
  const stats = {
    total:      leads.length,
    new:        leads.filter(l => l.status === 'new').length,
    contacted:  leads.filter(l => l.status === 'contacted').length,
    interested: leads.filter(l => l.status === 'interested').length,
    enrolled:   leads.filter(l => l.status === 'enrolled').length,
  }
  const conversionRate = stats.total > 0 ? Math.round((stats.enrolled / stats.total) * 100) : 0

  const programCounts = Object.keys(PROGRAM_LABELS).map(p => ({
    label: PROGRAM_LABELS[p],
    count: leads.filter(l => l.program === p).length,
  }))
  const maxProg = Math.max(...programCounts.map(p => p.count), 1)

  // ─────────────────── LOGIN SCREEN ───────────────────
  if (!authed) {
    return (
      <div className="crm-login">
        <div className="crm-login-box">
          <img src="/images/gallery/background%20remove.png" alt="Shraddha Institute" className="crm-login-logo" />
          <h1>Shraddha CRM</h1>
          <p className="crm-login-sub">Admin Dashboard — Team Login</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={passInput}
              onChange={e => { setPassInput(e.target.value); setPassError('') }}
              autoFocus
            />
            {passError && <p className="crm-login-err">{passError}</p>}
            <button type="submit">🔓 Login</button>
          </form>
          <a href="/" className="crm-back-link">← Back to website</a>
        </div>
      </div>
    )
  }

  // ─────────────────── DASHBOARD ───────────────────
  return (
    <>

      {/* ── TOPBAR ── */}
      <div className="crm-wrap">
      <header className="crm-topbar">
        <span className="crm-brand">
          <img src="/images/gallery/background%20remove.png" alt="Shraddha" className="crm-topbar-logo" />
          <span className="crm-brand-text">
           
          </span>
        </span>

        {newAlert && (
          <span className="crm-new-alert">🔔 New lead: <strong>{newAlert}</strong></span>
        )}

        <div className="crm-topbar-actions">
          <button onClick={exportCSV} className="crm-btn crm-btn-outline">⬇ CSV</button>
          <a href="/" className="crm-btn crm-btn-outline">🌐 Website</a>
          <button className="crm-btn crm-btn-danger" onClick={() => { sessionStorage.removeItem('crm_auth'); setAuthed(false) }}>
            Logout
          </button>
        </div>
      </header>

      <div className="crm-body">

        {/* ── TODAY'S FOLLOW-UPS ALERT ── */}
        {dueTodayOrOverdue.length > 0 && (
          <div className="crm-fu-alert">
            <div className="crm-fu-alert-header">
              <span>🔥</span>
              <strong>{dueTodayOrOverdue.length} Follow-up{dueTodayOrOverdue.length > 1 ? 's' : ''} Due Today or Overdue</strong>
            </div>
            <div className="crm-fu-alert-list">
              {dueTodayOrOverdue.map(l => {
                const fu1s = fuStatus(l.follow_up_date)
                const fu2s = fuStatus(l.follow_up_2_date)
                const isOverdue = fu1s === 'overdue' || fu2s === 'overdue'
                return (
                  <span key={l.id} className={`crm-fu-chip ${isOverdue ? 'crm-fu-chip-overdue' : 'crm-fu-chip-today'}`}>
                    <strong>{l.name}</strong>
                    {l.assigned_to && <em> → {l.assigned_to}</em>}
                    {l.follow_up_date   && fu1s !== 'future' && <span> · FU1: {fmtDate(l.follow_up_date)}</span>}
                    {l.follow_up_2_date && fu2s !== 'future' && <span> · FU2: {fmtDate(l.follow_up_2_date)}</span>}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        <div className="crm-stats-grid">
          <div className="crm-stat-card crm-stat-total">
            <div className="crm-stat-icon">📋</div>
            <span className="crm-stat-val">{stats.total}</span>
            <span className="crm-stat-lbl">Total Leads</span>
          </div>
          <div className="crm-stat-card crm-stat-today">
            <div className="crm-stat-icon">📅</div>
            <span className="crm-stat-val">{todayCount}</span>
            <span className="crm-stat-lbl">Today</span>
          </div>
          <div className="crm-stat-card crm-stat-new">
            <div className="crm-stat-icon">🆕</div>
            <span className="crm-stat-val">{stats.new}</span>
            <span className="crm-stat-lbl">New</span>
          </div>
          <div className="crm-stat-card crm-stat-contacted">
            <div className="crm-stat-icon">📞</div>
            <span className="crm-stat-val">{stats.contacted}</span>
            <span className="crm-stat-lbl">Contacted</span>
          </div>
          <div className="crm-stat-card crm-stat-interested">
            <div className="crm-stat-icon">⭐</div>
            <span className="crm-stat-val">{stats.interested}</span>
            <span className="crm-stat-lbl">Interested</span>
          </div>
          <div className="crm-stat-card crm-stat-enrolled">
            <div className="crm-stat-icon">✅</div>
            <span className="crm-stat-val">{stats.enrolled}</span>
            <span className="crm-stat-lbl">Enrolled</span>
          </div>
          <div className="crm-stat-card crm-stat-conversion">
            <div className="crm-stat-icon">📈</div>
            <span className="crm-stat-val">{conversionRate}%</span>
            <span className="crm-stat-lbl">Conversion</span>
          </div>
        </div>

        {/* ── ANALYTICS ── */}
        <div className="crm-analytics">
          <div className="crm-chart-card">
            <h3 className="crm-chart-title">📊 Program Interest</h3>
            <div className="crm-bars">
              {programCounts.map(p => (
                <div className="crm-bar-row" key={p.label}>
                  <span className="crm-bar-label">{p.label}</span>
                  <div className="crm-bar-track">
                    <div className="crm-bar-fill" style={{ width: `${Math.round((p.count / maxProg) * 100)}%` }} />
                  </div>
                  <span className="crm-bar-count">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="crm-chart-card">
            <h3 className="crm-chart-title">📉 Pipeline Status</h3>
            <div className="crm-pipeline">
              {STATUSES.map(s => {
                const count = leads.filter(l => l.status === s).length
                const pct   = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                return (
                  <div className="crm-pipe-row" key={s}>
                    <span className="crm-pipe-label">{STATUS_LABELS[s]}</span>
                    <div className="crm-pipe-track">
                      <div className="crm-pipe-fill" style={{ width: `${pct}%`, background: STATUS_COLORS[s] }} />
                    </div>
                    <span className="crm-pipe-pct">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div className="crm-filter-bar">
          <input
            className="crm-search"
            type="search"
            placeholder="🔍 Search name, phone, city, source, assigned…"
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)}>
            <option value="">All Programs</option>
            {Object.entries(PROGRAM_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input
            className="crm-search"
            style={{ minWidth: '130px', flex: 'none' }}
            type="search"
            placeholder="Filter assigned…"
            value={filterAssigned}
            onChange={e => setFilterAssigned(e.target.value)}
          />
          <button className="crm-btn crm-btn-primary" onClick={fetchLeads}>🔄 Refresh</button>
          <button className="crm-btn crm-btn-add" onClick={() => setShowAddModal(true)}>➕ Add New Lead</button>
          <span className="crm-count">{filteredLeads.length} leads</span>
        </div>

        {/* ── TABLE ── */}
        {loading ? (
          <div className="crm-loading">Loading leads…</div>
        ) : (
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Source</th>
                  <th>Assigned To</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Follow-up 1</th>
                  <th>Follow-up 2</th>
                  <th>WA</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 && (
                  <tr><td colSpan={13} className="crm-empty">No leads found</td></tr>
                )}

                {filteredLeads.map((lead, idx) => {
                  const fu1s = fuStatus(lead.follow_up_date)
                  const fu2s = fuStatus(lead.follow_up_2_date)
                  const isExpanded = expandedFu[lead.id]

                  return (
                    <React.Fragment key={lead.id}>
                      <tr className={[
                        'crm-row',
                        lead.status === 'new'                              ? 'crm-row-new'     : '',
                        fu1s === 'overdue' || fu2s === 'overdue'           ? 'crm-row-overdue' : '',
                        fu1s === 'today'   || fu2s === 'today'             ? 'crm-row-today'   : '',
                      ].join(' ')}>

                        <td className="crm-td-num">{filteredLeads.length - idx}</td>

                        <td className="crm-td-date">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          <small>{new Date(lead.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
                        </td>

                        <td className="crm-td-name">
                          <strong>{lead.name}</strong>
                          {lead.email && <small>{lead.email}</small>}
                        </td>

                        <td className="crm-td-phone">
                          <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                        </td>

                        <td>{lead.city}</td>

                        {/* ── SOURCE ── */}
                        <td className="crm-td-source">
                          {editSource[lead.id] !== undefined ? (
                            <div className="crm-inline-edit">
                              <input
                                value={editSource[lead.id]}
                                onChange={e => setEditSource(p => ({ ...p, [lead.id]: e.target.value }))}
                                placeholder="Source…"
                                onKeyDown={e => e.key === 'Enter' && saveSource(lead.id)}
                                list="crm-src-list"
                                autoFocus
                              />
                              <datalist id="crm-src-list">
                                {SOURCES.map(s => <option key={s} value={s} />)}
                              </datalist>
                              <button className="crm-icon-btn crm-save"   onClick={() => saveSource(lead.id)} disabled={saving === lead.id}>✓</button>
                              <button className="crm-icon-btn crm-cancel" onClick={() => setEditSource(p => { const n={...p}; delete n[lead.id]; return n })}>✕</button>
                            </div>
                          ) : (
                            <span className="crm-src-view" onClick={() => setEditSource(p => ({ ...p, [lead.id]: lead.source_name || lead.source || '' }))}>
                              {(lead.source_name || lead.source)
                                ? <span className="crm-src-badge">{lead.source_name || lead.source}</span>
                                : <span className="crm-add-note">+ source</span>
                              }
                            </span>
                          )}
                        </td>

                        {/* ── ASSIGNED TO ── */}
                        <td className="crm-td-assigned">
                          {editAssigned[lead.id] !== undefined ? (
                            <div className="crm-inline-edit">
                              <input
                                value={editAssigned[lead.id]}
                                onChange={e => setEditAssigned(p => ({ ...p, [lead.id]: e.target.value }))}
                                placeholder="Name…"
                                onKeyDown={e => e.key === 'Enter' && saveAssigned(lead.id)}
                                autoFocus
                              />
                              <button className="crm-icon-btn crm-save" onClick={() => saveAssigned(lead.id)} disabled={saving === lead.id}>✓</button>
                              <button className="crm-icon-btn crm-cancel" onClick={() => setEditAssigned(p => { const n = { ...p }; delete n[lead.id]; return n })}>✕</button>
                            </div>
                          ) : (
                            <span
                              className={`crm-assign-badge ${lead.assigned_to ? 'crm-assign-badge--set' : ''}`}
                              onClick={() => setEditAssigned(p => ({ ...p, [lead.id]: lead.assigned_to || '' }))}
                            >
                              {lead.assigned_to || <span className="crm-add-note">+ assign</span>}
                            </span>
                          )}
                        </td>

                        <td>
                          <span className="crm-prog-badge">{PROGRAM_LABELS[lead.program] || lead.program}</span>
                        </td>

                        <td>
                          <select
                            className="crm-status-sel"
                            style={{ background: STATUS_COLORS[lead.status] }}
                            value={lead.status}
                            onChange={e => updateStatus(lead.id, e.target.value)}
                            disabled={saving === lead.id}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                          </select>
                        </td>

                        {/* ── NOTES ── */}
                        <td className="crm-td-notes">
                          {editNotes[lead.id] !== undefined ? (
                            <div className="crm-inline-edit">
                              <input
                                value={editNotes[lead.id]}
                                onChange={e => setEditNotes(p => ({ ...p, [lead.id]: e.target.value }))}
                                placeholder="Add note…"
                                onKeyDown={e => e.key === 'Enter' && saveNotes(lead.id)}
                                autoFocus
                              />
                              <button className="crm-icon-btn crm-save"   onClick={() => saveNotes(lead.id)} disabled={saving === lead.id}>✓</button>
                              <button className="crm-icon-btn crm-cancel" onClick={() => setEditNotes(p => { const n={...p}; delete n[lead.id]; return n })}>✕</button>
                            </div>
                          ) : (
                            <span className="crm-notes-view" onClick={() => setEditNotes(p => ({ ...p, [lead.id]: lead.notes || '' }))}>
                              {lead.notes || <span className="crm-add-note">+ note</span>}
                            </span>
                          )}
                        </td>

                        {/* ── FOLLOW-UP 1 ── */}
                        <td className="crm-td-fu">
                          <div className="crm-fu-cell">
                            <input
                              type="date"
                              className={`crm-date-input ${fu1s ? `crm-date-${fu1s}` : ''}`}
                              value={lead.follow_up_date || ''}
                              onChange={e => updateFu1Date(lead.id, e.target.value)}
                              title="Set Follow-up 1 date"
                            />
                            {fu1s && (
                              <span className={`crm-fu-badge crm-fu-badge-${fu1s}`}>
                                {fu1s === 'overdue' ? '⚠ Overdue' : fu1s === 'today' ? '🔥 Today' : '✓'}
                              </span>
                            )}
                            <button
                              className={`crm-fu-notes-btn ${lead.follow_up_notes ? 'crm-fu-notes-btn--has' : ''}`}
                              onClick={() => setExpandedFu(p => ({ ...p, [lead.id]: !p[lead.id] }))}
                              title="Call conversion notes"
                            >
                              📝 {isExpanded ? '▲' : '▼'}
                            </button>
                          </div>
                        </td>

                        {/* ── FOLLOW-UP 2 ── */}
                        <td className="crm-td-fu">
                          <div className="crm-fu-cell">
                            <input
                              type="date"
                              className={`crm-date-input ${fu2s ? `crm-date-${fu2s}` : ''}`}
                              value={lead.follow_up_2_date || ''}
                              onChange={e => updateFu2Date(lead.id, e.target.value)}
                              title="Set Follow-up 2 date"
                            />
                            {fu2s && (
                              <span className={`crm-fu-badge crm-fu-badge-${fu2s}`}>
                                {fu2s === 'overdue' ? '⚠ Overdue' : fu2s === 'today' ? '🔥 Today' : '✓'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <a href={waLink(lead.phone, lead.name, lead.program)} target="_blank" rel="noopener noreferrer" className="crm-wa-btn" title="Send WhatsApp">📲</a>
                        </td>
                      </tr>

                      {/* ── FOLLOW-UP CALL NOTES DETAIL ROW ── */}
                      {isExpanded && (
                        <tr className="crm-fu-detail-row">
                          <td colSpan={13}>
                            <div className="crm-fu-detail">
                              <span className="crm-fu-detail-label">📞 Follow-up 1 — Call Conversion Notes for <strong>{lead.name}</strong></span>
                              {editFuNotes[lead.id] !== undefined ? (
                                <div className="crm-fu-notes-edit">
                                  <textarea
                                    value={editFuNotes[lead.id]}
                                    onChange={e => setEditFuNotes(p => ({ ...p, [lead.id]: e.target.value }))}
                                    placeholder="What happened on the call? Interest level, objections raised, what was discussed, next steps decided…"
                                    rows={3}
                                    autoFocus
                                  />
                                  <div className="crm-fu-notes-actions">
                                    <button className="crm-icon-btn crm-save" onClick={() => saveFuNotes(lead.id)} disabled={saving === lead.id}>💾 Save Notes</button>
                                    <button className="crm-icon-btn crm-cancel" onClick={() => setEditFuNotes(p => { const n={...p}; delete n[lead.id]; return n })}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="crm-fu-notes-view" onClick={() => setEditFuNotes(p => ({ ...p, [lead.id]: lead.follow_up_notes || '' }))}>
                                  {lead.follow_up_notes
                                    ? <p>{lead.follow_up_notes}</p>
                                    : <span className="crm-add-note">Click to add call conversion notes…</span>
                                  }
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* ── ADD LEAD MODAL ── */}
    {showAddModal && (
      <div className="crm-modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddModal(false)}>
        <div className="crm-modal">
          <div className="crm-modal-header">
            <h3>➕ Add New Lead</h3>
            <button className="crm-modal-close" onClick={() => { setShowAddModal(false); setAddForm(EMPTY_FORM); setAddError('') }}>✕</button>
          </div>
          <form onSubmit={handleAddLead}>
            <div className="crm-modal-body">
              {addError && <div className="crm-modal-error">{addError}</div>}
              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label className="crm-form-label">Name <span className="crm-req">*</span></label>
                  <input className="crm-form-input" type="text" required placeholder="Full name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="crm-form-group">
                  <label className="crm-form-label">Phone <span className="crm-req">*</span></label>
                  <input className="crm-form-input" type="tel" required placeholder="9876543210" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label className="crm-form-label">Email</label>
                  <input className="crm-form-input" type="email" placeholder="email@example.com" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="crm-form-group">
                  <label className="crm-form-label">City <span className="crm-req">*</span></label>
                  <input className="crm-form-input" type="text" required placeholder="City" value={addForm.city} onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))} />
                </div>
              </div>
              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label className="crm-form-label">Program <span className="crm-req">*</span></label>
                  <select className="crm-form-input" required value={addForm.program} onChange={e => setAddForm(f => ({ ...f, program: e.target.value }))}>
                    {Object.entries(PROGRAM_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="crm-form-group">
                  <label className="crm-form-label">Source</label>
                  <select className="crm-form-input" value={addForm.source_name} onChange={e => setAddForm(f => ({ ...f, source_name: e.target.value }))}>
                    <option value="">Select source…</option>
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label className="crm-form-label">Assigned To</label>
                  <input className="crm-form-input" type="text" placeholder="Team member name" value={addForm.assigned_to} onChange={e => setAddForm(f => ({ ...f, assigned_to: e.target.value }))} />
                </div>
              </div>
              <div className="crm-form-group">
                <label className="crm-form-label">Notes</label>
                <textarea className="crm-form-input crm-form-textarea" rows={3} placeholder="Any initial notes…" value={addForm.notes} onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="crm-modal-footer">
              <button type="button" className="crm-btn crm-btn-ghost" onClick={() => { setShowAddModal(false); setAddForm(EMPTY_FORM); setAddError('') }}>Cancel</button>
              <button type="submit" className="crm-btn crm-btn-primary" disabled={addSaving}>
                {addSaving ? '⏳ Saving…' : '➕ Save Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
  )
}
