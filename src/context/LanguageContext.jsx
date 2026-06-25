import { createContext, useContext, useState } from 'react'
import tr from '../locales/tr'
import en from '../locales/en'

const locales = { tr, en }

const LanguageContext = createContext(null)

// Resolve a dot-separated key like "nav.login" from a nested object
const resolve = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('takasla_lang') || 'tr'
  )

  const toggle = () => {
    const next = lang === 'tr' ? 'en' : 'tr'
    setLang(next)
    localStorage.setItem('takasla_lang', next)
  }

  // t('nav.login') → string
  // t('coinBar.remaining', { amount: '500' }) → '500 ß kaldı'
  const t = (key, params = {}) => {
    const value = resolve(locales[lang], key) ?? resolve(locales.tr, key) ?? key
    if (typeof value !== 'string') return key
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(new RegExp(`{${k}}`, 'g'), String(v)),
      value
    )
  }

  // For arrays (e.g. categories list)
  const ta = (key) => {
    const value = resolve(locales[lang], key) ?? resolve(locales.tr, key)
    return Array.isArray(value) ? value : []
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, ta }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
