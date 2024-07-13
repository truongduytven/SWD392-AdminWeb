import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'
type Route = {
  Route_CompanyID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  Status: string
}

export const columns = (handleStatusChange: (route: Route, status: string) => void): ColumnDef<Route>[] => [
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
        <span className='max-w-[500px] truncate '>{row.getValue('FromCity')}</span>
      </div>
    ),
    // filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false
  },
  {
    accessorKey: 'ToCity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Đến thành phố' />,
    cell: ({ row }) => <div>{row.getValue('ToCity')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'StartLocation',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa điểm bắt đầu' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('StartLocation')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },

  {
    accessorKey: 'EndLocation',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa điểm kết thúc' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('EndLocation')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },

  {
    accessorKey: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => <DataTableRowActions row={row} handleStatusChange={handleStatusChange}/>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  }
]
