import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'

const TableSkeleton = () => {
  const rows = Array.from({ length: 10 }, (_, index) => index + 1)

  return (
    <div className='p-4'>
      <div>
        <div className='h-10 w-96 bg-gray-200  rounded-md animate-pulse mb-4'></div>
        <div className='flex justify-between my-4'>
          <div className='flex gap-3'>
            <div className='h-6 w-60 bg-gray-200  rounded-md animate-pulse '></div>
            <div className='h-6 w-20 bg-gray-200  rounded-md animate-pulse '></div>
            <div className='h-6 w-20 bg-gray-200  rounded-md animate-pulse '></div>
            <div className='h-6 w-20 bg-gray-200  rounded-md animate-pulse '></div>
            <div className='h-6 w-20 bg-gray-200  rounded-md animate-pulse '></div>
          </div>
          <div className='h-6 w-20 bg-gray-200  rounded-md animate-pulse '></div>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <Table className='min-w-full bg-white'>
          <TableHeader>
            <TableRow className='animate-pulse '>
              <TableHead>
                <div className=' h-10 bg-gray-200  rounded'></div>
              </TableHead>
              <TableHead>
                <div className=' h-10 bg-gray-200  rounded'></div>
              </TableHead>
              <TableHead>
                <div className=' h-10 bg-gray-200  rounded'></div>
              </TableHead>
              <TableHead>
                <div className=' h-10 bg-gray-200  rounded'></div>
              </TableHead>
              <TableHead>
                <div className=' h-10 bg-gray-200  rounded'></div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
              <TableCell>
                <div className='h-5 bg-gray-200  rounded-full'></div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TableSkeleton
