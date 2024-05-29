import SideNavbar from '@/components/global/organisms/SideNavbar'
import { Outlet } from 'react-router-dom'
function RouteLayout() {
  return (
    <div className='min-h-screen w-full bg-white text-black flex '>
      <SideNavbar />
      <div className='p-8 w-full'>
        <Outlet />
      </div>
    </div>
  )
}

export default RouteLayout
