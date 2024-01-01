import logo from '../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import './css/nav.css'

function Header() {
  const { t } = useTranslation('header')
  return (
    <nav className='navbar navbar-expand-lg navbar-light navbar-custom'>
      <div className='container'>
        <a className='navbar-brand' href='/'>
          <img className='logo' src={logo} alt='logo...' />
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <FontAwesomeIcon icon={faBars} style={{ color: '#fff' }} />
        </button>
        <div className='container text-white'>
          <h1 className='display-6 quran-font'>{t('sma')}</h1>
        </div>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav ml-auto'>
            <li className='nav-item active'>
              <a
                className={`nav-link ${
                  window.location.pathname === '/' ? 'active' : ''
                }`}
                href='/'
              >
                {t('home')} <span className='sr-only'>(current)</span>
              </a>
            </li>
            <li
              className={`nav-item dropdown ${
                window.location.pathname === '/tafseer/search' ||
                window.location.pathname === '/tafseer/all'
                  ? 'active'
                  : ''
              }`}
            >
              <button
                className='btn btn-link dropdown-toggle'
                type='button' // Important to specify the type
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                {t('tafseer')}
              </button>
              <ul className='dropdown-menu'>
                <li>
                  <a
                    className={`dropdown-item ${
                      window.location.pathname === '/tafseer/all'
                        ? 'active'
                        : ''
                    }`}
                    href='/tafseer/all'
                  >
                    {t('all_tafseers')}
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      window.location.pathname === '/tafseer/search'
                        ? 'active'
                        : ''
                    }`}
                    href='/tafseer/search'
                  >
                    {t('search_tafseers')}
                  </a>
                </li>
              </ul>
            </li>
            <li
              className={`nav-item dropdown ${
                window.location.pathname === '/queries/new' ||
                window.location.pathname === '/queries/all'
                  ? 'active'
                  : ''
              }`}
            >
              <button
                className='btn btn-link dropdown-toggle'
                type='button' // Important to specify the type
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                {t('queries')}
              </button>
              <ul className='dropdown-menu'>
                <li>
                  <a
                    className={`dropdown-item ${
                      window.location.pathname === '/queries/new'
                        ? 'active'
                        : ''
                    }`}
                    href='/queries/new'
                  >
                    {t('new')}
                  </a>
                </li>
                <li>
                  <a
                    className={`dropdown-item ${
                      window.location.pathname === '/queries/all'
                        ? 'active'
                        : ''
                    }`}
                    href='/queries/all'
                  >
                    {t('all_queries')}
                  </a>
                </li>
              </ul>
            </li>
            <li className='nav-item'>
              <a
                className={`nav-link ${
                  window.location.pathname === '/publications' ? 'active' : ''
                }`}
                href='/writings'
              >
                {t('publications')}
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={`nav-link ${
                  window.location.pathname === '/about' ? 'active' : ''
                }`}
                href='/about'
              >
                {t('about')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
