/** @format */
'use client'

import { useState } from 'react'
import { Nav } from '../atoms/ui/nav'
import addressIcon from '@/assets/address.svg'

interface SideNavbarProps {
  isAdmin: boolean
}

import {
  ChevronRight,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Bus,
  Route,
  LandPlot,
  HandPlatter,
  Users,
  UsersRound,
  SwatchBook
} from 'lucide-react'
import { Button } from '../atoms/ui/button'
import { Handshake } from 'lucide-react'
import { useWindowWidth } from '@react-hook/window-size'

export default function SideNavbar({ isAdmin }: SideNavbarProps) {
  // console.log('admin ơ nav', isAdmin)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onlyWidth = useWindowWidth()
  const mobileWidth = onlyWidth < 768

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed)
  }
  const adminLinks = [
    {
      title: 'Dashboard',
      href: '/home/admin',
      icon: LayoutDashboard,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Người dùng',
      href: '/users',
      icon: UsersRound,
      variant: 'ghost' as 'default' | 'ghost'
    },
    {
      title: 'Công ty',
      href: '/companies',
      icon: Handshake,
      variant: 'ghost' as 'default' | 'ghost'
    },
    {
      title: 'Cài đặt',
      href: '/settings',
      icon: Settings,
      variant: 'ghost' as 'default' | 'ghost'
    }
    // {
    //   title: 'Đăng xuất',
    //   href: '/login',
    //   icon: LogOut,
    //   variant: 'ghost' as 'default' | 'ghost'
    // }
  ]

  const managerLinks = [
    {
      title: 'Dashboard',
      href: '/home/manager',
      icon: LayoutDashboard,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Nhân viên',
      href: '/staffs',
      icon: Users,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Chuyến đi',
      href: '/trips',
      icon: Bus,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Tuyến đường',
      href: '/routes',
      icon: Route,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Trạm dừng',
      href: '/stations',
      icon: LandPlot,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Chuyến xe mẫu',
      href: '/templates',
      icon: SwatchBook,
      variant: 'default' as 'default' | 'ghost'
    },
    // {
    //   title: 'Đăng xuất',
    //   href: '/login',
    //   icon: LogOut,
    //   variant: 'ghost' as 'default' | 'ghost'
    // }
  ]
  return (
    <div className='relative min-w-[80px] min-h-screen h-fit transition-all duration-300 ease-in-out border-r px-3 pb-10 pt-24'>
      {!mobileWidth && (
        <div className='absolute right-[-20px] top-24 '>
          <Button
            onClick={toggleSidebar}
            variant='secondary'
            className=' rounded-full p-2 transition-transform duration-300'
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight className='text-[#F9802D]' />
          </Button>
        </div>
      )}

      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={isAdmin ? adminLinks : managerLinks}
        // links={adminLinks }
      />
    </div>
  )
}
