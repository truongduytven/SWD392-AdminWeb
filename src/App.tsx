import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/global/molecules/Loader'
import Loading from './components/global/molecules/Loading'
import SignInForm from './components/global/organisms/SignInForm'
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
function App() {
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])
  return loading ? (
    <Loading />
  ) : (
   
    <Routes>
      <Route element={<RouteLayout />}>
        <Route 
          path='/home'
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path='/users'
          element={
            <Suspense fallback={<Loader />}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route
          path='/companies'
          element={
            <Suspense fallback={<Loader />}>
              <CompaniesPage />
            </Suspense>
          }
        />
        <Route
          path='/settings'
          element={
            <Suspense fallback={<Loader />}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path='/staffs'
          element={
            <Suspense fallback={<Loader />}>
              <StaffPage />
            </Suspense>
          }
        />
        <Route
          path='/trips'
          element={
            <Suspense fallback={<Loader />}>
              <TripPage />
            </Suspense>
          }
        />
        <Route
          path='/routes'
          element={
            <Suspense fallback={<Loader />}>
              <RoutePage />
            </Suspense>
          }
        />
        <Route
          path='/stations'
          element={
            <Suspense fallback={<Loader />}>
              <StationPage />
            </Suspense>
          }
        />
        <Route
          path='/services'
          element={
            <Suspense fallback={<Loader />}>
              <ServicePage />
            </Suspense>
          }
        />
      </Route>
      <Route path='/' element={<SignInForm />} />

    </Routes>
  )
}

export default App
