import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  Button,
  List,
  ConfigProvider,
  Tooltip,
  Space,
  Select,
  InputRef,
  Divider,
  Input,
  message,
  Form,
  Upload,
  Image
} from 'antd'
import { Edit2, Pen, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { EditServiceModal } from './EditServiceModal'
import busAPI from '@/lib/busAPI'
interface Service {
  Service_StationID: string
  ServiceID: string
  Price: number
  Name: string
  ImageUrl: string
}

// Define the interface for the ServiceType
interface ServiceType {
  ServiceTypeID: string
  ServiceTypeName: string
  ServiceInStation: Service[]
}

// Define the interface for the Station
interface Station {
  StationID: string
  CityID: string
  CityName: string
  StationName: string
  Status: string
  ServiceTypeInStation: ServiceType[]
}
interface ServiceModalProps {
  visible: boolean
  onOk: () => void
  station: Station | null
  onAddService: () => void
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ visible, onOk, station, onAddService }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [updatedServiceStation, setUpdatedServiceStation] = useState<Station | null>(station) // Local state for updated station data
  const showEditModal = (service: Service) => {
    setCurrentService(service)
    setEditModalVisible(true)
  }

  const hideEditModal = () => {
    setEditModalVisible(false)
    setCurrentService(null) // Clear current service on close
  }
  useEffect(() => {
    setUpdatedServiceStation(station);
  }, [station]);
  const handleServiceUpdate = (updatedService: Service) => {
    
      if (updatedServiceStation) {
          const updatedServiceTypes = updatedServiceStation.ServiceTypeInStation.map((serviceType) => ({
              ...serviceType,
              ServiceInStation: serviceType.ServiceInStation.map((service) =>
                service.ServiceID === updatedService.ServiceID ? updatedService : service
            )
        }))
        console.log("cps update", updatedServiceTypes)

      setUpdatedServiceStation({
        ...updatedServiceStation,
        ServiceTypeInStation: updatedServiceTypes
      })
    }
    hideEditModal() // Close the modal
  }
  console.log("After update:", updatedServiceStation);
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
      <Modal title='Thông tin dịch vụ' visible={visible} onOk={onOk} onCancel={onOk} footer={null}>
        <div className='p-4 h-[500px] overflow-y-auto'>
          <h2 className='text-lg font-semibold mb-2'>
            <span className='text-primary'>{station?.StationName}</span>
          </h2>
          <div className='mt-4 flex justify-between'>
            <p className='mb-2 font-medium'>Dịch vụ hiện có:</p>
            <Button type='primary' className='bg-primary' onClick={onAddService}>
              <Plus />
              Thêm dịch vụ
            </Button>
          </div>
          {updatedServiceStation?.ServiceTypeInStation.length ? (
            <List
              dataSource={updatedServiceStation.ServiceTypeInStation}
              renderItem={(serviceType) => (
                <div className='border-b py-2'>
                  <strong className='text-lg'>{serviceType.ServiceTypeName}:</strong>
                  <ul className='list-disc ml-4 mt-4'>
                    {serviceType.ServiceInStation.map((service) => (
                      <li key={service.ServiceID} className='flex gap-4 items-center mb-1'>
                        <img src={service.ImageUrl} alt={service.Name} className='w-16 h-16 object-cover rounded' />
                        <span className='mr-2'>
                          {service.Name} - Giá: {formatPrice(service.Price)}{' '}
                        </span>
                        <Tooltip title='Chỉnh sửa' className='mr-1'>
                          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => showEditModal(service)} />
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            />
          ) : (
            <p className='text-gray-500'>Không có dịch vụ.</p>
          )}
        </div>
      </Modal>
      <EditServiceModal
        visible={isEditModalVisible}
        onOk={hideEditModal}
        service={currentService}
        onUpdate={handleServiceUpdate}
      />
    </ConfigProvider>
  )
}

interface AddServiceModalProps {
  visible: boolean
  onOk: () => void
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ visible, onOk }) => {
  const [items, setItems] = useState<{ label: string; value: string }[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const [fileLists, setFileLists] = useState<{ [key: string]: any[] }>({})
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string[] }>({})
  const fetchItems = async () => {
    try {
      const response = await busAPI.get('service-management/managed-services')
      const flattenedItems = response.data.flatMap((serviceType: any) =>
        serviceType.Services.map((service: any) => ({
          label: service.ServiceName,
          value: service.ServiceID
        }))
      )
      setItems(flattenedItems)
      setLoading(false)
    } catch (err: any) {
      message.error('Failed to fetch services')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    if (name) {
      const exists = items.some((item) => item.label === name || item.value === name)
      if (exists) {
        message.warning(`${name} đã tồn tại trong list!`)
        return
      }
      const newItem = { label: name, value: name }
      setItems([...items, newItem])
      setName('')
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  const handleChange = (value: string[]) => {
    setSelectedValues(value)
  }

  const handleImageChange = (serviceID: string) => (info: any) => {
    if (info.file.status === 'done') {
      const newImage = URL.createObjectURL(info.file.originFileObj);
      setImagePreviews((prev) => ({
        ...prev,
        [serviceID]: [...(prev[serviceID] || []), newImage]
      }));
    }
  };
  const handleContinue = () => {
    if (selectedValues.length > 0) {
      setShowForm(true)
    } else {
      message.warning('Please select at least one service.')
    }
  }

  const handleFormFinish = async (values: any) => {
    console.log('Submitted values:', values)
    // Handle the submission logic here (e.g., sending the data to the API)
    onOk() // Close the modal after handling the submission
  }

  const handleClose = () => {
    setName('')
    setSelectedValues([])
    setShowForm(false)
    setFileLists({})
    setImagePreviews({})
    onOk() // Call the onOk function
  }
 
  console.log('anh', imagePreviews)
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
      <Modal title='Thêm dịch vụ' visible={visible} onOk={handleClose} onCancel={handleClose}>
        {!showForm ? (
          <Space style={{ width: '100%' }} direction='vertical'>
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Please select'
              onChange={handleChange}
              value={selectedValues}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder='Please enter item'
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type='text' onClick={addItem}>
                      Add item
                    </Button>
                  </Space>
                </>
              )}
              options={items}
            />
            <Button type='primary' onClick={handleContinue}>
              Continue
            </Button>
          </Space>
        ) : (
          <Form onFinish={handleFormFinish} className='h-[460px] overflow-y-auto'>
            <Space direction='vertical' style={{ width: '100%' }}>
              {selectedValues.map((serviceID) => {
                
                const selectedService = items.find((item) => item.value === serviceID)
                return (
                  <div key={serviceID}>
                    <h4>{selectedService?.label || serviceID}</h4>
                    <Form.Item
                      name={[serviceID, 'price']}
                      label='Price'
                      rules={[
                        {
                          required: true,
                          type: 'number',
                          message: 'Please enter a valid price',
                          transform: (value) => (value ? parseFloat(value) : NaN), // Convert input to number
                          validator: (_, value) => {
                            if (value && value >= 1) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Price must be greater than or equal to 1'));
                          },
                        },
                      ]}
                    >
                      <Input placeholder='Enter price' type='number' />
                    </Form.Item>
                    <Form.Item label='Upload Images'>
                      <Upload
                        onChange={handleImageChange(serviceID)}
                        showUploadList={false}
                      >
                        <Button icon={<Pen />}>Upload Image</Button>
                      </Upload>
                      {imagePreviews[serviceID]?.map((imgSrc, index) => (
                        
                        <Image key={index} src={imgSrc} width={100} preview={false} />
                      ))}
                    </Form.Item>
                  </div>
                )
              })}
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </Space>
          </Form>
        )}
      </Modal>
    </ConfigProvider>
  )
}