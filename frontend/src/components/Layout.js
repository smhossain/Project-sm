import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'

// This component is used to wrap admin pages in the application
// It will render the Header component if the current path is not '/admin'
const Layout = ({ children }) => {
  const location = useLocation()

  // Check if the current path starts with '/admin'
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Header />}
      <div className='container-fluid'>{children}</div>
    </>
  )
}

export default Layout
