'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

// import { RoleGate } from '@/auth/role-gate'
// import { AddUser } from '@/components/common/modal/add-user'
import { DataTableFacetedFilter } from '../table/faceted-filter'
import { DataTableViewOptions } from '../table/view-options'
import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'
import { AddStaff } from './addStaff'

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0
  const uniqueStatus = Array.from(table.getColumn('Status')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )

  return (
    <div className='mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Tìm kiếm nhân viên...'
          value={(table.getColumn('FromCity')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('FromCity')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <DataTableFacetedFilter column={table.getColumn('Status')} title='Trạng thái' options={uniqueStatus} />

        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 size-4' />
          </Button>
        )}
      </div>
      <div className='flex justify-center'>
        <AddStaff />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
