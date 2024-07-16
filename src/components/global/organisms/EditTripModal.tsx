import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, TimePicker, Select, message } from 'antd'
import moment, { Moment } from 'moment'
import busAPI from '@/lib/busAPI'
import { useAuth } from '@/auth/AuthProvider'
import { toast } from '../atoms/ui/use-toast'
import axios from 'axios'
type Trip = {
  TripID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  StartTime: string
  EndTime: string
  StartDate: string
  EndDate: string
  StaffName: string
  StaffID: string
  MinPrice: number
  MaxPrice: number
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
type EditTripModalProps = {
  visible: boolean
  onClose: () => void
  trip: Trip | null
  onUpdate: (updatedTrip: Trip) => void
}
const EditTripModal: React.FC<EditTripModalProps> = ({ visible, onClose, trip, onUpdate }) => {
  const { user } = useAuth()
  const [form] = Form.useForm()
  const [staff, setStaff] = useState<Staff[]>([])

  useEffect(() => {
    if (visible) {
      fetchStaff()
    }
  }, [visible])
  // const handleOk = () => {
  //   form.validateFields().then(values => {
  //     const formattedValues = {
  //       ...values,
  //       StartTime: (values.StartTime as Moment).format('HH:mm:ss'),
  //       EndTime: (values.EndTime as Moment).format('HH:mm:ss'),
  //     }
  //     console.log("dhkhjdf", formattedValues)
  //     onUpdate({ ...trip, ...formattedValues })
  //   })
  // }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const startTime = moment(`${trip?.StartDate} ${values.StartTime.format('HH:mm:ss')}`).toISOString();
      const endTime = moment(`${trip?.EndDate} ${values.EndTime.format('HH:mm:ss')}`).toISOString();
      const dataUpdate = {
        ...values,
        StartTime: (values.StartTime as Moment).format('HH:mm'),
        EndTime: (values.EndTime as Moment).format('HH:mm')
      }
      // Send the updated trip data to the server
      const updatedTrip = await busAPI.put<Trip>(`trip-management/managed-trips/trip/${trip?.TripID}`, {
        staffID: values.StaffID,
        startTime,
        endTime
      })
      message.success('Cập nhật chuyến đi thành công')
      // Call onUpdate with the updated trip data
      form.resetFields();
      onUpdate(dataUpdate)
      onClose() // Close the modal after updating
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const messagess = error.response.data.Result.message
        message.error(messagess)
      }
      message.error("Cập nhật chuyến đi thất bại")
     
      console.error('Failed to update trip:', error)
    }
  }
  const handleClose = () => {
    form.resetFields(); // Reset form fields
    onClose(); // Close the modal
  };
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
  return (
    <Modal
      title='Cập nhật chuyến đi'
      visible={visible}
      onCancel={handleClose}
      footer={[
        <Button key='Hủy' onClick={onClose}>
          Hủy
        </Button>,
        <Button key='Cập nhật' type='primary' onClick={handleOk}>
          Cập nhật
        </Button>
      ]}
    >
      <h1 className='text-md mb-2'>
        Tuyến:{' '}
        <strong>
          {trip?.FromCity} - {trip?.ToCity}
        </strong>
      </h1>
      <h1 className='text-md mb-2'>
        Địa điểm:{' '}
        <strong>
          {trip?.StartLocation} - {trip?.EndLocation}
        </strong>
      </h1>
      <Form
        form={form}
        initialValues={{
          StartTime: moment(trip?.StartTime, 'HH:mm'),
          EndTime: moment(trip?.EndTime, 'HH:mm'),
          StaffID: trip?.StaffID
        }}
      >
        <Form.Item name='StartTime' label='Start Time'>
          <TimePicker format='HH:mm' />
        </Form.Item>
        <Form.Item name='EndTime' label='End Time'>
          <TimePicker format='HH:mm' />
        </Form.Item>
        <Form.Item name='StaffID' label='Staff ID' rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
          <Select placeholder='Chọn nhân viên'>
            {staff.map(({ StaffID, Name }) => (
              <Select.Option key={StaffID} value={StaffID}>
                {Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditTripModal
