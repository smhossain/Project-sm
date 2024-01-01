import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      setIsAdmin(user.isAdmin) // Assuming user object has an isAdmin attribute
    } else {
      setIsAuthenticated(false)
      setIsAdmin(false)
    }
    setCheckingStatus(false)
  }, [user])

  return { isAuthenticated, checkingStatus, isAdmin }
}
