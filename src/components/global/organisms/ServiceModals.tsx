import React from 'react';
import { Modal, Button, List, ConfigProvider } from 'antd';
import { Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
interface Service {
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
  visible: boolean;
  onOk: () => void;
  station: Station | null;
  onAddService: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ visible, onOk, station, onAddService }) => (
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
    <Modal title="Thông tin dịch vụ" visible={visible} onOk={onOk} onCancel={onOk} footer={null}>
    <div className="p-4 h-[500px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2"><span className="text-primary">{station?.StationName}</span></h2>
      <div className="mt-4 flex justify-between ">
      <p className="mb-2 font-medium">Dịch vụ hiện có:</p>
        <Button type="primary" className='bg-primary' onClick={onAddService}><Plus/>Thêm dịch vụ</Button>
      </div>
      {station?.ServiceTypeInStation.length ? (
        <List
          dataSource={station.ServiceTypeInStation}
          renderItem={serviceType => (
            <div className="border-b py-2 ">
              <strong className="text-lg">{serviceType.ServiceTypeName}:</strong>
              <ul className="list-disc ml-4 mt-4">
                {serviceType.ServiceInStation.map(service => (
                  <li key={service.ServiceID} className="flex gap-4 items-center mb-1">
                    <img src={service.ImageUrl} alt={service.Name} className="w-16 h-16 object-cover rounded" />
                    <span className="mr-2">{service.Name} - Giá: {formatPrice(service.Price)} </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        />
      ) : (
        <p className="text-gray-500">Không có dịch vụ.</p>
      )}
     
    </div>
  </Modal>
  </ConfigProvider>
);

interface AddServiceModalProps {
  visible: boolean;
  onOk: () => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ visible, onOk }) => (
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
  <Modal title="Thêm dịch vụ" visible={visible} onOk={onOk} onCancel={onOk}>
    {/* Your form for adding a service goes here */}
    <p>Form for adding a new service goes here.</p>
  </Modal>
  </ConfigProvider>
);
