import { NavLink, useLocation } from 'react-router-dom'
import { SideNavData } from './SideNavData'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FaAngleRight, FaAngleDown } from 'react-icons/fa'
import i18next from 'i18next'

function SideNav() {
  const { t } = useTranslation('sidebar')
  const [activeNav, setActiveNav] = useState(null)
  const direction = i18next.resolvedLanguage || 'ltr'
  const location = useLocation()

  return (
    <div className='sidebar full-height'>
      <ul className='sidebarList'>
        {SideNavData.map((val, key) => (
          <div key={key}>
            {val.subNav && val.subNav.length > 0 ? (
              <div
                className={`row link ${
                  location.pathname === val.link ? 'active' : ''
                }`}
                onClick={() =>
                  setActiveNav(val.title === activeNav ? null : val.title)
                }
              >
                <div className='icon'>{val.icon}</div>
                <div className='title'>{t(val.title)}</div>
                <div className='arrowIcon'>
                  {activeNav === val.title ? (
                    <FaAngleDown />
                  ) : direction === 'ltr' ? (
                    <FaAngleRight />
                  ) : (
                    <div className='flippedArrow'>
                      <FaAngleRight />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <NavLink
                className={`row link ${
                  location.pathname === val.link ? 'active' : ''
                }`}
                to={val.link}
                end={val.link === '/admin'}
              >
                <div className='icon'>{val.icon}</div>
                <div className='title'>{t(val.title)}</div>
              </NavLink>
            )}
            {val.subNav && val.subNav.length > 0 && activeNav === val.title && (
              <div className={`subNavItems ${direction}`}>
                {val.subNav.map((subItem, subKey) => (
                  <NavLink
                    className={`row subNavLink ${
                      location.pathname === subItem.link ? 'active' : ''
                    }`}
                    key={subKey}
                    to={subItem.link}
                  >
                    <div className='subNavTitle'>{t(subItem.title)}</div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default SideNav
