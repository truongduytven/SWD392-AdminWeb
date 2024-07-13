/** @format */
'use client'

import { DataTable } from '@/components/local/data-table-user/data-table'
import { columns } from '@/components/local/data-table-user/column'
import PageTitle from '@/components/global/organisms/PageTitle'
import busAPI from '@/lib/busAPI'
import { User } from '@/types/User'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import Loading from '../molecules/Loading'

type Props = {}

// const columns: ColumnDef<User>[] = [
//   {
//     accessorKey: 'UserName',
//     header: 'Tên người dùng',
//     cell: ({ row }) => {
//       return (
//         <div className='flex gap-2 items-center'>
//           <img
//             className='h-12 w-12'
//             src="https://i.pinimg.com/564x/26/82/78/2682787e9d8241a3164a67748ac505b6.jpg"
//             alt='user-image'
//           />
//           <p>{row.getValue('UserName')} </p>
//         </div>
//       )
//     }
//   },
//   {
//     accessorKey: 'FullName',
//     header: 'Tên đầy đủ'
//   },
//   {
//     accessorKey: 'Email',
//     header: 'Email'
//   },
//   {
//     accessorKey: 'CreatedDate',
//     header: 'Ngày tạo',
//     cell: ({ row }) => {
//       const date = row.getValue('CreatedDate') ? new Date(row.getValue('CreatedDate')) : new Date()
//       const dateString = formatDate(date, "dd/MM/yyyy")
//       return <p>{dateString}</p>
//     }
//   },
//   {
//     accessorKey: 'Status',
//     header: 'Trạng thái',
//     cell: ({ row }) => {
//       return <Badge className='bg-green-500'>{row.getValue('Status')}</Badge>
//     }
//   },
// ]

const defaultValue: User[] = [
  {
    UserName: '',
    FullName: '',
    Email: '',
    CreatedDate: '',
    Status: ''
  }
]

export default function UsersPage({}: Props) {
  const [Data, setData] = useState<User[]>(defaultValue)
  const toastShown = useRef(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await busAPI.get<User[]>('/user-management/managed-users/role-name/Customer')
        setData(data)
        if (!toastShown.current) {
          toast.success('Tìm kiếm người dùng thành công')
          toastShown.current = true
        }
      } catch (error) {
        toast.error('Không thể tìm kiếm người dùng')
      }
    }
    fetchUsers()
  }, [])

  return Data[0].CreatedDate === '' ? (
    <Loading />
  ) : (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title='Danh sách người dùng' />
      <DataTable columns={columns} data={Data} />
    </div>
  )
}
