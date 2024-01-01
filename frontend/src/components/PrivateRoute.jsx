import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const { isAuthenticated, checkingStatus, isAdmin } = useAuthStatus()

  if (checkingStatus) {
    return <Spinner />
  }
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute
