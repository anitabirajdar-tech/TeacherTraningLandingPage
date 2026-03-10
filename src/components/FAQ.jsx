import React, { useState } from 'react'
import './FAQ.css'
import { useLanguage } from '../context/LanguageContext'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const { t } = useLanguage()
  const f = t.faq
  const faqs = f.items

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <div className="faq-header">
          <span className="section-badge">{f.badge}</span>
          <h2 className="section-title">{f.title}</h2>
          <p className="section-subtitle">{f.subtitle}</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>Q. {faq.question}</span>
                <span className="faq-toggle">▾</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="more-questions">
          <p>{f.stillQuestions}</p>
          <a href="#contact" className="btn btn-primary">{f.contactBtn}</a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
