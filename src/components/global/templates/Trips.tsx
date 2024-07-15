import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'
import TableSkeleton from '../organisms/TableSkeleton'
import { Button, Divider, Input, InputRef, Select, SelectProps, Space } from 'antd'
import { Dialog, DialogContent, DialogOverlay } from '../atoms/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../atoms/ui/form'
import { Plus } from 'lucide-react'
import { Button as But } from '../atoms/ui/button'
import ListTrip from '../organisms/TripList'
const headers = [
  { title: 'Từ thành phố', center: true },
  { title: 'Đến thành phố' },
  { title: 'Địa điểm bắt đầu' },
  { title: 'Địa điểm kết thúc', center: true },
  { title: 'Trạng thái', center: true }
]
// let index = 0
function Trip() {
  // const options: SelectProps['options'] = []

  // for (let i = 10; i < 36; i++) {
  //   options.push({
  //     label: i.toString(36) + i,
  //     value: i.toString(36) + i
  //   })
  // }

  // const [items, setItems] = useState(['jack', 'lucy'])
  // const [name, setName] = useState('')
  // const inputRef = useRef<InputRef>(null)

  // const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value)
  // }

  // const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
  //   e.preventDefault()
  //   setItems([...items, name || `New item ${items.length + 1}`])
  //   setName('')
  //   setTimeout(() => {
  //     inputRef.current?.focus()
  //   }, 0)
  // }

  // const handleChange = (value: string[]) => {
  //   console.log(`selected ${value}`)
  // }

  return (
    <div className='h-screen overflow-hidden'>
    <ListTrip/>
</div>
    // <div>
    //   <div className='flex items-center justify-between mb-6'>
    //     <div className='text-3xl font-bold'>Danh sách chuyến đi</div>
    //   </div>

    //   <Table>
    //     <TableHeader>
    //       <TableRow>
    //         <TableHead className='text-center'>From City</TableHead>
    //         <TableHead>To City</TableHead>
    //         <TableHead>Start Location</TableHead>
    //         <TableHead className='text-center'>EndLocation</TableHead>
    //         <TableHead className='text-center'>Status</TableHead>
    //         <TableHead className='text-end'></TableHead>
    //       </TableRow>
    //     </TableHeader>

    //     <TableBody>
    //       <TableRow key={1}>
    //         <TableCell className='text-center flex justify-center'>
    //           <Avatar className='cursor-pointer'>
    //             <AvatarImage src={'https://github.com/shadcn.png'} />
    //             <AvatarFallback>CN</AvatarFallback>
    //           </Avatar>
    //         </TableCell>
    //         <TableCell className='font-medium'></TableCell>
    //         <TableCell className='font-medium'></TableCell>
    //         <TableCell className='text-center flex justify-center'></TableCell>
    //         <TableCell className='text-center'></TableCell>
    //       </TableRow>
    //     </TableBody>
    //   </Table>
    //   <div>
    //     <Space style={{ width: '100%' }} direction='vertical'>
    //       <Select
    //         mode='multiple'
    //         allowClear
    //         style={{ width: '100%' }}
    //         placeholder='Please select'
    //         onChange={handleChange}
    //         dropdownRender={(menu) => (
    //           <>
    //             {menu}
    //             <Divider style={{ margin: '8px 0' }} />
    //             <Space style={{ padding: '0 8px 4px' }}>
    //               <Input
    //                 placeholder='Please enter item'
    //                 ref={inputRef}
    //                 value={name}
    //                 onChange={onNameChange}
    //                 onKeyDown={(e) => e.stopPropagation()}
    //               />
    //               <Button type='text' onClick={addItem}>
    //                 Add item
    //               </Button>
    //             </Space>
    //           </>
    //         )}
    //         options={items.map((item) => ({ label: item, value: item }))}
    //       />
    //       {/* <Select
    //     mode="multiple"
    //     allowClear
    //     style={{ width: '100%' }}
    //     placeholder="Please select"
    //     disabled
    //     defaultValue={['jack', 'lucy']}
    //     options={items.map((item) => ({ label: item, value: item }))}
    //   /> */}
    //     </Space>
    //     <Space style={{ width: '100%' }} direction='vertical'>
    //       <Select
    //         mode='multiple'
    //         allowClear
    //         style={{ width: '100%' }}
    //         placeholder='Please select'
    //         defaultValue={['a10', 'c12']}
    //         onChange={handleChange}
    //         options={options}
    //       />
    //     </Space>
    //   <But className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'><Plus className='w-6 mr-1'/>Thêm trạm dừng</But>
        
    //   </div>
    // </div>
  )
}

export default Trip
