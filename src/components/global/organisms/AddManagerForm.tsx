import { addManagerSchema } from '@/components/Schema/AddManagerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog, DialogContent, DialogTrigger } from '../atoms/ui/dialog'
import { Button } from '../atoms/ui/button'
import { PlusCircle } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../atoms/ui/form'
import { Input } from '../atoms/ui/input'
import busAPI from '@/lib/busAPI'
import { toast } from 'sonner'

function AddManager() {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof addManagerSchema>>({
    resolver: zodResolver(addManagerSchema),
    defaultValues: {
      email: '',
      companyName: ''
    }
  })

  const handleSubmit = async (data: z.infer<typeof addManagerSchema>) => {
    try {
      setIsOpen(false)
      form.reset()
      const response = await busAPI.post(`/auth-management/managed-auths/manager?email=${data.email}&companyName=${data.companyName}`)
      if(response.data) {
        toast.success('Tạo mới nhà xe thành công')
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau')
      }
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau')
    }
  }

  const handleClose = () => {
    isOpen === true ? setIsOpen(false) : setIsOpen(true)
    form.reset()
  }

  return (
    <div>
      <div className='flex items-center justify-between px-5'>
        
          <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogTrigger>
              <Button variant={'outline_primary'}>
                <PlusCircle size={16} className='mr-1' />
                Tạo mới nhà xe
              </Button>
            </DialogTrigger>
            <DialogContent className='w-[600px] flex flex-col overflow-hidden bg-white p-0'>
              <div className='bg-primary py-2 rounded-tl-md rounded-tr-md text-center font-semibold text-white'>Tạo mới nhà xe</div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='flex w-full flex-col gap-5 rounded-md bg-white px-8 py-6'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <span className='w-[30%] font-semibold'>
                          Email <span className='text-red-600'>*</span>
                        </span>
                        <div className='w-[70%]'>
                          <FormControl>
                            <Input placeholder='Email....' {...field} className='w-full' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='companyName'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <span className='w-[30%] font-semibold'>
                          Tên công ty<span className='text-red-600'>*</span>
                        </span>
                        <div className='w-[70%]'>
                          <FormControl>
                            <Input placeholder='vd: Phương Trang' {...field} className='w-full' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className='flex justify-end space-x-4'>
                    <Button type='submit'>Save</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
      </div>
    </div>
  )
}

export default AddManager
