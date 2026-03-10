import React, { useState, useEffect } from 'react'
import './Header.css'
import { useLanguage, LANGUAGES } from '../context/LanguageContext'

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const { lang, switchLang, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const navLinks = [
    { name: t.nav.home, href: '#home', id: 'home' },
    { name: t.nav.about, href: '#about', id: 'about' },
    { name: t.nav.programs, href: '#programs', id: 'programs' },
    { name: t.nav.gallery, href: '#gallery', id: 'gallery' },
    { name: t.nav.testimonials, href: '#testimonials', id: 'testimonials' },
    { name: t.nav.faq, href: '#faq', id: 'faq' },
    { name: t.nav.contact, href: '#contact', id: 'contact' },
  ]

  useEffect(() => {
    const ids = ['home', 'about', 'programs', 'gallery', 'testimonials', 'faq', 'contact']
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = ids.map(id => document.getElementById(id)).filter(Boolean)
      let current = 'home'
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#home" className="logo">
          <img
            src="/images/gallery/background%20remove.png"
            alt="Shraddha Institute logo"
            className="logo-img"
          />
        </a>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className={activeSection === link.id ? 'nav-active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-primary nav-cta" onClick={() => setIsMenuOpen(false)}>
            {t.nav.register}
          </a>
        </nav>

        {/* Language switcher */}
        <div className="lang-switcher">
          <select
            value={lang}
            onChange={e => switchLang(e.target.value)}
            aria-label="Select language"
            className="lang-select"
          >
            <option value="" disabled hidden>
              {t.nav.language || 'Language'}
            </option>
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header
