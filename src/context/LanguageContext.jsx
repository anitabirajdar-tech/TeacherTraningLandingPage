import React, { createContext, useContext, useState } from 'react'
import translations from '../i18n/translations'

const LanguageContext = createContext(null)

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🌐' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
]

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('si-lang') || 'mr')

  const switchLang = (code) => {
    setLang(code)
    localStorage.setItem('si-lang', code)
  }

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
