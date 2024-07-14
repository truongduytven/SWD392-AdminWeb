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

  
  const uniqueCityName = Array.from(table.getColumn('CityName')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
 
  const uniqueStatus = Array.from(table.getColumn('Status')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )

  return (
    <div className='ml-2 mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Tìm tên trạm... '
          value={(table.getColumn('StationName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('StationName')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

       
        <DataTableFacetedFilter
          column={table.getColumn('CityName')}
          title='Thành phố'
          options={uniqueCityName}
        />
    
        <DataTableFacetedFilter column={table.getColumn('Status')} title='Trạng thái' options={uniqueStatus} />

        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 size-4' />
          </Button>
        )}
      </div>
      <div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
