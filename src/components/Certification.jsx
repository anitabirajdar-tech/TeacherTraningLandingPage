import React from 'react'
import './Certification.css'
import { useLanguage } from '../context/LanguageContext'

const colors = ['#f7971e','#667eea','#11998e','#ff6b35','#764ba2','#e84393']

const Certification = () => {
  const { t } = useLanguage()
  const c = t.certification
  const benefits = c.benefits

  return (
    <section className="certification section" id="certification">
      <div className="container">
        <div className="cert-header">
          <span className="section-badge">{c.badge}</span>
          <h2 className="section-title">
            {c.title}{' '}
            <span className="cert-grad-text">{c.titleAccent}</span>
          </h2>
          <p className="section-subtitle" dangerouslySetInnerHTML={{ __html: c.subtitle }} />
        </div>

        <div className="cert-layout">
          <div className="cert-mockup-col">
            <div className="cert-ribbon">{c.ribbon}</div>
            <div className="cert-img-wrap">
              <img
                src="/images/certificate/certificate.jpg"
                alt="Shraddha Institute Certificate"
                className="cert-real-img"
              />
            </div>
            <div className="cert-valid-pill">{c.validPill}</div>
          </div>

          <div className="cert-benefits-col">
            {benefits.map((b, i) => (
              <div className="cb-card" key={i} style={{ '--cc': colors[i], '--i': i }}>
                <div className="cb-icon-wrap"><span className="cb-icon">{b.icon}</span></div>
                <div className="cb-text">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
                <div className="cb-badge">{String(i + 1).padStart(2,'0')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Certification
