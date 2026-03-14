import React, { useState, useEffect, useCallback } from 'react'
import './BooksKits.css'
import { useLanguage } from '../context/LanguageContext'

const BOOK_SLIDES = [
  { src: '/images/books/Abacus Foundation.jpeg', alt: 'Abacus Foundation' },
  { src: '/images/books/abacus level 1.jpeg',    alt: 'Abacus Level 1' },
  { src: '/images/books/abacus level4.jpeg',     alt: 'Abacus Level 4' },
  { src: '/images/books/abacus level5.jpeg',     alt: 'Abacus Level 5' },
  { src: '/images/books/vedic level1.jpeg',      alt: 'Vedic Math Level 1' },
  { src: '/images/books/vedic level3.jpeg',      alt: 'Vedic Math Level 3' },
  { src: '/images/books/vedic level4.jpeg',      alt: 'Vedic Math Level 4' },
]

const BooksKits = () => {
  const { t } = useLanguage()
  const b = t.booksKits
  const f = t.franchise
  const materials = b.materials

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() =>
    setCurrent(c => (c + 1) % BOOK_SLIDES.length), [])
  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + BOOK_SLIDES.length) % BOOK_SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 2800)
    return () => clearInterval(id)
  }, [paused, next])

  return (
    <section className="books-kits section" id="books-kits">
      <div className="container">
        <div className="bk-header">
          <span className="section-badge">{b.badge}</span>
          <h2 className="section-title">
            {b.title}{' '}
            <span className="bk-grad">{b.titleAccent}</span>
          </h2>
          <p className="section-subtitle" dangerouslySetInnerHTML={{ __html: b.subtitle }} />
        </div>

        <div className="bk-layout">
          <div className="bk-showcase">
            <div
              className="bk-slider"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="bk-slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
                {BOOK_SLIDES.map((slide, i) => (
                  <img
                    key={i}
                    src={slide.src}
                    alt={slide.alt}
                    className="bk-slide-img"
                    draggable={false}
                  />
                ))}
              </div>
              <button className="bk-slider-btn bk-slider-prev" onClick={prev} aria-label="Previous">&#8249;</button>
              <button className="bk-slider-btn bk-slider-next" onClick={next} aria-label="Next">&#8250;</button>
              <div className="bk-slider-dots">
                {BOOK_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={`bk-dot${i === current ? ' bk-dot-active' : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="bk-slide-caption">{BOOK_SLIDES[current].alt}</div>
            </div>
            <div className="bk-promise">
              <span className="bk-promise-icon">🏅</span>
              <div>
                <strong>{b.promiseTitle}</strong>
                <p>{b.promiseText}</p>
              </div>
            </div>
          </div>

          <div className="bk-cards">
            {materials.map((m, i) => (
              <div className="bk-card" key={i} style={{ '--mc': m.color, '--i': i }}>
                <div className="bk-card-icon">{m.icon}</div>
                <div className="bk-card-body">
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
                <div className="bk-card-num">{String(i + 1).padStart(2, '0')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* App Access Banner */}
        <div className="bk-app-banner">
          <div className="bk-app-left">
            <span className="bk-app-badge">📱 Exclusive Access</span>
            <h3>Shraddha Institute Learning App</h3>
            <p>Every certified teacher gets <strong>lifetime access</strong> to our mobile app — packed with recorded Abacus &amp; Vedic Math video lessons, worksheets, and teaching resources, available anytime, anywhere.</p>
            <ul className="bk-app-perks">
              <li>🎬 Recorded video lectures — Abacus &amp; Vedic Math</li>
              <li>📂 Downloadable worksheets &amp; exam papers</li>
              <li>🔔 New content updates &amp; notifications</li>
              <li>📡 Works offline after download</li>
            </ul>
            <a
              href={f.appLink || 'https://play.google.com/store/apps/details?id=co.groot.nitc&pcampaignid=web_share'}
              target="_blank"
              rel="noopener noreferrer"
              className="bk-app-btn"
            >
              📲 Download the App
            </a>
          </div>
          <div className="bk-app-right">
            <div className="bk-app-marquee-wrap">
              <div className="bk-app-marquee-track">
                {[
                  '/images/app/app.webp',
                  '/images/app/app1.webp',
                  '/images/app/app3.webp',
                  '/images/app/app4.webp',
                  '/images/app/app5.webp',
                  '/images/app/app.webp',
                  '/images/app/app1.webp',
                  '/images/app/app3.webp',
                  '/images/app/app4.webp',
                  '/images/app/app5.webp',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`App screenshot ${(i % 5) + 1}`}
                    className="bk-app-screenshot"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BooksKits
