import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/global/atoms/ui/dropdown-menu'
import SideNavbar from '@/components/global/organisms/SideNavbar'
import { BookUser, LogOut } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import LogoFull2 from '../../../assets/LogoFull2.png'
import { useEffect, useState } from 'react'
import { useAuth } from '@/auth/AuthProvider'

function RouteLayout() {
  // const user = useAuth()
  // console.log("user ở layout", user)
  // const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const {userDetail} = useAuth();
  console.log("user ở layout", userDetail);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (userDetail?.RoleName === 'Admin') {
      setIsAdmin(true);
    } else if (userDetail?.RoleName === 'Manager') {
      setIsAdmin(false);
    }
  }, [userDetail]);
  return (
    // <div>
    //   <div className='flex justify-between items-center px-10 py-2'>
    //     <div className='h-14'>
    //       <img src={LogoFull2} className='h-full' />
    //     </div>
    //     <div className=''>
    //       <img className='h-14 w-14' src='https://api.dicebear.com/8.x/adventurer/svg?seed=Oliver' alt='avatar' />
    //     </div>

    //   </div>
    //   <hr/>
    //   <div className='min-h-screen w-full bg-white text-black flex '>
    //     <SideNavbar />
    //     <div className='p-8 w-full'>
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
    <div className='relative'>
      <div className='fixed top-0 left-0 right-0 flex justify-between items-center px-20 py-2 bg-white z-10 shadow-md'>
        <div className='h-14'>
          <img src={LogoFull2} className='h-full' alt='Logo' />
        </div>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <img className='h-12 w-12 cursor-pointer' src='https://api.dicebear.com/8.x/adventurer/svg?seed=Oliver' alt='avatar' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-fit'>
              <DropdownMenuLabel className='py-0'>ThuongMinhlsr</DropdownMenuLabel>
              <DropdownMenuItem className='py-0 text-xs' disabled>
                thuongminhlsr@gmail.com
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='flex justify-start items-center gap-1 cursor-pointer'>
                <BookUser className='w-4' />
                Hồ sơ người dùng
              </DropdownMenuItem>
              <DropdownMenuItem className='flex justify-start items-center gap-1 cursor-pointer'>
                <LogOut className='w-4' />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
      <div className='pt-24 min-h-screen w-full bg-white text-black flex'>
        <SideNavbar isAdmin={isAdmin}/>
        <div className=' p-8 w-full h-screen overflow-y-auto no-scrollbar'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default RouteLayout
