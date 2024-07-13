import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, ConfigProvider, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface Service {
  ServiceID: string;
  Price: number;
  Name: string;
  ImageUrl: string; // Existing image URL
}

interface EditServiceModalProps {
  visible: boolean;
  onOk: () => void;
  service: Service | null;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({ visible, onOk, service }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]); // For the new image

  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        Price: service.Price,
        ImageUrl: service.ImageUrl,
      });
      setFileList([]); // Reset file list when the service changes
    }
  }, [service, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log("Updated Price:", values.Price);
      console.log("Uploaded File:", fileList[0]?.originFileObj); // Access the binary file
      onOk(); // Close the modal
    }).catch(info => {
      console.log('Validation Failed:', info);
    });
  };

  const handleImageChange = (newFileList: any) => {
    if (newFileList && newFileList.length > 0) {
      setFileList([newFileList[0]]);
    } else {
      setFileList([]); // Clear if no file is selected
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
            label="Hình ảnh:"
            rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
          >
            <div>
              <Upload
                beforeUpload={() => false} // Prevent automatic upload
                fileList={fileList} // Control fileList state
                onChange={({ fileList }) => handleImageChange(fileList)}
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
              <div style={{ marginTop: 10 }}>
                {/* Display existing service image */}
                {service?.ImageUrl && (
                  <div>
                    <span>Existing Image:</span>
                    <img
                      src={service.ImageUrl}
                      alt="Existing"
                      style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10, marginRight: 10 }}
                    />
                  </div>
                )}
                {/* Display new uploaded image if exists */}
                {fileList.length > 0 && (
                  <div>
                    <span>New Image:</span>
                    <img
                      src={URL.createObjectURL(fileList[0].originFileObj)} // Create a URL for the uploaded image
                      alt="New"
                      style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 10 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
