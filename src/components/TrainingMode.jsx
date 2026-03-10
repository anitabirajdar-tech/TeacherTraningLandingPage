import React from 'react'
import './TrainingMode.css'
import { useLanguage } from '../context/LanguageContext'

const TrainingMode = () => {
  const { t } = useLanguage()
  const tm = t.trainingMode
  const modes = tm.modes

  return (
    <section className="training-mode section">
      <div className="container">
        <div className="mode-header">
          <span className="section-badge">{tm.badge}</span>
          <h2 className="section-title">{tm.title}</h2>
          <p className="section-subtitle">{tm.subtitle}</p>
        </div>

        <div className="modes-grid">
          {modes.map((mode, index) => (
            <div className="mode-card" key={index}>
              <div className="mode-icon">{mode.icon}</div>
              <h3>{mode.title}</h3>
              {mode.subtitle && <p className="mode-subtitle">{mode.subtitle}</p>}
              <ul className="mode-features">
                {mode.features.map((feature, i) => (
                  <li key={i}>
                    <span className="check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="location-banner">
          <div className="map-icon">{tm.locationIcon}</div>
          <div className="location-text">
            <h3>{tm.locationTitle}</h3>
            <p>{tm.locationDesc}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrainingMode
