import React from 'react';
import { Modal, Button, Input, ConfigProvider } from 'antd';
interface Service {
    ServiceID: string
    Price: number
    Name: string
    ImageUrl: string
  }
interface EditServiceModalProps {
  visible: boolean;
  onOk: () => void;
  service: Service | null; // Assuming Service is the same type defined earlier
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({ visible, onOk, service }) => (
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
    <Modal title='Chỉnh sửa dịch vụ' visible={visible} onOk={onOk} onCancel={onOk}>
      {/* Your form for editing a service goes here */}
      <div>
        <Input placeholder='Tên dịch vụ' defaultValue={service?.Name} />
        <Input placeholder='Giá' type='number' defaultValue={service?.Price} style={{ marginTop: 10 }} />
        {/* Add other fields as needed */}
      </div>
    </Modal>
  </ConfigProvider>
);
