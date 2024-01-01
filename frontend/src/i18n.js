import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    debug: false,
    ns: ['header', 'hero', 'home', 'midsection', 'latest-queries', 'tafseer'],
    interpolation: {
      espaceValue: false,
      formatSeparator: ','
    },
    backend: {
      loadPath: '/locales/{{ns}}/{{lng}}.json'
    },
    react: {
      useSuspens: true
    },
    detection: {
      order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain'
      ],
      caches: ['localStorage', 'cookie']
    }
  })

export default i18n
