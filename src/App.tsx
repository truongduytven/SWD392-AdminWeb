import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Loader from './components/global/molecules/Loader'
import Loading from './components/global/molecules/Loading'
import SignInForm from './components/global/organisms/SignInForm'
import ProtectedRoute from './auth/ProtectedRoute'
import NotAuthorized from './components/global/templates/NotAuthorized'
import AdminProtectedRoute from './auth/AdminProtectedRoute'
import ManagerProtectedRoute from './auth/ManagerProtectedRoute'
import { useAuth } from './auth/AuthProvider'
import NotFoundPage from './components/global/templates/NotFoundPage'
import ProfilePage from './components/global/templates/ProfilePage'
import Template from './components/global/templates/Template'
const RouteLayout = React.lazy(() => import('./components/global/Layout/RouteLayout'))
const UsersPage = React.lazy(() => import('./components/global/templates/Users'))
const CompaniesPage = React.lazy(() => import('./components/global/templates/Companies'))
const SettingsPage = React.lazy(() => import('./components/global/templates/Settings'))
const Home = React.lazy(() => import('./components/global/templates/Dashboard'))
const StaffPage = React.lazy(() => import('./components/global/templates/Staffs'))
const TripPage = React.lazy(() => import('./components/global/templates/Trips'))
const RoutePage = React.lazy(() => import('./components/global/templates/Routes'))
const StationPage = React.lazy(() => import('./components/global/templates/Stations'))
const ServicePage = React.lazy(() => import('./components/global/templates/Services'))
const DashboardManager = React.lazy(() => import('./components/global/templates/DashboardManager'))
function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])
  // useEffect(() => {
  //   if (!loading && user) {
  //     if (user.RoleName === 'Admin') {
  //       navigate('/home/admin')
  //     } else if (user.RoleName === 'Manager') {
  //       navigate('/home/manager')
  //     }
  //   }
  // }, [loading, user, navigate])
  return loading ? (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Loading />
    </div>
  ) : (
    <Routes>
      <Route element={<RouteLayout />}>
      <Route
          path='/home/admin'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/home/manager'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <DashboardManager />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />

        <Route
          path='/users'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <UsersPage />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/companies'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <CompaniesPage />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <SettingsPage />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/staffs'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <StaffPage />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/trips'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <TripPage />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/routes'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <RoutePage />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/stations'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <StationPage />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/templates'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <Template />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>

      <Route
        path='/'
        element={
          <ProtectedRoute>
            <SignInForm />
          </ProtectedRoute>
        }
      />
      
      <Route path='/not-authorized' element={<NotAuthorized />} />
      <Route path='*' element={<NotFoundPage />} />

    </Routes>
  )
}

export default App
