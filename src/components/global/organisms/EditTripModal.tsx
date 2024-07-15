import React, { useState } from 'react'
import { Modal, Form, Input, Button, TimePicker } from 'antd'
import moment, { Moment }  from 'moment'
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
    MinPrice: number
    MaxPrice: number
    Status: string
    StaffID?: string
  }
type EditTripModalProps = {
    visible: boolean
    onClose: () => void
    trip: Trip | null
    onUpdate: (updatedTrip: Trip) => void
  }
  const EditTripModal: React.FC<EditTripModalProps> = ({ visible, onClose, trip, onUpdate }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        StartTime: (values.StartTime as Moment).format('HH:mm:ss'),
        EndTime: (values.EndTime as Moment).format('HH:mm:ss'),
      }
      console.log("dhkhjdf", formattedValues)
      onUpdate({ ...trip, ...formattedValues })
    })
  }

  return (
    <Modal
      title='Edit Trip'
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleOk}>
          Update
        </Button>
      ]}
    >
      <Form form={form} initialValues={{
        StartTime: moment(trip?.StartTime, 'HH:mm'),
        EndTime: moment(trip?.EndTime, 'HH:mm'),
        StaffID: trip?.StaffID
      }}>
        <Form.Item name='StartTime' label='Start Time'>
          <TimePicker format='HH:mm' />
        </Form.Item>
        <Form.Item name='EndTime' label='End Time'>
          <TimePicker format='HH:mm' />
        </Form.Item>
        <Form.Item name='StaffID' label='Staff ID'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditTripModal
