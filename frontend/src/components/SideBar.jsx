import React, { useState } from 'react'
import { SideNavData } from './SideNavData'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import i18next from 'i18next'

function SideBar() {
  const { t } = useTranslation('sidebar')
  const location = useLocation()

  const nav = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [activeIndex, setActiveIndex] = useState(null) // State to keep track of active dropdown

  const toggleDropdown = (index) => {
    // Toggle between active and null
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset())
    nav('/')
  }

  return (
    <div className='col-12 col-sm-3 col-xl-2 col-l-1 px-sm-2 px-0 green-background d-flex sticky-top'>
      <div className='d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2 text-white'>
        <a
          href='/'
          className='d-flex align-items-center pb-sm-3 mb-md-0 me-md-auto text-white text-decoration-none'
        >
          <span className='fs-5'>
            {t('s')}
            <span className='d-none d-sm-inline'> {t('mortadha')}</span>
          </span>
        </a>
        <ul
          className='nav nav-pills flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start'
          id='menu'
        >
          {SideNavData.map((item, index) => (
            <li key={index} className='nav-item'>
              {/* Link to the item's page */}
              <Link
                to={`/${item.link}`}
                className={`nav-link px-sm-0 px-2 text-white ${
                  location.pathname === `/${item.link}` ? 'active' : ''
                }`}
                onClick={(e) => {
                  // Prevent default action and toggle dropdown if item has subNav
                  if (item.subNav && item.subNav.length > 0) {
                    e.preventDefault()
                    toggleDropdown(index)
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                  <span className='ms-1 d-none d-sm-inline'>
                    {t(item.title)}
                  </span>
                  {/* Show dropdown arrow if item has subNav */}
                  {item.subNav && item.subNav.length > 0 && (
                    <span
                      className={`material-symbols-outlined ${
                        activeIndex === index ? 'rotate' : ''
                      }`}
                      style={{
                        transform: `rotate(${
                          activeIndex === index
                            ? 90
                            : i18next.resolvedLanguage === 'ar'
                            ? 180
                            : 0
                        }deg)`
                      }}
                    >
                      navigate_next
                    </span>
                  )}
                </div>
              </Link>
              {/* Show subNav if item has subNav and it's active */}
              {item.subNav &&
                item.subNav.length > 0 &&
                activeIndex === index && (
                  <ul className='subnav'>
                    {item.subNav.map((subItem, subIndex) => (
                      <li key={`sub-${subIndex}`}>
                        <Link
                          to={`/${subItem.link}`}
                          className='nav-link px-sm-0 px-2 text-white'
                        >
                          {subItem.icon}
                          <span className='ms-1 d-none d-sm-inline'>
                            {t(subItem.title)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
        {/* This section is for the account and sign-out */}
        {user ? (
          <div className='dropdown py-sm-4 mt-sm-auto ms-auto ms-sm-0 flex-shrink-1'>
            <button
              className='d-flex align-items-center text-white text-decoration-none dropdown-toggle btn'
              id='dropdownUser1'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <img
                src='https://github.com/mdo.png'
                alt='hugenerd'
                width='28'
                height='28'
                className='rounded-circle'
              />
              <span className='d-none d-sm-inline mx-1'>{user.name}</span>
            </button>
            <ul
              className='dropdown-menu dropdown-menu-dark text-small shadow'
              aria-labelledby='dropdownUser1'
            >
              <li>
                <Link className='dropdown-item' to={'settings'}>
                  Settings
                </Link>
              </li>
              <li>
                <Link className='dropdown-item' to={'settings'}>
                  Profile
                </Link>
              </li>
              <li>
                <hr className='dropdown-divider' />
              </li>
              <li>
                <Link className='dropdown-item' onClick={handleLogout}>
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default SideBar
