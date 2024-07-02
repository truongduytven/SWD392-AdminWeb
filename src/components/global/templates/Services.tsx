import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'
function Services() {
  return (
    <div>
    <div className='flex items-center justify-between mb-6'>
      <div className='text-3xl font-bold'>Danh sách dịch vụ</div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='text-center'>From City</TableHead>
          <TableHead>To City</TableHead>
          <TableHead>Start Location</TableHead>
          <TableHead className='text-center'>EndLocation</TableHead>
          <TableHead className='text-center'>Status</TableHead>
          <TableHead className='text-end'></TableHead>
        </TableRow>
      </TableHeader>

        <TableBody>
              <TableRow key={1}>
                <TableCell className='text-center flex justify-center'>
                  <Avatar className='cursor-pointer'>
                  
                    <AvatarImage src={ 'https://github.com/shadcn.png'} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className='font-medium'></TableCell>
                <TableCell className='font-medium'></TableCell>
                <TableCell className='text-center flex justify-center'>
                
                </TableCell>
                <TableCell className='text-center'>
                 
                </TableCell>
              </TableRow>
        </TableBody>
    </Table>
   
  </div>
  )
}

export default Services