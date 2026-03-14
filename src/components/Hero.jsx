import React from 'react'
import './Hero.css'
import { useLanguage } from '../context/LanguageContext'

const Hero = () => {
  const { t } = useLanguage()
  const h = t.hero

  return (
    <section className="hero" id="home">
      <div className="hero-img-wrap">
        <img
          src="/images/Hero/hero1.png"
          alt="Become a Certified Abacus & Vedic Math Teacher"
          className="hero-main-img"
        />
        <div className="hero-btn-bar">
          <a href="#contact" className="btn-hero-apply">{h.btn1}</a>
          <a
            href="https://wa.me/9168756060"
            className="btn-hero-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="wa-icon">📱</span> {h.btn2}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
