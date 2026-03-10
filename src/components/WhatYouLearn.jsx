import React from 'react'
import './WhatYouLearn.css'
import { useLanguage } from '../context/LanguageContext'

const WhatYouLearn = () => {
  const { t } = useLanguage()
  const w = t.whatYouLearn

  return (
    <section className="what-you-learn section" id="programs">
      <div className="container">
        <h2 className="wyl-title">{w.title}</h2>

        <div className="wyl-cards">
          {/* Abacus Card */}
          <div className="wyl-card">
            <h3 className="wyl-card-title">{w.tab1}</h3>
            {w.abacusVideo && (
              <div className="wyl-video-wrap">
                <p className="wyl-video-label">{w.abacusVideoLabel}</p>
                <div className="wyl-video">
                  <iframe
                    src={w.abacusVideo}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Abacus Video"
                  />
                </div>
              </div>
            )}
            <ul className="wyl-list">
              {w.abacusTopics.map((topic, index) => (
                <li key={index}>
                  <span className="wyl-dot wyl-dot-green" />
                  {topic.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Vedic Math Card */}
          <div className="wyl-card">
            <h3 className="wyl-card-title">{w.tab2}</h3>
            {w.vedicVideo && (
              <div className="wyl-video-wrap">
                <p className="wyl-video-label">{w.vedicVideoLabel}</p>
                <div className="wyl-video">
                  <iframe
                    src={w.vedicVideo}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Vedic Math Video"
                  />
                </div>
              </div>
            )}
            <ul className="wyl-list">
              {w.vedicTopics.map((topic, index) => (
                <li key={index}>
                  <span className="wyl-dot wyl-dot-red" />
                  {topic.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatYouLearn
