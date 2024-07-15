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
  DatePickerProps,
  ConfigProvider,
  message,
  Spin
} from 'antd'
import { toast } from '../atoms/ui/use-toast'
import busAPI from '@/lib/busAPI'
import { useAuth } from '@/auth/AuthProvider'
import { DownOutlined } from '@ant-design/icons' // Import an icon of your choice
import { UploadOutlined } from '@ant-design/icons'
import { Minus, Plus } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import TripDetailModal from './TripDetailModal'
import TemplateCard from './TemplateCard'
import axios from 'axios'
import moment from 'moment'

interface AddTripModalProps {
  isModalVisible: boolean
  handleOk: () => void
  handleCancel: () => void
  onSuccess: (trip: any) => void
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
type Utility = {
  UtilityID: string
  Name: string
  Status: string
  Description: string
}
type TicketType = {
  TicketTypeID: string
  Name: string
  Status: string
}
interface TimeTrip {
  StartTime: string
  EndTime: string
}
const AddTripModal: React.FC<AddTripModalProps> = ({ isModalVisible, handleOk, handleCancel, onSuccess }) => {
  const { user } = useAuth()

  const [form] = Form.useForm()
  const [routes, setRoutes] = useState<any[]>([]) // Adjust type as necessary
  const [staff, setStaff] = useState<Staff[]>([])
  const [isRange, setIsRange] = useState(false) // State to toggle between single and range date selection
  const [templates, setTemplates] = useState<any[]>([]) // Adjust type as necessary
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(false) // Loading state
  const disabledDate = (current:any) => {
    // Disable dates before today
    return current && current < moment().endOf('day');
  };

  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue({
        times: [{ startTime: null, endTime: null }] // Set default values
      })

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
      const fetchTemplates = async () => {
        setLoadingTemplates(true) // Set loading state to true
        try {
          const response = await busAPI.get(`company-management/managed-companies/${user?.CompanyID}/templates`) // Replace with your API endpoint
          setTemplates(response.data.Result)
          console.log('template', response)
        } catch (error) {
          message.error('Lỗi tải dữ liệu mẫu!')
          console.error('Failed to fetch templates:', error)
        } finally {
          setLoadingTemplates(false) // Reset loading state
        }
      }
      fetchTemplates()

      fetchStaff()
    }
  }, [isModalVisible, user?.CompanyID])

  const onFinish = (values: any) => {
    // Format single date
    if (values.date) {
      const dates = Array.isArray(values.date) ? values.date : [values.date]
      values.date = dates.map((date: any) => dayjs(date).format('YYYY-MM-DD')) // Format each date
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
    const timeTrips: TimeTrip[] = []
    if (Array.isArray(values.date)) {
      values.date.forEach((date: any) => {
        values.times.forEach((time: any) => {
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
            StartTime: startTimeParsed.format('YYYY-MM-DDTHH:mm:ss'),
            EndTime: endTimeParsed.format('YYYY-MM-DDTHH:mm:ss')
          })
        })
      })
    }
    values.TimeTrips = timeTrips
    console.log('Trip Details:', timeTrips) // Send this to your backend
    console.log('Trip Details:', values)

    const requestData = {
      IsTemplate: values.isTemplate || false,
      StaffID: values.staff,
      TemplateID: values.templateID || '',
      TimeTrips: timeTrips || []
    }
    console.log('Request Data:', requestData)
    console.log('Request Data tripjhfjkghkh:', requestData.TimeTrips)
    const formData = new FormData()

    // formData.append('TimeTrips', requestData.TimeTrips)
    formData.append('TimeTripsString', JSON.stringify(requestData.TimeTrips))
    formData.append('IsTemplate', values.isTemplate || false)
    formData.append('StaffID', requestData.StaffID || '')
    formData.append('TemplateID', values.templateID || '')

    // Log the values in FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }
    busAPI
      .post('trip-management/managed-trips', formData)
      .then((response) => {
        form.resetFields()
        handleOk()
        onSuccess(response.data.Result)
        console.log('Response:', response.data.Result)
        form.resetFields()
        toast({
          variant: 'success',
          title: 'Đã tạo chuyến đi thành công',
          description: 'Chuyến đi đã được tạo'
        })
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          const messagess = error.response.data.Result.message
          message.error(messagess)
        }
        message.error('Lỗi tạo chuyến xe')
        console.error('Error:', error)
      })
  }

  const onCancel = () => {
    form.resetFields() // Reset form fields
    handleCancel()
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

  console.log('nênne', templates)
  const handleTemplateSelect = (template: any) => {
    console.log('duojc chọn')
    form.setFieldsValue({
      templateID: template.TemplateID,
      fromCity: template.FromCity,
      toCity: template.ToCity,
      startLocation: template.StartLocation,
      endLocation: template.EndLocation,
      tripPriceSeats: template.TripPriceSeats,
      tripUtilities: template.TripUtilityModels
    })
    setIsTemplateModalVisible(false)
  }
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316'
        },
        components: {
          Button: {
            colorTextLightSolid: '#fff'
          }
        }
      }}
    >
      <Modal title='Tạo chuyến đi' visible={isModalVisible} onCancel={onCancel} footer={null}>
        <Form form={form} onFinish={onFinish} className='h-[460px] overflow-y-auto'>
          <Form.Item label='Chọn mẫu chuyến đi' name='templateID'>
            <Input
              onClick={() => setIsTemplateModalVisible(true)}
              placeholder='Chọn mẫu chuyến đi'
              readOnly
              addonAfter={
                <DownOutlined onClick={() => setIsTemplateModalVisible(true)} style={{ cursor: 'pointer' }} />
              }
            />
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
              <DatePicker.RangePicker format='DD/MM/YYYY' disabledDate={disabledDate} />
            </Form.Item>
          ) : (
            <Form.Item label='Ngày' name='date' rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
              <DatePicker multiple onChange={onChange} maxTagCount='responsive' format='YYYY/MM/DD' disabledDate={disabledDate}  />
            </Form.Item>
          )}
          <Form.Item label='Thời gian' rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
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
                      style={{ display: 'flex', justifyContent: 'start', alignItems: 'start ', marginBottom: 0 }}
                      // align='baseline'
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'startTime']}
                        fieldKey={[fieldKey, 'startTime']}
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                      >
                        <TimePicker placeholder='Thời gian bắt đầu' format='HH:mm:ss' />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'endTime']}
                        fieldKey={[fieldKey, 'endTime']}
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                      >
                        <TimePicker placeholder='Thời gian kết thúc' format='HH:mm:ss' />
                      </Form.Item>
                      <Minus className='w-4' onClick={() => remove(name)} style={{ cursor: 'pointer' }} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button type='dashed' className='mx-auto' onClick={() => add()} icon={<Plus />}>
                      Thêm thời gian
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Tạo chuyến đi
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title='Chọn mẫu chuyến đi'
          visible={isTemplateModalVisible}
          onCancel={() => setIsTemplateModalVisible(false)}
          footer={null}
          style={{ maxHeight: '80vh' }} // Set the maximum height of the modal
        >
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {' '}
            {/* Scrollable area */}
            {loadingTemplates ? (
              <Spin tip='Đang tải mẫu chuyến đi...' /> // Show loading spinner
            ) : (
              templates.map((template) => (
                <div key={template.TemplateID}>
                  <TemplateCard template={template} onSelect={handleTemplateSelect} />
                </div>
              ))
            )}
          </div>
        </Modal>
      </Modal>
    </ConfigProvider>
  )
}
export default AddTripModal
