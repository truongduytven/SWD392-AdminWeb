import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/global/atoms/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/global/atoms/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/global/atoms/ui/form'
import { Input } from '@/components/global/atoms/ui/input'
import { useAuth } from '@/auth/AuthProvider'
import { AddStaffSchema } from '@/components/Schema/AddStaffSchema'
import { PasswordInput } from '../../atoms/ui/password-input'
import busAPI from '@/lib/busAPI'
import Loading from '@/components/local/login/Loading'
import { useQueryClient } from '@tanstack/react-query'

export function AddStaff() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof AddStaffSchema>>({
    resolver: zodResolver(AddStaffSchema),
    defaultValues: {
      userName: '',
      fullName: '',
      email: '',
      address: '',
      phoneNumber: '',
      password: '',
      confirmpassword: '',
      companyID: 'abc'
    }
  })

  const handleSubmit = async (data: z.infer<typeof AddStaffSchema>) => {
    try {
      setLoading(true)
      data = { ...data, companyID: user?.CompanyID || '' }
      await busAPI.post(`/auth-management/managed-auths/sign-ups`, data)
      setLoading(false)
      setIsOpen(false)
      form.reset()
      toast.success('Tạo nhân viên thành công')
      refetchData()
    } catch (error) {
      setLoading(false)
      toast.error('Lỗi trong quá trình tạo mới nhân viên')
    }
  }

  const handleClose = () => {
    isOpen === true ? setIsOpen(false) : setIsOpen(true)
    form.reset()
  }

  const refetchData = () => {
    queryClient.invalidateQueries({ queryKey: ['staff'] });
  };

  return (
    <div>
      <div className='flex items-center justify-between px-5'>
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogTrigger>
            <Button className='h-8' variant={'outline'}>
              <PlusCircle size={16} className='mr-2' />
              Tạo nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className='w-[1000px] overflow-hidden bg-white p-0'>
            <div className='bg-primary py-2 rounded-tl-md rounded-tr-md text-center font-semibold text-white'>
              Tạo mới nhân viên
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='flex w-full flex-col gap-5 bg-white px-8 py-6'
              >
                <div className='flex justify-between space-x-4 items-start'>
                  <FormField
                    control={form.control}
                    name='userName'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <div className='w-full'>
                          <FormLabel>
                            Tên người dùng<span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập tên người dùng...' {...field} className='w-full my-1' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='fullName'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <div className='w-full'>
                          <FormLabel>
                            Tên đầy đủ<span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập tên đầy đủ...' {...field} className='w-full my-1' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex justify-between space-x-4 items-start'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <div className='w-full'>
                          <FormLabel>
                            Email<span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập địa chỉ email...' {...field} className='w-full my-1' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <div className='w-full'>
                          <FormLabel>
                            Số điện thoại<span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập số điện thoại...' {...field} className='w-full my-1' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem className='flex w-full items-center justify-between gap-10'>
                      <div className='w-full'>
                        <FormLabel>
                          Địa chỉ<span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Nhập địa chỉ...' {...field} className='w-full my-1' />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <div className='flex justify-between space-x-4 items-start'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <div className='w-full'>
                          <FormLabel>
                            Mật khẩu<span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <PasswordInput placeholder='Nhập mật khẩu...' {...field} className='w-full my-1' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmpassword'
                    render={({ field }) => (
                      <FormItem className='flex w-full items-center justify-between gap-10'>
                        <div className='w-full'>
                          <FormLabel>
                            Xác nhận mật khẩu<span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <PasswordInput placeholder='Nhập mật khẩu xác nhận...' {...field} className='w-full my-1' />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex justify-end space-x-4'>
                  <Button type='submit' disabled={loading}>
                    {loading && <Loading />}Tạo mới
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
