import React from 'react'
import './BooksKits.css'
import { useLanguage } from '../context/LanguageContext'

const BooksKits = () => {
  const { t } = useLanguage()
  const b = t.booksKits
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
      </div>
    </section>
  )
}

export default BooksKits
