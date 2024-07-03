import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'

type AdminProtectedRouteProps = RouteProps & {
    children: React.ReactNode
  }

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/" />
  }

  if (user.RoleName !== 'Admin') {
    // Redirect to not authorized page if user is not an admin
    return <Navigate to="/not-authorized" />
  }

  return <>{children}</>
}

export default AdminProtectedRoute
