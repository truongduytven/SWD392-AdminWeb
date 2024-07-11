import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
// import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'

// Define the interface for the Service
interface Service {
	ServiceID: string;
	Price: number;
	Name: string;
	ImageUrl: string;
  }
  
  // Define the interface for the ServiceType
  interface ServiceType {
	ServiceTypeID: string;
	ServiceTypeName: string;
	ServiceInStation: Service[];
  }
  
  // Define the interface for the Station
  interface Station {
	StationID: string;
	CityID: string;
	CityName: string;
	StationName: string;
	Status: string;
	ServiceTypeInStation: ServiceType[];
  }
export const columns = (handleStatusChange: (route: Station, status: string) => void): ColumnDef<Station>[] => [

  {
    accessorKey: 'StationID',
    header: ({ column }) => null,
    cell: ({ row }) => null
  },
  {
    accessorKey: 'StationName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên trạm dừng' />,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate font-medium'>{row.getValue('StationName')}</span>
      </div>
    ),
    // filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false
  },
  {
    accessorKey: 'CityName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên thành phố' />,
    cell: ({ row }) => <div>{row.getValue('CityName')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  // {
  //   accessorKey: 'ServiceTypeInStation',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Dịch vụ' />,
  //   cell: ({ row }) => <div>{row.getValue('ServiceTypeInStation')}</div>,
  //   filterFn: (row, id, value) => value.includes(row.getValue(id))
  // },
  {
    accessorKey: 'ServiceTypeInStation',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Dịch vụ' />,
    cell: ({ row }) => {
      const services = row.original.ServiceTypeInStation;
      return (
        <div>
          {services.length === 0 ? (
            <span>Không có dịch vụ</span>
          ) : (
            <span>Có dịch vụ</span>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => <DataTableRowActions row={row} handleStatusChange={handleStatusChange}/>,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  }
]
