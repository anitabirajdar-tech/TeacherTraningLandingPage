import React, { useState } from 'react'
import './StudentVideos.css'

const videos = [
  {
    id: 'HM-kXSKjNLU',
    label: '🎥 Abacus Speed Demo',
  },
  {
    id: 'HM-kXSKjNLU',
    label: '🎥 Vedic Math Trick',
  },
  {
    id: 'HM-kXSKjNLU',
    label: '🎥 Mental Math Calculation',
  },
  {
    id: 'HM-kXSKjNLU',
    label: '🎥 Competition Speed Round',
  },
  {
    id: 'MxdRV8Uk4p0',
    label: '🎥 Additional Student Clip',
  },
]

// Duplicate for seamless infinite loop
const allVideos = [...videos, ...videos]

const StudentVideos = () => {
  const [activeId, setActiveId] = useState(null)

  return (
    <section className="sv-section">
      <div className="sv-header">
        <h2 className="sv-title">⚡ Watch Our Students in Action</h2>
        <p className="sv-sub">See real results from our certified teachers' students</p>
      </div>

      <div className="sv-track-wrap">
        <div className="sv-track">
          {allVideos.map((v, i) => (
            <div className="sv-card" key={i} onClick={() => setActiveId(v.id + '_' + i)}>
              <div className="sv-thumb-wrap">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.label}
                  className="sv-thumb"
                />
                <div className="sv-play-btn">▶</div>
              </div>
              <p className="sv-label">{v.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal overlay */}
      {activeId && (
        <div className="sv-modal" onClick={() => setActiveId(null)}>
          <div className="sv-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="sv-modal-close" onClick={() => setActiveId(null)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${activeId.split('_')[0]}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Student Video"
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default StudentVideos
