import React from 'react'
import './Income.css'
import { useLanguage } from '../context/LanguageContext'

const Income = () => {
  const { t } = useLanguage()
  const inc = t.income

  return (
    <section className="income section" id="income">
      <div className="container">
        <h2 className="inc-title">
          {inc.title} <span className="inc-highlight">{inc.titleAccent}</span>
        </h2>

        <div className="inc-items">
          {inc.opportunities.map((o, i) => (
            <div className="inc-item" key={i}>
              <div className="inc-item-icon">{o.icon}</div>
              <p className="inc-item-text">{o.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Income
