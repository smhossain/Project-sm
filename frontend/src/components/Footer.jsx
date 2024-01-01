import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation('footer')
  return (
    <footer
      className='py-4 my-4'
      style={{ backgroundColor: 'rgb(24, 46, 43)' }}
    >
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 col-sm-6'>
            <p className='text-left text-white font-weight-bold'>
              {t('sayed')}
            </p>
          </div>
          <div className='col-lg-2 col-sm-2'>
            <div className='col-2'>
              <p className='text-white font-weight-bold'>{t('sma')}</p>
            </div>
            <div className='col-2'>
              <p>
                <a className='text-white link' href='/'>
                  {t('home')}
                </a>
              </p>
            </div>
            <div className='col-2'>
              <p>
                <a className='text-white link' href='/writings'>
                  {t('publications')}
                </a>
              </p>
            </div>
            <div className='col-2'>
              <p>
                <a className='text-white link' href='/about'>
                  {t('about')}
                </a>
              </p>
            </div>
          </div>
          <div className='col-lg-2 col-sm-2'>
            <div className='col-2'>
              <p className='text-white font-weight-bold'>{t('tafseer')}</p>
            </div>
            <div className='col-2'>
              <p>
                <a className='text-white link' href='/tafseer'>
                  {t('browse')}
                </a>
              </p>
            </div>
            <div className='col-2'>
              <p>
                <a className='text-white link' href='/queries'>
                  {t('queries')}
                </a>
              </p>
            </div>
          </div>
          <div className='col-lg-2 col-sm-2'>
            <div className='col-2'>
              <p className='text-white font-weight-bold'>{t('contact')}</p>
            </div>
            <div className='col-2'>
              <p className='text-white'>{t('email')}</p>
            </div>
          </div>
          <div className='row'>
            <p className='text-center text-white'>
              Copyright &copy;Sayed Mortadha 2023
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
