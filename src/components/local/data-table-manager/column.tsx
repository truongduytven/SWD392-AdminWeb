import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

// import Chip from "@/components/global/atoms/ui/chip"
import { DataTableColumnHeader } from '@/components/local/data-table-user/data-table-column-header'

// import { DataTableRowActions } from './data-table-row-actions'
import { User } from '@/types/User'
import { Badge } from '@/components/global/atoms/ui/badge'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'UserName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên người dùng' />,
    cell: ({ row }) => {
      return (
        <div className='flex gap-2 items-center'>
          <img
            className='h-12 w-12'
            src='https://i.pinimg.com/564x/26/82/78/2682787e9d8241a3164a67748ac505b6.jpg'
            alt='user-image'
          />
          <p>{row.getValue('UserName')} </p>
        </div>
      )
    },
    enableHiding: false
  },
  {
    accessorKey: 'FullName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên đầy đủ' />,
    cell: ({ row }) => {
      return <div className='max-w-[500px] truncate font-semibold'>{row.getValue('FullName')}</div>
    }
  },
  {
    accessorKey: 'Email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />
  },
  {
    accessorKey: 'CreateDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
    cell: ({ row }) => {
      const createdOnDate = new Date(row.getValue('CreateDate') ? row.getValue('CreateDate') : new Date())
      return <div>{format(createdOnDate, 'dd/MM/yyyy')}</div>
    }
  },
  {
    accessorKey: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => {
      return <Badge className='bg-green-500 hover:bg-green-600'>{row.getValue('Status')}</Badge>
    }
  }
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
  //   cell: ({ row }) => {
  //     const status = row.getValue('status') as IUserStatus
  //     const color = status === IUserStatus.Active ? '#4DB848' : '#E53E3E'
  //     const content = status === IUserStatus.Active ? 'Active' : 'Inactive'
  //     return <Chip content={content} color={color} />
  //   }
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     return <DataTableRowActions row={row} />
  //   }
  // }
]
