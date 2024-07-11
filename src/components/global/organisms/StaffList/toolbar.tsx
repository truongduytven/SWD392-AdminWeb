'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

// import { RoleGate } from '@/auth/role-gate'
// import { AddUser } from '@/components/common/modal/add-user'
import { DataTableFacetedFilter } from '../table/faceted-filter'
import { DataTableViewOptions } from '../table/view-options'
import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
	const isFiltered = table.getState().columnFilters.length > 0

	const uniqueStatus = Array.from(
		table.getColumn('status')?.getFacetedUniqueValues()?.entries() || [],
	).map(([key]) => key)
	const uniqueGender = Array.from(
		table.getColumn('gender')?.getFacetedUniqueValues()?.entries() || [],
	).map(([key]) => key)
	const uniqueRole = Array.from(
		table.getColumn('role')?.getFacetedUniqueValues()?.entries() || [],
	).map(([key]) => key)



	return (
		<div className="mb-2 flex justify-between">
			<div className="flex space-x-2">
				<Input
					placeholder="Filter users..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableFacetedFilter
					column={table.getColumn('status')}
					title="Status"
					options={uniqueStatus.map((status) => ({
						value: status,
						label: status ? 'Active' : 'Inactive',
					}))}
				/>

				<DataTableFacetedFilter
					column={table.getColumn('gender')}
					title="Gender"
					options={uniqueGender}
				/>
				<DataTableFacetedFilter
					column={table.getColumn('role')}
					title="Role"
					options={uniqueRole}
				/>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<Cross2Icon className="ml-2 size-4" />
					</Button>
				)}
			</div>
			<div>
				<DataTableViewOptions table={table} />
				
			</div>
		</div>
	)
}
