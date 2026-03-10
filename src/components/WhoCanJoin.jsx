import React from 'react'
import './WhoCanJoin.css'
import { useLanguage } from '../context/LanguageContext'

const WhoCanJoin = () => {
  const { t } = useLanguage()
  const w = t.whoCanJoin

  return (
    <section className="who-can-join section" id="eligibility">
      <div className="container">
        <div className="who-header">
          <span className="section-badge">{w.badge}</span>
          <h2 className="section-title">{w.title}</h2>
          <p className="section-subtitle">{w.subtitle}</p>
        </div>

        <div className="eligibility-grid">
          {w.people.map((person, index) => (
            <div className="eligibility-card" key={index}>
              <div className="eligibility-icon">
                {person.image ? (
                  <img src={person.image} alt={person.title} />
                ) : (
                  person.icon
                )}
              </div>
              <h3>{person.title}</h3>
              <p>{person.description}</p>
            </div>
          ))}
        </div>

        <div className="no-experience-banner">
          <div className="banner-icon">{w.bannerIcon}</div>
          <div className="banner-content">
            <h3>{w.bannerTitle}</h3>
            <p>{w.bannerDesc}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoCanJoin
