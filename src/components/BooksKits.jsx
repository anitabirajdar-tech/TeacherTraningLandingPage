import React from 'react'
import './BooksKits.css'
import { useLanguage } from '../context/LanguageContext'

const BooksKits = () => {
  const { t } = useLanguage()
  const b = t.booksKits
  const f = t.franchise
  const materials = b.materials

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
            <div className="bk-kit-card">
              <div className="bk-kit-ribbon">{b.ribbon}</div>
              <div className="bk-kit-icons">
                <span className="bki bki-1">📚</span>
                <span className="bki bki-2">📘</span>
                <span className="bki bki-3">📗</span>
                <span className="bki bki-4">📙</span>
                <span className="bki bki-5">🧮</span>
              </div>
              <p className="bk-kit-label">{b.kitLabel}</p>
              <p className="bk-kit-sub">{b.kitSub}</p>
              <div className="bk-kit-pills">
                {b.pills.map((p, i) => <span key={i}>{p}</span>)}
              </div>
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
