import React, { useState } from 'react'
import './Testimonials.css'
import { useLanguage } from '../context/LanguageContext'

const TEACHER_VIDEOS = [
  { id: '5X02qZAiKMY', name: 'Mrs. Dipmala Kolekar', location: 'Solapur, Maharashtra' },
  { id: 'ycXsHXewqqE', name: 'Mrs. Aarti Lalbige', location: 'Pune, Maharashtra' },
  { id: 'R1-tV-ItNsc', name: 'Mrs. Savita Mohite', location: 'Pune, Maharashtra' },
  { id: 'kETpHR3XiKA', name: 'Mrs. Ashawini Narayankar', location: 'Pune, Maharashtra' },
  { id: 'SZ2jqSOi_C8', name: 'Mrs. Nita Pawar', location: 'Solapur, Maharashtra' },
  { id: 'TW8PKxkpYus', name: 'Mrs.Rupa Dhepe', location: 'Solpaur, Maharashtra' },
  { id: 'E4MiDkQ73ms', name: 'Mrs. Ashwini kadam', location: 'Pune, Maharashtra' },
  { id: 'eUuG_eKT3CU', name: 'Mrs. Ashwini Kamble', location: 'Pune, Maharashtra' },
]

const Testimonials = () => {
  const { t } = useLanguage()
  const tm = t.testimonials
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <>
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <div className="tm-header">
          <span className="section-badge">{tm.badge}</span>
          <h2 className="tm-title">{tm.title}</h2>
          <p className="tm-subtitle">{tm.subtitle}</p>
        </div>
      </div>

      {/* Full-width marquee outside container for edge-to-edge */}
      <div className="tm-marquee-wrap">
        <div className="tm-track">
          {[...TEACHER_VIDEOS, ...TEACHER_VIDEOS].map((v, i) => (
            <div className="tm-vid-card" key={i} onClick={() => setActiveVideo(v)}>
              <div className="tm-vid-frame">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.name}
                  className="tm-thumb"
                  loading="lazy"
                />
                <div className="tm-play-btn">▶</div>
              </div>
              <div className="tm-caption">
                <strong>{v.name}</strong><br />
                <span>{v.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Video modal ── */}
    {activeVideo && (
      <div className="tm-modal" onClick={() => setActiveVideo(null)}>
        <div className="tm-modal-inner" onClick={e => e.stopPropagation()}>
          <button className="tm-modal-close" onClick={() => setActiveVideo(null)}>✕</button>
          <iframe
            src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={activeVideo.name}
          />
        </div>
      </div>
    )}
  </>
  )
}

export default Testimonials
