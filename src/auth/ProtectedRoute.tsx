import { ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const {user} = useAuth()
  const token = localStorage.getItem('token')
  const location = useLocation()
  const navigate = useNavigate()
  if (user?.RoleName==="Admin" || user?.RoleName==="Manager") {
    // If token exists, navigate back to the previous page or to the home page as a fallback
    return <Navigate to={location.state?.from || `/home/${user?.RoleName==="Admin"?"admin":"manager"}`} replace />
  } 
  return <>{children}</>
}

export default ProtectedRoute
