import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger,  SelectValue } from '../atoms/ui/select'
import { Badge } from '../atoms/ui/badge'

function Routes() {
  return (
    <div>
    <div className='flex items-center justify-between mb-6'>
      <div className='text-3xl font-bold'>Danh sách tuyến đường</div>
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
                <TableCell className='text-center r'>
                  Hồ Chí Minh
                </TableCell>
                <TableCell className='font-medium'>Bình Thuận</TableCell>
                <TableCell className='font-medium'>Quận 1</TableCell>
                <TableCell className='text-center '>
                Hàm Thuận Bắc
                </TableCell>
                <TableCell className='text-center'>
                <Select
                    // disabled={account.role === 'admin'}
                    // onValueChange={(val: Role) => {
                    //   changeRole(account._id, val)
                    // }}
                    // defaultValue={(() => {
                    //   return account.role.toString()
                    // })()}
                  >
                    <SelectTrigger className='w-fit mx-auto'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='w-fit'>
                    
                      <SelectItem value='HOẠT ĐỘNG'>
                        <Badge variant='success'>Hoạt động</Badge>
                      </SelectItem>
                    
                      <SelectItem value='KHÔNG HOẠT ĐỘNG'>
                        <Badge variant='destructive'>Không hoạt động</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
        </TableBody>
    </Table>
   
  </div>
  )
}

export default Routes