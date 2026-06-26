import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

const resources = {
  en: { translation: en },
  zh: { translation: zh },
}

// RTL language detection (includes languages not yet in resources for future expansion)
const rtlLanguages = ['ar', 'he', 'fa', 'ur']

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
})

// Update document direction and lang on language change
i18n.on('languageChanged', lng => {
  if (typeof document === 'undefined') {
    return
  }

  const dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
})

export default i18n
export { i18n }
export const availableLanguages = Object.keys(resources)
export const isRTL = (lng: string): boolean => rtlLanguages.includes(lng)
