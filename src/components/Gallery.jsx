import React, { useState } from 'react'
import './Gallery.css'
import { useLanguage } from '../context/LanguageContext'

const Gallery = () => {
  const [lightbox, setLightbox] = useState(null)
  const { t } = useLanguage()
  const g = t.gallery

  const photos = [
    { src: '/images/gallery/gallery-1.jpg', fallback: '🎓', category: 'training' },
    { src: '/images/gallery/gallery-2.jpg', fallback: '🧮', category: 'students' },
    { src: '/images/gallery/gallery-3.jpg', fallback: '🏆', category: 'events' },
    { src: '/images/gallery/gallery-4.jpg', fallback: '📝', category: 'events' },
    { src: '/images/gallery/gallery-5.jpg', fallback: '🎖', category: 'training' },
    { src: '/images/gallery/gallery-6.jpg', fallback: '👥', category: 'students' },
  ].map((p, i) => ({ ...p, label: g.labels[i] }))

  const videos = [
    { youtubeId: null, localSrc: '/videos/intro.mp4', label: 'Intro Video' },
  ]

  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <div className="gallery-header">
          <span className="section-badge">{g.badge}</span>
          <h2 className="section-title">{g.title}</h2>
          <p className="section-subtitle">{g.subtitle}</p>
        </div>

        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="gallery-card"
              onClick={() => setLightbox(photo)}
            >
              <div className="gallery-img-wrap">
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="gallery-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="gallery-fallback" style={{ display: 'none' }}>
                  <span>{photo.fallback}</span>
                </div>
                <div className="gallery-overlay">
                  <span className="gallery-zoom">🔍</span>
                </div>
              </div>
              <div className="gallery-label">{photo.label}</div>
            </div>
          ))}
        </div>

        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
              <img src={lightbox.src} alt={lightbox.label} className="lightbox-img" />
              <p style={{ color: '#fff', textAlign: 'center', marginTop: 10, fontSize: '0.9rem' }}>{lightbox.label}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Gallery
