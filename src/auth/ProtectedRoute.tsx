import { ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token')
  const location = useLocation()
  const navigate = useNavigate()
  if (token) {
    // If token exists, navigate back to the previous page or to the home page as a fallback
    return <Navigate to={location.state?.from || '/'} replace />
  } 
  return <>{children}</>
}

export default ProtectedRoute
