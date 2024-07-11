import React, { useEffect, useState } from 'react'

import { DataTable } from '@/components/global/organisms/DataTable'
import PageTitle from '@/components/global/organisms/PageTitle'
import { ColumnDef } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/ui/avatar'
import { Check, X } from 'lucide-react'
import { Select, SelectContent, SelectItem,SelectTrigger, SelectValue } from '../atoms/ui/select'
import { Badge } from '../atoms/ui/badge'
import busAPI from '@/lib/busAPI'
import { toast } from '../atoms/ui/use-toast'
import { useSearchParams } from 'react-router-dom'
import ListStaff from '../organisms/StaffList'

type Props = {}
type Payment = {
  name: string
  email: string
  lastOrder: string
  method: string
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div className='flex gap-2 items-center'>
          <img
            className='h-12 w-12'
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue('name')}`}
            alt='user-image'
          />
          <p>{row.getValue('name')} </p>
        </div>
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'lastOrder',
    header: 'Last Order'
  },
  {
    accessorKey: 'method',
    header: 'Method'
  }
]

const data: Payment[] = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    lastOrder: '2023-01-01',
    method: 'Credit Card'
  },
  {
    name: 'Alice Smith',
    email: 'alice@example.com',
    lastOrder: '2023-02-15',
    method: 'PayPal'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    lastOrder: '2023-03-20',
    method: 'Stripe'
  },
  {
    name: 'Emma Brown',
    email: 'emma@example.com',
    lastOrder: '2023-04-10',
    method: 'Venmo'
  },
  {
    name: 'Michael Davis',
    email: 'michael@example.com',
    lastOrder: '2023-05-05',
    method: 'Cash'
  },
  {
    name: 'Sophia Wilson',
    email: 'sophia@example.com',
    lastOrder: '2023-06-18',
    method: 'Bank Transfer'
  },
  {
    name: 'Liam Garcia',
    email: 'liam@example.com',
    lastOrder: '2023-07-22',
    method: 'Payoneer'
  },
  {
    name: 'Olivia Martinez',
    email: 'olivia@example.com',
    lastOrder: '2023-08-30',
    method: 'Apple Pay'
  },
  {
    name: 'Noah Rodriguez',
    email: 'noah@example.com',
    lastOrder: '2023-09-12',
    method: 'Google Pay'
  },
  {
    name: 'Ava Lopez',
    email: 'ava@example.com',
    lastOrder: '2023-10-25',
    method: 'Cryptocurrency'
  },
  {
    name: 'Elijah Hernandez',
    email: 'elijah@example.com',
    lastOrder: '2023-11-05',
    method: 'Alipay'
  },
  {
    name: 'Mia Gonzalez',
    email: 'mia@example.com',
    lastOrder: '2023-12-08',
    method: 'WeChat Pay'
  },
  {
    name: 'James Perez',
    email: 'james@example.com',
    lastOrder: '2024-01-18',
    method: 'Square Cash'
  },
  {
    name: 'Charlotte Carter',
    email: 'charlotte@example.com',
    lastOrder: '2024-02-22',
    method: 'Zelle'
  },
  {
    name: 'Benjamin Taylor',
    email: 'benjamin@example.com',
    lastOrder: '2024-03-30',
    method: 'Stripe'
  }
]
type Role = 'customer' | 'staff' | 'manager' | 'admin' | 'guest'

function Staff() {
  const [searchParams] = useSearchParams()
  const pageNumber = Number(searchParams.get('pageNumber') || 1)
  // const [accounts, setAccounts] = useState<User[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [defaultAvatarUrl, setDefaultAvatarUrl] = useState<string | null>(null)
  // useEffect(() => {
  //   const fetchMedia = async () => {
  //     const { data } = await birdFarmApi.get('/api/media')
  //     setDefaultAvatarUrl(data.media.defaultAvatarUrl)
  //   }

  //   fetchMedia()
  // }, [])

  // useEffect(() => {
  //   const fetchAccounts = async () => {
  //     setIsLoadingAccounts(true)
  //     try {
  //       const { data } = await birdFarmApi.get(addSearchParams('/api/users/pagination', { pageNumber, pageSize }))
  //       setAccounts(data?.users || null)
  //       setIsLoadingAccounts(false)
  //       setTotalPages(data?.totalPages || null)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   fetchAccounts()
  // }, [pageNumber])
  // useEffect(() => {
  //   const fetchStaffs = async () => {
  //     setIsLoadingAccounts(true)
  //     try {
  //       const { data } = await busAPI.get("")
  //       setAccounts(data?.users || null)
  //       setIsLoadingAccounts(false)
  //       setTotalPages(data?.totalPages || null)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   fetchAccounts()
  // }, [pageNumber])
  
  const changeRole = async (userId: string, role: Role) => {
    try {
      await busAPI.put(`/api/users/${userId}/role`, { role })

      // toast({
      //   variant: 'success',
      //   title: 'Phân quyền thành công',
      //   description: 'Đã phân quyền người dùng này thành ' + roleToVi[role]
      // })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const messageError = error.response.data.message
      window.location.reload()
      toast({
        variant: 'destructive',
        title: 'Không thể đổi vai trò',
        description: messageError || 'Không rõ nguyễn nhân'
      })
    }
  }
  return (
    <div className='h-screen overflow-hidden'>
    <ListStaff/>
  </div>
  )
}

export default Staff