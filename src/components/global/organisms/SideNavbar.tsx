/** @format */
'use client'

import { useState } from 'react'
import { Nav } from '../atoms/ui/nav'

type Props = {}

import { ChevronRight, LayoutDashboard, Settings, ShoppingCart, UsersRound } from 'lucide-react'
import { Button } from '../atoms/ui/button'

import { useWindowWidth } from '@react-hook/window-size'

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onlyWidth = useWindowWidth()
  const mobileWidth = onlyWidth < 768

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className='fixed top-0 left-0 h-full z-10 min-w-[80px] transition-all duration-300 ease-in-out border-r px-3 pb-10 pt-5 '>
      {!mobileWidth && (
        <div className='absolute right-[-20px] top-7 '>
          <Button onClick={toggleSidebar} variant='secondary' className=' rounded-full p-2 transition-transform duration-300'
           style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >

            <ChevronRight className='text-primary'/>
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: 'Dashboard',
            href: '/',
            icon: LayoutDashboard,
            variant: 'default'
          },
          {
            title: 'Users',
            href: '/users',
            icon: UsersRound,
            variant: 'ghost'
          },
          {
            title: 'Orders',
            href: '/orders',
            icon: ShoppingCart,
            variant: 'ghost'
          },
          {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
            variant: 'ghost'
          }
        ]}
      />
    </div>
  )
}
