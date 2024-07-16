import { useAuth } from '@/auth/AuthProvider'
import busAPI from '@/lib/busAPI'
import { Button as ButtonAnt, ConfigProvider, Form, Input, message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import TemplateDisplay from '../organisms/TemplateDisplay'
import { Plus } from 'lucide-react'
import { Button } from '../atoms/ui/button'
import AddTemplate from '../organisms/AddTemplate'

function Template() {
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const fetchData = async () => {
    try {
      const response = await busAPI.get(`company-management/managed-companies/${user?.CompanyID}/templates`)
      setTemplates(response.data.Result)
    } catch (error) {
      message.error('Không thể tải chuyến xe mẫu')
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const handleCreateTemplate = async (values: any) => {
    try {
      await busAPI.post(`company-management/managed-companies/${user?.CompanyID}/templates`, values)
      message.success('Tạo chuyến xe mẫu thành công')
      setIsModalVisible(false)
      form.resetFields()
      // Optionally refetch templates
      fetchData()
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo chuyến xe mẫu')
      console.error('Error creating template:', error)
    }
  }
  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleAddTemplateSuccess = (newData: any) => {
    setTemplates((prevTemplates) => [...prevTemplates, newData])
  }
  if (loading) {
    return <Spin size='large' />
  }
  return (
    <div className='px-9'>
      <div className='flex justify-between mb-4'>
        <h1 className='text-3xl font-semibold'>Danh sách chuyến xe mẫu</h1>
        <Button onClick={() => setIsModalVisible(true)}>
          <Plus />
          Tạo Mới Chuyến Xe Mẫu
        </Button>
      </div>
      <TemplateDisplay templates={templates} />
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
          <AddTemplate isModalVisible={isModalVisible} handleCancel={handleCancel} handleOk={handleOk}  onAddTemplateSuccess={handleAddTemplateSuccess}/>
      </ConfigProvider>
    </div>
  )
}

export default Template
