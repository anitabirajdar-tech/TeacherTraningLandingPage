import React from 'react'
import './About.css'
import { useLanguage } from '../context/LanguageContext'

const About = () => {
  const { t } = useLanguage()
  const a = t.about

  return (
    <section className="about section" id="about">
      <div className="container">
        <h2 className="about-title">{a.title}<span className="about-title-accent">{a.titleAccent}</span>?</h2>

        <div className="about-badges">
          {a.features.map((feature, index) => (
            <div className="about-badge-item" key={index}>
              <div className="about-badge-icon">{feature.icon}</div>
              <span className="about-badge-text">{feature.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
