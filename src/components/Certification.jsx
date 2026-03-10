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
            <div className="certificate-card">
              <span className="cc-corner cc-tl" /><span className="cc-corner cc-tr" />
              <span className="cc-corner cc-bl" /><span className="cc-corner cc-br" />
              <div className="cc-top">
                <span className="cc-star">⭐</span>
                <div>
                  <p className="cc-institute">{c.institute}</p>
                  <h3 className="cc-title">{c.certTitle}</h3>
                </div>
                <span className="cc-star">⭐</span>
              </div>
              <div className="cc-rule" />
              <div className="cc-body">
                <p className="cc-lbl">{c.certLbl1}</p>
                <p className="cc-name">{c.certName}</p>
                <p className="cc-lbl">{c.certLbl2}</p>
                <p className="cc-program">{c.certProgram}</p>
                <p className="cc-lbl">{c.certLbl3}</p>
              </div>
              <div className="cc-rule" />
              <div className="cc-foot">
                <div className="cc-seal"><span>🏆</span><small>Certified</small></div>
                <div className="cc-sig">
                  <div className="cc-sig-line" />
                  <small>{c.certSig}</small>
                </div>
                <div className="cc-seal"><span>🎖</span><small>Official</small></div>
              </div>
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
