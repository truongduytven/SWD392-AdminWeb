import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
import { statuses } from './data/data'
import { Task } from './data/schema'
import { DataTableRowActions } from './row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => <DataTableColumnHeader column={column} title="No" />,
		cell: ({ row }) => (
			<Tooltip title={row.getValue('id')}>
				<p className="w-12 truncate ">{row.getValue('id')}</p>
			</Tooltip>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'avatar',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Avatar" />,
		cell: ({ row }) => (
			<div className="flex items-center">
				<Avatar>
					<AvatarImage className="object-cover" src={row.getValue('avatar')} alt="avatar" />
					<AvatarFallback>FAMS</AvatarFallback>
				</Avatar>
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) => (
			<div className="flex space-x-2">
				<span className="max-w-[500px] truncate font-medium">{row.getValue('name')}</span>
			</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		cell: ({ row }) => <div>{row.getValue('email')}</div>,
	},
	{
		accessorKey: 'phone',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
		cell: ({ row }) => <div>{row.getValue('phone')}</div>,
	},

	{
		accessorKey: 'birthday',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Birthday" />,
		cell: ({ row }) => <div>{row.getValue('birthday')}</div>,
	},
	{
		accessorKey: 'gender',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
		cell: ({ row }) => <div>{row.getValue('gender')}</div>,
		filterFn: (row, id, value) => value.includes(row.getValue(id)),
	},
	{
		accessorKey: 'role',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
		cell: ({ row }) => <div>{row.getValue('role')}</div>,
		filterFn: (row, id, value) => value.includes(row.getValue(id)),
	},
	{
		accessorKey: 'status',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const status = statuses.find((status) => status.value === row.getValue('status'))

			if (!status) {
				return null
			}

			return (
				<div className="flex w-[100px] items-center">
					{status.icon && <status.icon className="mr-2 size-4 text-muted-foreground" />}
					<span>{status.label}</span>
				</div>
			)
		},
		filterFn: (row, id, value) => value.includes(row.getValue(id)),
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
]
