import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'
import { Edit2, Eye } from 'lucide-react'
type Trip = {
  TripID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  StartTime: string
  EndTime: string
  StartDate: string
  EndDate: string
  StaffName: string
  StaffID:string
  MinPrice: number
  MaxPrice: number
  Status: string
}
export const columns = (
  handleStatusChange: (trip: Trip, status: string) => void,
  handleViewDetails: (routeId: string) => void,
  handleEditTrip: (trip: Trip) => void
): ColumnDef<Trip>[] => [
  {
    accessorKey: 'TripID',
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
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'StartLocation',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa điểm bắt đầu' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('StartLocation')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },

  {
    accessorKey: 'EndLocation',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa điểm kết thúc' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('EndLocation')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorFn: (row) => `${row.StartTime} - ${row.EndTime}`,
    id: 'StartEndTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Thời gian' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('StartEndTime')}</div>
  },
  {
    accessorKey: 'StartDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày bắt đầu' />,
    cell: ({ row }) => <div>{row.getValue('StartDate')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'EndDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày kết thúc' />,
    cell: ({ row }) => <div>{row.getValue('EndDate')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'StaffName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên nhân viên' />,
    cell: ({ row }) => <div>{row.getValue('StaffName')}</div>
  },

  {
    accessorKey: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    id: 'view',
    header: 'Xem',
    cell: ({ row }) => (
      <Tooltip title='Xem chi tiết' className='mr-1'>
        <Eye className='cursor-pointer w-4 text-primary' onClick={() => handleViewDetails(row.original.TripID)} />
      </Tooltip>
    )
  },
  {
    id: 'edit',
    header: 'Chỉnh sửa',
    cell: ({ row }) => (
      <Tooltip title='Chỉnh sửa chuyến đi' className='mr-1'>
        <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditTrip(row.original)} />
      </Tooltip>
    )
  }
]
