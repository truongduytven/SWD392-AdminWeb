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
  message
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
  startTime: string
  endTime: string
}
const AddTemplate: React.FC<AddTripModalProps> = ({ isModalVisible, handleOk, handleCancel }) => {
  const { user } = useAuth()

  const [form] = Form.useForm()
  const [routes, setRoutes] = useState<any[]>([]) // Adjust type as necessary
  const [staff, setStaff] = useState<Staff[]>([])
  const [utilities, setUtilities] = useState<Utility[]>([])
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]) // State to store ticket types
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
      const fetchUtilities = async () => {
        try {
          const { data } = await busAPI.get('utility-management/managed-utilities') // Replace with the correct path
          setUtilities(data) // Set the fetched utilities
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Không thể tải dữ liệu tiện ích',
            description: 'Vui lòng thử lại sau'
          })
          // Handle error
        }
      }

      const fetchTicketTypes = async () => {
        try {
          const { data } = await busAPI.get('trip-management/managed-trips/ticket-type') // Replace with the correct path
          setTicketTypes(data) // Set the fetched ticket types
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Không thể tải dữ liệu loại vé',
            description: 'Vui lòng thử lại sau'
          })
          // Handle error
        }

        if (ticketTypes.length > 0) {
            form.setFieldsValue({
              ticketTypes: [
                {
                  ticketTypeID: ticketTypes[2].TicketTypeID
                }
              ]
            })
          }
      }
      fetchRoutes()
      fetchStaff()
      fetchUtilities()
      fetchTicketTypes()
    }
  }, [isModalVisible, user?.CompanyID])

  console.log('route ơ tạo chuyen', routes)
  // Custom validation rule to check for duplicate ticketTypeID
  const uniqueTicketTypeIDRule = ({ getFieldValue }: any) => ({
    validator(_, value: any) {
      const ticketTypeIDs = getFieldValue('ticketTypes').map((ticket: any) => ticket.ticketTypeID)
      const duplicates = ticketTypeIDs.filter((id: any) => id === value)
      if (duplicates.length > 1) {
        return Promise.reject(new Error('Mỗi loại vé phải là duy nhất!'))
      }
      return Promise.resolve()
    }
  })
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
            startTime: startTimeParsed.format('YYYY-MM-DDTHH:mm:ss'),
            endTime: endTimeParsed.format('YYYY-MM-DDTHH:mm:ss')
          })
        })
      })
    }
    values.TimeTrips = timeTrips
    console.log('Trip Details:', timeTrips) // Send this to your backend
    console.log('Trip Details:', values)



    const requestData = {
        Route_CompanyID: values.route,
        IsTemplate: values.isTemplate || false,
        StaffID: [values.staff] ||[],
        TemplateID: values.templateID || "",
        ImageUrls: imageFiles || [],
        TimeTrips: timeTrips||[],
        TicketType_TripModels: values.ticketTypes,
        Trip_UtilityModels: values.utilityModels || []
      };
      console.log('Request Data:', requestData);
      const formData = new FormData();

      // Append each field to the FormData object
      formData.append('Route_CompanyID', values.route);
      formData.append('IsTemplate', values.isTemplate || true);
    //   formData.append('StaffID', JSON.stringify([values.staff])); // Ensure it's an array
    requestData.StaffID.forEach(id => formData.append('StaffID[]', id));
      formData.append('TemplateID', values.templateID || '');
      imageFiles.forEach(file => formData.append('ImageUrls[]', file)); // Append image files
      timeTrips.forEach((trip) => {
        formData.append('TimeTrips[]', JSON.stringify(trip)); // Append each time trip as JSON
      });
      
      values.ticketTypes.forEach((ticketType) => {
        formData.append('TicketType_TripModels[]', JSON.stringify(ticketType)); // Append each ticket type as JSON
      });
    
      values.utilityModels.forEach((utilityModel) => {
        formData.append('Trip_UtilityModels[]', JSON.stringify(utilityModel)); // Append each utility model as JSON
      });
    
      busAPI.post('trip-management/managed-trips', formData)
      .then(response => {
        setImageFiles([]) // Reset the uploaded images

        form.resetFields()
        handleOk()
        console.log('Response:', response.data);
        form.resetFields();
      })
      .catch(error => {
        message.error("Lỗi tạo chuyến xe")
        console.error('Error:', error);
      });
   
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
                    style={{ display: 'flex', justifyContent: 'start' ,alignItems:"start ", marginBottom: 0 }}
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
        <Form.Item label='Loại vé' rules={[{ required: true, message: 'Vui lòng chọn loại vé!' }]}>
          <Form.List name='ticketTypes'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey = key, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                    <Form.Item
                      {...restField}
                      name={[name, 'ticketTypeID']}
                      fieldKey={[fieldKey, 'ticketTypeID']}
                      rules={[{ required: true, message: 'Vui lòng chọn loại vé!' }, uniqueTicketTypeIDRule]}
                    >
                      <Select placeholder='Chọn loại vé' style={{ width: 200 }}>
                        {ticketTypes.map((ticket) => (
                          <Select.Option key={ticket.TicketTypeID} value={ticket.TicketTypeID}>
                            {ticket.Name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      fieldKey={[fieldKey, 'price']}
                      rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }]}
                    >
                      <Input placeholder='Giá vé' type='number' />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      fieldKey={[fieldKey, 'quantity']}
                      rules={[{ required: true, message: 'Vui lòng nhập số lượng vé!' }]}
                    >
                      <Input placeholder='Số lượng vé' type='number' />
                    </Form.Item>
                    <Button type='primary' onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<UploadOutlined />}>
                    Thêm loại vé
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
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

        <Form.Item
          label='Mô hình tiện ích'
          name='utilityModels'
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một mô hình tiện ích!' }]}
        >
          <Select
            mode='multiple'
            placeholder='Chọn mô hình tiện ích'
            options={utilities.map((utility) => ({
              label: utility.Name,
              value: utility.UtilityID
            }))}
          />
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
    </ConfigProvider>
  )
}
export default AddTemplate
