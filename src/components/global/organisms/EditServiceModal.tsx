import React, { useEffect, useState } from 'react'
import { Modal, Input, Form, ConfigProvider, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { ArrowRightLeft, Pen } from 'lucide-react'
import busAPI from '@/lib/busAPI'

interface Service {
  Service_StationID: string
  ServiceID: string
  Price: number
  Name: string
  ImageUrl: string // Existing image URL
}

interface EditServiceModalProps {
  visible: boolean
  onOk: () => void
  service: Service | null
  onUpdate: (updatedService: Service) => void
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({ visible, onOk, service, onUpdate }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([]) // For the new image
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        Price: service.Price,
        ImageUrl: service.ImageUrl
      })
      setFileList([]) // Reset file list when the service changes
    }
  }, [service, form])

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsLoading(true)
        try {
          // Prepare data for the API request
          const formData = new FormData()
          formData.append('Price', values.Price)
          if (fileList.length > 0) {
            formData.append('ImageUrl', fileList[0].originFileObj) // Append new image file
          }

          // API request to update the service
          const response = await busAPI.put(
            `station-service-management/managed-station-services/${service?.Service_StationID}`,
            formData
          )
          // console.log('thanh cong', response)
          const updateService: Service = {
            Service_StationID: service?.Service_StationID || '',
            Name: service?.Name || '',
            ServiceID: service?.ServiceID || '',
            Price: values.Price, // Use values.Price
            ImageUrl: fileList.length > 0 ? URL.createObjectURL(fileList[0].originFileObj) : service?.ImageUrl || ''
          }
          // console.log("update service ne", updateService);
          // if (response.status === 200) {
          //   message.success('Service updated successfully!');
          message.success("Cập nhật dịch vụ thành công!")
          onUpdate(updateService) // Update parent state with the new service data
          onOk() // Close the modal
          // }
        } catch (error) {
          message.error("Cập nhật thất bại vui lòng thử lại sau!")
          // message.error('Failed to update service. Please try again.');
          console.error(error)
        }finally{
          setIsLoading(false)
        }
      })
      .catch((info) => {
        console.log('Validation Failed:', info)
      })
  }

  const handleImageChange = (newFileList: any) => {
    if (newFileList && newFileList.length > 0) {
      setFileList([newFileList[0]])
    } else {
      setFileList([]) // Clear if no file is selected
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
      <Modal title='Chỉnh sửa dịch vụ' visible={visible} onOk={handleOk} onCancel={onOk}  footer={[
          <Button key="cancel" onClick={onOk}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={isLoading} onClick={handleOk}>
            {isLoading ? 'Đang cập nhật...' : 'Câp nhật'}
          </Button>
        ]}>
        <Form form={form} layout='vertical'>
          <Form.Item label='Tên dịch vụ:'>
            <Input value={service?.Name} readOnly />
          </Form.Item>
          <Form.Item label='Giá:' name='Price' rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
            <Input type='number' placeholder='Giá' />
          </Form.Item>
          <Form.Item label='Hình ảnh:' rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}>
            <div>
              <Upload
                beforeUpload={() => false} // Prevent automatic upload
                fileList={fileList} // Control fileList state
                onChange={({ fileList }) => handleImageChange(fileList)}
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
              <div style={{ marginTop: 10, display: 'flex', gap: '40px' }}>
                {/* Display existing service image */}
                {service?.ImageUrl && (
                  <div>
                    <span>Ảnh hiện tại:</span>
                    <img
                      className='rounded-lg'
                      src={service.ImageUrl}
                      alt='Existing'
                      style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10, marginRight: 10 }}
                    />
                  </div>
                )}
                {/* Display new uploaded image if exists */}
                {fileList.length > 0 && (
                  <div className='flex justify-center items-center gap-[40px]'>
                    <div>
                      <ArrowRightLeft />
                    </div>
                    <div>
                      <span>Ảnh mới:</span>
                      <img
                        className='rounded-lg'
                        src={URL.createObjectURL(fileList[0].originFileObj)} // Create a URL for the uploaded image
                        alt='New'
                        style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  )
}
