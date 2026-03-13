import React from 'react'
import './Footer.css'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()
  const f = t.footer

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <a href="#home" className="footer-logo-link">
                <img
                  src="/images/gallery/background%20remove.png"
                  alt="Shraddha Institute logo"
                  className="footer-logo-img"
                />
              </a>
            </div>
            <p className="footer-description">{f.description}</p>
            <div className="footer-trust">
              {f.trust.map((item, i) => (
                <span key={i}>{item}<br /></span>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <h4>{f.quickLinks}</h4>
            <ul>
              <li><a href="#home">{f.links.home}</a></li>
              <li><a href="#about">{f.links.about}</a></li>
              <li><a href="#programs">{f.links.programs}</a></li>
              <li><a href="#gallery">{f.links.gallery}</a></li>
              <li><a href="#testimonials">{f.links.testimonials}</a></li>
              <li><a href="#faq">{f.links.faq}</a></li>
              <li><a href="#contact">{f.links.contact}</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>{f.programs}</h4>
            <ul>
              {f.programLinks.map((link, i) => (
                <li key={i}><a href="#programs">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4>{f.contactInfo}</h4>
            <ul>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+918446889966">+91 84468 89966</a>
              </li>
              <li>
                <span className="contact-icon">📲</span>
                <a href="https://wa.me/919168756060?text=Hello" target="_blank" rel="noopener noreferrer">+91 91687 56060 (WhatsApp)</a>
              </li>
              <li>
                <span className="contact-icon">📧</span>
                <span>info@shraddhainstitute.com</span>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>{f.available}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Shraddha Institute. {f.copyright}</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/shraddhainstitute/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">📷</a>
            <a href="https://www.youtube.com/watch?v=K2ees_bJSyE" aria-label="YouTube" target="_blank" rel="noopener noreferrer">📺</a>
            <a href="https://wa.me/919168756060?text=Hello" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">💬</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
