import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import StudentVideos from './components/StudentVideos'
import WhoCanJoin from './components/WhoCanJoin'
import WhatYouLearn from './components/WhatYouLearn'
import Certification from './components/Certification'
import BooksKits from './components/BooksKits'
import Testimonials from './components/Testimonials'
import Gallery from './components/Gallery'
import Franchise from './components/Franchise'
import TrainingMode from './components/TrainingMode'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'
import Dashboard from './pages/Dashboard'
import { LanguageProvider } from './context/LanguageContext'
import './App.css'

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="app">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Hero />
        <About />
        <Testimonials />
        <WhoCanJoin />
        <WhatYouLearn />
        <StudentVideos />
        <Certification />
        <BooksKits />
        <Gallery />
        <Franchise />
        <TrainingMode />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<LandingPage />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App

