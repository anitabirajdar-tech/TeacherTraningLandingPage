import React from 'react'
import './Hero.css'
import { useLanguage } from '../context/LanguageContext'

const Hero = () => {
  const { t } = useLanguage()
  const h = t.hero

  return (
    <section className="hero" id="home">
      <div className="hero-bg" />

      <div className="hero-grid">
        <div className="hero-content">
          <h1 className="h-title">
            {h.titleLine1} <span className="h-accent">{h.titleAccent}</span><br />
            <span className="h-title-highlight">{h.titleLine2}</span><br />
            <span className="h-title-highlight">{h.titleLine3}</span>
          </h1>

          <p className="h-sub" dangerouslySetInnerHTML={{ __html: h.subtitle }} />

          <ul className="h-checks">
            {h.checks.map((c, i) => (
              <li key={i} className="h-check">
                <span className="h-check-icon">✔</span>
                {c.text}
              </li>
            ))}
          </ul>

          <div className="h-btns">
            <a href="#contact" className="btn-hero-apply">{h.btn1}</a>
            <a
              href="https://wa.me/919876543210"
              className="btn-hero-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="wa-icon">📱</span> {h.btn2}
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="/images/gallery/banner1.png"
            alt="Shraddha Institute Teacher Training"
            className="hero-photo"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
