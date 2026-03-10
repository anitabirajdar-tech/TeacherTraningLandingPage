import React from 'react'
import './Testimonials.css'
import { useLanguage } from '../context/LanguageContext'

const Testimonials = () => {
  const { t } = useLanguage()
  const tm = t.testimonials
  const testimonials = tm.items

  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <h2 className="tm-title">{tm.title}</h2>

        <div className="tm-cards">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div className="tm-card" key={index}>
              {testimonial.video ? (
                <div className="tm-video">
                  <iframe
                    src={testimonial.video}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={testimonial.name}
                  />
                </div>
              ) : (
                <>
                  <div className="tm-photo-wrap">
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="tm-photo"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }}
                    />
                    <span className="tm-photo-fallback">{testimonial.emoji}</span>
                  </div>
                  <p className="tm-quote">{testimonial.quote}</p>
                </>
              )}

              <div className="tm-author">
                <span className="tm-dot" style={{ background: index === 0 ? '#27ae60' : index === 1 ? '#e74c3c' : '#27ae60' }} />
                {testimonial.name}, {testimonial.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
