import { useTranslation } from 'react-i18next'

function Hero() {
  const { t } = useTranslation('hero')
  return (
    <div className='jumbotron jumbotron-fluid quran-font'>
      <div className='container'>
        <h1 className='display-4'>{t('tafseer_alhadi')}</h1>
        <p className='lead fw-normal'>{t('author')}</p>
        <hr className='my-4' />
        <p>{t('bottom')}</p>
        <a
          className='btn btn-primary btn-lg btn-green'
          href='/tafseer/all'
          role='button'
        >
          {t('learn_more')}
        </a>
        <a
          className='btn btn-secondary btn-lg btn-gold mx-3'
          href='/tafseer/search'
          role='button'
        >
          {t('browse')}
        </a>
      </div>
    </div>
  )
}

export default Hero
