import React, { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  TimePicker,
  Space,
  DatePicker,
  Switch,
  Flex,
  DatePickerProps
} from 'antd'
import { toast } from '../atoms/ui/use-toast'
import busAPI from '@/lib/busAPI'
import { useAuth } from '@/auth/AuthProvider'
import { UploadOutlined } from '@ant-design/icons'
import { Minus, Plus } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'

interface AddTripModalProps {
  isModalVisible: boolean
  handleOk: () => void
  handleCancel: () => void
}

type Route = {
  Route_CompanyID: string
  RouteID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  Status: string
}
type Staff = {
  StaffID: string
  Name: string
  CompanyID: string
  Password: string
  Email: string
  Address: string
  PhoneNumber: string
  Status: string
}
const AddTripModal: React.FC<AddTripModalProps> = ({ isModalVisible, handleOk, handleCancel }) => {
  const { user } = useAuth()

  const [form] = Form.useForm()
  const [routes, setRoutes] = useState<any[]>([]) // Adjust type as necessary
  const [staff, setStaff] = useState<Staff[]>([])
  const [imageFiles, setImageFiles] = useState<any[]>([])
  const [isRange, setIsRange] = useState(false) // State to toggle between single and range date selection
  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({
        times: [{ startTime: null, endTime: null }] // Set default values
      })
      const fetchRoutes = async () => {
        try {
          const { data } = await busAPI.get<Route[]>(
            `route-management/managed-routes/company-routes/${user?.CompanyID}`
          )
          setRoutes(data)
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Không thể tải dữ liệu tuyến đường',
            description: 'Vui lòng thử lại sau'
          })
          console.error('Failed to fetch routes:', error)
        }
      }

      const fetchStaff = async () => {
        try {
          const { data } = await busAPI.get<Staff[]>(`user-management/managed-users/staff/${user?.CompanyID}`)
          setStaff(data)
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Không thể tải dữ liệu nhân viên',
            description: 'Vui lòng thử lại sau'
          })
          console.error('Failed to fetch staff:', error)
        }
      }

      fetchRoutes()
      fetchStaff()
    }
  }, [isModalVisible, user?.CompanyID])

  console.log('route ơ tạo chuyen', routes)

  const onFinish = (values: any) => {
    // Format single date
    if (values.date) {
      const dates = Array.isArray(values.date) ? values.date : [values.date]
      values.date = dates.map((date) => dayjs(date).format('YYYY-MM-DD')) // Format each date
    }

    // Check if the dateRange field is provided
    if (values.dateRange && Array.isArray(values.dateRange)) {
      const start = dayjs(values.dateRange[0])
      const end = dayjs(values.dateRange[1])

      const dateList = []
      let currentDate = start

      while (currentDate.isBefore(end) || currentDate.isSame(end)) {
        dateList.push(currentDate.format('YYYY/MM/DD'))
        currentDate = currentDate.add(1, 'day')
      }

      values.date = dateList // Store the list of formatted dates
    }

    // Format times
    if (values.times) {
      values.times = values.times.map((time: any) => ({
        startTime: dayjs(time.startTime).format('HH:mm'),
        endTime: dayjs(time.endTime).format('HH:mm')
      }))
    }
    const timeTrips = []

    // Check if values.date is an array (for multiple dates)
    // if (Array.isArray(values.date)) {
    //   values.date.forEach((date) => {
    //     values.times.forEach((time) => {
    //       console.log('time', time)
    //       // Combine date and time correctly
    //       const startDateTime = `${date}T${time.startTime}`
    //       const endDateTime = `${date}T${time.endTime}`

    //       console.log('Combined Start Time:', startDateTime) // Log combined start time
    //       console.log('Combined End Time:', endDateTime) // Log combined end time
    //       timeTrips.push({
    //         startTime: dayjs(`${date}T${time.startTime}`).format('YYYY-MM-DDTHH:mm:ss'),
    //         endTime: dayjs(`${date}T${time.endTime}`).format('YYYY-MM-DDTHH:mm:ss')
    //       })
    //     })
    //   })
    // }
    if (Array.isArray(values.date)) {
      values.date.forEach((date) => {
        values.times.forEach((time) => {
          console.log('time', time) // Log the time object

          // Combine date and time correctly
          const startDateTime = `${date}T${time.startTime}`
          const endDateTime = `${date}T${time.endTime}`

          console.log('Combined Start Time:', startDateTime) // Log combined start time
          console.log('Combined End Time:', endDateTime) // Log combined end time

          // Create timeTrip objects using dayjs
          const startTimeParsed = dayjs(startDateTime, { timeZone: 'UTC' })
          const endTimeParsed = dayjs(endDateTime, { timeZone: 'UTC' })

          // Check if parsing was successful
          if (!startTimeParsed.isValid() || !endTimeParsed.isValid()) {
            console.error('Invalid date-time parsing:', startDateTime, endDateTime)
          }

          timeTrips.push({
            startTime: startTimeParsed.format('YYYY-MM-DDTHH:mm'),
            endTime: endTimeParsed.format('YYYY-MM-DDTHH:mm')
          })
        })
      })
    }
    values.TimeTrips = timeTrips
    console.log('Trip Details:', timeTrips) // Send this to your backend
    console.log('Trip Details:', values)
    setImageFiles([]) // Reset the uploaded images

    form.resetFields()
    handleOk()
  }

  const onCancel = () => {
    form.resetFields() // Reset form fields
    setImageFiles([]) // Reset the uploaded images
    handleCancel()
  }
  const handleChange = (info: any) => {
    const { fileList } = info

    // Map the files to the expected UploadFile structure
    const formattedFileList = fileList.map((file: any) => ({
      uid: file.uid,
      name: file.name,
      status: file.status,
      url: file.url, // Optional: add this if you have a URL for preview
      originFileObj: file.originFileObj // Keep the original file object
    }))

    setImageFiles(formattedFileList) // Update state with the properly formatted file list
  }
  const onChange = (date: Dayjs | Dayjs[] | null, dateString: string | string[]) => {
    if (Array.isArray(dateString)) {
      // Handle range selection
      console.log(
        'Selected Range:',
        dateString.map((d) => dayjs(d).format('YYYY/MM/DD'))
      )
    } else {
      // Handle single date selection
      console.log('Selected Date:', dayjs(dateString).format('YYYY/MM/DD'))
    }
  }
  return (
    <Modal title='Tạo chuyến đi' visible={isModalVisible} onCancel={onCancel} footer={null}>
      <Form form={form} onFinish={onFinish} className='h-[460px] overflow-y-auto'>
        <Form.Item label='Tuyến' name='route' rules={[{ required: true, message: 'Vui lòng chọn tuyến!' }]}>
          <Select placeholder='Chọn tuyến'>
            {routes
              .filter((route) => route.Status === 'HOẠT ĐỘNG') // Filter for active routes
              .map((route) => (
                <Select.Option key={`${route.RouteID}-${route.Route_CompanyID}`} value={route.Route_CompanyID}>
                  {route.FromCity} - {route.ToCity}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='Địa điểm bắt đầu'
          name='startLocation'
          rules={[{ required: true, message: 'Vui lòng nhập địa điểm bắt đầu!' }]}
        >
          <Input placeholder='Địa điểm bắt đầu' />
        </Form.Item>
        <Form.Item
          label='Địa điểm kết thúc'
          name='endLocation'
          rules={[{ required: true, message: 'Vui lòng nhập địa điểm kết thúc!' }]}
        >
          <Input placeholder='Địa điểm kết thúc' />
        </Form.Item>

        <Form.Item label='Chọn loại ngày'>
          <Switch checked={isRange} onChange={setIsRange} />
          <span style={{ marginLeft: 8 }}>{isRange ? 'Chọn khoảng ngày' : 'Chọn ngày đơn'}</span>
        </Form.Item>

        {isRange ? (
          <Form.Item
            label='Khoảng ngày'
            name='dateRange'
            rules={[{ required: true, message: 'Vui lòng chọn khoảng ngày!' }]}
          >
            <DatePicker.RangePicker format='DD/MM/YYYY' />
          </Form.Item>
        ) : (
          <Form.Item label='Ngày' name='date' rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
            <DatePicker multiple onChange={onChange} maxTagCount='responsive' format='YYYY/MM/DD' />
          </Form.Item>
        )}

        <Form.List
          name='times'
          rules={[
            {
              validator: (_, times) =>
                times && times.length
                  ? Promise.resolve()
                  : Promise.reject(new Error('Vui lòng thêm ít nhất một khoảng thời gian!'))
            }
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey = key, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}
                  align='baseline'
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'startTime']}
                    fieldKey={[fieldKey, 'startTime']}
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                  >
                    <TimePicker placeholder='Thời gian bắt đầu' format='HH:mm' />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'endTime']}
                    fieldKey={[fieldKey, 'endTime']}
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                  >
                    <TimePicker placeholder='Thời gian kết thúc' format='HH:mm' />
                  </Form.Item>
                  <Minus className='w-4' onClick={() => remove(name)} style={{ cursor: 'pointer' }} />
                </Space>
              ))}
              <Form.Item>
                <Button type='dashed' onClick={() => add()} icon={<Plus />}>
                  Thêm thời gian
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item label='Hình ảnh' name='images' rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}>
          <Upload
            multiple
            accept='image/*'
            onChange={handleChange}
            beforeUpload={() => false} // Prevent automatic upload
            fileList={imageFiles} // Display the uploaded files
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item label='Nhân viên' name='staff' rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
          <Select placeholder='Chọn nhân viên'>
            {staff.map((member) => (
              <Select.Option key={member.StaffID} value={member.StaffID}>
                {member.Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* Add more fields as necessary */}
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Tạo chuyến đi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default AddTripModal
