// import AdminLayout from "@/components/AdminLayout"
import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
// import RouteLayout from './components/RouteLayout'
import Loader from './components/global/molecules/Loader'
// import UsersPage from './components/global/templates/Users'
// import OrdersPage from './components/global/templates/Orders';
// import SettingsPage from './components/global/templates/Settings';
// import Home from './components/global/templates/Dashboard';
const RouteLayout = React.lazy(() => import('./components/RouteLayout'))
const UsersPage = React.lazy(() => import('./components/global/templates/Users'))
const OrdersPage = React.lazy(() => import('./components/global/templates/Orders'))
const SettingsPage = React.lazy(() => import('./components/global/templates/Settings'))
const Home = React.lazy(() => import('./components/global/templates/Dashboard'))

function App() {
	const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
		setTimeout(() => setLoading(false), 1000)
	}, [])
  return loading?(<Loader/>): (

    // <>
    //   <div className=''>
    //     {/* <AdminLayout/> */}
    //     <RouteLayout children={<UsersPage />} />
    //     fgfrgrg
    //   </div>
    // </>
    //   <Routes>
    //   <Route element={<RouteLayout />}>
    //     <Route path="/" element={<Home />} />
    //     <Route path="users" element={<UsersPage />} />
    //     <Route path="orders" element={<OrdersPage />} />
    //     <Route path="settings" element={<SettingsPage />} />
    //   </Route>
    // </Routes>

    //   <Suspense fallback={<div>Loading...</div>}>
    //   <Routes>
    //     <Route element={<RouteLayout />}>
    //       <Route path="/" element={<Home />} />
    //       <Route path="users" element={<UsersPage />} />
    //       <Route path="orders" element={<OrdersPage />} />
    //       <Route path="settings" element={<SettingsPage />} />
    //     </Route>
    //   </Routes>
    // </Suspense>
    <Routes>
      <Route element={<RouteLayout />}>
        <Route
          path='/'
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path='users'
          element={
            <Suspense fallback={<Loader />}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route
          path='orders'
          element={
            <Suspense fallback={<Loader />}>
              <OrdersPage />
            </Suspense>
          }
        />
        <Route
          path='settings'
          element={
            <Suspense fallback={<Loader />}>
              <SettingsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
