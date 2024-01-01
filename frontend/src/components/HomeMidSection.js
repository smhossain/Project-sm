import { useTranslation } from 'react-i18next'

function HomeMidSection() {
  const { t } = useTranslation('midsection')
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-6 col-sm mid-section-img'>
          <img src='/Holy-Book1.jpeg' alt='mid-pic' />
        </div>
        <div className='col-6 mt-1'>
          <h1 className='display-6'>{t('publications')}</h1>
          <h1 className='display-3 pb-5'>{t('precious_publications')}</h1>
          <a
            className='btn btn-primary btn-lg btn-green-on-white mt-4'
            href='/writings'
            role='button'
          >
            {t('go_to_publications')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomeMidSection
