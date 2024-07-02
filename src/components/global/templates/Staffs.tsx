import React, { useState } from 'react'

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
    <div>
    <div className='flex items-center justify-between mb-6'>
      <div className='text-3xl font-bold'>Tài khoản nhân viên</div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-center'>Ảnh đại diên</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead className='text-center'>Xác minh</TableHead>
          <TableHead className='text-center'>Vai trò</TableHead>
          <TableHead className='text-end'></TableHead>
        </TableRow>
      </TableHeader>

      {/* {!isLoadingAccounts && ( */}
        <TableBody>
          {/* {accounts.map((account) => { */}
            {/* return ( */}
              <TableRow key={1}>
                <TableCell className='text-center flex justify-center'>
                  <Avatar className='cursor-pointer'>
                    {/* <AvatarImage src={account.imageUrl || defaultAvatarUrl || 'https://github.com/shadcn.png'} /> */}
                    <AvatarImage src={ 'https://github.com/shadcn.png'} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className='font-medium'>admin@gmail.com</TableCell>
                <TableCell className='font-medium'>admin</TableCell>
                <TableCell className='text-center flex justify-center'>
                  {/* {account.verified ? ( */}
                    <Check className='text-primary w-8 h-8' />
                  {/* ) : ( */}
                    {/* <X className='text-destructive w-8 h-8' /> */}
                  {/* )} */}
                </TableCell>
                <TableCell className='text-center'>
                  <Select
                    // disabled={account.role === 'admin'}
                    // onValueChange={(val: Role) => {
                    //   changeRole(account._id, val)
                    // }}
                    // defaultValue={(() => {
                    //   return account.role.toString()
                    // })()}
                  >
                    <SelectTrigger className='w-fit mx-auto'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='w-fit'>
                      <SelectItem value='customer'>
                        <Badge variant='breed'>Khách hàng</Badge>
                      </SelectItem>
                      <SelectItem value='staff'>
                        <Badge variant='success'>Nhân viên</Badge>
                      </SelectItem>
                      <SelectItem value='manager'>
                        <Badge variant='warning'>Quản lý</Badge>
                      </SelectItem>
                      <SelectItem value='admin'>
                        <Badge variant='info'>Quản trị viên</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            {/* ) */}
          {/* })} */}
        </TableBody>
      {/* )} */}
    </Table>
    {/* {isLoadingAccounts && <div>Đang tải</div>} */}
    {/* {!!totalPages && (
      <Paginate
        className='mt-8'
        path={addSearchParams('/admin/accounts', {})}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    )} */}
  </div>
  )
}

export default Staff