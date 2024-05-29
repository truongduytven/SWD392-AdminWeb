import SideNavbar from '@/components/global/organisms/SideNavbar'
import { Outlet } from 'react-router-dom'
import LogoFull2 from '../assets/LogoFull2.png'
import { Avatar, AvatarFallback, AvatarImage } from './global/atoms/ui/avatar'
function RouteLayout() {
  return (
    <div>
      <div className='flex justify-between items-center px-10 py-2'>
        <div className='h-14'>
          <img src={LogoFull2} className='h-full' />
        </div>
        <div className=''>
          <img className='h-14 w-14' src='https://api.dicebear.com/8.x/adventurer/svg?seed=Oliver' alt='avatar' />
        </div>
       
      </div>
      <hr/>
      <div className='min-h-screen w-full bg-white text-black flex '>
        <SideNavbar />
        <div className='p-8 w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default RouteLayout
