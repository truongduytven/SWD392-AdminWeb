import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'Route_CompanyID',
    header: ({ column }) => null,
    cell: ({ row }) => null
  },
  {
    accessorKey: 'FromCity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Từ thành phố' />,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate font-medium'>{row.getValue('FromCity')}</span>
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'ToCity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Đến thành phố' />,
    cell: ({ row }) => <div>{row.getValue('ToCity')}</div>
  },
  {
    accessorKey: 'StartLocation',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa điểm bắt đầu' />,
    cell: ({ row }) => <div>{row.getValue('StartLocation')}</div>
  },

  {
    accessorKey: 'EndLocation',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa điểm kết thúc' />,
    cell: ({ row }) => <div>{row.getValue('EndLocation')}</div>
  },

  {
    accessorKey: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
