import { fetchUserDetail, updateUserProfile } from '@/apis/userAPI'
import { useAuth } from '@/auth/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'
import Loader from '@/components/global/molecules/Loader'
import { formatPrice } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { Button, ConfigProvider, Form, Input } from 'antd'
import { RuleObject } from 'antd/lib/form'
import { Key, PiggyBank } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import Loading from '@/components/global/molecules/Loading'
function ProfilePage() {
  const { user } = useAuth()
  const { data, isLoading, isError, refetch } = fetchUserDetail(user?.UserID || '')
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [form] = Form.useForm()
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    refetch()
  }, [user, queryClient])

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const droppedFile = acceptedFiles[0]
    if (droppedFile && !droppedFile.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận tệp tin hình ảnh!')
      return
    }
    setFile(droppedFile)
    const reader = new FileReader()

    reader.onloadend = () => {
      setPreview(reader.result)
      setHasChanges(true)
    }

    if (droppedFile) {
      reader.readAsDataURL(droppedFile)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  })

  const onSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('UserName', values.UserName || data?.UserName)
    formData.append('FullName', values.FullName || data?.FullName)
    formData.append('Address', values.Address || data?.Address)
    formData.append('PhoneNumber', values.PhoneNumber || data?.PhoneNumber)
    formData.append('Password', values.Password)
    formData.append('NewPassword', values.NewPassword)
    formData.append('ConfirmPassword', values.ConfirmPassword)

    if (file) {
      formData.append('Avatar', file)
    } else {
      formData.append('Avatar', '')
    }
    // // Logging form data
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`)
    // }
    try {
      const response = await updateUserProfile(user?.UserID || '', formData)
      setLoading(false)
      toast.success('Cập nhật profile thành công')

      console.log('Profile updated successfully:', response)
      console.log('Profile updated successfully:', response.data)
      await refetch()
      setHasChanges(false)
      queryClient.invalidateQueries({ queryKey: ['userDetail', user?.UserID] })
    } catch (error: any) {
      setLoading(false)
      toast.error(error.response?.data?.result?.message || 'Mật khẩu cũ không chính xác!')
      console.error('Error updating profile:', error)
    }
  }

  const handleFormSubmit = async (values: any) => {
    setLoading(true)
    await onSubmit(values)
    setHasChanges(false)
  }

  const handleValuesChange = () => {
    setHasChanges(true)
  }

  const validateConfirmPassword = (_rule: RuleObject, value: any) => {
    const passFieldValue = form.getFieldValue('NewPassword')
    if (passFieldValue && !value) {
      return Promise.reject('Vui lòng xác nhận mật khẩu')
    }
    if (value !== passFieldValue) {
      return Promise.reject('Mật khẩu xác nhận không khớp')
    }
    return Promise.resolve()
  }

  const handleTogglePasswordFields = () => {
    setShowPasswordFields((prevShowPasswordFields) => !prevShowPasswordFields)
  }

  const validatePhoneNumber = (_rule: RuleObject, value: any) => {
    if (value && value !== '') {
      const phoneNumberRegex = /^0\d{9}$/
      if (!phoneNumberRegex.test(value)) {
        return Promise.reject('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0')
      }
    }
    return Promise.resolve()
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen w-full'>
        <Loader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center min-h-screen w-full'>
        <p>Đã xảy ra lỗi tải thông tin người dùng. Vui lòng thử lại sau!</p>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex mt-4 flex-col items-center justify-center'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#F97316'
            },
            components: {
              Button: {
                colorTextLightSolid: '#000000'
              }
            }
          }}
        >
          <Form
            form={form}
            variant='filled'
            onFinish={handleFormSubmit}
            onValuesChange={handleValuesChange}
            className='w-full max-w-3xl rounded-lg p-4 shadow-mini-content'
            layout='vertical'
            initialValues={{
              UserName: data?.UserName,
              email: data?.Email,
              Password: '',
              FullName: data?.FullName,
              Avatar: data?.Avatar,
              PhoneNumber: data?.PhoneNumber,
              Address: data?.Address,
              NewPassword: '',
              ConfirmPassword: ''
            }}
          >
            <div className='flex flex-col items-center justify-center'>
              <div className='shadow-3xl shadow-shadow-500 dark:!bg-navy-800 relative mx-auto w-full rounded-[20px] drop-shadow-md bg-white bg-clip-border p-4 dark:text-white dark:!shadow-none'>
                <div className='relative flex h-36 w-full justify-center rounded-xl bg-cover'>
                  <img
                    alt='banner'
                    src='https://cdn.eva.vn/upload/4-2017/images/2017-12-20/1513760778-721-cover-1513760779-width1920height1113.jpg'
                    className='absolute flex h-36  w-full object-cover justify-center rounded-xl bg-cover'
                  />
                  <div
                    {...getRootProps()}
                    title='Change avatar'
                    className='dark:!border-navy-700 absolute -bottom-14 flex h-[87px] w-[87px] cursor-pointer items-center justify-center rounded-full border-[4px] hover:border-tertiary border-amber-400'
                  >
                    <input {...getInputProps()} />
                    {!preview ? (
                      <Avatar className='h-full w-full' title='Change avatar'>
                        <AvatarImage className='object-cover' src={data?.Avatar} alt='avatar' />
                        <AvatarFallback>{data?.UserName}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className='h-full w-full' title='Change image'>
                        <AvatarImage className='object-cover' src={preview as string} alt={data?.FullName} />
                        <AvatarFallback>{data?.UserName}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
                <div className='mt-16 flex flex-col items-center'>
                  <h4 className='text-navy-700 text-xl font-bold dark:text-white'>{data?.UserName}</h4>
                  <p className='flex items-center gap-2 text-base font-normal text-gray-600'>
                    <Key size={16} /> {data?.RoleName}
                  </p>
                  <p className='flex items-center gap-2 text-lg text-primary font-medium text-gray-600'>
                    <PiggyBank size={24} /> <span>{formatPrice(data?.Balance || 0)}</span>
                  </p>
                </div>

                <Form.Item
                  name='UserName'
                  label={<span className='font-medium'>Tên người dùng</span>}
                  rules={[{ required: false }]}
                >
                  <Input placeholder='Tên người dùng' />
                </Form.Item>
                <Form.Item
                  name='FullName'
                  label={<span className='font-medium'>Họ và tên</span>}
                  rules={[{ required: true, message: 'Họ và tên không được bỏ trống' }]}
                >
                  <Input placeholder='Họ và tên' />
                </Form.Item>
                <Form.Item
                  name='Address'
                  label={<span className='font-medium'>Địa chỉ</span>}
                  rules={[{ required: false }]}
                >
                  <Input placeholder='Địa chỉ' />
                </Form.Item>
                <Form.Item className='hidden' name='avatar' label='Avatar' />

                <Form.Item
                  name='PhoneNumber'
                  label={<span className='font-medium'>PhoneNumber</span>}
                  rules={[{ required: false }, { validator: validatePhoneNumber }]}
                >
                  <Input placeholder='Số điện thoại' />
                </Form.Item>
                <Form.Item name='email' label={<span className='font-medium'>Email</span>} rules={[{ required: true }]}>
                  <Input className='cursor-not-allowed' disabled />
                </Form.Item>

                {/* <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                  {showPasswordFields ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
                </Button> */}
                {data?.Password && ( // Check if data.Password has a value
                  <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                    {showPasswordFields ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
                  </Button>
                )}
                <Form.Item
                  name='Password'
                  label={<span className='font-medium'>Mật khẩu cũ</span>}
                  hidden={!showPasswordFields}
                >
                  <Input.Password placeholder='Nhập mật khẩu cũ' />
                </Form.Item>
                <Form.Item
                  name='NewPassword'
                  label={<span className='font-medium'>Mật khẩu mới</span>}
                  hidden={!showPasswordFields}
                >
                  <Input.Password placeholder='Nhập mật khẩu mới' />
                </Form.Item>

                <Form.Item
                  name='ConfirmPassword'
                  label={<span className='font-medium'>Xác nhận mật khẩu</span>}
                  rules={[{ validator: validateConfirmPassword }]}
                  hidden={!showPasswordFields}
                >
                  <Input.Password placeholder='Xác nhận mật khẩu' />
                </Form.Item>
                <Form.Item className='mb-2 flex justify-center'>
                  <Button
                    type='dashed'
                    htmlType='submit'
                    className={`${loading ? 'bg-orange-500 text-white' : ''}`}
                    disabled={!hasChanges}
                  >
                    {loading && <Loading />}
                    Cập nhật
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  )
}

export default ProfilePage
