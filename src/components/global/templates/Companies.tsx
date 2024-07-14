/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */
'use client'

import { DataTable } from '@/components/local/data-table-manager/data-table'
import PageTitle from '@/components/global/organisms/PageTitle'
import { columns } from '@/components/local/data-table-manager/column'
import busAPI from '@/lib/busAPI'
import { User } from '@/types/User'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Loading from '../molecules/Loading'

type Props = {}
const defaultValue: User[] = [
  {
    UserName: "",
    FullName: "",
    Email: "",
    CreatedDate: "",
    Status: "",    
  },
]

export default function OrdersPage({}: Props) {
  const [Data, setData] = useState<User[]>(defaultValue);
  const toastShown = useRef(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await busAPI.get<User[]>('/user-management/managed-users/role-name/Manager')
        setData(data)
        if (!toastShown.current) {
          toast.success('Tìm kiếm nhà xe thành công')
          toastShown.current = true
        }
      } catch (error) {
        toast.error('Không thể tìm kiếm nhà xe')
      }
    }
    fetchUsers()
  }, [])
  return Data[0].CreatedDate === "" ? (
    <Loading />
  ) : (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title='Danh sách nhà xe' />
      <DataTable columns={columns} data={Data} />
    </div>
  )
}
