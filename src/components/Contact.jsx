import React, { useState } from 'react'
import './Contact.css'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

const Contact = () => {
  const { t } = useLanguage()
  const c = t.contact
  const form = c.form

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    program: 'abacus',
    message: ''
  })
  const [submitStatus, setSubmitStatus] = useState(null) // 'saving' | 'done' | 'error'
  const [submitError,  setSubmitError]  = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('saving')

    // Save lead to Supabase
    try {
      const { error } = await supabase.from('leads').insert({
        name:    formData.name,
        phone:   formData.phone,
        email:   formData.email  || null,
        city:    formData.city,
        program: formData.program,
        message: formData.message || null,
        status:  'new',
        source:  'website_form',
      })
      if (error) {
        console.error('Supabase insert error:', error)
        setSubmitError('Could not save your enquiry: ' + error.message)
        setSubmitStatus('error')
        return
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setSubmitError('Network error — please try again or contact us on WhatsApp.')
      setSubmitStatus('error')
      return
    }

    const programMap = {
      abacus: form.programs.abacus,
      vedic: form.programs.vedic,
      both: form.programs.both,
      franchise: form.programs.franchise,
    }

    const msg = [
      `Hello Shraddha Institute! 🙏`,
      ``,
      `I would like to register for your Teacher Training Program.`,
      ``,
      `📌 *Name:* ${formData.name}`,
      `📞 *Phone:* ${formData.phone}`,
      `📧 *Email:* ${formData.email || 'N/A'}`,
      `📍 *City:* ${formData.city}`,
      `📚 *Program:* ${programMap[formData.program]}`,
      formData.message ? `💬 *Message:* ${formData.message}` : '',
      ``,
      `Please share more details. Thank you!`,
    ].filter(Boolean).join('\n')

    const waUrl = `https://wa.me/919168756060?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')

    setFormData({ name: '', email: '', phone: '', city: '', program: 'abacus', message: '' })
    setSubmitStatus('done')
    setTimeout(() => setSubmitStatus(null), 4000)
  }

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="contact-header">
          <span className="section-badge">{c.badge}</span>
          <h2 className="section-title">{c.title}</h2>
          <p className="section-subtitle">{c.subtitle}</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <h3>{c.limitedTitle}</h3>
              <p>{c.limitedDesc}</p>
            </div>

            <div className="info-card info-card-secondary">
              <h3>{c.callTitle}</h3>
              <p>{c.callDesc}</p>
            </div>

            <div className="contact-methods">
              <a href="tel:+918446889966" className="contact-method">
                <span className="method-icon">📞</span>
                <div className="method-info">
                  <span className="method-label">{c.callLabel}</span>
                  <span className="method-value">+91 84468 89966</span>
                </div>
              </a>

              <a href="https://wa.me/919168756060?text=Hello" className="contact-method whatsapp" target="_blank" rel="noopener noreferrer">
                <span className="method-icon">📲</span>
                <div className="method-info">
                  <span className="method-label">{c.waLabel}</span>
                  <span className="method-value">+91 91687 56060</span>
                  <span className="method-hint">{c.waHint}</span>
                </div>
              </a>

              <a href="mailto:info@shraddhainstitute.com" className="contact-method">
                <span className="method-icon">📧</span>
                <div className="method-info">
                  <span className="method-label">{c.emailLabel}</span>
                  <span className="method-value">info@shraddhainstitute.com</span>
                </div>
              </a>
            </div>

            <div className="whatsapp-instruction">
              <h4>{c.waInstTitle}</h4>
              <p dangerouslySetInnerHTML={{ __html: c.waInstText }} />
              {' '}
              <a href="https://wa.me/919168756060?text=Hello" target="_blank" rel="noopener noreferrer">
                <strong>9168756060</strong>
              </a>
              {' '}
              <p>{c.waInstText2}</p>
              <p className="contact-alt">
                {c.waInstAlt}{' '}
                <a href="tel:+918446889966"><strong>8446889966</strong></a>
              </p>
            </div>

            <div className="quick-connect">
              <h4>{c.quickConnect}</h4>
              <div className="social-buttons">
                <a href="https://www.instagram.com/shraddhainstitute/" className="social-btn instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.youtube.com/watch?v=K2ees_bJSyE" className="social-btn youtube" target="_blank" rel="noopener noreferrer">YouTube</a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>{form.title}</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{form.nameLbl}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={form.namePh}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{form.phoneLbl}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={form.phonePh}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">{form.emailLbl}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={form.emailPh}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">{form.cityLbl}</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={form.cityPh}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="program">{form.programLbl}</label>
                <select id="program" name="program" value={formData.program} onChange={handleChange} required>
                  <option value="abacus">{form.programs.abacus}</option>
                  <option value="vedic">{form.programs.vedic}</option>
                  <option value="both">{form.programs.both}</option>
                  <option value="franchise">{form.programs.franchise}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">{form.msgLbl}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={form.msgPh}
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-submit" disabled={submitStatus === 'saving'}>
                {submitStatus === 'saving' ? '⏳ Submitting...' : form.submitBtn}
              </button>

              {submitStatus === 'done' && (
                <p style={{ color: '#10b981', fontWeight: 700, textAlign: 'center', marginTop: 10 }}>
                  ✅ Enquiry submitted! Our team will contact you soon.
                </p>
              )}
              {submitStatus === 'error' && (
                <p style={{ color: '#ef4444', fontWeight: 700, textAlign: 'center', marginTop: 10 }}>
                  ⚠️ {submitError}
                </p>
              )}

              <p className="form-disclaimer">
                🔒 Your information is 100% safe. We will contact you within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
