'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

// import { RoleGate } from '@/auth/role-gate'
// import { AddUser } from '@/components/common/modal/add-user'
import { DataTableFacetedFilter } from '../table/faceted-filter'
import { DataTableViewOptions } from '../table/view-options'
import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'
import { DateRangeFilter } from '../table/date-range-filter'

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0

  const uniqueFromCity = Array.from(table.getColumn('FromCity')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueToCity = Array.from(table.getColumn('ToCity')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueStartLocation = Array.from(
    table.getColumn('StartLocation')?.getFacetedUniqueValues()?.entries() || []
  ).map(([key]) => key)
  const uniqueEndLocation = Array.from(table.getColumn('EndLocation')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueStatus = Array.from(table.getColumn('Status')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueStartDate = Array.from(table.getColumn('StartDate')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueEndDate = Array.from(table.getColumn('EndDate')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const resetTrigger = table.getState().columnFilters.length
  return (
    <div className='mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Tìm chuyến bắt đầu từ tp...'
          value={(table.getColumn('FromCity')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('FromCity')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

       
        <DataTableFacetedFilter column={table.getColumn('ToCity')} title='Đến thành phố' options={uniqueToCity} />
        <DataTableFacetedFilter
          column={table.getColumn('StartLocation')}
          title='Địa điểm bắt đầu'
          options={uniqueStartLocation}
        />
        <DataTableFacetedFilter
          column={table.getColumn('EndLocation')}
          title='Địa điểm kết thúc'
          options={uniqueEndLocation}
        />
        <DataTableFacetedFilter column={table.getColumn('Status')} title='Trạng thái' options={uniqueStatus} />
        <DateRangeFilter
          column={table.getColumn('StartDate')}
          title='Ngày bắt đầu'
          options={uniqueStartDate}
          resetTrigger={resetTrigger}
        />

        <DateRangeFilter
          column={table.getColumn('EndDate')}
          title='Ngày kết thúc'
          options={uniqueEndDate}
          resetTrigger={resetTrigger}
        />
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
