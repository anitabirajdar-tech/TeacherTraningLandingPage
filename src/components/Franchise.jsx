import React from 'react'
import './Franchise.css'
import { useLanguage } from '../context/LanguageContext'

const Franchise = () => {
  const { t } = useLanguage()
  const f = t.franchise
  const benefits = f.benefits
  const stats = f.stats

  return (
    <section className="franchise section" id="franchise">
      <div className="container">
        <div className="fr-layout">
          <div className="fr-info">
            <span className="section-badge">{f.badge}</span>
            <h2 className="section-title fr-title">
              {f.title}{' '}
              <span className="fr-grad">{f.titleAccent}</span>
            </h2>
            <p className="fr-intro" dangerouslySetInnerHTML={{ __html: f.intro }} />

            <div className="fr-types">
              {f.types.map((type, i) => (
                <div className="fr-type-card" key={i}>
                  <span className="fr-type-icon">{type.icon}</span>
                  <span>{type.text} <strong>{type.bold}</strong></span>
                </div>
              ))}
            </div>

            <div className="fr-benefits-wrap">
              <p className="fr-benefits-label">{f.benefitsLabel}</p>
              <div className="fr-benefits">
                {benefits.map((b, i) => (
                  <div className="fr-benefit" key={i} style={{ '--bc': b.color, '--i': i }}>
                    <div className="fr-benefit-icon">{b.icon}</div>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fr-tagline">
              <span>{f.taglineIcon}</span>
              <p dangerouslySetInnerHTML={{ __html: f.tagline }} />
            </div>

            <a href="#contact" className="fr-cta-btn">{f.cta}</a>
          </div>

          <div className="fr-visual">
            <div className="fr-network-card">
              <div className="fr-orb fr-orb1" />
              <div className="fr-orb fr-orb2" />
              <div className="fr-card-top">
                <div className="fr-card-icon-wrap"><span>🎯</span></div>
                <h3>{f.networkTitle}</h3>
                <p>{f.networkSub}</p>
              </div>
              <div className="fr-stats">
                {stats.map((s, i) => (
                  <div className="fr-stat" key={i} style={{ '--i': i }}>
                    <span className="fr-stat-icon">{s.icon}</span>
                    <span className="fr-stat-value">{s.value}</span>
                    <span className="fr-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Franchise
