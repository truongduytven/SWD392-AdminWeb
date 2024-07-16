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
  // const uniqueTicketTypeIDRule = ({ getFieldValue }: any) => ({
  //   validator(_, value: any) {
  //     const ticketTypeIDs = getFieldValue('ticketTypes').map((ticket: any) => ticket.ticketTypeID)
  //     const duplicates = ticketTypeIDs.filter((id: any) => id === value)
  //     if (duplicates.length > 1) {
  //       return Promise.reject(new Error('Mỗi loại vé phải là duy nhất!'))
  //     }
  //     return Promise.resolve()
  //   }
  // })
  const onFinish = (values: any) => {
    const requestData = {
      Route_CompanyID: values.route,
      IsTemplate: values.isTemplate || true,
      TemplateID: values.templateID || '',
      ImageUrls: imageFiles || [],
      TicketType_TripModels: values.ticketTypes,
      Trip_UtilityModels: values.utilityModels || []
    }
    console.log('Request Data:', requestData)
    const formData = new FormData()
    formData.append('Route_CompanyID', values.route)
    formData.append('IsTemplate', values.isTemplate || true)
    // formData.append('TemplateID', values.templateID || '');

    // Append all image files as an array
    // imageFiles.forEach(file => {
    //   formData.append('ImageUrls[]', file.originFileObj); // Use "ImageUrls[]" for array format
    // });
    // imageFiles.forEach((file, index) => {
    //   formData.append(`ImageUrls[${index}]`, file.originFileObj);
    // });
    const imageUrls = []
    imageFiles.forEach((file) => {
      imageUrls.push(file.originFileObj)
    })
    formData.append('ImageUrls', imageUrls)
    formData.append('TicketType_TripModelsString', JSON.stringify(values.ticketTypes || []))
    // formData.append('Trip_UtilityModelsString', JSON.stringify(values.utilityModels || []));
    formData.append(
      'Trip_UtilityModelsString',
      JSON.stringify(
        values.utilityModels.map((utilityID: string) => ({
          utilityID
        }))
      )
    )
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    busAPI
      .post('trip-management/managed-trips', formData)
      .then((response) => {
        setImageFiles([]) // Reset the uploaded images

        form.resetFields()
        handleOk()
        console.log('Response:', response.data)
        form.resetFields()
      })
      .catch((error) => {
        message.error('Lỗi tạo chuyến xe')
        console.error('Error:', error)
      })
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
                        rules={[{ required: true, message: 'Vui lòng chọn loại vé!' }]}
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

          {/* Add more fields as necessary */}
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Tạo chuyến đi mẫu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  )
}
export default AddTemplate
