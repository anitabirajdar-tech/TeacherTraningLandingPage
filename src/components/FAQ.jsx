import React, { useState } from 'react'
import './FAQ.css'
import { useLanguage } from '../context/LanguageContext'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const { t } = useLanguage()
  const f = t.faq
  const faqs = f.items

  const toggleFAQ = (index) => {
    setActiveIndex(prev => (prev === index ? null : index))
  }

  return (
    <section className="faq section" id="faq">
      {/* Decorative blobs */}
      <div className="faq-blob faq-blob-1" />
      <div className="faq-blob faq-blob-2" />

      <div className="container">
        {/* Header */}
        <div className="faq-header">
          <span className="section-badge">{f.badge}</span>
          <h2 className="section-title">{f.title}</h2>
          <p className="section-subtitle">{f.subtitle}</p>
        </div>

        {/* FAQ Grid */}
        <div className="faq-grid">
          <div className="faq-col">
            {faqs.filter((_, i) => i % 2 === 0).map((faq, ci) => {
              const index = ci * 2
              return (
                <div
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                  key={index}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={activeIndex === index}
                  >
                    <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="faq-q-text">{faq.question}</span>
                    <span className="faq-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="faq-col">
            {faqs.filter((_, i) => i % 2 === 1).map((faq, ci) => {
              const index = ci * 2 + 1
              return (
                <div
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                  key={index}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={activeIndex === index}
                  >
                    <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="faq-q-text">{faq.question}</span>
                    <span className="faq-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="faq-cta">
          <div className="faq-cta-icon">🤔</div>
          <div className="faq-cta-text">
            <h3>{f.stillQuestions}</h3>
            <p>Our team is happy to help you with any query — reach out anytime!</p>
          </div>
          <a href="#contact" className="btn btn-primary faq-cta-btn">{f.contactBtn}</a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
