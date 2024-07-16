import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/global/atoms/ui/dropdown-menu'
import SideNavbar from '@/components/global/organisms/SideNavbar'
import { BookUser, Loader, LogOut } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import LogoFull2 from '../../../assets/LogoFull.png'
import { useEffect, useState } from 'react'
import { useAuth } from '@/auth/AuthProvider'

function RouteLayout() {
  const { user, loading, logout } = useAuth()
  // console.log('user ở layout', user)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  // const {userDetail} = useAuth();
  // console.log("user ở layout", userDetail);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.RoleName === 'Admin')
    }
  }, [user])
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full' role='status'>
          <span className='visually-hidden'>
            <Loader className='w-4 h-4 animate-spin' />
          </span>
        </div>
      </div>
    )
  }
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
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                className='h-12 w-12 cursor-pointer rounded-full object-cover'
                src={user?.Avatar || 'https://api.dicebear.com/8.x/adventurer/svg?seed=Oliver'}
                alt='avatar'
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-fit'>
              <DropdownMenuLabel className='py-0'>{user?.UserName}</DropdownMenuLabel>
              <DropdownMenuItem className='py-0 text-xs' disabled>
                {user?.Email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to='/profile'>
                <DropdownMenuItem className='flex justify-start items-center gap-1 cursor-pointer'>
                  <BookUser className='w-4' />
                  Hồ sơ người dùng
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className='flex justify-start items-center gap-1 cursor-pointer'
                onClick={() => logout()}
              >
                <LogOut className='w-4' />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className='min-h-screen h-fit w-full bg-white text-black flex'>
        {user ? (
          <SideNavbar isAdmin={isAdmin} />
        ) : (
          <div className='flex justify-center items-center w-full'>
            <Loader className='w-4 h-4 animate-spin' />
          </div>
        )}
        <div className='p-8 pt-24 w-full max-h-screen overflow-y-auto no-scrollbar'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default RouteLayout
