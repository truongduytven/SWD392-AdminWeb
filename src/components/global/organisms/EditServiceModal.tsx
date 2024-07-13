import React, { useEffect } from 'react';
import { Modal, Input, Form, ConfigProvider, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface Service {
  ServiceID: string;
  Price: number;
  Name: string;
  ImageUrl: string;
}

interface EditServiceModalProps {
  visible: boolean;
  onOk: () => void;
  service: Service | null;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({ visible, onOk, service }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        Price: service.Price,
        ImageUrl: service.ImageUrl,
      });
    }
  }, [service, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log("Updated Price:", values.Price);
      console.log("Updated Image URL:", values.ImageUrl);
      onOk(); // Close the modal
    }).catch(info => {
      console.log('Validation Failed:', info);
    });
  };

  const handleImageChange = (fileList: any) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setFieldsValue({ ImageUrl: e.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
        components: {
          Button: {
            colorTextLightSolid: '#fff',
          },
        },
      }}
    >
      <Modal title='Chỉnh sửa dịch vụ' visible={visible} onOk={handleOk} onCancel={onOk}>
        <Form form={form} layout="vertical">
          <Form.Item label="Tên dịch vụ:">
            <Input value={service?.Name} readOnly />
          </Form.Item>
          <Form.Item
            label="Giá:"
            name="Price"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <Input type='number' placeholder='Giá' />
          </Form.Item>
          <Form.Item
            label="URL hình ảnh:"
            name="ImageUrl"
            rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh!' }]}
          >
            <div>
              <Upload
                beforeUpload={() => false} // Prevent automatic upload
                onChange={({ fileList }) => handleImageChange(fileList)}
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
              {service && service.ImageUrl && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={service.ImageUrl} // Directly use service.ImageUrl
                    alt="Selected"
                    style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
                  />
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
