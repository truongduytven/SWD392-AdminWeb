import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../table/col-header';
import { DataTableRowActions } from './row-actions';

export type Staff = {
  StaffID: string;
  Name: string;
  CompanyID: string;
  Password: string;
  Email: string;
  Address: string;
  PhoneNumber: string;
  Status: string;
};

export const columns = (handleStatusChange: (staff: Staff, status: string) => void): ColumnDef<Staff>[] => [
  {
    accessorKey: 'StaffID',
    header: ({ column }) => null,
    cell: ({ row }) => null
  },
  {
    accessorKey: 'Name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên nhân viên' />,
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate '>{row.getValue('Name')}</span>
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'Email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div>{row.getValue('Email')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'Address',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Địa chỉ' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('Address')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'PhoneNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số điện thoại' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('PhoneNumber')}</div>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'Status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    cell: ({ row }) => <DataTableRowActions row={row} handleStatusChange={handleStatusChange}/>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  }
];
